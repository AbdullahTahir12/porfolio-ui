import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  deleteCertification,
  getCertificationById,
  updateCertification,
} from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const certification = await getCertificationById(id);
    if (!certification) {
      return respondError(new Error("Certification not found"), {
        status: 404,
      });
    }
    return respondJson(certification);
  } catch (error) {
    return respondError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const payload = await request.json();
    const { id } = await context.params;
    const certification = await updateCertification(id, payload);
    if (!certification) {
      return respondError(new Error("Certification not found"), {
        status: 404,
      });
    }
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/certifications"),
    ]);
    return respondJson(certification);
  } catch (error) {
    return respondError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const success = await deleteCertification(id);
    if (!success) {
      return respondError(new Error("Certification not found"), {
        status: 404,
      });
    }
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/certifications"),
    ]);
    return respondJson({ deleted: true });
  } catch (error) {
    return respondError(error);
  }
}
