import { getResend, FROM } from "./client";
import {
  welcomeCustomerHtml,
  welcomeTradieHtml,
  tradieApprovedHtml,
  newMatchCustomerHtml,
  newMatchTradieHtml,
  newQuoteCustomerHtml,
  paymentFailedHtml,
} from "./templates";

/**
 * Every send function is a no-op when RESEND_API_KEY is missing — safe to call
 * unconditionally. Errors are swallowed (logged) so transactional failures
 * never block the user-facing action.
 */
async function safeSend(to: string, subject: string, html: string) {
  const resend = getResend();
  if (!resend) return; // not configured — skip silently
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[email]", subject, err);
  }
}

export async function sendWelcomeCustomer(to: string, firstName: string | null) {
  return safeSend(to, "Welcome to TradieMatch", welcomeCustomerHtml(firstName));
}

export async function sendWelcomeTradie(to: string, firstName: string | null) {
  return safeSend(to, "Welcome to TradieMatch — verify your business", welcomeTradieHtml(firstName));
}

export async function sendTradieApprovedEmail(args: {
  to: string;
  firstName: string | null;
  businessName: string | null;
}) {
  return safeSend(
    args.to,
    "You're verified — TradieMatch is live for you",
    tradieApprovedHtml(args.firstName, args.businessName),
  );
}

export async function sendNewMatchCustomer(args: {
  to: string;
  tradieBusiness: string;
  jobTitle: string;
  matchId: string;
}) {
  return safeSend(
    args.to,
    `It's a match — ${args.tradieBusiness}`,
    newMatchCustomerHtml(args.tradieBusiness, args.jobTitle, args.matchId),
  );
}

export async function sendNewMatchTradie(args: {
  to: string;
  jobTitle: string;
  customerFirst: string | null;
  matchId: string;
}) {
  return safeSend(
    args.to,
    `New match — ${args.jobTitle}`,
    newMatchTradieHtml(args.jobTitle, args.customerFirst, args.matchId),
  );
}

export async function sendNewQuoteCustomer(args: {
  to: string;
  tradieBusiness: string;
  amount: number;
  matchId: string;
}) {
  return safeSend(
    args.to,
    `Quote received — $${args.amount.toLocaleString("en-US")}`,
    newQuoteCustomerHtml(args.tradieBusiness, args.amount, args.matchId),
  );
}

export async function sendPaymentFailed(args: {
  to: string;
  firstName: string | null;
}) {
  return safeSend(
    args.to,
    "Payment failed — please update your card",
    paymentFailedHtml(args.firstName),
  );
}
