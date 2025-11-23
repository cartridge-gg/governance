import type { EventProcessor } from "./processor";
import { logger } from "./logger";
import {
  parseProposalCreatedEvent,
  parseProposalQueuedEvent,
  parseProposalExecutedEvent,
  parseProposalCanceledEvent,
  parseVoteCastEvent,
  parseVoteCastWithParamsEvent,
} from "./events/governor";
import type {
  ProposalCreatedEvent,
  ProposalQueuedEvent,
  ProposalExecutedEvent,
  ProposalCanceledEvent,
  VoteCastEvent,
  VoteCastWithParamsEvent,
} from "./events/governor";
import {
  parseDelegateChangedEvent,
  parseDelegateVotesChangedEvent,
} from "./events/votes";
import type {
  DelegateChangedEvent,
  DelegateVotesChangedEvent,
} from "./events/votes";
// TEMPORARILY DISABLED: Swap and Oracle imports (not indexing these events)
// import { parseSwappedEvent } from "./events/ekubo";
// import type { SwappedEvent } from "./events/ekubo";
// import { parseSnapshotEvent } from "./events/oracle";
// import type { SnapshotEvent } from "./events/oracle";

export const EVENT_PROCESSORS = [
  <EventProcessor<ProposalCreatedEvent>>{
    filter: {
      fromAddress: process.env.GOVERNOR_ADDRESS,
      keys: [
        // ProposalCreated
        "0x02c0d1d9d0efb5c7398b67924974bb430e0de82d366c7ee89e068943383c0181",
      ],
    },
    parser: parseProposalCreatedEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("ProposalCreated", { parsed, key });
      await dao.insertProposalCreatedEvent(parsed, key);
    },
  },
  <EventProcessor<ProposalQueuedEvent>>{
    filter: {
      fromAddress: process.env.GOVERNOR_ADDRESS,
      keys: [
        // ProposalQueued
        "0x012f080ed02a408b879ef08ae2f613eedda9e8ce460d99be2b53ff65c2b49fa9",
      ],
    },
    parser: parseProposalQueuedEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("ProposalQueued", { parsed, key });
      await dao.insertProposalQueuedEvent(parsed, key);
    },
  },
  <EventProcessor<ProposalExecutedEvent>>{
    filter: {
      fromAddress: process.env.GOVERNOR_ADDRESS,
      keys: [
        // ProposalExecuted
        "0x0290e6190b9add2042390b39f4b905ba158c4a169e57c3aa925ecd5cbc8d355a",
      ],
    },
    parser: parseProposalExecutedEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("ProposalExecuted", { parsed, key });
      await dao.insertProposalExecutedEvent(parsed, key);
    },
  },
  <EventProcessor<ProposalCanceledEvent>>{
    filter: {
      fromAddress: process.env.GOVERNOR_ADDRESS,
      keys: [
        // ProposalCanceled
        "0x02bd214ac73ad0a4cd5dda5aef5372f4f4088355ac9b3f2ab9ef4adf946a9326",
      ],
    },
    parser: parseProposalCanceledEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("ProposalCanceled", { parsed, key });
      await dao.insertProposalCanceledEvent(parsed, key);
    },
  },
  <EventProcessor<VoteCastEvent>>{
    filter: {
      fromAddress: process.env.GOVERNOR_ADDRESS,
      keys: [
        // VoteCast
        "0x021d85f4389cb888ceaf7588bcebcebd09d3c1a57890503af1d9e7a2573352b5",
      ],
    },
    parser: parseVoteCastEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("VoteCast", { parsed, key });
      await dao.insertVoteCastEvent(parsed, key);
    },
  },
  <EventProcessor<VoteCastWithParamsEvent>>{
    filter: {
      fromAddress: process.env.GOVERNOR_ADDRESS,
      keys: [
        // VoteCastWithParams
        "0x01039af07de3ec81795d90cf085e15dee232fa5a71db8e253918c1f030b745da",
      ],
    },
    parser: parseVoteCastWithParamsEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("VoteCastWithParams", { parsed, key });
      await dao.insertVoteCastWithParamsEvent(parsed, key);
    },
  },
  <EventProcessor<DelegateChangedEvent>>{
    filter: {
      fromAddress: process.env["VOTES_TOKEN_ADDRESS"],
      keys: [
        // DelegateChanged
        "0x01b0439783bfefdfc1a2af2a035ae0f0e030bbc035c2507b7e79ca84c2c3f645",
      ],
    },
    parser: parseDelegateChangedEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("DelegateChanged", { parsed, key });
      await dao.insertDelegateChangedEvent(parsed, key);
    },
  },
  <EventProcessor<DelegateVotesChangedEvent>>{
    filter: {
      fromAddress: process.env["VOTES_TOKEN_ADDRESS"],
      keys: [
        // DelegateVotesChanged
        "0x00a9fa878c35cd3d0191318f89033ca3e5501a3d90e21e3cc9256bdd5cd17fdd",
      ],
    },
    parser: parseDelegateVotesChangedEvent,
    async handle(dao, { parsed, key }): Promise<void> {
      logger.debug("DelegateVotesChanged", { parsed, key });
      await dao.insertDelegateVotesChangedEvent(parsed, key);
    },
  },
  // TEMPORARILY DISABLED: Swap and Oracle indexing for performance
  // Uncomment these when you're ready to index price data
  // <EventProcessor<SwappedEvent>>{
  //   filter: {
  //     fromAddress: process.env["EKUBO_ADDRESS"],
  //     keys: [
  //       // Swapped
  //       "0x157717768aca88da4ac4279765f09f4d0151823d573537fbbeb950cdbd9a870",
  //     ],
  //   },
  //   parser: parseSwappedEvent,
  //   async handle(dao, { parsed, key }): Promise<void> {
  //     logger.debug("Swapped", { parsed, key });
  //     await dao.insertSwappedEvent(parsed, key);
  //   },
  // },
  // <EventProcessor<SnapshotEvent>>{
  //   filter: {
  //     fromAddress: process.env["ORACLE_ADDRESS"],
  //     keys: [
  //       // Snapshot
  //       "0x62cc09262bfb9bcc1d33aed854c67083f331d07e624b987576a98db8249d25",
  //     ],
  //   },
  //   parser: parseSnapshotEvent,
  //   async handle(dao, { parsed, key }): Promise<void> {
  //     logger.debug("OracleSnapshot", { parsed, key });
  //     await dao.insertOracleSnapshotEvent(parsed, key);
  //   },
  // },
] as const;
