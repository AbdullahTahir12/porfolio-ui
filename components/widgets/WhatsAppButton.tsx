"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState, type SVGProps } from "react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const WHATSAPP_GREETING =
  process.env.NEXT_PUBLIC_WHATSAPP_GREETING ??
  "Hi! I found your portfolio and would love to chat.";

type WidgetFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: WidgetFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16 2.667c-7.364 0-13.333 5.97-13.333 13.333 0 2.35.616 4.643 1.786 6.664L2.78 28.4c-.118.343-.03.724.228.982.198.198.463.303.73.303.087 0 .175-.01.26-.033l6.06-1.622a13.24 13.24 0 0 0 5.94 1.402c7.364 0 13.334-5.97 13.334-13.334S23.364 2.667 16 2.667Zm0 24c-1.913 0-3.8-.49-5.465-1.416a.667.667 0 0 0-.494-.052l-4.608 1.232 1.234-4.392a.667.667 0 0 0-.079-.53A11.95 11.95 0 0 1 4.667 16c0-6.632 5.368-12 12-12s12 5.368 12 12-5.368 12-12 12Zm6.209-8.763c-.339-.175-2.002-.99-2.314-1.103-.312-.116-.54-.175-.768.175-.227.349-.882 1.103-1.082 1.33-.2.228-.4.263-.74.088-.339-.175-1.435-.529-2.735-1.685-1.01-.9-1.69-2.017-1.888-2.366-.198-.349-.021-.536.149-.711.153-.152.339-.394.51-.591.167-.197.223-.349.338-.581.116-.232.058-.437-.029-.612-.088-.175-.768-1.853-1.052-2.543-.277-.665-.56-.576-.768-.587l-.65-.012a1.264 1.264 0 0 0-.913.428c-.313.349-1.199 1.172-1.199 2.86 0 1.689 1.228 3.322 1.401 3.553.175.232 2.415 3.695 5.85 5.133.818.354 1.456.565 1.955.723.822.261 1.57.224 2.161.136.66-.098 2.002-.81 2.284-1.594.281-.784.281-1.456.197-1.594-.084-.136-.31-.223-.649-.398Z"
      />
    </svg>
  );
}


export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<WidgetFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const hasWhatsAppNumber = Boolean(WHATSAPP_NUMBER);

  const toggle = () => {
    setOpen((prev) => !prev);
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const messageBody = form.message.trim();
    if (messageBody.length < 5) {
      setFeedback("Please include a short message (at least 5 characters).");
      return;
    }

    const nameValue = form.name.trim();
    const emailValue = form.email.trim();
    const phoneValue = form.phone.trim();

    const detailLines = [
      nameValue ? `Name: ${nameValue}` : "",
      emailValue ? `Email: ${emailValue}` : "",
      phoneValue ? `Phone: ${phoneValue}` : "",
    ].filter(Boolean);

    const emailMessage = [messageBody, ...detailLines]
      .filter(Boolean)
      .join("\n");

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameValue || undefined,
          email: emailValue || undefined,
          phone: phoneValue || undefined,
          message: emailMessage,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const errorMessage =
          (data && (data.message || data.error)) ||
          "Unable to notify via email right now.";
        throw new Error(errorMessage);
      }

      if (hasWhatsAppNumber) {
        const whatsappMessage = [
          messageBody,
          detailLines.join("\n"),
        ]
          .filter(Boolean)
          .join("\n\n");

        const encoded = encodeURIComponent(
          whatsappMessage || WHATSAPP_GREETING
        );
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }

      setFeedback("Thanks! I will follow up shortly.");
      setForm(initialForm);
      setOpen(false);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Failed to send message."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" suppressHydrationWarning>
      <AnimatePresence>
        {open && (
          <motion.form
            key="whatsapp-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="pointer-events-auto w-[min(320px,calc(100vw-2rem))] rounded-3xl border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface)] p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
                  WhatsApp me
                </p>
                <p className="text-xs text-[color:var(--color-muted)]">
                  I will also get an email so I do not miss it.
                </p>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="rounded-full border border-[color:var(--color-surface-border)] px-2 py-1 text-xs text-[color:var(--color-muted)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
              >
                Close
              </button>
            </div>
            <div className="grid gap-3 text-xs text-[color:var(--color-muted)]">
              <label className="flex flex-col gap-2">
                Name (optional)
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
                />
              </label>
              <label className="flex flex-col gap-2">
                Email (optional)
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
                />
              </label>
              <label className="flex flex-col gap-2">
                Phone (optional)
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
                />
              </label>
              <label className="flex flex-col gap-2">
                Message
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, message: event.target.value }))
                  }
                  placeholder={WHATSAPP_GREETING}
                  className="rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
                />
              </label>
            </div>
            {feedback && (
              <p className="mt-3 text-xs text-[color:var(--color-muted-strong)]">
                {feedback}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_35px_-20px_var(--color-shadow)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
            {!hasWhatsAppNumber && (
              <p className="mt-3 text-[10px] text-red-300">
                WhatsApp number is not configured. Set NEXT_PUBLIC_WHATSAPP_NUMBER
                to enable the redirect.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-label="Open WhatsApp chat"
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_35px_-18px_rgba(37,211,102,0.5)] transition transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 hover:shadow-[0_0_0_12px_rgba(37,211,102,0.22)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(37,211,102,0.35)]"
      >
        <WhatsAppIcon className="h-6 w-6 drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]" />
      </button>
    </div>
  );
}


