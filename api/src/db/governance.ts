import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;

export const governancePool = new Pool({
  connectionString: process.env.GOVERNANCE_DB_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

governancePool.on('error', (err) => {
  console.error('Unexpected error on governance DB client', err);
});
