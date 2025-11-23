# Governance Stack - Railway Deployment

Full-stack governance application with indexer, API, and UI.

## Architecture

- **Postgres**: Database for indexed blockchain data
- **Indexer**: Apibara-based indexer for OpenZeppelin Governor events
- **PostgREST**: Automatic REST API for Postgres
- **UI**: React + Vite frontend

## Local Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The app will be available at:
- UI: http://localhost:8080
- PostgREST API: http://localhost:3000
- Postgres: localhost:5432

## Railway Deployment

Railway doesn't natively support docker-compose, so you'll deploy each service separately in a single Railway project.

### Setup Steps

1. **Create a Railway Project**
   ```bash
   railway login
   railway init
   ```

2. **Add Postgres Database**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Note the connection string from the "Connect" tab

3. **Deploy Indexer Service**
   ```bash
   cd indexer
   railway up
   ```

   Set environment variables in Railway dashboard:
   - `NETWORK`: `mainnet` or `sepolia`
   - `PG_CONNECTION_STRING`: Use Railway Postgres connection string
   - `APIBARA_URL`: Your Apibara DNA endpoint
   - `DNA_TOKEN`: Your Apibara API token
   - `GOVERNOR_ADDRESS`: Your governor contract address
   - `VOTES_TOKEN_ADDRESS`: Your ERC20Votes token address
   - `STARTING_CURSOR_BLOCK_NUMBER`: Block to start indexing from
   - `LOG_LEVEL`: `info`

4. **Deploy PostgREST Service**

   In Railway dashboard:
   - Click "+ New" → "Empty Service"
   - Go to "Settings" → "Source"
   - Deploy from image: `postgrest/postgrest:latest`
   - Set environment variables:
     - `PGRST_DB_URI`: Railway Postgres connection string
     - `PGRST_DB_ANON_ROLE`: `postgres`
     - `PGRST_DB_SCHEMA`: `public`
     - `PGRST_DB_SCHEMAS`: `public`
     - `PGRST_OPENAPI_SERVER_PROXY_URI`: `${{RAILWAY_PUBLIC_DOMAIN}}`
   - Enable "Public Networking" to get a public URL

5. **Deploy UI Service**
   ```bash
   cd ui
   railway up
   ```

   Set environment variables:
   - `VITE_POSTGREST_URL`: PostgREST public URL from step 4

6. **Configure Networking**
   - Each service will get its own Railway internal URL
   - Services can communicate via `servicename.railway.internal`
   - Enable public domains for PostgREST and UI

## Alternative: Single Docker Deployment

If you want to run everything in one container on Railway:

1. Use the provided `docker-compose.yml` for local dev
2. For Railway, create a single Dockerfile that runs docker-compose:

```dockerfile
FROM docker/compose:latest

WORKDIR /app
COPY . .

CMD ["docker-compose", "up"]
```

**Note**: This approach is not recommended as Railway works best with individual services.

## Environment Variables

### Indexer
- `NETWORK`: Starknet network (mainnet/sepolia)
- `PG_CONNECTION_STRING`: PostgreSQL connection string
- `APIBARA_URL`: Apibara DNA stream URL
- `DNA_TOKEN`: Apibara authentication token
- `GOVERNOR_ADDRESS`: Governor contract address (0x...)
- `VOTES_TOKEN_ADDRESS`: ERC20Votes token address (0x...)
- `STARTING_CURSOR_BLOCK_NUMBER`: Block number to start indexing from
- `LOG_LEVEL`: Log level (debug/info/warn/error)
- `NO_BLOCKS_TIMEOUT_MS`: Timeout for block streaming (default: 120000)

### PostgREST
- `PGRST_DB_URI`: PostgreSQL connection URI
- `PGRST_DB_ANON_ROLE`: Database role (postgres)
- `PGRST_DB_SCHEMA`: Schema to expose (public)
- `PGRST_OPENAPI_SERVER_PROXY_URI`: Public URL for OpenAPI spec

### UI
- `VITE_POSTGREST_URL`: PostgREST API URL

## Project Structure

```
governance-stack/
├── indexer/           # Blockchain indexer
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── ui/               # React frontend
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── railway.json
└── README.md
```

## Monitoring

On Railway dashboard you can:
- View logs for each service
- Monitor resource usage
- Set up alerts
- View deployment history

## Troubleshooting

### Indexer not syncing
- Check `APIBARA_URL` and `DNA_TOKEN` are correct
- Verify `GOVERNOR_ADDRESS` matches your deployed contract
- Check indexer logs: `railway logs -s indexer`

### PostgREST schema cache issues
- PostgREST caches schema on startup
- If tables/views don't appear, restart the PostgREST service
- Check postgres connection string is correct

### UI can't connect to API
- Verify `VITE_POSTGREST_URL` points to PostgREST public URL
- Ensure PostgREST has public networking enabled
- Check CORS if needed

## Production Considerations

1. **Database**: Use Railway's managed Postgres with regular backups
2. **Secrets**: Store sensitive values (DNA_TOKEN, connection strings) in Railway environment variables
3. **Scaling**: Each service can be scaled independently
4. **Monitoring**: Set up Railway alerts for service health
5. **Updates**: Use Railway's GitHub integration for automatic deployments
