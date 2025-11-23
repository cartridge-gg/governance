import "./config";
import { StarknetStream } from "@apibara/starknet";
import { createClient, Metadata } from "@apibara/protocol";
import type { EventKey } from "./processor";
import { logger } from "./logger";
import { DAO } from "./dao";
import { Pool } from "pg";
import { EVENT_PROCESSORS } from "./eventProcessors";
import { getTokenMetadataConfig } from "./config";

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  connectionTimeoutMillis: 1000,
});

const streamClient = createClient(StarknetStream, process.env.APIBARA_URL, {
  defaultCallOptions: {
    "*": {
      metadata: Metadata({
        Authorization: `Bearer ${process.env.DNA_TOKEN}`,
      }),
    },
  },
});

// Timer for exiting if no blocks are received within the configured time
const NO_BLOCKS_TIMEOUT_MS = parseInt(process.env.NO_BLOCKS_TIMEOUT_MS || "0");
let noBlocksTimer: NodeJS.Timeout | null = null;

// Function to set or reset the no-blocks timer
function resetNoBlocksTimer() {
  // Clear existing timer if it exists
  if (noBlocksTimer) {
    clearTimeout(noBlocksTimer);
  }

  // Only set a new timer if the timeout is greater than 0
  if (NO_BLOCKS_TIMEOUT_MS > 0) {
    noBlocksTimer = setTimeout(() => {
      logger.error(
        `No blocks received in the last ${msToHumanShort(NO_BLOCKS_TIMEOUT_MS)}. Exiting process.`,
      );
      process.exit(1);
    }, NO_BLOCKS_TIMEOUT_MS);
  }
}

function msToHumanShort(ms: number): string {
  const units = [
    { label: "d", ms: 86400000 },
    { label: "h", ms: 3600000 },
    { label: "min", ms: 60000 },
    { label: "s", ms: 1000 },
    { label: "ms", ms: 1 },
  ];

  const parts: string[] = [];

  for (const { label, ms: unitMs } of units) {
    if (ms >= unitMs) {
      const count = Math.floor(ms / unitMs);
      ms %= unitMs;
      parts.push(`${count}${label}`);
      if (parts.length === 3) break; // Limit to 2 components
    }
  }

  return parts.join(", ") || "0ms";
}

(async function () {
  // first set up the schema
  let databaseStartingCursor;
  {
    const client = await pool.connect();
    const dao = new DAO(client);

    const initializeTimer = logger.startTimer();
    databaseStartingCursor = await dao.initializeSchema();
    initializeTimer.done({
      message: "Initialized schema",
      startingCursor: databaseStartingCursor,
    });

    // Initialize token metadata from configuration
    const tokens = getTokenMetadataConfig();
    if (tokens.length > 0) {
      await dao.initializeTokenMetadataFromConfig(tokens);
      logger.info(`Initialized ${tokens.length} token(s) for price calculations`, {
        tokens: tokens.map(t => t.symbol),
      });
    }

    client.release();
  }

  // Start the no-blocks timer when application starts
  resetNoBlocksTimer();

  for await (const message of streamClient.streamData({
    filter: [
      {
        events: EVENT_PROCESSORS.map((ep, ix) => ({
          id: ix + 1,
          address: ep.filter.fromAddress,
          keys: ep.filter.keys,
        })),
      },
    ],
    finality: "pending",
    startingCursor: databaseStartingCursor
      ? databaseStartingCursor
      : { orderKey: BigInt(process.env.STARTING_CURSOR_BLOCK_NUMBER ?? 0) },
  })) {
    switch (message._tag) {
      case "heartbeat": {
        logger.info(`Heartbeat`);

        // Note: We don't reset the no-blocks timer on heartbeats, only when actual blocks are received
        break;
      }

      case "systemMessage": {
        switch (message.systemMessage.output?._tag) {
          case "stderr":
            logger.error(`System message: ${message.systemMessage.output}`);
            break;
          case "stdout":
            logger.info(`System message: ${message.systemMessage.output}`);
            break;
        }
        break;
      }

      case "invalidate": {
        let invalidatedCursor = message.invalidate.cursor;

        if (invalidatedCursor) {
          logger.warn(`Invalidated cursor`, {
            cursor: invalidatedCursor,
          });

          const client = await pool.connect();
          const dao = new DAO(client);

          await dao.beginTransaction();
          await dao.deleteOldBlockNumbers(
            Number(invalidatedCursor.orderKey) + 1,
          );
          await dao.writeCursor(invalidatedCursor);
          await dao.commitTransaction();

          client.release();
        }

        break;
      }

      case "data": {
        // Reset the no-blocks timer since we received block data
        resetNoBlocksTimer();

        const blockProcessingTimer = logger.startTimer();

        const client = await pool.connect();
        const dao = new DAO(client);

        await dao.beginTransaction();

        let deletedCount: number = 0;

        let eventsProcessed: number = 0;
        const isHead = message.data.production === "live";

        for (const block of message.data.data) {
          if (!block) continue;

          const blockNumber = Number(block.header.blockNumber);
          deletedCount += await dao.deleteOldBlockNumbers(blockNumber);

          const blockTime = block.header.timestamp;

          await dao.insertBlock({
            hash: BigInt(block.header.blockHash ?? 0),
            number: block.header.blockNumber,
            time: blockTime,
          });

          for (const event of block.events) {
            const eventKey: EventKey = {
              blockNumber,
              transactionIndex: event.transactionIndex,
              eventIndex: event.eventIndexInTransaction,
              emitter: BigInt(event.address),
              transactionHash: BigInt(event.transactionHash),
            };

            // process each event sequentially through all the event processors in parallel
            // assumption is that none of the event processors operate on the same events, i.e. have the same filters
            // this assumption could be validated at runtime
            await Promise.all(
              event.filterIds.map(async (matchingFilterId) => {
                eventsProcessed++;
                const eventProcessor = EVENT_PROCESSORS[matchingFilterId - 1];
                const { parser, handle } = eventProcessor;

                try {
                  // For Starknet events:
                  // - keys[0] is the event selector
                  // - keys[1..n] are parameters marked with #[key]
                  // - data contains non-keyed parameters
                  // We need to combine both, with keys coming first (excluding selector)
                  const keysWithoutSelector = event.keys?.slice(1) || [];
                  const combinedData = [...keysWithoutSelector, ...event.data];

                  const parsed = parser(combinedData, 0).value;

                  await handle(dao, {
                    parsed: parsed as any,
                    key: eventKey,
                  });
                } catch (error) {
                  logger.error("Failed to parse event", {
                    error,
                    blockNumber,
                    transactionHash: eventKey.transactionHash.toString(16),
                    eventIndex: eventKey.eventIndex,
                    emitter: event.address,
                    eventKeys: event.keys?.map(k => BigInt(k).toString(16)) || [],
                    eventData: event.data.map(d => BigInt(d).toString(16)),
                    filterKeys: eventProcessor.filter.keys,
                  });
                  throw error;
                }
              }),
            );
          }

          // endCursor is what we write so when we restart we delete any pending data
          if (message.data.finality !== 'pending') {
            await dao.writeCursor(message.data.endCursor);
          }

          await dao.commitTransaction();

          blockProcessingTimer.done({
            message: `Processed to block`,
            blockNumber,
            isHead,
            eventsProcessed,
            blockTimestamp: blockTime,
            lag: msToHumanShort(
              Math.floor(Date.now() - Number(blockTime.getTime())),
            ),
          });
        }

        // TEMPORARILY DISABLED: Materialized view refresh (no swap/oracle data being indexed)
        // Uncomment when you re-enable swap and oracle indexing
        // if (eventsProcessed > 0) {
        //   try {
        //     const refreshTimer = logger.startTimer();
        //     await dao.refreshAnalyticalTables();
        //     refreshTimer.done({ message: 'Refreshed analytical materialized views' });
        //   } catch (error) {
        //     logger.error('Failed to refresh analytical tables', { error });
        //   }
        // }

        client.release();

        break;
      }

      default: {
        logger.error(`Unhandled message type: ${message._tag}`);
        break;
      }
    }
  }
})()
  .then(() => {
    logger.error("Stream closed unexpectedly - this should not happen in production");
    process.exit(1);
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
