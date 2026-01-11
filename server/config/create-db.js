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
const database = process.env.DB_NAME || 'tasks_db';

async function createDatabase() {
  const client = new Client({
    host,
    port,
    user: username,
    password,
    database: 'postgres',
  });

  try {
    await client.connect();

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [database]
    );

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${database}`);
      console.log(`✅ Database ${database} created`);
    } else {
      console.log(`ℹ️ Database ${database} already exists`);
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    await client.end();
    process.exit(1);
  }
}

createDatabase();
