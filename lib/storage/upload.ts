import type { SupabaseClient } from "@supabase/supabase-js";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];

export interface UploadResult {
  ok: boolean;
  url?: string;
  path?: string;
  error?: string;
}

interface UploadParams {
  supabase: SupabaseClient;
  bucket: "tradie-portfolio" | "tradie-documents" | "job-photos";
  file: File;
  pathPrefix: string;
  publicUrl?: boolean;
}

/**
 * Upload a single image file to Supabase Storage and return its URL.
 * Validates type + size. Bucket must already exist (see docs/DEPLOYMENT.md).
 */
export async function uploadImage({
  supabase,
  bucket,
  file,
  pathPrefix,
  publicUrl = true,
}: UploadParams): Promise<UploadResult> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: `Unsupported file type: ${file.type}` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "File is larger than 5 MB" };
  }

  const ext = file.type.split("/")[1] ?? "jpg";
  const path = `${pathPrefix}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) return { ok: false, error: error.message };

  if (publicUrl) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { ok: true, url: data.publicUrl, path };
  }
  return { ok: true, path };
}
