import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { getAboutContent, updateAboutContent } from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";

export async function GET() {
  try {
    const about = await getAboutContent();
    return respondJson(about);
  } catch (error) {
    return respondError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const about = await updateAboutContent(payload);
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/about"),
    ]);
    return respondJson(about);
  } catch (error) {
    return respondError(error);
  }
}
