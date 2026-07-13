const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = fs.readFileSync(path.join(__dirname, 'migrations', '002_admin_crm_security.sql'), 'utf8');

const client = new Client({ connectionString: databaseUrl });

async function main() {
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();