#!/bin/bash
set -e

# Start the indexer in the background
npm start &
INDEXER_PID=$!

# Wait a bit for schema to be initialized
sleep 10

# Reload PostgREST schema cache
echo "Reloading PostgREST schema cache..."
wget -q -O- http://postgrest:3000/ > /dev/null 2>&1 || true
sleep 1

# Try to signal PostgREST to reload (if in same network)
# This uses HTTP to the PostgREST admin endpoint
curl -X POST http://postgrest:3000/rpc/pgrst_watch || true

# Wait for the indexer process
wait $INDEXER_PID
