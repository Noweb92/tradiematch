// ABN verification via the Australian Business Register (ABR).
// Docs: https://abr.business.gov.au/Tools/WebServices
// The API returns JSONP — we strip the `callback(...)` wrapper.

export interface ABNVerificationResult {
  valid: boolean;
  abn?: string;
  entityName?: string;
  entityType?: string;
  abnStatus?: string;
  gstRegistered?: boolean;
  state?: string;
  postcode?: string;
  effectiveFrom?: string;
  error?: string;
}

interface AbrResponse {
  Abn?: string;
  AbnStatus?: string;
  AbnStatusEffectiveFrom?: string;
  Acn?: string;
  AddressDate?: string;
  AddressPostcode?: string;
  AddressState?: string;
  BusinessName?: string[];
  EntityName?: string;
  EntityTypeCode?: string;
  EntityTypeName?: string;
  Gst?: string;
  Message?: string;
  Exception?: string;
}

const ABR_ENDPOINT = "https://abr.business.gov.au/json/AbnDetails.aspx";

export function normaliseAbn(input: string): string {
  return input.replace(/\s+/g, "");
}

export function isValidAbnFormat(input: string): boolean {
  const cleaned = normaliseAbn(input);
  return /^\d{11}$/.test(cleaned);
}

/**
 * Validate ABN structure with the official checksum algorithm.
 * Doesn't hit the network — useful as a pre-check before the ABR call.
 */
export function isValidAbnChecksum(input: string): boolean {
  const cleaned = normaliseAbn(input);
  if (!/^\d{11}$/.test(cleaned)) return false;

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = cleaned.split("").map((d) => parseInt(d, 10));
  digits[0] -= 1; // First digit reduced by 1 per ABR algorithm

  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  return sum % 89 === 0;
}

export async function verifyAbn(input: string): Promise<ABNVerificationResult> {
  const cleaned = normaliseAbn(input);

  if (!isValidAbnFormat(cleaned)) {
    return { valid: false, error: "ABN must be 11 digits" };
  }

  if (!isValidAbnChecksum(cleaned)) {
    return { valid: false, error: "Invalid ABN — checksum failed" };
  }

  const guid = process.env.ABR_GUID;
  if (!guid) {
    return {
      valid: false,
      error:
        "ABN verification not configured. Set ABR_GUID in environment variables.",
    };
  }

  try {
    const url = `${ABR_ENDPOINT}?abn=${cleaned}&guid=${guid}&callback=callback`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return { valid: false, error: `ABR returned ${res.status}` };
    }

    const text = await res.text();
    // Strip JSONP wrapper: callback({...}) — dotAll-free for ES2017 compat
    const match = text.match(/^callback\(([\s\S]*)\)\s*;?\s*$/);
    const json = match ? match[1] : text;
    const parsed = JSON.parse(json) as AbrResponse;

    if (parsed.Exception) {
      return { valid: false, error: parsed.Exception };
    }
    if (parsed.Message) {
      return { valid: false, error: parsed.Message };
    }
    if (!parsed.Abn || parsed.AbnStatus !== "Active") {
      return {
        valid: false,
        abn: parsed.Abn,
        abnStatus: parsed.AbnStatus,
        error: `ABN is not active (status: ${parsed.AbnStatus ?? "unknown"})`,
      };
    }

    return {
      valid: true,
      abn: parsed.Abn,
      entityName: parsed.EntityName,
      entityType: parsed.EntityTypeName,
      abnStatus: parsed.AbnStatus,
      gstRegistered: !!parsed.Gst,
      state: parsed.AddressState,
      postcode: parsed.AddressPostcode,
      effectiveFrom: parsed.AbnStatusEffectiveFrom,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Network error contacting ABR",
    };
  }
}
