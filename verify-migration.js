const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('leads', 'lead_rate_limits')
    `);
    console.log('Tables:', res.rows.map(r => r.table_name).join(', '));
    
    const cols = await client.query(`
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'leads' ORDER BY ordinal_position
    `);
    console.log('Leads columns:', cols.rows.map(r => r.column_name + ':' + r.data_type).join(', '));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();