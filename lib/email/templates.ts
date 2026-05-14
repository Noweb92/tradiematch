// Minimal HTML email templates. Plain HTML keeps the bundle small and
// avoids React-Email's runtime. They render correctly in Gmail / Outlook / iOS Mail.

import { APP_URL } from "./client";

function shell(title: string, body: string, cta?: { url: string; label: string }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#F7F7F8;font-family:-apple-system,Segoe UI,sans-serif;color:#0A2540">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F8;padding:32px 16px">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px -8px rgba(10,37,64,0.12)">
      <tr><td style="padding:24px 32px;background:linear-gradient(135deg,#0A2540,#0A2540 70%,#FF6B35)">
        <div style="color:#FFFFFF;font-weight:900;font-size:18px;letter-spacing:-0.02em">TradieMatch</div>
        <div style="color:#FFB494;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px">Swipe. Match. Build.</div>
      </td></tr>
      <tr><td style="padding:28px 32px">
        ${body}
        ${cta ? `<table style="margin-top:24px"><tr><td style="background:#FF6B35;border-radius:10px;padding:14px 24px"><a href="${cta.url}" style="color:#FFFFFF;font-weight:800;text-decoration:none;font-size:14px">${cta.label}</a></td></tr></table>` : ""}
      </td></tr>
      <tr><td style="padding:16px 32px;background:#F7F7F8;color:#64748B;font-size:11px">
        TradieMatch · ABN-verified tradie marketplace · Australia<br>
        <a href="${APP_URL}" style="color:#64748B">${APP_URL}</a>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export function welcomeCustomerHtml(firstName: string | null) {
  return shell(
    "Welcome to TradieMatch",
    `<h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 12px">G&apos;day${firstName ? ` ${firstName}` : ""} 👋</h1>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px">Welcome to TradieMatch — Australia&apos;s fastest way to find a verified tradie. Post your first job and you&apos;ll see matched pros in under 60 seconds.</p>`,
    { url: `${APP_URL}/app/customer/dashboard`, label: "Post your first job" },
  );
}

export function welcomeTradieHtml(firstName: string | null) {
  return shell(
    "Welcome to TradieMatch",
    `<h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 12px">Welcome${firstName ? `, ${firstName}` : ""} 👋</h1>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px">You&apos;re one step away from exclusive matches — no shared leads, no bidding wars. Complete your profile (ABN, white card, insurance) and we&apos;ll verify you within 24 hours.</p>`,
    { url: `${APP_URL}/app/tradie/onboarding`, label: "Complete onboarding" },
  );
}

export function tradieApprovedHtml(firstName: string | null, businessName: string | null) {
  return shell(
    "You're approved",
    `<h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 12px">Approved &amp; live 🎉</h1>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px">${businessName ?? "Your business"} just went live on TradieMatch.${firstName ? ` Hey ${firstName} —` : ""} customers in your service area can match with you starting now.</p>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px">Open the app to start swiping through jobs that match your trade categories.</p>`,
    { url: `${APP_URL}/app/tradie/swipe`, label: "Browse jobs now" },
  );
}

export function newMatchCustomerHtml(tradieBusiness: string, jobTitle: string, matchId: string) {
  return shell(
    "You've matched",
    `<h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 12px">It&apos;s a match 🎉</h1>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px"><strong>${tradieBusiness}</strong> just matched on your job <em>${jobTitle}</em>. You have 48 hours of exclusive contact — start the conversation now to get a quote and lock in a time.</p>`,
    { url: `${APP_URL}/app/customer/matches/${matchId}`, label: "Open chat" },
  );
}

export function newMatchTradieHtml(jobTitle: string, customerFirst: string | null, matchId: string) {
  return shell(
    "You've matched",
    `<h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 12px">New match 🎉</h1>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px">${customerFirst ?? "A customer"} just matched on the job <em>${jobTitle}</em>. You have 48 hours of exclusive contact — open the chat and send a quote to close the deal.</p>`,
    { url: `${APP_URL}/app/tradie/matches/${matchId}`, label: "Open chat &amp; send quote" },
  );
}

export function newQuoteCustomerHtml(tradieBusiness: string, amount: number, matchId: string) {
  return shell(
    "New quote received",
    `<h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 12px">Quote in: $${amount.toLocaleString("en-US")}</h1>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px"><strong>${tradieBusiness}</strong> just sent you a quote. Review it in the chat and accept or counter.</p>`,
    { url: `${APP_URL}/app/customer/matches/${matchId}`, label: "Review quote" },
  );
}

export function paymentFailedHtml(firstName: string | null) {
  return shell(
    "Payment failed",
    `<h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 12px">We couldn&apos;t charge your card</h1>
     <p style="font-size:15px;line-height:1.6;color:#1E293B;margin:0 0 12px">${firstName ? `Hey ${firstName} — y` : "Y"}our last TradieMatch subscription payment failed. You won&apos;t lose matches yet, but please update your payment method this week to stay live.</p>`,
    { url: `${APP_URL}/app/tradie/dashboard`, label: "Update payment method" },
  );
}
