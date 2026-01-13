# Governance API

REST API for querying governance data from PostgreSQL.

## Architecture

This API replaces PostgREST with a custom Express server that provides:
- Optimized query patterns for governance operations
- In-memory caching with configurable TTLs
- Connection pooling for the governance database
- Custom business logic and data aggregations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Update environment variables:
- `GOVERNANCE_DB_URL`: Connection string for governance database
- `PORT`: API server port (default: 4000)
- `CORS_ORIGIN`: Allowed CORS origin
- Cache TTLs in seconds for different data types

## Running

Development mode with hot reload:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check

#### `GET /health`
Returns API health status
```json
{
  "status": "ok",
  "timestamp": "2025-01-13T10:00:00.000Z"
}
```

### Governance Endpoints

#### `GET /api/governance/proposals`
Returns all proposals with their current state
```json
[
  {
    "proposal_id": "1",
    "proposer": "0x...",
    "targets": [...],
    "values": [...],
    "signatures": [...],
    "calldatas": [...],
    "start_block": 100,
    "end_block": 200,
    "description": "Proposal description",
    "state": "Active",
    "created_at": "2025-01-01T00:00:00Z",
    "for_votes": "1000",
    "against_votes": "100",
    "abstain_votes": "50"
  }
]
```

#### `GET /api/governance/proposals/:id`
Returns detailed information about a specific proposal

#### `GET /api/governance/proposals/:id/votes`
Returns all votes cast for a specific proposal
```json
[
  {
    "proposal_id": "1",
    "voter": "0x...",
    "support": 1,
    "weight": "100",
    "reason": "I support this",
    "params": null,
    "voted_at": "2025-01-02T00:00:00Z"
  }
]
```

#### `GET /api/governance/proposals/:id/calls`
Returns all calls (actions) for a specific proposal
```json
[
  {
    "proposal_id": "1",
    "call_index": 0,
    "target": "0x...",
    "value": "0",
    "signature": "transfer(address,uint256)",
    "calldata": "0x..."
  }
]
```

#### `GET /api/governance/delegates`
Returns all delegates with their current voting power
```json
[
  {
    "delegate": "0x...",
    "votes": "5000",
    "last_updated": "2025-01-10T00:00:00Z"
  }
]
```

#### `GET /api/governance/delegates/:address`
Returns detailed information about a specific delegate

#### `GET /api/governance/delegations/:address`
Returns who an address has delegated to
```json
{
  "delegator": "0x...",
  "delegate": "0x...",
  "last_updated": "2025-01-05T00:00:00Z"
}
```

#### `GET /api/governance/stats/total-votes`
Returns the total delegated voting power
```json
{
  "total_votes": "1000000"
}
```

#### `GET /api/governance/votes/address/:address`
Returns all votes cast by a specific address

## Caching

The API implements in-memory caching with configurable TTLs:
- `CACHE_TTL_PROPOSALS`: Proposals data (default: 120s)
- `CACHE_TTL_VOTES`: Votes data (default: 60s)
- `CACHE_TTL_DELEGATES`: Delegate data (default: 300s)

Cache is automatically invalidated when TTL expires.

## Database Connections

The API maintains a connection pool for the governance database:
- **Governance Pool**: Max 20 connections to governance database
- 30s idle timeout
- 2s connection timeout
- Automatic error handling and logging
