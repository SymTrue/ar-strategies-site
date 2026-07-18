export type ResendEmail = {
  to: string;
  replyTo: string | null;
  subject: string;
  html: string;
};

export async function sendResendEmail(email: ResendEmail): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY is not configured' };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AR Strategies <leads@arstrategists.com>',
        to: email.to,
        reply_to: email.replyTo ?? undefined,
        subject: email.subject,
        html: email.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) return { ok: true };
    return { ok: false, error: (await response.text()).slice(0, 1000) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Resend request failed' };
  }
}

// Adds a newsletter subscriber to a Resend Audience so weekly issues can be
// sent as a Resend Broadcast from the dashboard, without touching this code
// again. Requires RESEND_AUDIENCE_ID (create the Audience once in the Resend
// dashboard, then set the env var) alongside the existing RESEND_API_KEY.
// A missing audience ID is a deployment-config gap, not a request failure:
// this never throws, so a signup still saves and confirms even if the
// Audience isn't wired up yet.
export async function addToNewsletterAudience(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn('Resend Audience sync skipped: RESEND_AUDIENCE_ID not configured');
    return;
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Resend Audience sync error:', body);
    }
  } catch (err) {
    console.error('Resend Audience sync failed:', err);
  }
}
