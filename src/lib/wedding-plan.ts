export const TOTAL_BUDGET = 25000;
export const GUEST_COUNT = 120;

export interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  note: string;
}

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: "venue-catering",
    name: "Venue & Catering",
    amount: 12500,
    note: "Vineyard rental, family-style dinner & estate wine for 120 guests (~$104/person)",
  },
  {
    id: "photography",
    name: "Photography & Film",
    amount: 2500,
    note: "8 hours of coverage plus a highlight film — golden hour in the vines is unmissable",
  },
  {
    id: "attire",
    name: "Attire & Beauty",
    amount: 2000,
    note: "Dress, suit, alterations, hair & makeup for the couple",
  },
  {
    id: "flowers-decor",
    name: "Flowers & Décor",
    amount: 2000,
    note: "Burgundy & blush arrangements, garlands of grapevine and olive branch",
  },
  {
    id: "rentals-lighting",
    name: "Rentals & Lighting",
    amount: 1500,
    note: "Farm tables, cross-back chairs, string lights — plus a tent on hold for June weather",
  },
  {
    id: "music",
    name: "Music & Entertainment",
    amount: 1500,
    note: "Acoustic trio for the ceremony, DJ for dancing under the stars",
  },
  {
    id: "stationery",
    name: "Stationery",
    amount: 750,
    note: "Save-the-dates, invitations, menus and hand-lettered signage",
  },
  {
    id: "cake",
    name: "Cake & Desserts",
    amount: 750,
    note: "Semi-naked cake with fresh figs, plus a late-night dessert table",
  },
  {
    id: "officiant-rings",
    name: "Officiant & Rings",
    amount: 750,
    note: "Ceremony officiant, marriage license and wedding bands",
  },
  {
    id: "contingency",
    name: "Contingency",
    amount: 750,
    note: "3% buffer for weather calls, extra guests and last-minute fixes",
  },
];

export interface TimelinePhase {
  id: string;
  when: string;
  title: string;
  tasks: string[];
}

export const TIMELINE: TimelinePhase[] = [
  {
    id: "phase-8",
    when: "Now – November 2026",
    title: "Lay the foundation",
    tasks: [
      "Tour and book the vineyard — June Saturdays go first",
      "Lock in your June 2027 date and sign the venue contract",
      "Hire your photographer and videographer",
      "Draft the guest list of ~120 and collect addresses",
      "Set up a shared budget tracker and payment calendar",
    ],
  },
  {
    id: "phase-6",
    when: "December 2026 – January 2027",
    title: "Book the big players",
    tasks: [
      "Book the caterer and plan a family-style menu with estate wine pairings",
      "Reserve the band or DJ and ceremony musicians",
      "Send save-the-dates to all 120 guests",
      "Say yes to the dress — order by January for alterations",
      "Arrange guest shuttles if the vineyard is remote",
    ],
  },
  {
    id: "phase-4",
    when: "February – March 2027",
    title: "Design the details",
    tasks: [
      "Book the florist — seasonal, locally grown arrangements",
      "Reserve rentals: farm tables, chairs, lighting, and a tent on standby",
      "Cake tasting and dessert table selection",
      "Order invitations; plan to mail them 10–12 weeks out",
      "Schedule the hair and makeup trial",
    ],
  },
  {
    id: "phase-2",
    when: "April – May 2027",
    title: "Bring it together",
    tasks: [
      "Mail invitations with an RSVP deadline 4 weeks before the wedding",
      "Meet the officiant and write your ceremony",
      "Pick up the wedding bands",
      "Final dress and suit fittings",
      "Build the seating chart as RSVPs arrive",
    ],
  },
  {
    id: "phase-1",
    when: "June 2027",
    title: "The home stretch",
    tasks: [
      "Confirm the final headcount (~120) with caterer and rentals",
      "Check the 10-day forecast — decide on the tent",
      "Final venue walkthrough and rehearsal at the vineyard",
      "Pack a day-of emergency kit: sunscreen, bug spray, flats",
      "Get married among the vines!",
    ],
  },
];
