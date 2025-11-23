# Governance Indexer

Service for indexing governance events into a Postgres database.

## Overview

This indexer focuses on producing an always-consistent realtime view of OpenZeppelin-style governance events, using the Apibara service to get a stream of relevant data from Starknet.

The indexer tracks:
- **Proposals**: Created, Queued, Executed, Canceled
- **Votes**: VoteCast and VoteCastWithParams
- **Delegation**: DelegateChanged and DelegateVotesChanged

Events are stored directly in PostgreSQL tables with views for querying current delegation and voting power state.

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Apibara DNA token (get one from [apibara.com](https://www.apibara.com/))
- Your governance contract addresses

### Setup

1. **Configure environment variables**:

   Edit `.env.mainnet` (or create `.env.local` for local development):
   ```bash
   # Set your DNA token
   DNA_TOKEN="your_apibara_token_here"

   # Contract addresses are already set, but verify they're correct
   GOVERNOR_ADDRESS="0x050897ea9df71b661b8eac53162be37552e729ee9d33a6f9ae0b61c95a11209e"
   VOTES_TOKEN_ADDRESS="0x042dd777885ad2c116be96d4d634abc90a26a790ffb5871e037dd5ae7d2ec86b"
   ```

2. **Start the indexer**:
   ```bash
   # For mainnet
   docker-compose up -d

   # For a different network, set NETWORK env var
   NETWORK=sepolia docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f indexer
   ```

4. **Access PostgreSQL**:
   ```bash
   docker exec -it governance-postgres psql -U postgres -d mainnet
   ```

### Stopping the Indexer

```bash
docker-compose down

# To also remove the database volume
docker-compose down -v
```

## Running Locally (Without Docker)

### Prerequisites
- Node.js `^22.10.0`
- PostgreSQL running locally
- Apibara DNA token

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   - Copy `.env.local.example` to `.env.local` or `.env.mainnet`
   - Fill in your `DNA_TOKEN` and contract addresses
   - Update `PG_CONNECTION_STRING` to point to your local PostgreSQL instance

3. **Create database**:
   ```bash
   createdb mainnet  # or your database name
   ```

4. **Run the indexer**:
   ```bash
   # For mainnet
   npm start

   # For sepolia
   npm run start:sepolia
   ```

## Database Schema

The indexer creates the following tables:

- `blocks` - Block metadata
- `event_keys` - Event metadata (transaction hash, block number, etc.)
- `proposals` - ProposalCreated events
- `proposal_calls` - Calls associated with proposals
- `proposal_signatures` - Signatures for proposals
- `proposal_queued` - ProposalQueued events
- `proposal_executed` - ProposalExecuted events
- `proposal_canceled` - ProposalCanceled events
- `votes` - VoteCast and VoteCastWithParams events
- `delegate_changed` - DelegateChanged events
- `delegate_votes_changed` - DelegateVotesChanged events

And views:
- `current_delegations_view` - Current delegation state for each delegator
- `current_delegate_votes_view` - Current voting power for each delegate

## Querying the Data

```sql
-- Get all proposals
SELECT * FROM proposals ORDER BY event_id DESC;

-- Get votes for a specific proposal
SELECT * FROM votes WHERE proposal_id = 'your_proposal_id';

-- Get current delegations
SELECT * FROM current_delegations_view;

-- Get current voting power
SELECT * FROM current_delegate_votes_view ORDER BY current_votes DESC;
```

## Configuration

Key environment variables:

- `GOVERNOR_ADDRESS` - The governance contract address
- `VOTES_TOKEN_ADDRESS` - The ERC20Votes token contract address
- `DNA_TOKEN` - Your Apibara DNA token
- `STARTING_CURSOR_BLOCK_NUMBER` - Block to start indexing from
- `NO_BLOCKS_TIMEOUT_MS` - Timeout before exiting if no blocks received (default: 5 minutes)
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `NETWORK` - Network to index (mainnet, sepolia)
- `APIBARA_URL` - Apibara stream URL
- `PG_CONNECTION_STRING` - PostgreSQL connection string