import { NextRequest } from "next/server";

import { respondError, respondJson } from "@/src/lib/apiResponse";
import { isEmailConfigured, sendEmail } from "@/src/lib/email";
import { createContactMessage } from "@/src/lib/portfolioService";
import { whatsappNotificationSchema } from "@/src/lib/validators";

const WHATSAPP_NOTIFICATION_EMAIL =
  process.env.WHATSAPP_NOTIFICATION_EMAIL ?? "aj1762919@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = whatsappNotificationSchema.parse(payload);

    const contactRecord = await createContactMessage({
      name: data.name ?? "WhatsApp visitor",
      email: data.email,
      phone: data.phone,
      message: data.message,
      channel: "whatsapp",
    });

    if (isEmailConfigured()) {
      const summaryLines = [
        `Name: ${contactRecord.name}`,
        contactRecord.email ? `Email: ${contactRecord.email}` : undefined,
        contactRecord.phone ? `Phone: ${contactRecord.phone}` : undefined,
        `Channel: ${contactRecord.channel}`,
        "",
        contactRecord.message,
      ].filter(Boolean) as string[];

      const text = summaryLines.join("\n");
      const html = summaryLines
        .map((line) =>
          line ? `<p style="margin:0 0 8px 0;font-size:14px;">${line}</p>` : "<br/>"
        )
        .join("");

      try {
        await sendEmail({
          to: WHATSAPP_NOTIFICATION_EMAIL,
          subject: `New WhatsApp inquiry from ${contactRecord.name}`,
          text,
          html,
        });
      } catch (notificationError) {
        console.error(
          "WhatsApp email notification failed",
          notificationError
        );
      }
    } else {
      console.warn("WhatsApp email notification skipped: SMTP not configured");
    }

    return respondJson(contactRecord, { status: 201 });
  } catch (error) {
    return respondError(error);
  }
}

export async function GET() {
  return respondError(new Error("Method not allowed"), { status: 405 });
}
