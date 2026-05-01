import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { createCertification, getCertifications } from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";

export async function GET() {
  try {
    const certifications = await getCertifications();
    return respondJson(certifications);
  } catch (error) {
    return respondError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const certification = await createCertification(payload);
    await Promise.all([
      revalidatePath("/", "page"),
      revalidatePath("/api/certifications"),
    ]);
    return respondJson(certification, { status: 201 });
  } catch (error) {
    return respondError(error);
  }
}
