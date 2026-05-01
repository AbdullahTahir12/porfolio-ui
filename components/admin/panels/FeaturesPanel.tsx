"use client";

import { useMemo, useState } from "react";
import type React from "react";

import { DEFAULT_FEATURE_ICON, FEATURE_ICON_MAP, FEATURE_ICON_OPTIONS, FeatureIconKey } from "@/src/lib/featureIcons";
import type { Feature } from "@/src/types/portfolio";

type FeaturesPanelProps = {
  features: Feature[];
  onCreate: (payload: {
    title: string;
    description: string;
    icon: FeatureIconKey;
    order?: number;
  }) => Promise<void> | void;
  onUpdate: (
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      icon: FeatureIconKey;
      order?: number;
    }>
  ) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  busy: boolean;
};

type FeatureCardProps = {
  feature: Feature;
  onUpdate: (
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      icon: FeatureIconKey;
      order?: number;
    }>
  ) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  busy: boolean;
};

const compareByOrder = (a: Feature, b: Feature) => {
  const orderA = a.order ?? 0;
  const orderB = b.order ?? 0;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return a.title.localeCompare(b.title);
};

export function FeaturesPanel({ features, onCreate, onUpdate, onDelete, busy }: FeaturesPanelProps) {
  const defaultIcon = FEATURE_ICON_OPTIONS[0]?.id ?? "sparkles";
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: defaultIcon,
    order: features.length,
  });

  const orderedFeatures = useMemo(() => [...features].sort(compareByOrder), [features]);

  const canCreate = form.title.trim().length > 0 && form.description.trim().length > 0 && !busy;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreate) {
      return;
    }

    await onCreate({
      title: form.title,
      description: form.description,
      icon: form.icon,
      order: Number.isFinite(form.order) ? form.order : undefined,
    });

    setForm({
      title: "",
      description: "",
      icon: defaultIcon,
      order: features.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <form className="surface-card rounded-2xl p-6 shadow-sm space-y-4" onSubmit={handleSubmit}>
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--color-foreground)]">What I bring</h2>
          <p className="text-sm text-[color:var(--color-muted)]">
            Curate the capability highlights shown in the features section.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
              placeholder="Performance-first builds"
              disabled={busy}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Icon</span>
            <select
              value={form.icon}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, icon: event.target.value as FeatureIconKey }))
              }
              className="mt-1 w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
              disabled={busy}
            >
              {FEATURE_ICON_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col md:col-span-2">
            <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)] min-h-[6rem]"
              placeholder="Ship fast experiences with edge rendering, ISR, and fine-grained caching tailored to your roadmap."
              disabled={busy}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-[color:var(--color-foreground-secondary)]">Order</span>
            <input
              type="number"
              min={0}
              value={form.order}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, order: Number(event.target.value) }))
              }
              className="mt-1 w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
              disabled={busy}
            />
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-on-accent)] shadow-[0_12px_28px_-18px_var(--color-accent-glow)] transition disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canCreate}
          >
            Add feature
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {orderedFeatures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--color-admin-border-soft)] px-4 py-6 text-center text-sm text-[color:var(--color-muted)]">
            No features added yet.
          </div>
        ) : (
          orderedFeatures.map((feature) => (
            <FeatureCard
              key={`${feature._id}-${feature.updatedAt}`}
              feature={feature}
              onUpdate={onUpdate}
              onDelete={onDelete}
              busy={busy}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FeatureCard({ feature, onUpdate, onDelete, busy }: FeatureCardProps) {
  const resolvedIcon = FEATURE_ICON_MAP[
    feature.icon as FeatureIconKey
  ]
    ? (feature.icon as FeatureIconKey)
    : FEATURE_ICON_OPTIONS[0].id;

  const [form, setForm] = useState({
    title: feature.title,
    description: feature.description,
    icon: resolvedIcon,
    order: feature.order ?? 0,
  });

  const Icon = FEATURE_ICON_MAP[form.icon] ?? DEFAULT_FEATURE_ICON;

  const hasChanges = useMemo(() => {
    return (
      form.title !== feature.title ||
      form.description !== feature.description ||
      form.icon !== resolvedIcon ||
      form.order !== (feature.order ?? 0)
    );
  }, [form, feature, resolvedIcon]);

  const handleSave = async () => {
    if (!hasChanges || busy) {
      return;
    }

    await onUpdate(feature._id, {
      title: form.title,
      description: form.description,
      icon: form.icon,
      order: form.order,
    });
  };

  const handleDelete = async () => {
    if (busy) {
      return;
    }

    const confirmed = typeof window === "undefined" ? true : window.confirm(`Remove "${feature.title}"?`);
    if (!confirmed) {
      return;
    }

    await onDelete(feature._id);
  };

  return (
    <div className="surface-card rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--color-accent-outline)] bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]">
              <Icon size={20} />
            </span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="flex-1 rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
              placeholder="Feature title"
              disabled={busy}
            />
          </div>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)] min-h-[4.5rem]"
            placeholder="Feature description"
            disabled={busy}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col text-sm text-[color:var(--color-muted)]">
              Icon
              <select
                value={form.icon}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, icon: event.target.value as FeatureIconKey }))
                }
                className="mt-1 w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
                disabled={busy}
              >
                {FEATURE_ICON_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-sm text-[color:var(--color-muted)]">
              Order
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface-strong)] px-3 py-2 text-sm text-[color:var(--color-foreground)] outline-none transition focus:border-[color:var(--color-accent)] focus:ring focus:ring-[color:var(--color-accent-soft)]"
                disabled={busy}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-on-accent)] shadow-[0_12px_26px_-18px_var(--color-accent-glow)] transition disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy || !hasChanges || !form.title.trim() || !form.description.trim()}
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                title: feature.title,
                description: feature.description,
                icon: resolvedIcon,
                order: feature.order ?? 0,
              })
            }
            className="rounded-full border border-[color:var(--color-admin-border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-foreground-secondary)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy || !hasChanges}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-[color:var(--color-admin-danger)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-admin-danger-text)] transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
