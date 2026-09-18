# Executive Connect — Hackathon 2026

An AI-powered executive event discovery and networking intelligence platform designed for technology leaders across Texas.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Modern Light Theme Design System
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Network Graph**: Cytoscape.js
- **Charts & Data**: Recharts

## Project Structure
```
Hackathon26/
└── executive-connect/
    ├── app/                     # Next.js App Router routes & layouts
    │   ├── (app)/               # Authenticated app routes (events, people, network, etc.)
    │   ├── (auth)/              # Authentication routes (login, register wizard)
    │   ├── globals.css          # Design system variables & utilities
    │   └── layout.tsx           # Root application layout
    ├── components/
    │   ├── dashboard/           # Dashboard hero, greeting, stats, teaser
    │   ├── events/              # Event row, filtering, registration drawer
    │   ├── layout/              # Persistent sidebar, topbar, mobile nav, command palette
    │   ├── network/             # Interactive Cytoscape network graph & connection pathing
    │   └── people/              # People directory rows & profile views
    ├── lib/
    │   ├── auth/                # Session and auth utilities
    │   ├── graph/               # Graph traversal & shortest path algorithms
    │   ├── mock/                # Curated mock datasets (events, executives, relationships)
    │   └── utils/               # Formatters and classname helpers
    └── public/
```

## Getting Started

1. Navigate to the project directory:
   ```bash
   cd executive-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
