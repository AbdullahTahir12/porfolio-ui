import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  deleteSkill,
  getSkillById,
  updateSkill,
} from "@/src/lib/portfolioService";
import { respondError, respondJson, respondMessage } from "@/src/lib/apiResponse";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const skill = await getSkillById(id);

    if (!skill) {
      return respondError(new Error("Skill not found"), { status: 404 });
    }

    return respondJson(skill);
  } catch (error) {
    return respondError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const skill = await updateSkill(id, payload);

    if (!skill) {
      return respondError(new Error("Skill not found"), { status: 404 });
    }

    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/skills"),
    ]);
    return respondJson(skill);
  } catch (error) {
    return respondError(error);
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteSkill(id);

    if (!deleted) {
      return respondError(new Error("Skill not found"), { status: 404 });
    }

    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/skills"),
    ]);
    return respondMessage("Skill deleted successfully");
  } catch (error) {
    return respondError(error);
  }
}
