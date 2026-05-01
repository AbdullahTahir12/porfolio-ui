"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

import type { SiteIdentity } from "@/src/types/portfolio";

type BrandingPanelProps = {
  site: SiteIdentity;
  onSave: (payload: {
    brandName: string;
    brandTagline?: string | null;
    brandDescription?: string | null;
    brandLogoUrl?: string | null;
  }) => Promise<void> | void;
  onUploadLogo: (file: File) => Promise<string>;
  onError: (message: string) => void;
  busy: boolean;
};

export function BrandingPanel({ site, onSave, onUploadLogo, onError, busy }: BrandingPanelProps) {
  const [form, setForm] = useState({
    brandName: site.brandName,
    brandTagline: site.brandTagline ?? "",
    brandDescription: site.brandDescription ?? "",
    brandLogoUrl: site.brandLogoUrl ?? "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({
      brandName: site.brandName,
      brandTagline: site.brandTagline ?? "",
      brandDescription: site.brandDescription ?? "",
      brandLogoUrl: site.brandLogoUrl ?? "",
    });
  }, [site]);

  const hasChanges = useMemo(() => {
    return (
      form.brandName.trim() !== site.brandName ||
      form.brandTagline.trim() !== (site.brandTagline ?? "") ||
      form.brandDescription.trim() !== (site.brandDescription ?? "") ||
      form.brandLogoUrl.trim() !== (site.brandLogoUrl ?? "")
    );
  }, [form, site]);

  const inputClasses =
    "mt-1 w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave({
      brandName: form.brandName,
      brandTagline: form.brandTagline || null,
      brandDescription: form.brandDescription || null,
      brandLogoUrl: form.brandLogoUrl || null,
    });
  };

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const url = await onUploadLogo(file);
      setForm((prev) => ({ ...prev, brandLogoUrl: url }));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Logo upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({ ...prev, brandLogoUrl: "" }));
  };

  const logoPreview = form.brandLogoUrl;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="surface-card rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-[color:var(--color-foreground)]">Brand identity</h2>
            <p className="text-sm text-[color:var(--color-muted)]">
              Update the name, tone, and logo used across navigation and footer areas.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Brand name</span>
              <input
                required
                value={form.brandName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, brandName: event.target.value }))
                }
                className={inputClasses}
                placeholder="DevPortfolio"
                disabled={busy || uploading}
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Tagline (optional)</span>
              <input
                value={form.brandTagline}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, brandTagline: event.target.value }))
                }
                className={inputClasses}
                placeholder="Thoughtful digital experiences"
                disabled={busy || uploading}
              />
            </label>
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Summary (optional)</span>
              <textarea
                value={form.brandDescription}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, brandDescription: event.target.value }))
                }
                className={`${inputClasses} min-h-[6rem]`}
                placeholder="A sentence that appears in the footer."
                disabled={busy || uploading}
              />
            </label>
          </div>
          <div className="space-y-3">
            <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Brand mark</span>
            <div className="flex flex-wrap items-center gap-4">
              {logoPreview ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)]">
                    <Image
                      unoptimized
                      src={logoPreview}
                      alt="Brand logo preview"
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-[color:var(--color-admin-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-foreground-secondary)] transition hover:border-[color:var(--color-admin-danger)] hover:text-[color:var(--color-admin-danger-text)]"
                    onClick={handleRemoveLogo}
                    disabled={busy || uploading}
                  >
                    Remove logo
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[color:var(--color-muted)]">
                  Upload a square PNG or SVG for best results.
                </p>
              )}
              <div>
                <input
                  id="brand-logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                  disabled={busy || uploading}
                />
                <label
                  htmlFor="brand-logo"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-foreground-secondary)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                >
                  {uploading ? "Uploading..." : logoPreview ? "Replace logo" : "Upload logo"}
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-on-accent)] shadow-[0_14px_36px_-20px_var(--color-accent-glow)] transition disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy || uploading || !form.brandName.trim() || !hasChanges}
            >
              Save branding
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
