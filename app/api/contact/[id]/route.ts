import { NextRequest } from "next/server";

import {
  deleteContactMessage,
  updateContactMessageStatus,
} from "@/src/lib/portfolioService";
import {
  respondError,
  respondJson,
  respondMessage,
} from "@/src/lib/apiResponse";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const status = payload?.status;

    if (status !== "new" && status !== "read") {
      return respondError(new Error("Invalid status"), { status: 400 });
    }

    const updated = await updateContactMessageStatus(id, status);

    if (!updated) {
      return respondError(new Error("Contact message not found"), {
        status: 404,
      });
    }

    return respondJson(updated);
  } catch (error) {
    return respondError(error);
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteContactMessage(id);

    if (!deleted) {
      return respondError(new Error("Contact message not found"), {
        status: 404,
      });
    }

    return respondMessage("Contact message removed");
  } catch (error) {
    return respondError(error);
  }
}
