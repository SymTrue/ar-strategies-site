'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { AdminLead, LeadPriority, LeadStats, LeadStatus } from '@/lib/db';

const statuses: LeadStatus[] = [
  'new',
  'confirmed',
  'notification_failed',
  'contacted',
  'qualified',
  'won',
  'lost',
  'archived',
];

const priorities: LeadPriority[] = ['high', 'normal', 'low'];

const DETAIL_LABELS: Record<string, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  phone: 'Phone',
  industry: 'Industry',
  spend: 'Marketing spend',
  help: 'Needs help with',
};

function formatDate(value: string | null): string {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function toInputDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromInputDate(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

function StatusPill({ status }: { status: LeadStatus }) {
  const tone = status === 'won' ? 'text-green-400' : status === 'lost' ? 'text-red-400' : 'text-brand';
  return <span className={`text-xs uppercase tracking-[0.14em] ${tone}`}>{status.replaceAll('_', ' ')}</span>;
}

export function AdminDashboard({
  initialLeads,
  stats,
  adminEmail,
}: {
  initialLeads: AdminLead[];
  stats: LeadStats;
  adminEmail: string;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState<AdminLead[]>(initialLeads);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visibleStats = useMemo(
    () => [
      { label: 'Total leads', value: stats.total },
      { label: 'Needs review', value: stats.newLeads },
      { label: 'Qualified', value: stats.qualified },
      { label: 'Won', value: stats.won },
    ],
    [stats],
  );

  const updateLeadField = <Key extends keyof AdminLead>(
    id: string,
    field: Key,
    value: AdminLead[Key],
  ) => {
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, [field]: value } : lead)),
    );
  };

  const saveLead = async (lead: AdminLead, markContacted: boolean) => {
    setSavingId(lead.id);
    setError(null);

    const response = await fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: lead.status,
        priority: lead.priority,
        notes: lead.notes,
        nextFollowUpAt: lead.nextFollowUpAt,
        markContacted,
      }),
    });

    setSavingId(null);
    if (!response.ok) {
      setError('Could not save lead. Refresh and try again.');
      return;
    }

    const data = (await response.json()) as { lead: AdminLead };
    setLeads((current) => current.map((item) => (item.id === lead.id ? data.lead : item)));
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--nav-background)] px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brand">AR Strategies CRM</p>
            <h1 className="font-display mt-1 text-3xl uppercase">Lead Command</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span>{adminEmail}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-[var(--text-primary)] transition hover:border-brand"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="grid gap-3 md:grid-cols-4">
          {visibleStats.map((item) => (
            <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">{item.label}</p>
              <p className="font-display mt-3 text-4xl text-brand">{item.value}</p>
            </div>
          ))}
        </section>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        <section className="mt-8 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              <tr>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Follow-up</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-[var(--border)] align-top last:border-b-0">
                  <td className="px-4 py-4">
                    <a href={`mailto:${lead.email}`} className="font-semibold text-[var(--text-primary)] hover:text-brand">
                      {lead.email}
                    </a>
                    <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                      {lead.source} · {formatDate(lead.createdAt)}
                    </p>
                    <p className="mt-2">
                      <StatusPill status={lead.status} />
                    </p>
                    {lead.details && Object.keys(lead.details).length > 0 && (
                      <dl className="mt-3 space-y-1 text-xs text-[var(--text-secondary)]">
                        {Object.entries(lead.details).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <dt className="shrink-0 text-[var(--text-tertiary)]">{DETAIL_LABELS[key] ?? key}:</dt>
                            <dd className="min-w-0 break-words">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={lead.status}
                      onChange={(event) => updateLeadField(lead.id, 'status', event.target.value as LeadStatus)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={lead.priority}
                      onChange={(event) => updateLeadField(lead.id, 'priority', event.target.value as LeadPriority)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="datetime-local"
                      value={toInputDate(lead.nextFollowUpAt)}
                      onChange={(event) => updateLeadField(lead.id, 'nextFollowUpAt', fromInputDate(event.target.value))}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                    />
                    <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                      Last contacted: {formatDate(lead.lastContactedAt)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <textarea
                      value={lead.notes ?? ''}
                      onChange={(event) => updateLeadField(lead.id, 'notes', event.target.value)}
                      rows={3}
                      className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                      placeholder="Call notes, objections, promised audit items"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => saveLead(lead, false)}
                        disabled={savingId === lead.id}
                        className="rounded-md border border-[var(--border)] px-3 py-2 text-sm transition hover:border-brand disabled:opacity-50"
                      >
                        {savingId === lead.id ? 'Saving' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => saveLead({ ...lead, status: 'contacted' }, true)}
                        disabled={savingId === lead.id}
                        className="btn-primary rounded-md px-3 py-2 text-sm disabled:opacity-50"
                      >
                        Mark contacted
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[var(--text-tertiary)]">
                    No leads yet. New audit requests will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
