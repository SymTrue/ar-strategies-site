import { escapeHtml } from './lead-validation';

const SITE_URL = 'https://www.arstrategists.com';
const WRAP = "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;";

// Sent on signup. Nothing else is sent and nobody is added to the list until
// the recipient clicks the link, so a stranger's address typed into the form
// costs that stranger one short email, not a subscription.
export function confirmRequestHtml(confirmUrl: string): string {
  return `
    <div style="${WRAP}">
      <p>One click to finish: confirm your email and you're on the weekly list.</p>
      <p style="margin: 20px 0;"><a href="${escapeHtml(confirmUrl)}" style="background: #2f6893; color: #fff; padding: 12px 22px; border-radius: 999px; text-decoration: none; font-weight: 600;">Confirm my email</a></p>
      <p style="color: #666;">If you didn't ask for this, ignore this email and nothing happens. The link expires in 7 days.</p>
      <p style="margin-top: 24px; color: #999; font-size: 14px;">- AR Strategies</p>
    </div>
  `;
}

export function welcomeHtml(unsubscribeUrl: string | null): string {
  return `
    <div style="${WRAP}">
      <p>You're in. Every week you get one specific fix that helps local businesses get found first: real examples, exact steps, about five minutes to read.</p>
      <p style="color: #666; margin-top: 12px;">Want a head start? The free 3-second test scores how your business reads to a stranger, in about two minutes: <a href="${SITE_URL}/tools/three-second-test">${SITE_URL}/tools/three-second-test</a></p>
      <p style="color: #666; margin-top: 12px;">One email a week. No spam. ${unsubscribeUrl ? `<a href="${unsubscribeUrl}">Unsubscribe with one click.</a>` : 'Reply to unsubscribe.'}</p>
      <p style="margin-top: 16px;">Questions? Just reply to this email or reach out to <strong>hello@arstrategists.com</strong>.</p>
      <p style="margin-top: 24px; color: #999; font-size: 14px;">- AR Strategies</p>
    </div>
  `;
}

export function ownerNewsletterHtml(email: string): string {
  return `
    <div style="${WRAP}">
      <p><strong>${escapeHtml(email)}</strong> confirmed and joined the weekly list.</p>
      <p style="margin-top: 12px;">Reply to this email to reach them directly.</p>
    </div>
  `;
}
