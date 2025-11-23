# Railway Deployment Guide

## Quick Start

Railway doesn't support docker-compose natively, so we'll deploy 4 separate services in one Railway project.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Create Railway Project

```bash
cd governance-stack
railway init
# Give your project a name: "governance-stack"
```

### Step 3: Deploy Postgres

In Railway web dashboard (https://railway.app):
1. Open your project
2. Click "+ New" → "Database" → "PostgreSQL"
3. Wait for provisioning
4. Copy the connection string from "Connect" tab

### Step 4: Deploy Indexer

```bash
cd indexer
railway link  # Link to your existing project
railway up    # Deploy the indexer
```

Set environment variables in Railway dashboard for the indexer service:
- Click on the indexer service
- Go to "Variables" tab
- Add these variables:

```
NETWORK=mainnet
PG_CONNECTION_STRING=${{Postgres.DATABASE_URL}}
APIBARA_URL=https://mainnet.starknet.a5a.ch
DNA_TOKEN=your_apibara_token
GOVERNOR_ADDRESS=0x...your_governor_address...
VOTES_TOKEN_ADDRESS=0x...your_votes_token_address...
STARTING_CURSOR_BLOCK_NUMBER=0
LOG_LEVEL=info
NO_BLOCKS_TIMEOUT_MS=120000
```

**Note**: `${{Postgres.DATABASE_URL}}` is Railway's syntax to reference the Postgres service's connection string.

### Step 5: Deploy PostgREST

In Railway web dashboard:
1. Click "+ New" → "Empty Service"
2. Name it "postgrest"
3. Go to "Settings" → scroll to "Deploy via Docker Image"
4. Enter image: `postgrest/postgrest:latest`
5. Click "Deploy"
6. Go to "Variables" tab and add:

```
PGRST_DB_URI=${{Postgres.DATABASE_URL}}
PGRST_DB_ANON_ROLE=postgres
PGRST_DB_SCHEMA=public
PGRST_DB_SCHEMAS=public
PGRST_OPENAPI_SERVER_PROXY_URI=https://${{RAILWAY_PUBLIC_DOMAIN}}
PGRST_DB_POOL=10
PGRST_DB_POOL_ACQUISITION_TIMEOUT=10
```

7. Go to "Settings" → "Networking"
8. Click "Generate Domain" to get a public URL
9. **Copy this URL** - you'll need it for the UI

### Step 6: Deploy UI

```bash
cd ../ui
railway link  # Link to the same project
railway up    # Deploy the UI
```

Set environment variables for the UI service:
- Go to Variables tab
- Add:

```
VITE_POSTGREST_URL=https://your-postgrest-url.railway.app
```

Replace `your-postgrest-url.railway.app` with the PostgREST domain from Step 5.

Then go to Settings → Networking → Generate Domain to get a public URL for your UI.

### Step 7: Verify Deployment

1. **Check Indexer Logs**
   - Click on indexer service
   - Go to "Deployments" → latest deployment → "View Logs"
   - Should see: "Initialized schema" and "Processed to block"

2. **Test PostgREST API**
   ```bash
   curl https://your-postgrest-url.railway.app/current_delegate_votes_view
   ```
   Should return JSON with delegate data

3. **Open UI**
   - Navigate to your UI's Railway domain
   - Should see the governance interface
   - Check browser console for any API errors

## Environment Variables Reference

### Railway Variable Syntax

Railway allows you to reference other services:
- `${{Postgres.DATABASE_URL}}` - Postgres connection string
- `${{RAILWAY_PUBLIC_DOMAIN}}` - Current service's public domain
- `${{ServiceName.VARIABLE_NAME}}` - Reference another service's variable

### Required Variables by Service

**Indexer:**
- `NETWORK` - mainnet or sepolia
- `PG_CONNECTION_STRING` - Use `${{Postgres.DATABASE_URL}}`
- `APIBARA_URL` - Apibara DNA endpoint
- `DNA_TOKEN` - Your Apibara API token
- `GOVERNOR_ADDRESS` - 0x-prefixed address
- `VOTES_TOKEN_ADDRESS` - 0x-prefixed address
- `STARTING_CURSOR_BLOCK_NUMBER` - Block to start from (0 for genesis)
- `LOG_LEVEL` - info/debug/warn/error
- `NO_BLOCKS_TIMEOUT_MS` - Default 120000

**PostgREST:**
- `PGRST_DB_URI` - Use `${{Postgres.DATABASE_URL}}`
- `PGRST_DB_ANON_ROLE` - postgres
- `PGRST_DB_SCHEMA` - public
- `PGRST_DB_SCHEMAS` - public
- `PGRST_OPENAPI_SERVER_PROXY_URI` - `https://${{RAILWAY_PUBLIC_DOMAIN}}`

**UI:**
- `VITE_POSTGREST_URL` - PostgREST public URL

## Troubleshooting

### Indexer won't start
- Check logs: Look for connection errors
- Verify `PG_CONNECTION_STRING` is set correctly
- Ensure Postgres service is healthy
- Verify `APIBARA_URL` and `DNA_TOKEN` are correct

### PostgREST returns empty results
- Check indexer has synced blocks (view logs)
- Verify tables exist:
  ```bash
  railway run --service postgres psql -c "\dt"
  ```
- Restart PostgREST service to reload schema cache

### UI can't connect to API
- Check browser console for CORS errors
- Verify `VITE_POSTGREST_URL` matches PostgREST's public domain
- Ensure PostgREST has public networking enabled

### View Railway logs
```bash
# View indexer logs
railway logs --service indexer

# View postgrest logs
railway logs --service postgrest

# View ui logs
railway logs --service ui
```

## Monitoring

Railway provides:
- **Metrics**: CPU, Memory, Network usage per service
- **Logs**: Real-time log streaming
- **Alerts**: Set up notifications for service health
- **Deployments**: Track deployment history and rollback

## Scaling

Each service can be scaled independently:
1. Go to service → Settings → Resources
2. Adjust CPU/Memory limits
3. Railway charges based on usage

## CI/CD Setup

Connect GitHub for automatic deployments:
1. Go to service → Settings → Source Repo
2. Connect your GitHub repository
3. Select branch (main/master)
4. Railway will auto-deploy on push

## Costs

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month + usage
- **Pro Plan**: $20/month + usage
- **Postgres**: ~$5-15/month depending on size
- Each service: Billed by CPU/Memory/Network usage

Estimated monthly cost for this stack: **$15-30/month**

## Production Checklist

- [ ] Database backups enabled (Railway auto-backs up Postgres)
- [ ] Environment variables set for all services
- [ ] PostgREST has public domain configured
- [ ] UI has public domain configured
- [ ] Indexer is syncing blocks (check logs)
- [ ] API returns data (test endpoints)
- [ ] UI loads and connects to API
- [ ] Set up monitoring/alerts
- [ ] Document contract addresses used
- [ ] Test voting functionality end-to-end
