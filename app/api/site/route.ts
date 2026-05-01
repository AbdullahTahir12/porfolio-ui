import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

import { CACHE_TAGS } from "@/src/lib/cacheTags";
import { respondError, respondJson } from "@/src/lib/apiResponse";
import { getSiteIdentity, updateSiteIdentity } from "@/src/lib/portfolioService";

export async function GET() {
  try {
    const site = await getSiteIdentity();
    return respondJson(site);
  } catch (error) {
    return respondError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const site = await updateSiteIdentity(payload);
    await revalidatePath("/", "page");
    (revalidateTag as unknown as (tag: string) => void)(CACHE_TAGS.site);
    return respondJson(site);
  } catch (error) {
    return respondError(error);
  }
}