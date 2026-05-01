import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { createExperience, getExperience } from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";

export async function GET() {
  try {
    const experience = await getExperience();
    return respondJson(experience);
  } catch (error) {
    return respondError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const experience = await createExperience(payload);
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/experience"),
    ]);
    return respondJson(experience, { status: 201 });
  } catch (error) {
    return respondError(error);
  }
}
