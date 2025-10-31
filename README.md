# Lichess 4545 League Statistics

Comprehensive statistics and analysis platform for the Lichess 4545 Team League.

**Status:** Core migration complete (Phases 1-3) ✅
**Repository:** https://github.com/PomPomLtd/lichess4545-stats

## Features

- **Round Statistics**: Detailed analysis of each round with 15 components
  - Game overview, phases, results breakdown
  - Opening analysis (ECO classification with 3,546+ openings)
  - Tactical statistics (captures, castling, promotions)
  - Board heatmap visualization
  - Piece statistics and survival rates
  - Fun awards (11 creative categories)
  - Checkmate analysis

- **Season Overview**: Aggregate statistics across all rounds (5 components)
  - Season overview hero section
  - Piece Cemetery (creative graveyard theme)
  - Hall of Fame (best awards from all rounds)
  - Player leaderboards
  - Trends visualization

- **Data Pipeline**: Automated fetching and processing
  - Fetch season data from Lichess 4545 API
  - Download PGNs from Lichess.org with rate limiting
  - Parse and analyze games with chess.js
  - Generate comprehensive statistics

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TailwindCSS 4
- **Analysis:** chess.js for game analysis, Recharts for visualizations
- **Data Sources:** Lichess 4545 API, Lichess.org PGN exports
- **Deployment:** Vercel-ready (no database or environment variables needed!)

## Quick Start

### Installation

```bash
npm install
```

### Data Pipeline

Complete workflow for generating statistics:

```bash
# 1. Fetch season data from Lichess 4545
node scripts/fetch-lichess-season.js --season=46

# 2. Download PGNs for a round
node scripts/download-pgns.js --season=46 --round=1

# 3. Generate round statistics
node scripts/generate-stats.js --round 1 --season 46

# 4. Generate season overview (after 2+ rounds)
node scripts/generate-overview.js --season 46
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000

## Migration Status

### ✅ Phase 1: Environment Setup (Complete)
- [x] Created new repository structure
- [x] Removed database layer (Prisma)
- [x] Removed authentication (NextAuth)
- [x] Removed tournament management features
- [x] Kept all 20 stats components
- [x] Updated dependencies
- [x] Created landing page

### ✅ Phase 2: Data Fetching Scripts (Complete)
- [x] `fetch-lichess-season.js` - Fetches game data from Lichess 4545 API
- [x] `download-pgns.js` - Downloads PGNs from Lichess.org (100ms rate limit)
- [x] `lichess-adapter.js` - Transforms Lichess 4545 data format
- [x] Tested with Season 46 (222 games, 158 PGNs for Round 1)

### ✅ Phase 3: Stats Generation (Complete)
- [x] Updated `generate-stats.js` to read from data/ directory
- [x] Made --season parameter required
- [x] Updated branding to Lichess 4545
- [x] Made tactical analysis optional (requires Python venv)
- [x] Tested successfully: 158 games → 26KB JSON in ~2 minutes
- [x] PGNs include built-in Stockfish evaluations!

### 🚧 Phase 4-6: Remaining Work

See **MIGRATION_PLAN.md** for complete details on remaining phases:
- Phase 4: UI Components (multi-season routing)
- Phase 5: Branding & Polish
- Phase 6: Testing & Deployment

## Next Steps

1. **Complete Phase 4** - Restructure app routes for multi-season support (see MIGRATION_PLAN.md)
2. **Generate historical data** for Seasons 44 and 45
3. **Deploy to Vercel** and test
4. **Share with Lichess 4545 community**

## Credits

- **K4 Classical League** - Original stats system design
- **Lichess 4545 League** - Game data and community
- **Lichess.org** - PGN exports with evaluations, ECO database (CC0)

## License

MIT
