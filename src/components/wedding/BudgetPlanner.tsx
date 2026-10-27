import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Minus, Plus, RotateCcw } from "lucide-react";

import {
  BUDGET_CATEGORIES,
  GUEST_COUNT,
  TOTAL_BUDGET,
  type BudgetCategory,
} from "@/lib/wedding-plan";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "vineyard-vows-plan-v1";

function formatMoney(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function BudgetPlanner() {
  const [amounts, setAmounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(BUDGET_CATEGORIES.map((c) => [c.id, c.amount])),
  );
  const [guests, setGuests] = useState(GUEST_COUNT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          amounts?: Record<string, number>;
          guests?: number;
        };
        if (saved.amounts) setAmounts((prev) => ({ ...prev, ...saved.amounts }));
        if (typeof saved.guests === "number") setGuests(saved.guests);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ amounts, guests }));
    } catch {
      // storage unavailable
    }
  }, [amounts, guests, hydrated]);

  const spent = useMemo(
    () => BUDGET_CATEGORIES.reduce((sum, c) => sum + (amounts[c.id] ?? 0), 0),
    [amounts],
  );
  const remaining = TOTAL_BUDGET - spent;
  const over = remaining < 0;
  const perGuest = guests > 0 ? spent / guests : 0;

  const reset = () => {
    setAmounts(Object.fromEntries(BUDGET_CATEGORIES.map((c) => [c.id, c.amount])));
    setGuests(GUEST_COUNT);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
      {/* Summary column */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
            Total budget
          </p>
          <p className="mt-1 font-display text-5xl font-semibold text-foreground">
            {formatMoney(TOTAL_BUDGET)}
          </p>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                over ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${Math.min(100, (spent / TOTAL_BUDGET) * 100)}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">Allocated</p>
              <p className="font-display text-2xl font-semibold">{formatMoney(spent)}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                {over ? "Over budget" : "Remaining"}
              </p>
              <p
                className={cn(
                  "font-display text-2xl font-semibold",
                  over ? "text-destructive" : "text-olive",
                )}
              >
                {formatMoney(Math.abs(remaining))}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm",
              over
                ? "bg-destructive/10 text-destructive"
                : "bg-accent text-accent-foreground",
            )}
          >
            {over ? (
              <>
                <AlertTriangle className="size-4 shrink-0" />
                Trim {formatMoney(Math.abs(remaining))} to get back on track.
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4 shrink-0" />
                You're within budget — {formatMoney(remaining)} of breathing room.
              </>
            )}
          </div>
        </div>

        {/* Guest count */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
            Guest count
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              aria-label="Fewer guests"
              onClick={() => setGuests((g) => Math.max(20, g - 5))}
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-16 text-center font-display text-4xl font-semibold">{guests}</span>
            <button
              type="button"
              aria-label="More guests"
              onClick={() => setGuests((g) => Math.min(300, g + 5))}
              className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            That's about{" "}
            <span className="font-semibold text-foreground">{formatMoney(perGuest)}</span> per
            guest across everything — catering alone should stay near $100–$110 a head at a
            vineyard.
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-4" />
          Reset to the recommended plan
        </button>
      </div>

      {/* Categories */}
      <ul className="space-y-3">
        {BUDGET_CATEGORIES.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            value={amounts[category.id] ?? 0}
            spent={spent}
            onChange={(v) => setAmounts((prev) => ({ ...prev, [category.id]: v }))}
          />
        ))}
      </ul>
    </div>
  );
}

function CategoryRow({
  category,
  value,
  spent,
  onChange,
}: {
  category: BudgetCategory;
  value: number;
  spent: number;
  onChange: (v: number) => void;
}) {
  const share = spent > 0 ? (value / spent) * 100 : 0;
  return (
    <li className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">{category.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{category.note}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-semibold text-primary">{formatMoney(value)}</p>
          <p className="text-xs text-muted-foreground">{share.toFixed(1)}% of spend</p>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={15000}
        step={50}
        value={value}
        aria-label={`${category.name} budget`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--color-primary)]"
      />
    </li>
  );
}
