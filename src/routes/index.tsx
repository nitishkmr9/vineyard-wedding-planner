import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Grape, Leaf, Sun, Umbrella, Users, Wallet } from "lucide-react";

import heroImage from "@/assets/vineyard-hero.jpg";
import detailImage from "@/assets/vineyard-detail.jpg";
import { BudgetPlanner } from "@/components/wedding/BudgetPlanner";
import { Timeline } from "@/components/wedding/Timeline";
import { GUEST_COUNT, TOTAL_BUDGET } from "@/lib/wedding-plan";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vineyard Vows — Rustic June 2027 Wedding Plan" },
      {
        name: "description",
        content:
          "Your initial plan for a rustic outdoor vineyard wedding: 120 guests, a $25,000 budget breakdown, and a month-by-month checklist to June 2027.",
      },
      { property: "og:title", content: "Vineyard Vows — Rustic June 2027 Wedding Plan" },
      {
        property: "og:description",
        content:
          "A rustic vineyard wedding plan for 120 guests on a $25,000 budget, with an interactive budget planner and planning timeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TIPS = [
  {
    icon: Sun,
    title: "Time it for golden hour",
    text: "June sunsets are late — schedule the ceremony for 5:30–6:00 pm so vows and portraits happen in the warmest light over the vines.",
  },
  {
    icon: Umbrella,
    title: "Always hold a rain plan",
    text: "June weather is glorious but fickle. Keep a tent or the barrel room on standby until the 10-day forecast is out — that's what the contingency fund is for.",
  },
  {
    icon: Leaf,
    title: "Let the venue do the decorating",
    text: "Vineyard rows, wine barrels and string lights carry the rustic look. Seasonal local flowers and greenery keep the floral bill honest.",
  },
  {
    icon: Grape,
    title: "Pour the estate's wine",
    text: "Most vineyards offer their own bottles at a better rate than outside catering with corkage fees. Ask for a wedding package — it can save thousands.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background texture-grain">
      {/* Hero */}
      <header className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroImage}
          alt="Long banquet tables under string lights in a vineyard at sunset"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-vignette absolute inset-0" />
        <nav className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10">
          <span className="font-display text-2xl font-semibold tracking-wide text-cream">
            Vineyard Vows
          </span>
          <div className="hidden gap-8 text-sm font-medium tracking-widest text-cream/90 uppercase sm:flex">
            <a href="#budget" className="transition-opacity hover:opacity-70">
              Budget
            </a>
            <a href="#timeline" className="transition-opacity hover:opacity-70">
              Timeline
            </a>
            <a href="#tips" className="transition-opacity hover:opacity-70">
              Vineyard Tips
            </a>
          </div>
        </nav>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 sm:px-10">
          <p className="text-sm font-medium tracking-[0.3em] text-gold uppercase">
            An outdoor celebration among the vines
          </p>
          <h1 className="mt-4 font-display text-6xl leading-[0.95] font-semibold text-cream sm:text-7xl md:text-8xl">
            Your Rustic
            <br />
            <em className="font-medium">Vineyard Wedding</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
            One hundred twenty guests, long farm tables, estate wine and a June sunset — planned
            down to the dollar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#budget"
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold tracking-widest text-primary-foreground uppercase transition-transform hover:scale-105"
            >
              Explore the budget
            </a>
            <a
              href="#timeline"
              className="rounded-full border border-cream/60 px-7 py-3 text-sm font-semibold tracking-widest text-cream uppercase transition-colors hover:bg-cream/10"
            >
              See the timeline
            </a>
          </div>
        </div>
      </header>

      {/* At a glance */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3 sm:px-10">
          <div className="flex items-center gap-4">
            <CalendarDays className="size-8 shrink-0 text-primary" />
            <div>
              <p className="font-display text-3xl font-semibold text-foreground">June 2027</p>
              <p className="text-sm text-muted-foreground">Date to be set when the venue books</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Users className="size-8 shrink-0 text-primary" />
            <div>
              <p className="font-display text-3xl font-semibold text-foreground">
                {GUEST_COUNT} guests
              </p>
              <p className="text-sm text-muted-foreground">Family-style dinner in the vines</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Wallet className="size-8 shrink-0 text-primary" />
            <div>
              <p className="font-display text-3xl font-semibold text-foreground">
                ${TOTAL_BUDGET.toLocaleString("en-US")}
              </p>
              <p className="text-sm text-muted-foreground">About $208 per guest, all-in</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-olive uppercase">The vision</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            Rustic elegance, <em>uncorked</em>
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Think cream linen runners over weathered wood, burgundy dahlias and blush garden roses,
            taper candles flickering between wine glasses, and bunches of grapes spilling across the
            table. The ceremony happens between the vine rows; dinner unfolds under string lights as
            the sun drops behind the hills.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Ceremony among the vine rows at golden hour",
              "Family-style feast with estate wine pairings",
              "String-light canopy over long farm tables",
              "Dancing under the stars, last dance by the barrels",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                <span className="size-1.5 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -top-4 -left-4 size-full rounded-3xl border-2 border-gold/50" />
          <img
            src={detailImage}
            alt="Rustic wedding table with burgundy florals, candles and grapes"
            width={1024}
            height={1280}
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-3xl object-cover shadow-xl"
          />
        </div>
      </section>

      {/* Budget */}
      <section id="budget" className="border-y border-border bg-muted/60 scroll-mt-8">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-olive uppercase">
              Where the money goes
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              The $25,000 budget
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              A realistic allocation for 120 guests at a vineyard. Drag any slider to make it yours —
              your changes are saved in this browser.
            </p>
          </div>
          <BudgetPlanner />
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 scroll-mt-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-olive uppercase">
            From now to "I do"
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            The road to June 2027
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tick tasks off as you go — your progress is saved in this browser.
          </p>
        </div>
        <Timeline />
      </section>

      {/* Tips */}
      <section id="tips" className="border-t border-border bg-secondary scroll-mt-8">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-olive uppercase">
              Insider advice
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              Vineyard wisdom
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {TIPS.map((tip) => (
              <article
                key={tip.title}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <tip.icon className="size-7 text-primary" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">
                  {tip.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center sm:px-10">
        <p className="font-display text-2xl font-semibold text-foreground">Vineyard Vows</p>
        <p className="mt-2 text-sm text-muted-foreground">
          120 guests · June 2027 · $25,000 — here's to a beautiful beginning.
        </p>
      </footer>
    </div>
  );
}
