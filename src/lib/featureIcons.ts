import { Brain, Code, Figma, GaugeCircle, LucideIcon, ShieldCheck, Sparkles } from "lucide-react";

export type FeatureIconKey =
  | "gauge-circle"
  | "figma"
  | "code"
  | "brain"
  | "shield-check"
  | "sparkles";

export const FEATURE_ICON_OPTIONS: Array<{
  id: FeatureIconKey;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "gauge-circle", label: "Performance", icon: GaugeCircle },
  { id: "figma", label: "Design Systems", icon: Figma },
  { id: "code", label: "Full-stack", icon: Code },
  { id: "brain", label: "AI Workflows", icon: Brain },
  { id: "shield-check", label: "Security", icon: ShieldCheck },
  { id: "sparkles", label: "Delight", icon: Sparkles },
];

export const FEATURE_ICON_MAP: Record<FeatureIconKey, LucideIcon> = FEATURE_ICON_OPTIONS.reduce(
  (accumulator, option) => {
    accumulator[option.id] = option.icon;
    return accumulator;
  },
  {} as Record<FeatureIconKey, LucideIcon>
);

export const DEFAULT_FEATURE_ICON: LucideIcon = Sparkles;