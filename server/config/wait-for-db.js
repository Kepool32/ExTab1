const nodeEnv = process.env.NODE_ENV || 'development';

if (!process.env.DB_HOST) {
  const envFile = nodeEnv === 'production' ? '.env.production' : '.env.example';
  require('dotenv').config({ path: envFile });
}

const { Client } = require('pg');

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const username = process.env.DB_USERNAME || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';

const maxRetries = 30;
const retryDelay = 1000;

async function waitForDatabase() {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = new Client({
        host,
        port,
        user: username,
        password,
        database: 'postgres',
      });

      await client.connect();
      await client.query('SELECT 1');
      await client.end();

      console.log('✅ Database is ready');
      process.exit(0);
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('❌ Database is not ready after', maxRetries, 'attempts');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

waitForDatabase();
