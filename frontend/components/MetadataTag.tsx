"use client";

import { cn } from "@/lib/utils";

interface MetadataTagProps {
  label: string;
  value?: string;
  variant?: "default" | "accent" | "sienna" | "muted";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    "border-[rgba(26,26,26,0.22)] text-[rgba(26,26,26,0.65)]",
  accent:
    "border-[#4a5343] text-[#4a5343]",
  sienna:
    "border-[#c1440e] text-[#c1440e]",
  muted:
    "border-[rgba(26,26,26,0.14)] text-[rgba(26,26,26,0.45)]",
};

export function MetadataTag({
  label,
  value,
  variant = "default",
  className,
}: MetadataTagProps) {
  return (
    <span
      className={cn(
        "stamp",
        variantStyles[variant],
        className
      )}
    >
      {value ? (
        <>
          <span className="opacity-60">{label}</span>
          <span>{value}</span>
        </>
      ) : (
        label
      )}
    </span>
  );
}
