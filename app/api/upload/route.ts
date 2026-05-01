import { NextRequest } from "next/server";

import { getCloudinary } from "@/src/lib/cloudinary";
import { respondError, respondJson } from "@/src/lib/apiResponse";
import { uploadPayloadSchema } from "@/src/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = uploadPayloadSchema.parse(payload);
    const cloudinary = getCloudinary();

    const result = await cloudinary.uploader.upload(data.file, {
      folder: data.folder ?? "portfolio",
    });

    return respondJson({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    return respondError(error);
  }
}

export async function GET() {
  return respondError(new Error("Method not allowed"), { status: 405 });
}
