import nodemailer, { Transporter } from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

let cachedTransporter: Transporter | null = null;

function validateEmailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error(
      "Email transport is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM."
    );
  }

  const port = Number(SMTP_PORT);
  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a valid number.");
  }

  return { SMTP_HOST, port, SMTP_USER, SMTP_PASS, EMAIL_FROM };
}

async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const { SMTP_HOST, port, SMTP_USER, SMTP_PASS } = validateEmailConfig();

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return cachedTransporter;
}

export async function sendEmail({ to, subject, text, html }: SendMailOptions) {
  try {
    const transporter = await getTransporter();
    const { EMAIL_FROM } = validateEmailConfig();

    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Failed to send email", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to send email notification");
  }
}

export function isEmailConfigured() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
    process.env;
  return Boolean(
    SMTP_HOST &&
      SMTP_PORT &&
      SMTP_USER &&
      SMTP_PASS &&
      EMAIL_FROM
  );
}
