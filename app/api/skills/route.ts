import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { createSkill, getSkills } from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";

export async function GET() {
  try {
    const skills = await getSkills();
    return respondJson(skills);
  } catch (error) {
    return respondError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const skill = await createSkill(payload);
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/skills"),
    ]);
    return respondJson(skill, { status: 201 });
  } catch (error) {
    return respondError(error);
  }
}
