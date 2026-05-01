import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { createProject, getProjects } from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";

export async function GET() {
  try {
    const projects = await getProjects();
    return respondJson(projects);
  } catch (error) {
    return respondError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const project = await createProject(payload);
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/projects"),
    ]);
    return respondJson(project, { status: 201 });
  } catch (error) {
    return respondError(error);
  }
}
