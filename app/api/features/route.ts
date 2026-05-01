import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

import { CACHE_TAGS } from "@/src/lib/cacheTags";
import { respondError, respondJson } from "@/src/lib/apiResponse";
import { createFeature, getFeatures } from "@/src/lib/portfolioService";

export async function GET() {
  try {
    const features = await getFeatures();
    return respondJson(features);
  } catch (error) {
    console.error("GET /api/features error:", error);
    return respondError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const feature = await createFeature(payload);
    await revalidatePath("/", "page");
    (revalidateTag as unknown as (tag: string) => void)(CACHE_TAGS.features);
    return respondJson(feature, { status: 201 });
  } catch (error) {
    return respondError(error);
  }
}