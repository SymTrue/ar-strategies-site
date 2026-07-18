import type { Metadata } from 'next';
import { requireAdminSession } from '@/lib/admin-auth';
import {
  getLeadStats,
  isLeadSource,
  isLeadStatus,
  listAdminLeads,
  type LeadListFilters,
  type LeadSource,
  type LeadStatus,
} from '@/lib/db';
import { AdminDashboard } from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Lead CRM: AR Strategies',
  robots: { index: false, follow: false },
};

const FOLLOW_UP_VALUES = ['all', 'overdue', 'today', 'scheduled'] as const;
export type FollowUpFilter = (typeof FOLLOW_UP_VALUES)[number];

function isFollowUpFilter(value: unknown): value is FollowUpFilter {
  return typeof value === 'string' && (FOLLOW_UP_VALUES as readonly string[]).includes(value);
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireAdminSession();
  const params = await searchParams;

  const statusParam = first(params.status);
  const sourceParam = first(params.source);
  const followUpParam = first(params.followUp);
  const pageParam = Number(first(params.page));

  const filters: LeadListFilters = {
    page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
    query: first(params.q) || undefined,
    status: isLeadStatus(statusParam) ? (statusParam as LeadStatus) : undefined,
    source: isLeadSource(sourceParam) ? (sourceParam as LeadSource) : undefined,
    followUp: isFollowUpFilter(followUpParam) ? followUpParam : 'all',
  };

  const [leads, stats] = await Promise.all([listAdminLeads(filters), getLeadStats()]);

  return (
    <AdminDashboard
      initialLeads={leads}
      stats={stats}
      adminEmail={session.email}
      filters={{
        query: filters.query ?? '',
        status: (filters.status ?? '') as LeadStatus | '',
        source: (filters.source ?? '') as LeadSource | '',
        followUp: filters.followUp ?? 'all',
      }}
    />
  );
}
