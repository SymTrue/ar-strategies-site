import type { Metadata } from 'next';
import { requireAdminSession } from '@/lib/admin-auth';
import { getLeadStats, listAdminLeads } from '@/lib/db';
import { AdminDashboard } from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Lead CRM: AR Strategies',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await requireAdminSession();
  const [leads, stats] = await Promise.all([listAdminLeads(), getLeadStats()]);

  return <AdminDashboard initialLeads={leads} stats={stats} adminEmail={session.email} />;
}
