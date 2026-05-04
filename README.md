# TradieMatch — Demo

Australia's smartest way to connect with verified tradies. Tinder-style marketplace built as a clickable visual demo.

## Run it

```bash
npm install && npm run dev
```

Open <http://localhost:3000>.

## What's inside

All eight screens are wired up via the sidebar (desktop) or bottom tab bar (mobile):

| Route          | Screen                                              |
| -------------- | --------------------------------------------------- |
| `/`            | Landing — hero "Swipe. Match. Build."               |
| `/onboarding`  | Customer onboarding · 3-step wizard                 |
| `/swipe`       | Tinder-style tradie card stack (the hero screen)    |
| `/match`       | Match list + replayable celebration overlay         |
| `/chat`        | WhatsApp-like chat with quotes &amp; bookings       |
| `/dashboard`   | Tradie dashboard — stats, conversations, plan card  |
| `/pricing`     | 3-tier subscription page (Basic / Pro / Elite)      |
| `/investor`    | Investor metrics — KPIs, growth, AU heatmap, ask    |

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + custom design tokens (navy `#0A2540`, orange `#FF6B35`)
- Framer Motion for swipe + page transitions
- Recharts for dashboards
- Lucide icons
- 100% client-side · no backend, no database

## Demo notes

- The swipe screen supports drag (left = skip, right = match, up = super-like) and tap actions.
- The match overlay can be replayed from `/match`.
- Chat screen has fake quote and booking cards baked into the conversation thread.
- All data lives in `lib/mockData.ts`.
