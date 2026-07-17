// Pure validation logic for the /api/lead route, split out so it's testable
// without a live database or Resend connection.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0 || normalized.length > 254) return null;
  if (!EMAIL_PATTERN.test(normalized)) return null;
  return normalized;
}

export function isHoneypotTriggered(website: unknown): boolean {
  return typeof website === 'string' && website.trim() !== '';
}

export function cleanField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export interface ApplicationFields {
  firstName: string;
  lastName: string;
  phone: string;
  industry: string;
  spend: string;
  help: string;
}

export function parseApplicationFields(data: Record<string, unknown>): ApplicationFields {
  return {
    firstName: cleanField(data.firstName, 100),
    lastName: cleanField(data.lastName, 100),
    phone: cleanField(data.phone, 40),
    industry: cleanField(data.industry, 120),
    spend: cleanField(data.spend, 120),
    help: cleanField(data.help, 2000),
  };
}

export function isApplicationComplete(fields: ApplicationFields): boolean {
  return fields.firstName !== '' && fields.help !== '';
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

export function applicationRows(fields: ApplicationFields): string {
  const rows: Array<[string, string]> = [
    ['Name', `${fields.firstName} ${fields.lastName}`.trim()],
    ['Phone', fields.phone],
    ['Industry', fields.industry],
    ['Current marketing spend', fields.spend],
    ['Needs help with', fields.help],
  ];

  return rows
    .filter(([, value]) => value !== '')
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 4px 12px 4px 0; color: #999; vertical-align: top; white-space: nowrap;">${label}</td><td style="padding: 4px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
}
