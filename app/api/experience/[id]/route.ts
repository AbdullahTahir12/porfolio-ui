import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  deleteExperience,
  getExperienceById,
  updateExperience,
} from "@/src/lib/portfolioService";
import { respondError, respondJson, respondMessage } from "@/src/lib/apiResponse";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const experience = await getExperienceById(id);

    if (!experience) {
      return respondError(new Error("Experience not found"), { status: 404 });
    }

    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/experience"),
    ]);
    return respondJson(experience);
  } catch (error) {
    return respondError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const payload = await request.json();
    const { id } = await context.params;
    const experience = await updateExperience(id, payload);

    if (!experience) {
      return respondError(new Error("Experience not found"), { status: 404 });
    }

    return respondJson(experience);
  } catch (error) {
    return respondError(error);
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteExperience(id);

    if (!deleted) {
      return respondError(new Error("Experience not found"), { status: 404 });
    }

    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/experience"),
    ]);
    return respondMessage("Experience deleted successfully");
  } catch (error) {
    return respondError(error);
  }
}
