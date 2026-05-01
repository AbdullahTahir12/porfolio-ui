import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/src/lib/portfolioService";
import { respondError, respondJson, respondMessage } from "@/src/lib/apiResponse";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(id);

    if (!project) {
      return respondError(new Error("Project not found"), { status: 404 });
    }

    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/projects"),
    ]);
    return respondJson(project);
  } catch (error) {
    return respondError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const payload = await request.json();
    const { id } = await context.params;
    const project = await updateProject(id, payload);

    if (!project) {
      return respondError(new Error("Project not found"), { status: 404 });
    }

    return respondJson(project);
  } catch (error) {
    return respondError(error);
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteProject(id);

    if (!deleted) {
      return respondError(new Error("Project not found"), { status: 404 });
    }

    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/projects"),
    ]);
    return respondMessage("Project deleted successfully");
  } catch (error) {
    return respondError(error);
  }
}
