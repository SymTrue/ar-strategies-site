import { sql } from '@vercel/postgres';

export type LeadStatus =
  | 'new'
  | 'confirmed'
  | 'notification_failed'
  | 'contacted'
  | 'qualified'
  | 'won'
  | 'lost'
  | 'archived';

export type LeadPriority = 'low' | 'normal' | 'high';

export type AdminLead = {
  id: string;
  email: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  notes: string | null;
  details: Record<string, string> | null;
  nextFollowUpAt: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadStats = {
  total: number;
  newLeads: number;
  qualified: number;
  won: number;
};

export type LeadCRMUpdate = {
  status: LeadStatus;
  priority: LeadPriority;
  notes: string | null;
  nextFollowUpAt: string | null;
  markContacted: boolean;
};

const LEAD_STATUSES: ReadonlySet<string> = new Set([
  'new',
  'confirmed',
  'notification_failed',
  'contacted',
  'qualified',
  'won',
  'lost',
  'archived',
]);

const LEAD_PRIORITIES: ReadonlySet<string> = new Set(['low', 'normal', 'high']);

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && LEAD_STATUSES.has(value);
}

export function isLeadPriority(value: unknown): value is LeadPriority {
  return typeof value === 'string' && LEAD_PRIORITIES.has(value);
}

function rowToLead(row: Record<string, unknown>): AdminLead {
  return {
    id: String(row.id),
    email: String(row.email),
    source: String(row.source),
    status: row.status as LeadStatus,
    priority: row.priority as LeadPriority,
    notes: typeof row.notes === 'string' ? row.notes : null,
    details:
      row.details && typeof row.details === 'object'
        ? (row.details as Record<string, string>)
        : null,
    nextFollowUpAt: row.next_follow_up_at ? new Date(String(row.next_follow_up_at)).toISOString() : null,
    lastContactedAt: row.last_contacted_at ? new Date(String(row.last_contacted_at)).toISOString() : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function saveLead(
  email: string,
  source: string = 'homepage',
  details: Record<string, string> | null = null,
): Promise<string | null> {
  const detailsJson = details ? JSON.stringify(details) : null;
  try {
    // On conflict, keep existing details unless this submission carries new
    // ones, and never demote an applicant back to a lower-intent source: a
    // newsletter signup after an application must not wipe or bury the
    // application.
    const result = await sql`
      INSERT INTO leads (email, source, status, details, created_at, updated_at)
      VALUES (${email}, ${source}, 'new', ${detailsJson}::jsonb, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        source = CASE WHEN leads.source = 'application' THEN 'application' ELSE ${source} END,
        details = COALESCE(${detailsJson}::jsonb, leads.details),
        updated_at = NOW()
      RETURNING id;
    `;
    return result.rows[0]?.id || null;
  } catch (err) {
    // 42703 = undefined column: migration 003 has not run yet. Capture the
    // lead anyway rather than dropping it; details still reach the owner in
    // the notification email.
    if ((err as { code?: string })?.code === '42703') {
      console.error('leads.details column missing: run migrations/003_lead_details.sql');
      const fallback = await sql`
        INSERT INTO leads (email, source, status, created_at, updated_at)
        VALUES (${email}, ${source}, 'new', NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET source = ${source}, updated_at = NOW()
        RETURNING id;
      `;
      return fallback.rows[0]?.id || null;
    }
    console.error('Database error saving lead:', err);
    throw err;
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  try {
    await sql`
      UPDATE leads SET status = ${status}, updated_at = NOW() WHERE id = ${id};
    `;
  } catch (err) {
    console.error('Database error updating lead:', err);
    throw err;
  }
}

export async function checkLeadRateLimit(
  rateKey: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const result = await sql`
    INSERT INTO lead_rate_limits (rate_key, count, reset_at)
    VALUES (${rateKey}, 1, NOW() + (${windowSeconds} || ' seconds')::interval)
    ON CONFLICT (rate_key) DO UPDATE SET
      count = CASE
        WHEN lead_rate_limits.reset_at <= NOW() THEN 1
        ELSE lead_rate_limits.count + 1
      END,
      reset_at = CASE
        WHEN lead_rate_limits.reset_at <= NOW() THEN NOW() + (${windowSeconds} || ' seconds')::interval
        ELSE lead_rate_limits.reset_at
      END
    RETURNING count <= ${limit} AS allowed;
  `;

  return Boolean(result.rows[0]?.allowed);
}

export async function listAdminLeads(): Promise<AdminLead[]> {
  const result = await sql`
    SELECT
      id,
      email,
      source,
      status,
      COALESCE(priority, 'normal') AS priority,
      notes,
      details,
      next_follow_up_at,
      last_contacted_at,
      created_at,
      updated_at
    FROM leads
    ORDER BY
      CASE COALESCE(priority, 'normal')
        WHEN 'high' THEN 0
        WHEN 'normal' THEN 1
        ELSE 2
      END,
      created_at DESC
    LIMIT 250;
  `;

  return result.rows.map((row) => rowToLead(row));
}

export async function getLeadStats(): Promise<LeadStats> {
  const result = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status IN ('new', 'confirmed', 'notification_failed'))::int AS new_leads,
      COUNT(*) FILTER (WHERE status = 'qualified')::int AS qualified,
      COUNT(*) FILTER (WHERE status = 'won')::int AS won
    FROM leads;
  `;

  const row = result.rows[0] ?? {};
  return {
    total: Number(row.total ?? 0),
    newLeads: Number(row.new_leads ?? 0),
    qualified: Number(row.qualified ?? 0),
    won: Number(row.won ?? 0),
  };
}

export async function updateLeadCRM(id: string, update: LeadCRMUpdate): Promise<AdminLead | null> {
  const result = await sql`
    UPDATE leads
    SET
      status = ${update.status},
      priority = ${update.priority},
      notes = ${update.notes},
      next_follow_up_at = ${update.nextFollowUpAt},
      last_contacted_at = CASE
        WHEN ${update.markContacted} THEN NOW()
        ELSE last_contacted_at
      END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING
      id,
      email,
      source,
      status,
      COALESCE(priority, 'normal') AS priority,
      notes,
      details,
      next_follow_up_at,
      last_contacted_at,
      created_at,
      updated_at;
  `;

  const row = result.rows[0];
  return row ? rowToLead(row) : null;
}
