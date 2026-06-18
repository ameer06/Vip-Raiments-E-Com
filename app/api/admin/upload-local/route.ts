import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!hasSupabaseServiceRole()) {
      return Response.json(
        { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY not set. Images must be uploaded to Supabase Storage." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return Response.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    const allowedTypes = ["image/webp", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ ok: false, error: "Only WebP, JPEG, PNG allowed" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ ok: false, error: "File too large. Maximum 5MB" }, { status: 400 });
    }

    const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabase = createSupabaseAdminClient();

    // Ensure bucket exists (public)
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === "product-images")) {
      const { error: createError } = await supabase.storage.createBucket("product-images", {
        public: true
      });
      if (createError) {
        return Response.json(
          { ok: false, error: `Failed to create bucket: ${createError.message}` },
          { status: 500 }
        );
      }
    }

    // Upload with upsert (overwrites if same filename, handles concurrent uploads)
    const { data, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, file, { cacheControl: "3600", upsert: true });

    if (uploadError || !data) {
      return Response.json(
        { ok: false, error: `Supabase Storage upload failed: ${uploadError?.message ?? "Unknown error"}` },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return Response.json({
      ok: true,
      url: publicUrl,
      filename: data.path,
      size: file.size
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
