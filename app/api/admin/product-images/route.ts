import { NextResponse, type NextRequest } from "next/server";

import { getCurrentAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const runtime = "nodejs";

const bucket = "newjersey-product-images";
const maxSize = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
    if (request.headers.get("origin") !== request.nextUrl.origin) {
        return NextResponse.json(
            { error: "Invalid request origin." },
            { status: 403 }
        );
    }

    try {
        const admin = await getCurrentAdmin();

        if (
            !admin ||
            !["owner", "admin"].includes(admin.profile.role)
        ) {
            return NextResponse.json(
                { error: "Owner or admin access is required." },
                { status: 403 }
            );
        }

        const declaredSize = Number(
            request.headers.get("content-length") ?? 0
        );

        if (declaredSize > maxSize + 65536) {
            return NextResponse.json(
                { error: "Use an image smaller than 4 MB." },
                { status: 413 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json(
                { error: "Choose an image." },
                { status: 400 }
            );
        }

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Use an image smaller than 4 MB." },
                { status: 413 }
            );
        }

        const bytes = Buffer.from(await file.arrayBuffer());

        let extension: string;
        let contentType: string;

        if (
            bytes.length >= 3 &&
            bytes[0] === 0xff &&
            bytes[1] === 0xd8 &&
            bytes[2] === 0xff
        ) {
            extension = "jpg";
            contentType = "image/jpeg";
        } else if (
            bytes.subarray(0, 8).equals(
                Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
            )
        ) {
            extension = "png";
            contentType = "image/png";
        } else if (
            bytes.length >= 12 &&
            bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
        ) {
            extension = "webp";
            contentType = "image/webp";
        } else {
            return NextResponse.json(
                { error: "Choose a JPG, PNG or WebP image." },
                { status: 400 }
            );
        }

        const path = `${admin.user.id}/${crypto.randomUUID()}.${extension}`;
        const supabase = getSupabaseAdmin();

        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, bytes, {
                contentType,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("[NewJersey Image Upload]", error);

            return NextResponse.json(
                { error: "Upload failed. Check the bucket and server logs." },
                { status: 500 }
            );
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return NextResponse.json(
            { url: data.publicUrl },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("[NewJersey Image Upload]", error);

        return NextResponse.json(
            { error: "Unable to upload the image. Please try again." },
            { status: 500 }
        );
    }
}; 

export async function GET() {
  return NextResponse.json(
    { ok: true, endpoint: "product-images" },
    { headers: { "Cache-Control": "no-store" } }
  );
}