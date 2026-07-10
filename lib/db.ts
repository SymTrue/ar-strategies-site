import { sql } from '@vercel/postgres';

export async function saveLead(email: string) {
  try {
    const result = await sql`
      INSERT INTO leads (email, source, status, created_at, updated_at)
      VALUES (${email}, 'homepage', 'new', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id;
    `;
    return result.rows[0]?.id || null;
  } catch (err) {
    console.error('Database error saving lead:', err);
    throw err;
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    await sql`
      UPDATE leads SET status = ${status}, updated_at = NOW() WHERE id = ${id};
    `;
  } catch (err) {
    console.error('Database error updating lead:', err);
    throw err;
  }
}
