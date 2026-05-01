import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { getHeroContent, updateHeroContent } from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";

export async function GET() {
  try {
    const hero = await getHeroContent();
    return respondJson(hero);
  } catch (error) {
    return respondError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const hero = await updateHeroContent(payload);
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/hero"),
    ]);
    return respondJson(hero);
  } catch (error) {
    return respondError(error);
  }
}
