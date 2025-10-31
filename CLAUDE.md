# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Lichess 4545 League Stats is a Next.js application that analyzes and displays comprehensive chess statistics from Lichess team league games. The application processes PGN (Portable Game Notation) files and generates detailed statistics including game phases, tactics, openings, piece activity, and fun awards.

## Statistics Generation

**IMPORTANT**: Statistics generation scripts should be run in a **separate terminal window** by the user.

### Commands

**Generate Round Statistics:**
```bash
# From API (recommended)
curl -s "https://lichess.org/api/broadcast/round/{roundId}/pgn" | \
  node scripts/generate-stats.js --round <number> --season <number>

# With Stockfish analysis (slower but more detailed)
curl -s "https://lichess.org/api/broadcast/round/{roundId}/pgn" | \
  node scripts/generate-stats.js --round <number> --season <number> --analyze

# From local PGN file
cat round1.pgn | node scripts/generate-stats.js --round 1 --season 46
```

**Output:**
- Round stats: `public/stats/season-<N>-round-<N>.json`
- View at: `http://localhost:3000/stats/<season>/round/<roundNumber>`

### Key Statistics Components

**Round Statistics** (15 components in `/components/stats/`):
1. `round-header.tsx` - Navigation and broadcast link
2. `overview-stats.tsx` - Game overview metrics
3. `results-breakdown.tsx` - Win/loss/draw with pie chart
4. `awards-section.tsx` - Tournament awards
5. `fun-stats.tsx` - 15+ fun statistics with clickable game links
6. `game-phases.tsx` - Opening/middlegame/endgame analysis
7. `tactics-section.tsx` - Captures, castling, promotions
8. `openings-section.tsx` - ECO opening analysis with charts
9. `piece-stats.tsx` - Piece activity and survival rates
10. `notable-games.tsx` - Interesting games
11. `checkmates-section.tsx` - Checkmate analysis
12. `board-heatmap-section.tsx` - Interactive heatmap
13. `analysis-section.tsx` - Stockfish analysis (accuracy, blunders, etc.)
14. `opening-popularity-chart.tsx` - Bar chart (recharts)
15. `win-rate-chart.tsx` - Pie chart (recharts)

**Fun Statistics** (15+ awards with clickable game links):
- ⚡ Fastest Queen Trade
- 🐌 Slowest Queen Trade
- 🔪 Longest Capture Spree
- 👑 Longest King Hunt
- 🌪️ Pawn Storm Award
- 🏠 Piece Loyalty Award
- ✈️ Square Tourist Award
- 🏁 Castling Race Winner
- 🎩 Opening Hipster
- 👸 Sporty Queen
- 👑 Dadbod Shuffler
- 🎯 Sniper (fastest checkmate execution)
- ⚡ Opening Blitzer
- 😢 Sad Times
- 🤖 Most Premoves
- 🤔 Longest Think
- ⏰ Zeitnot Addict
- 🏃 Time Scramble Survivor
- 💨 Bullet Speed
- And more...

### Architecture

**Tech Stack:**
- Next.js 15 with App Router
- TypeScript
- Recharts for data visualization
- chess.js for PGN parsing
- Stockfish for game analysis (optional)

**Key Utilities** (`/scripts/utils/`):
- `pgn-parser.js` - Parse PGN with chess.js
- `game-phases.js` - Detect game phases
- `stats-calculator.js` - Calculate all statistics
- `time-analyzer.js` - Time-based statistics (Sniper, etc.)
- `chess-openings.js` - ECO opening database (3,546 openings)
- `calculators/fun-stats/` - Individual fun stat calculators

### UI Components

**AwardCard Component:**
All fun statistics use the `AwardCard` component which makes entire cards clickable with hover icons when a `gameId` is available. Cards without `gameId` render as plain divs.

```tsx
<AwardCard gameId={funStats.fastestQueenTrade.gameId} className="bg-pink-50 dark:bg-pink-900/20">
  {/* Award content */}
</AwardCard>
```

**Dark Mode Support:**
All components support dark mode with Tailwind CSS dark: variants.

## Development Workflow

**Build and Verify:**
```bash
npm run build  # Always run before committing to verify TypeScript
```

**Type Safety:**
- TypeScript interfaces in `app/stats/[season]/round/[roundNumber]/page.tsx` must match component interfaces
- All fun stats must have consistent interface structure across calculators and UI components

## Important Notes

- Statistics generation can take 30-45s for basic stats, 7-15min with Stockfish analysis
- Always run stats generation in a separate terminal window (user's responsibility)
- The application uses static JSON files for fast page loads
- Game links use Lichess game IDs extracted from PGN headers
