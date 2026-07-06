"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Single-select card grid. */
export function SingleSelect({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: { value: string; label: string; detail?: string }[];
  value: string;
  onChange: (v: string) => void;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3"
      )}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all",
              active
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <div>
              <div className="font-medium">{o.label}</div>
              {o.detail && <div className="mt-0.5 text-sm text-muted-foreground">{o.detail}</div>}
            </div>
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                active ? "border-primary bg-primary text-primary-foreground" : "border-border"
              )}
            >
              {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select chip/card grid. */
export function MultiSelect({
  options,
  values,
  onChange,
  columns = 2,
}: {
  options: { value: string; label: string }[];
  values: string[];
  onChange: (v: string[]) => void;
  columns?: 1 | 2 | 3;
}) {
  const toggle = (v: string) =>
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3"
      )}
    >
      {options.map((o) => {
        const active = values.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
              active
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                active ? "border-primary bg-primary text-primary-foreground" : "border-border"
              )}
            >
              {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <span className="text-sm font-medium">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-lg font-semibold">{children}</h3>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
