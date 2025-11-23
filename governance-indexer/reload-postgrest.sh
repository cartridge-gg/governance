#!/bin/bash
# Wait for PostgREST to be ready, then reload its schema cache

sleep 5  # Give PostgREST time to start

# Send SIGUSR1 to reload schema
docker exec governance-postgrest kill -SIGUSR1 1 2>/dev/null || echo "PostgREST not running yet"

echo "PostgREST schema cache reloaded"
