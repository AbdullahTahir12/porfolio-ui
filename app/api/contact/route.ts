import { NextRequest } from "next/server";

import {
  createContactMessage,
  getContactMessages,
} from "@/src/lib/portfolioService";
import { respondError, respondJson } from "@/src/lib/apiResponse";
import { isEmailConfigured, sendEmail } from "@/src/lib/email";

const CONTACT_NOTIFICATION_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL ?? "aj1762919@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const message = await createContactMessage(payload);

    if (isEmailConfigured()) {
      const summaryLines = [
        `Name: ${message.name}`,
        message.email ? `Email: ${message.email}` : undefined,
        message.phone ? `Phone: ${message.phone}` : undefined,
        `Channel: ${message.channel}`,
        "",
        message.message,
      ].filter(Boolean) as string[];

      const text = summaryLines.join("\n");
      const html = summaryLines
        .map((line) =>
          line ? `<p style="margin:0 0 8px 0;font-size:14px;">${line}</p>` : "<br/>"
        )
        .join("");

      try {
        await sendEmail({
          to: CONTACT_NOTIFICATION_EMAIL,
          subject: `New contact message from ${message.name}`,
          text,
          html,
        });
      } catch (notificationError) {
        console.error(
          "Contact email notification failed",
          notificationError
        );
      }
    } else {
      console.warn("Contact email notification skipped: SMTP not configured");
    }

    return respondJson(message, { status: 201 });
  } catch (error) {
    return respondError(error);
  }
}

export async function GET() {
  try {
    const messages = await getContactMessages();
    return respondJson(messages);
  } catch (error) {
    return respondError(error);
  }
}
