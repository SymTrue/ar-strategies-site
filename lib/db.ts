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
export type LeadSource = 'homepage' | 'newsletter' | 'application' | 'three-second-test';

export type LeadAttribution = {
  landingPath: string | null;
  referrer: string | null;
  utm: Record<string, string> | null;
};

export type AdminLead = {
  id: string;
  email: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  notes: string | null;
  details: Record<string, string> | null;
  attribution: LeadAttribution;
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

export type LeadListFilters = {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: LeadStatus;
  source?: LeadSource;
  followUp?: 'all' | 'overdue' | 'today' | 'scheduled';
};

export type LeadListResult = {
  leads: AdminLead[];
  total: number;
  page: number;
  pageSize: number;
};

export type LeadEvent = {
  id: number;
  eventType: string;
  details: Record<string, unknown> | null;
  createdAt: string;
};

export type EmailDelivery = {
  id: string;
  leadId: string;
  deliveryType: 'owner_notification' | 'lead_confirmation';
  recipient: string;
  replyTo: string | null;
  subject: string;
  html: string;
  attempts: number;
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
const LEAD_SOURCES: ReadonlySet<string> = new Set([
  'homepage',
  'newsletter',
  'application',
  'three-second-test',
]);

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && LEAD_STATUSES.has(value);
}

export function isLeadPriority(value: unknown): value is LeadPriority {
  return typeof value === 'string' && LEAD_PRIORITIES.has(value);
}

export function isLeadSource(value: unknown): value is LeadSource {
  return typeof value === 'string' && LEAD_SOURCES.has(value);
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
    attribution: {
      landingPath: typeof row.landing_path === 'string' ? row.landing_path : null,
      referrer: typeof row.referrer === 'string' ? row.referrer : null,
      utm: row.utm && typeof row.utm === 'object' ? (row.utm as Record<string, string>) : null,
    },
    nextFollowUpAt: row.next_follow_up_at ? new Date(String(row.next_follow_up_at)).toISOString() : null,
    lastContactedAt: row.last_contacted_at ? new Date(String(row.last_contacted_at)).toISOString() : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function saveLead(
  email: string,
  source: LeadSource,
  details: Record<string, string> | null = null,
  attribution: LeadAttribution,
): Promise<{ id: string; created: boolean } | null> {
  const detailsJson = details ? JSON.stringify(details) : null;
  const utmJson = attribution.utm ? JSON.stringify(attribution.utm) : null;
  try {
    // On conflict, keep existing details unless this submission carries new
    // ones, and never demote an applicant back to a lower-intent source: a
    // newsletter signup after an application must not wipe or bury the
    // application.
    const result = await sql`
      INSERT INTO leads (email, source, status, details, landing_path, referrer, utm, created_at, updated_at)
      VALUES (${email}, ${source}, 'new', ${detailsJson}::jsonb, ${attribution.landingPath}, ${attribution.referrer}, ${utmJson}::jsonb, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        source = CASE WHEN leads.source = 'application' THEN 'application' ELSE ${source} END,
        details = COALESCE(${detailsJson}::jsonb, leads.details),
        landing_path = COALESCE(${attribution.landingPath}, leads.landing_path),
        referrer = COALESCE(${attribution.referrer}, leads.referrer),
        utm = COALESCE(${utmJson}::jsonb, leads.utm),
        updated_at = NOW()
      RETURNING id, (xmax = 0) AS created;
    `;
    const row = result.rows[0];
    return row ? { id: String(row.id), created: Boolean(row.created) } : null;
  } catch (err) {
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

export async function recordLeadEvent(
  leadId: string,
  eventType: string,
  details: Record<string, unknown> | null = null,
): Promise<void> {
  await sql`
    INSERT INTO lead_events (lead_id, event_type, details)
    VALUES (${leadId}, ${eventType}, ${details ? JSON.stringify(details) : null}::jsonb);
  `;
}

export async function listLeadEvents(leadId: string): Promise<LeadEvent[]> {
  const result = await sql`
    SELECT id, event_type, details, created_at
    FROM lead_events
    WHERE lead_id = ${leadId}
    ORDER BY created_at DESC
    LIMIT 25;
  `;

  return result.rows.map((row) => ({
    id: Number(row.id),
    eventType: String(row.event_type),
    details: row.details && typeof row.details === 'object' ? (row.details as Record<string, unknown>) : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
  }));
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

export async function listAdminLeads(filters: LeadListFilters = {}): Promise<LeadListResult> {
  const pageSize = Math.min(Math.max(filters.pageSize ?? 25, 10), 100);
  const page = Math.max(filters.page ?? 1, 1);
  const offset = (page - 1) * pageSize;
  const query = filters.query?.trim().toLowerCase() || null;
  const followUp = filters.followUp ?? 'all';

  const values = [
    query,
    filters.status ?? null,
    filters.source ?? null,
    followUp,
    pageSize,
    offset,
  ];
  const where = `
    WHERE ($1::text IS NULL OR LOWER(email) LIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR status = $2)
      AND ($3::text IS NULL OR source = $3)
      AND ($4::text = 'all'
        OR ($4::text = 'overdue' AND next_follow_up_at < NOW() AND status NOT IN ('won', 'lost', 'archived'))
        OR ($4::text = 'today' AND next_follow_up_at::date = NOW()::date AND status NOT IN ('won', 'lost', 'archived'))
        OR ($4::text = 'scheduled' AND next_follow_up_at IS NOT NULL AND next_follow_up_at > NOW()::date + INTERVAL '1 day' AND status NOT IN ('won', 'lost', 'archived')))
  `;

  const [leadsResult, totalResult] = await Promise.all([
    sql.query(
      `SELECT
        id, email, source, status, COALESCE(priority, 'normal') AS priority, notes, details,
        landing_path, referrer, utm, next_follow_up_at, last_contacted_at, created_at, updated_at
      FROM leads
      ${where}
      ORDER BY
        CASE COALESCE(priority, 'normal') WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END,
        created_at DESC
      LIMIT $5 OFFSET $6;`,
      values,
    ),
    sql.query(`SELECT COUNT(*)::int AS total FROM leads ${where};`, values.slice(0, 4)),
  ]);

  return {
    leads: leadsResult.rows.map((row) => rowToLead(row)),
    total: Number(totalResult.rows[0]?.total ?? 0),
    page,
    pageSize,
  };
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
      landing_path,
      referrer,
      utm,
      next_follow_up_at,
      last_contacted_at,
      created_at,
      updated_at;
  `;

  const row = result.rows[0];
  if (!row) return null;

  const lead = rowToLead(row);
  await recordLeadEvent(id, update.markContacted ? 'lead.contacted' : 'lead.updated', {
    status: lead.status,
    priority: lead.priority,
    nextFollowUpAt: lead.nextFollowUpAt,
  });
  return lead;
}

export async function bulkUpdateLeadStatus(ids: string[], status: LeadStatus): Promise<number> {
  if (ids.length === 0) return 0;
  const result = await sql.query(
    `UPDATE leads SET status = $2, updated_at = NOW() WHERE id = ANY($1::text[]) RETURNING id;`,
    [ids, status],
  );
  await Promise.all(
    result.rows.map((row) => recordLeadEvent(String(row.id), 'lead.bulk_status_changed', { status })),
  );
  return result.rows.length;
}

export async function enqueueEmailDelivery(input: {
  leadId: string;
  deliveryType: EmailDelivery['deliveryType'];
  recipient: string;
  replyTo: string | null;
  subject: string;
  html: string;
}): Promise<void> {
  await sql`
    INSERT INTO email_deliveries (lead_id, delivery_type, recipient, reply_to, subject, html)
    VALUES (${input.leadId}, ${input.deliveryType}, ${input.recipient}, ${input.replyTo}, ${input.subject}, ${input.html});
  `;
}

export async function claimEmailDeliveries(limit: number): Promise<EmailDelivery[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 25);
  const result = await sql`
    WITH candidates AS (
      SELECT id
      FROM email_deliveries
      WHERE (status = 'pending' AND next_attempt_at <= NOW())
        OR (status = 'processing' AND locked_at < NOW() - INTERVAL '15 minutes')
      ORDER BY next_attempt_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${safeLimit}
    )
    UPDATE email_deliveries
    SET status = 'processing', attempts = attempts + 1, locked_at = NOW(), updated_at = NOW()
    WHERE id IN (SELECT id FROM candidates)
    RETURNING id, lead_id, delivery_type, recipient, reply_to, subject, html, attempts;
  `;

  return result.rows.map((row) => ({
    id: String(row.id),
    leadId: String(row.lead_id),
    deliveryType: row.delivery_type as EmailDelivery['deliveryType'],
    recipient: String(row.recipient),
    replyTo: typeof row.reply_to === 'string' ? row.reply_to : null,
    subject: String(row.subject),
    html: String(row.html),
    attempts: Number(row.attempts),
  }));
}

export async function markEmailDeliverySent(delivery: EmailDelivery): Promise<void> {
  await sql`
    UPDATE email_deliveries
    SET status = 'sent', sent_at = NOW(), locked_at = NULL, updated_at = NOW(), last_error = NULL
    WHERE id = ${delivery.id};
  `;
  await recordLeadEvent(delivery.leadId, 'email.sent', { deliveryType: delivery.deliveryType });
  if (delivery.deliveryType === 'owner_notification') {
    await updateLeadStatus(delivery.leadId, 'confirmed');
  }
}

export async function markEmailDeliveryFailed(delivery: EmailDelivery, error: string): Promise<void> {
  const terminal = delivery.attempts >= 5;
  const retryAt = new Date(Date.now() + Math.min(60 * 60 * 1000, 60_000 * 2 ** delivery.attempts));
  await sql`
    UPDATE email_deliveries
    SET
      status = ${terminal ? 'failed' : 'pending'},
      next_attempt_at = ${retryAt.toISOString()},
      locked_at = NULL,
      last_error = ${error.slice(0, 1000)},
      updated_at = NOW()
    WHERE id = ${delivery.id};
  `;
  await recordLeadEvent(delivery.leadId, terminal ? 'email.failed' : 'email.retry_scheduled', {
    deliveryType: delivery.deliveryType,
    attempts: delivery.attempts,
  });
  if (terminal && delivery.deliveryType === 'owner_notification') {
    await updateLeadStatus(delivery.leadId, 'notification_failed');
  }
}

export async function unsubscribeNewsletter(email: string): Promise<void> {
  await sql`
    UPDATE leads
    SET newsletter_unsubscribed_at = NOW(), updated_at = NOW()
    WHERE email = ${email};
  `;
}

export async function cleanOperationalRecords(): Promise<void> {
  await Promise.all([
    sql`DELETE FROM lead_rate_limits WHERE reset_at < NOW() - INTERVAL '7 days';`,
    sql`DELETE FROM email_deliveries WHERE status = 'sent' AND sent_at < NOW() - INTERVAL '90 days';`,
  ]);
}
