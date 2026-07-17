import { describe, expect, it } from 'vitest';
import {
  applicationRows,
  cleanField,
  escapeHtml,
  isApplicationComplete,
  isHoneypotTriggered,
  normalizeEmail,
  parseApplicationFields,
} from './lead-validation';

describe('normalizeEmail', () => {
  it('lowercases and trims a valid email', () => {
    expect(normalizeEmail('  Owner@Example.com  ')).toBe('owner@example.com');
  });

  it('rejects non-string input', () => {
    expect(normalizeEmail(undefined)).toBeNull();
    expect(normalizeEmail(42)).toBeNull();
    expect(normalizeEmail(null)).toBeNull();
  });

  it('rejects empty or whitespace-only input', () => {
    expect(normalizeEmail('')).toBeNull();
    expect(normalizeEmail('   ')).toBeNull();
  });

  it('rejects strings without an @ or a domain dot', () => {
    expect(normalizeEmail('not-an-email')).toBeNull();
    expect(normalizeEmail('missing-domain@')).toBeNull();
    expect(normalizeEmail('@missing-local.com')).toBeNull();
  });

  it('rejects addresses over 254 characters', () => {
    const tooLong = `${'a'.repeat(250)}@b.co`;
    expect(tooLong.length).toBeGreaterThan(254);
    expect(normalizeEmail(tooLong)).toBeNull();
  });

  it('accepts a realistic boundary-length address', () => {
    const local = 'a'.repeat(243);
    const email = `${local}@b.co`; // exactly 249 chars, under the 254 cap
    expect(normalizeEmail(email)).toBe(email);
  });
});

describe('isHoneypotTriggered', () => {
  it('is false when the honeypot field is empty or absent', () => {
    expect(isHoneypotTriggered('')).toBe(false);
    expect(isHoneypotTriggered('   ')).toBe(false);
    expect(isHoneypotTriggered(undefined)).toBe(false);
  });

  it('is true when a bot fills the hidden field', () => {
    expect(isHoneypotTriggered('http://spam.example')).toBe(true);
  });
});

describe('cleanField', () => {
  it('trims and truncates to the max length', () => {
    expect(cleanField('  hello  ', 3)).toBe('hel');
  });

  it('returns an empty string for non-string input', () => {
    expect(cleanField(undefined, 10)).toBe('');
    expect(cleanField(123, 10)).toBe('');
  });
});

describe('isApplicationComplete', () => {
  const base = { firstName: '', lastName: '', phone: '', industry: '', spend: '', help: '' };

  it('requires firstName and help', () => {
    expect(isApplicationComplete(base)).toBe(false);
    expect(isApplicationComplete({ ...base, firstName: 'Jordan' })).toBe(false);
    expect(isApplicationComplete({ ...base, firstName: 'Jordan', help: 'SEO' })).toBe(true);
  });
});

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml(`<script>alert('x')&"y"</script>`)).toBe(
      '&lt;script&gt;alert(&#39;x&#39;)&amp;&quot;y&quot;&lt;/script&gt;',
    );
  });
});

describe('parseApplicationFields + applicationRows', () => {
  it('drops empty fields from the rendered summary', () => {
    const fields = parseApplicationFields({ firstName: 'Jordan', help: 'Need more calls' });
    expect(fields.lastName).toBe('');
    const html = applicationRows(fields);
    expect(html).toContain('Jordan');
    expect(html).toContain('Need more calls');
    expect(html).not.toContain('Phone');
    expect(html).not.toContain('Industry');
  });

  it('escapes attacker-controlled field values before embedding in the notification email', () => {
    const fields = parseApplicationFields({
      firstName: '<img src=x onerror=alert(1)>',
      help: 'legit request',
    });
    const html = applicationRows(fields);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});
