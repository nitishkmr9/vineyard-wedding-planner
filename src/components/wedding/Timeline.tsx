import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import { TIMELINE } from "@/lib/wedding-plan";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "vineyard-vows-checklist-v1";

export function Timeline() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // storage unavailable
    }
  }, [done, hydrated]);

  const toggle = (key: string) => setDone((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalTasks = TIMELINE.reduce((n, p) => n + p.tasks.length, 0);
  const doneCount = Object.values(done).filter(Boolean).length;

  return (
    <div>
      <p className="mb-8 text-center text-sm font-medium tracking-widest text-muted-foreground uppercase">
        {doneCount} of {totalTasks} tasks complete
      </p>
      <ol className="relative mx-auto max-w-3xl space-y-10 border-l-2 border-border pl-8">
        {TIMELINE.map((phase) => {
          const phaseDone = phase.tasks.every((_, i) => done[`${phase.id}-${i}`]);
          return (
            <li key={phase.id} className="relative">
              <span
                className={cn(
                  "absolute top-1 -left-[41px] flex size-4 items-center justify-center rounded-full border-2 transition-colors",
                  phaseDone ? "border-primary bg-primary" : "border-gold bg-background",
                )}
              />
              <p className="text-xs font-semibold tracking-[0.2em] text-olive uppercase">
                {phase.when}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
                {phase.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {phase.tasks.map((task, i) => {
                  const key = `${phase.id}-${i}`;
                  const checked = !!done[key];
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        aria-pressed={checked}
                        className="group flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-secondary"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card group-hover:border-primary",
                          )}
                        >
                          {checked && <Check className="size-3.5" />}
                        </span>
                        <span
                          className={cn(
                            "text-sm leading-relaxed",
                            checked ? "text-muted-foreground line-through" : "text-foreground",
                          )}
                        >
                          {task}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
