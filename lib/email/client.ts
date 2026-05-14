import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export const FROM = process.env.RESEND_FROM_EMAIL ?? "TradieMatch <hello@tradiematch.com.au>";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tradiematch.com.au";
