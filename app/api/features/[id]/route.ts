import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

import { CACHE_TAGS } from "@/src/lib/cacheTags";
import { respondError, respondJson } from "@/src/lib/apiResponse";
import { deleteFeature, updateFeature } from "@/src/lib/portfolioService";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const feature = await updateFeature(id, payload);
    if (!feature) {
      return respondJson({ message: "Feature not found" }, { status: 404 });
    }

    await revalidatePath("/", "page");
    (revalidateTag as unknown as (tag: string) => void)(CACHE_TAGS.features);

    return respondJson(feature);
  } catch (error) {
    return respondError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteFeature(id);
    if (!deleted) {
      return respondJson({ message: "Feature not found" }, { status: 404 });
    }

    await revalidatePath("/", "page");
    (revalidateTag as unknown as (tag: string) => void)(CACHE_TAGS.features);

    return respondJson({ success: true });
  } catch (error) {
    return respondError(error);
  }
}
