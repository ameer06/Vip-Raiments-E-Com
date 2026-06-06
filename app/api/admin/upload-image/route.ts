import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function POST(request: Request) {
  try {
    const adminCheck = await requireAdmin();

    if (!adminCheck.ok) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file || !productId) {
      return Response.json(
        { ok: false, error: "Missing file or productId" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/webp", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        {
          ok: false,
          error: "Invalid file type. Only WebP, JPEG, and PNG allowed"
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json(
        { ok: false, error: "File too large. Maximum 5MB" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const timestamp = Date.now();
    const filename = `${productId}_${timestamp}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError || !data) {
      console.error("Upload error:", uploadError);
      return Response.json(
        { ok: false, error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Generate public URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${data.path}`;

    return Response.json({
      ok: true,
      url: publicUrl,
      filename: data.path,
      size: file.size
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Image upload failed"
      },
      { status: 500 }
    );
  }
}
