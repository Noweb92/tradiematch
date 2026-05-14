/**
 * Returns true if the given email is on the comma-separated ADMIN_EMAILS allowlist.
 * Set ADMIN_EMAILS in env (e.g. ADMIN_EMAILS=marwan@tradiematch.com.au,ops@tradiematch.com.au).
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
