import { requireAdmin } from "@/lib/auth/require-admin";
import { createSupabaseAdminClient, hasSupabaseServiceRole } from "@/lib/supabase/admin";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  try {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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

    // Try Supabase Storage first (works on Vercel)
    if (hasSupabaseServiceRole()) {
      const supabase = createSupabaseAdminClient();

      // Ensure bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find((b) => b.name === "product-images")) {
        await supabase.storage.createBucket("product-images", {
          public: true
        });
      }

      const { data, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filename, file, { cacheControl: "3600", upsert: false });

      if (!uploadError && data) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${data.path}`;
        return Response.json({
          ok: true,
          url: publicUrl,
          filename: data.path,
          size: file.size
        });
      }

      // If upload failed (e.g. bucket not public), try upsert instead
      if (uploadError) {
        const { data: retryData, error: retryError } = await supabase.storage
          .from("product-images")
          .upload(filename, file, { cacheControl: "3600", upsert: true });

        if (!retryError && retryData) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${retryData.path}`;
          return Response.json({
            ok: true,
            url: publicUrl,
            filename: retryData.path,
            size: file.size
          });
        }
      }
    }

    // Local fallback for development
    try {
      const dir = path.join(process.cwd(), "public", "images");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
      return Response.json({
        ok: true,
        url: `/images/${filename}`,
        filename,
        size: file.size
      });
    } catch {
      return Response.json(
        { ok: false, error: "Upload failed. Make sure the 'product-images' bucket exists in Supabase Storage." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
