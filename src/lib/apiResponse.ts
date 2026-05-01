import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function respondJson<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function respondMessage(message: string, init?: ResponseInit) {
  return NextResponse.json({ message }, init);
}

export function respondError(error: unknown, init?: ResponseInit) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "ValidationError",
        issues: error.issues,
      },
      {
        status: 400,
        ...init,
      }
    );
  }

  const status = (init && init.status) || 500;
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return NextResponse.json(
    {
      error: "ServerError",
      message,
    },
    {
      status,
    }
  );
}
