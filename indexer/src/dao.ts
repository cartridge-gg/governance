import type { PoolClient } from "pg";
import { Client } from "pg";
import type { EventKey } from "./processor.ts";
import type {
  ProposalCreatedEvent,
  ProposalQueuedEvent,
  ProposalExecutedEvent,
  ProposalCanceledEvent,
  VoteCastEvent,
  VoteCastWithParamsEvent,
} from "./events/governor.ts";
import type {
  DelegateChangedEvent,
  DelegateVotesChangedEvent,
} from "./events/votes.ts";

// Data access object for governance data only
export class DAO {
  private pg: Client | PoolClient;

  constructor(pg: Client | PoolClient) {
    this.pg = pg;
  }

  public async beginTransaction(): Promise<void> {
    await this.pg.query("BEGIN");
  }

  public async commitTransaction(): Promise<void> {
    await this.pg.query("COMMIT");
  }

  public async initializeSchema() {
    await this.beginTransaction();
    await this.createSchema();
    const cursor = await this.loadCursor();
    // we need to clear anything that was potentially inserted as pending before starting
    if (cursor) {
      await this.deleteOldBlockNumbers(Number(cursor.orderKey) + 1);
    }
    await this.commitTransaction();
    return cursor;
  }

  private async createSchema(): Promise<void> {
    await this.pg.query(`
        CREATE TABLE IF NOT EXISTS cursor
        (
            id           INT         NOT NULL UNIQUE CHECK (id = 1), -- only one row.
            order_key    BIGINT      NOT NULL,
            unique_key   bytea       NOT NULL,
            last_updated timestamptz NOT NULL
        );

        CREATE TABLE IF NOT EXISTS blocks
        (
            -- int4 blocks represents over a thousand years at 12 second blocks
            number   int4        NOT NULL PRIMARY KEY,
            hash     NUMERIC     NOT NULL,
            time     timestamptz NOT NULL,
            inserted timestamptz NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_blocks_time ON blocks USING btree (time);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_blocks_hash ON blocks USING btree (hash);

        -- all events reference an event id which contains the metadata of the event
        CREATE TABLE IF NOT EXISTS event_keys
        (
            id                int8 GENERATED ALWAYS AS (block_number * 4294967296 + transaction_index * 65536 + event_index) STORED PRIMARY KEY,
            transaction_hash  TEXT NOT NULL,
            block_number      int4    NOT NULL REFERENCES blocks (number) ON DELETE CASCADE,
            transaction_index int2    NOT NULL,
            event_index       int2    NOT NULL,
            emitter           NUMERIC NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_event_keys_block_number_transaction_index_event_index ON event_keys USING btree (block_number, transaction_index, event_index);
        CREATE INDEX IF NOT EXISTS idx_event_keys_transaction_hash ON event_keys USING btree (transaction_hash);

        CREATE TABLE IF NOT EXISTS proposals
        (
            event_id     int8 REFERENCES event_keys (id) ON DELETE CASCADE PRIMARY KEY,

            proposal_id  NUMERIC NOT NULL,
            proposer     NUMERIC NOT NULL,
            vote_start   BIGINT  NOT NULL,
            vote_end     BIGINT  NOT NULL,
            description  TEXT    NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_proposals_proposal_id ON proposals USING btree (proposal_id);
        CREATE INDEX IF NOT EXISTS idx_proposals_proposer ON proposals USING btree (proposer);

        CREATE TABLE IF NOT EXISTS proposal_calls
        (
            proposal_id  NUMERIC   NOT NULL REFERENCES proposals (proposal_id) ON DELETE CASCADE,
            call_index   int2      NOT NULL,
            to_address   NUMERIC   NOT NULL,
            selector     NUMERIC   NOT NULL,
            calldata     NUMERIC[] NOT NULL,
            PRIMARY KEY (proposal_id, call_index)
        );

        CREATE TABLE IF NOT EXISTS proposal_signatures
        (
            proposal_id      NUMERIC   NOT NULL REFERENCES proposals (proposal_id) ON DELETE CASCADE,
            signature_index  int2      NOT NULL,
            signature        NUMERIC[] NOT NULL,
            PRIMARY KEY (proposal_id, signature_index)
        );

        CREATE TABLE IF NOT EXISTS proposal_queued
        (
            event_id     int8 REFERENCES event_keys (id) ON DELETE CASCADE PRIMARY KEY,

            proposal_id  NUMERIC NOT NULL,
            eta_seconds  BIGINT  NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_proposal_queued_proposal_id ON proposal_queued USING btree (proposal_id);

        CREATE TABLE IF NOT EXISTS proposal_executed
        (
            event_id     int8 REFERENCES event_keys (id) ON DELETE CASCADE PRIMARY KEY,

            proposal_id  NUMERIC NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_proposal_executed_proposal_id ON proposal_executed USING btree (proposal_id);

        CREATE TABLE IF NOT EXISTS proposal_canceled
        (
            event_id     int8 REFERENCES event_keys (id) ON DELETE CASCADE PRIMARY KEY,

            proposal_id  NUMERIC NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_proposal_canceled_proposal_id ON proposal_canceled USING btree (proposal_id);

        CREATE TABLE IF NOT EXISTS votes
        (
            event_id     int8 REFERENCES event_keys (id) ON DELETE CASCADE PRIMARY KEY,

            proposal_id  NUMERIC   NOT NULL,
            voter        NUMERIC   NOT NULL,
            support      int2      NOT NULL,
            weight       NUMERIC   NOT NULL,
            reason       TEXT      NOT NULL,
            params       NUMERIC[] NULL
        );
        CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes USING btree (proposal_id);
        CREATE INDEX IF NOT EXISTS idx_votes_voter ON votes USING btree (voter);
        CREATE INDEX IF NOT EXISTS idx_votes_proposal_voter ON votes USING btree (proposal_id, voter);

        CREATE TABLE IF NOT EXISTS delegate_changed
        (
            event_id      int8 REFERENCES event_keys (id) ON DELETE CASCADE PRIMARY KEY,

            delegator     NUMERIC NOT NULL,
            from_delegate NUMERIC NOT NULL,
            to_delegate   NUMERIC NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_delegate_changed_delegator ON delegate_changed USING btree (delegator);
        CREATE INDEX IF NOT EXISTS idx_delegate_changed_to_delegate ON delegate_changed USING btree (to_delegate);
        CREATE INDEX IF NOT EXISTS idx_delegate_changed_from_delegate ON delegate_changed USING btree (from_delegate);

        CREATE TABLE IF NOT EXISTS delegate_votes_changed
        (
            event_id       int8 REFERENCES event_keys (id) ON DELETE CASCADE PRIMARY KEY,

            delegate       NUMERIC NOT NULL,
            previous_votes NUMERIC NOT NULL,
            new_votes      NUMERIC NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_delegate_votes_changed_delegate ON delegate_votes_changed USING btree (delegate);
    `);
  }

  private async loadCursor(): Promise<
    | {
        orderKey: bigint;
        uniqueKey: `0x${string}`;
      }
    | { orderKey: bigint }
    | null
  > {
    const { rows } = await this.pg.query({
      text: `SELECT order_key, unique_key
                   FROM cursor
                   WHERE id = 1;`,
    });
    if (rows.length === 1) {
      const { order_key, unique_key } = rows[0];

      if (BigInt(unique_key) === 0n) {
        return {
          orderKey: BigInt(order_key),
        };
      } else {
        return {
          orderKey: BigInt(order_key),
          uniqueKey: `0x${BigInt(unique_key).toString(16)}`,
        };
      }
    } else {
      return null;
    }
  }

  public async writeCursor(cursor: { orderKey: bigint; uniqueKey?: string }) {
    await this.pg.query({
      text: `
          INSERT INTO cursor (id, order_key, unique_key, last_updated)
          VALUES (1, $1, $2, NOW())
          ON CONFLICT (id) DO UPDATE SET order_key    = excluded.order_key,
                                         unique_key   = excluded.unique_key,
                                         last_updated = NOW();
      `,
      values: [cursor.orderKey, BigInt(cursor.uniqueKey ?? 0)],
    });
  }

  public async insertBlock({
    number,
    hash,
    time,
  }: {
    number: bigint;
    hash: bigint;
    time: Date;
  }) {
    await this.pg.query({
      text: `INSERT INTO blocks (number, hash, time)
                   VALUES ($1, $2, $3);`,
      values: [number, hash, time],
    });
  }

  /**
   * Deletes all the blocks equal to or greater than the given block number, cascades to all the other tables.
   * @param invalidatedBlockNumber the block number for which data in the database should be removed
   */
  public async deleteOldBlockNumbers(invalidatedBlockNumber: number) {
    const { rowCount } = await this.pg.query({
      text: `
                DELETE
                FROM blocks
                WHERE number >= $1;
            `,
      values: [invalidatedBlockNumber],
    });
    if (rowCount === null) throw new Error("Null row count after delete");
    return rowCount;
  }

  // =============================================================================
  // GOVERNANCE EVENT INSERTION METHODS
  // =============================================================================

  async insertProposalCreatedEvent(
    parsed: ProposalCreatedEvent,
    key: EventKey
  ) {
    const query =
      parsed.calls.length > 0
        ? `
                        WITH inserted_event AS (
                            INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                                VALUES ($1, $2, $3, $4, $5)
                                RETURNING id),
                             inserted_proposal AS (
                                 INSERT
                                     INTO proposals
                                         (event_id, proposal_id, proposer, vote_start, vote_end, description)
                                         VALUES ((SELECT id FROM inserted_event), $6, $7, $8, $9, $10))
                        INSERT
                        INTO proposal_calls (proposal_id, call_index, to_address, selector, calldata)
                        VALUES
                        ${parsed.calls
                          .map(
                            (call, ix) =>
                              `($6, ${ix}, ${call.to}, ${
                                call.selector
                              }, '{${call.calldata
                                .map((c) => c.toString())
                                .join(",")}}')`
                          )
                          .join(",")};
                `
        : `
                        WITH inserted_event AS (
                            INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                                VALUES ($1, $2, $3, $4, $5)
                                RETURNING id)
                        INSERT
                        INTO proposals
                            (event_id, proposal_id, proposer, vote_start, vote_end, description)
                        VALUES ((SELECT id FROM inserted_event), $6, $7, $8, $9, $10);
                `;
    await this.pg.query({
      text: query,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.proposal_id,
        parsed.proposer,
        parsed.vote_start,
        parsed.vote_end,
        // postgres does not support null characters
        parsed.description.replaceAll("\u0000", "?"),
      ],
    });

    // Insert signatures if present
    if (parsed.signatures.length > 0) {
      const signatureValues = parsed.signatures
        .map(
          (sig, ix) =>
            `($6, ${ix}, '{${sig.map((s) => s.toString()).join(",")}}')`
        )
        .join(",");

      await this.pg.query({
        text: `
          INSERT INTO proposal_signatures (proposal_id, signature_index, signature)
          VALUES ${signatureValues};
        `,
        values: [
          key.blockNumber,
          key.transactionIndex,
          key.eventIndex,
          key.transactionHash,
          key.emitter,
          parsed.proposal_id,
        ],
      });
    }
  }

  async insertProposalQueuedEvent(parsed: ProposalQueuedEvent, key: EventKey) {
    await this.pg.query({
      text: `
                WITH inserted_event AS (
                    INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id)
                INSERT
                INTO proposal_queued
                    (event_id, proposal_id, eta_seconds)
                VALUES ((SELECT id FROM inserted_event), $6, $7)
            `,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.proposal_id,
        parsed.eta_seconds,
      ],
    });
  }

  async insertProposalExecutedEvent(
    parsed: ProposalExecutedEvent,
    key: EventKey
  ) {
    await this.pg.query({
      text: `
                WITH inserted_event AS (
                    INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id)
                INSERT
                INTO proposal_executed
                    (event_id, proposal_id)
                VALUES ((SELECT id FROM inserted_event), $6)
            `,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.proposal_id,
      ],
    });
  }

  async insertProposalCanceledEvent(
    parsed: ProposalCanceledEvent,
    key: EventKey
  ) {
    await this.pg.query({
      text: `
                WITH inserted_event AS (
                    INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id)
                INSERT
                INTO proposal_canceled
                    (event_id, proposal_id)
                VALUES ((SELECT id FROM inserted_event), $6)
            `,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.proposal_id,
      ],
    });
  }

  async insertVoteCastEvent(parsed: VoteCastEvent, key: EventKey) {
    await this.pg.query({
      text: `
                WITH inserted_event AS (
                    INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id)
                INSERT
                INTO votes
                    (event_id, proposal_id, voter, support, weight, reason)
                VALUES ((SELECT id FROM inserted_event), $6, $7, $8, $9, $10)
            `,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.proposal_id,
        parsed.voter,
        parsed.support,
        parsed.weight,
        // postgres does not support null characters
        parsed.reason.replaceAll("\u0000", "?"),
      ],
    });
  }

  async insertVoteCastWithParamsEvent(
    parsed: VoteCastWithParamsEvent,
    key: EventKey
  ) {
    await this.pg.query({
      text: `
                WITH inserted_event AS (
                    INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id)
                INSERT
                INTO votes
                    (event_id, proposal_id, voter, support, weight, reason, params)
                VALUES ((SELECT id FROM inserted_event), $6, $7, $8, $9, $10, $11)
            `,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.proposal_id,
        parsed.voter,
        parsed.support,
        parsed.weight,
        // postgres does not support null characters
        parsed.reason.replaceAll("\u0000", "?"),
        parsed.params,
      ],
    });
  }

  async insertDelegateChangedEvent(
    parsed: DelegateChangedEvent,
    key: EventKey
  ) {
    await this.pg.query({
      text: `
                WITH inserted_event AS (
                    INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id)
                INSERT
                INTO delegate_changed
                    (event_id, delegator, from_delegate, to_delegate)
                VALUES ((SELECT id FROM inserted_event), $6, $7, $8)
            `,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.delegator,
        parsed.from_delegate,
        parsed.to_delegate,
      ],
    });
  }

  async insertDelegateVotesChangedEvent(
    parsed: DelegateVotesChangedEvent,
    key: EventKey
  ) {
    await this.pg.query({
      text: `
                WITH inserted_event AS (
                    INSERT INTO event_keys (block_number, transaction_index, event_index, transaction_hash, emitter)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id)
                INSERT
                INTO delegate_votes_changed
                    (event_id, delegate, previous_votes, new_votes)
                VALUES ((SELECT id FROM inserted_event), $6, $7, $8)
            `,
      values: [
        key.blockNumber,
        key.transactionIndex,
        key.eventIndex,
        key.transactionHash,
        key.emitter,
        parsed.delegate,
        parsed.previous_votes,
        parsed.new_votes,
      ],
    });
  }
}
