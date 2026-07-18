'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type {
  AdminLead,
  LeadEvent,
  LeadListResult,
  LeadPriority,
  LeadSource,
  LeadStats,
  LeadStatus,
} from '@/lib/db';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useTheme } from '../providers';

const NeuralNet = dynamic(() => import('../components/NeuralNet'), { ssr: false });

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

const sources: LeadSource[] = ['homepage', 'newsletter', 'application', 'three-second-test'];
const priorities: LeadPriority[] = ['high', 'normal', 'low'];

type FollowUpFilter = 'all' | 'overdue' | 'today' | 'scheduled';
const followUps: { value: FollowUpFilter; label: string }[] = [
  { value: 'all', label: 'All follow-ups' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'scheduled', label: 'Scheduled' },
];

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

function EventLog({ state }: { state: LeadEvent[] | 'loading' | 'error' | undefined }) {
  if (state === undefined || state === 'loading') {
    return <p className="text-xs text-[var(--text-tertiary)]">Loading activity…</p>;
  }
  if (state === 'error') {
    return <p className="text-xs text-red-400">Could not load activity.</p>;
  }
  if (state.length === 0) {
    return <p className="text-xs text-[var(--text-tertiary)]">No activity recorded yet.</p>;
  }
  return (
    <ul className="space-y-2">
      {state.map((event) => (
        <li key={event.id} className="text-xs text-[var(--text-secondary)]">
          <span className="text-[var(--text-tertiary)]">{formatDate(event.createdAt)}</span>{' '}
          <span className="text-[var(--text-primary)]">{event.eventType.replaceAll('.', ' ').replaceAll('_', ' ')}</span>
          {event.details && Object.keys(event.details).length > 0 && (
            <span className="text-[var(--text-tertiary)]">
              {' — '}
              {Object.entries(event.details)
                .map(([key, value]) => `${key}: ${String(value)}`)
                .join(', ')}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function AdminDashboard({
  initialLeads,
  stats,
  adminEmail,
  filters,
}: {
  initialLeads: LeadListResult;
  stats: LeadStats;
  adminEmail: string;
  filters: {
    query: string;
    status: LeadStatus | '';
    source: LeadSource | '';
    followUp: FollowUpFilter;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();

  const [leads, setLeads] = useState<AdminLead[]>(initialLeads.leads);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(filters.query);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<LeadStatus>('contacted');
  const [bulkSaving, setBulkSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [eventsById, setEventsById] = useState<Record<string, LeadEvent[] | 'loading' | 'error'>>({});

  // Adjust local state during render when the server-provided props change
  // (new searchParams navigation), rather than in an effect: this avoids an
  // extra cascading render pass for what is really a prop-driven reset.
  const [prevInitialLeads, setPrevInitialLeads] = useState(initialLeads);
  if (initialLeads !== prevInitialLeads) {
    setPrevInitialLeads(initialLeads);
    setLeads(initialLeads.leads);
    setSelectedIds(new Set());
  }

  const [prevQuery, setPrevQuery] = useState(filters.query);
  if (filters.query !== prevQuery) {
    setPrevQuery(filters.query);
    setSearchText(filters.query);
  }

  // Debounce the free-text search before it becomes a navigation.
  useEffect(() => {
    if (searchText === filters.query) return;
    const id = setTimeout(() => pushFilters({ query: searchText, page: 1 }), 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const totalPages = Math.max(1, Math.ceil(initialLeads.total / initialLeads.pageSize));

  const visibleStats = useMemo(
    () => [
      { label: 'Total leads', value: stats.total },
      { label: 'Needs review', value: stats.newLeads },
      { label: 'Qualified', value: stats.qualified },
      { label: 'Won', value: stats.won },
    ],
    [stats],
  );

  function pushFilters(next: {
    query?: string;
    status?: LeadStatus | '';
    source?: LeadSource | '';
    followUp?: FollowUpFilter;
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = {
      query: filters.query,
      status: filters.status,
      source: filters.source,
      followUp: filters.followUp,
      page: initialLeads.page,
      ...next,
    };

    if (merged.query) params.set('q', merged.query);
    else params.delete('q');

    if (merged.status) params.set('status', merged.status);
    else params.delete('status');

    if (merged.source) params.set('source', merged.source);
    else params.delete('source');

    if (merged.followUp && merged.followUp !== 'all') params.set('followUp', merged.followUp);
    else params.delete('followUp');

    if (merged.page && merged.page > 1) params.set('page', String(merged.page));
    else params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  }

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

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((current) => (current.size === leads.length ? new Set() : new Set(leads.map((l) => l.id))));
  };

  const applyBulkStatus = async () => {
    if (selectedIds.size === 0) return;
    setBulkSaving(true);
    setError(null);

    const response = await fetch('/api/admin/leads/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...selectedIds], status: bulkStatus }),
    });

    setBulkSaving(false);
    if (!response.ok) {
      setError('Could not apply the bulk update.');
      return;
    }

    setSelectedIds(new Set());
    router.refresh();
  };

  const toggleActivity = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (eventsById[id]) return;

    setEventsById((current) => ({ ...current, [id]: 'loading' }));
    try {
      const response = await fetch(`/api/admin/leads/${id}/events`);
      if (!response.ok) throw new Error('Request failed');
      const data = (await response.json()) as { events: LeadEvent[] };
      setEventsById((current) => ({ ...current, [id]: data.events }));
    } catch {
      setEventsById((current) => ({ ...current, [id]: 'error' }));
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  const selectClass =
    'rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm';
  const inputClass =
    'rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm';

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <NeuralNet theme={theme} reducedMotion={reducedMotion} />
      </div>

      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--nav-background)] px-6 py-5 backdrop-blur">
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

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <section className="grid gap-3 md:grid-cols-4">
          {visibleStats.map((item) => (
            <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">{item.label}</p>
              <p className="font-display mt-3 text-4xl text-brand">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by email"
            className={`${inputClass} min-w-[220px] flex-1`}
          />
          <select
            value={filters.status}
            onChange={(event) => pushFilters({ status: event.target.value as LeadStatus | '', page: 1 })}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
          <select
            value={filters.source}
            onChange={(event) => pushFilters({ source: event.target.value as LeadSource | '', page: 1 })}
            className={selectClass}
          >
            <option value="">All sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
          <select
            value={filters.followUp}
            onChange={(event) => pushFilters({ followUp: event.target.value as FollowUpFilter, page: 1 })}
            className={selectClass}
          >
            {followUps.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        {selectedIds.size > 0 && (
          <section className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-brand/40 bg-brand/5 px-4 py-3">
            <span className="text-sm text-[var(--text-secondary)]">{selectedIds.size} selected</span>
            <select
              value={bulkStatus}
              onChange={(event) => setBulkStatus(event.target.value as LeadStatus)}
              className={selectClass}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  Set to: {status.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={applyBulkStatus}
              disabled={bulkSaving}
              className="btn-primary rounded-md px-4 py-2 text-sm disabled:opacity-50"
            >
              {bulkSaving ? 'Applying…' : 'Apply to selected'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Clear selection
            </button>
          </section>
        )}

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        <section className="mt-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
            <thead className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              <tr>
                <th className="px-4 py-3 font-medium">
                  <input
                    type="checkbox"
                    checked={leads.length > 0 && selectedIds.size === leads.length}
                    onChange={toggleSelectAll}
                    aria-label="Select all leads on this page"
                  />
                </th>
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
                <Fragment key={lead.id}>
                  <tr className="border-b border-[var(--border)] align-top last:border-b-0">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(lead.id)}
                        onChange={() => toggleSelected(lead.id)}
                        aria-label={`Select ${lead.email}`}
                      />
                    </td>
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
                      <button
                        type="button"
                        onClick={() => toggleActivity(lead.id)}
                        className="mt-3 text-xs uppercase tracking-[0.14em] text-brand hover:underline"
                      >
                        {expandedId === lead.id ? 'Hide activity' : 'View activity'}
                      </button>
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
                  {expandedId === lead.id && (
                    <tr className="border-b border-[var(--border)] bg-[var(--background)] last:border-b-0">
                      <td />
                      <td colSpan={6} className="px-4 py-4">
                        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)]">Activity history</p>
                        <EventLog state={eventsById[lead.id]} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-tertiary)]">
                    No leads match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {initialLeads.total > 0 && (
          <section className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>
              Page {initialLeads.page} of {totalPages} · {initialLeads.total} leads
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => pushFilters({ page: initialLeads.page - 1 })}
                disabled={initialLeads.page <= 1}
                className="rounded-md border border-[var(--border)] px-3 py-2 transition hover:border-brand disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => pushFilters({ page: initialLeads.page + 1 })}
                disabled={initialLeads.page >= totalPages}
                className="rounded-md border border-[var(--border)] px-3 py-2 transition hover:border-brand disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
