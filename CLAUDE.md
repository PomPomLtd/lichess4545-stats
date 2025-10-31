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

**Generate Season Overview:**
```bash
# Aggregates all round stats into season overview
node scripts/generate-overview.js --season 46
```

**Output:**
- Round stats: `public/stats/season-<N>-round-<N>.json`
  - View at: `http://localhost:3000/stats/<season>/round/<roundNumber>`
- Season overview: `public/stats/season-<N>-overview.json`
  - View at: `http://localhost:3000/stats/<season>/overview`

### Team Statistics

**Team Awards** (12 awards tracked in each round):
1. 🩸 Most Bloodthirsty - Most total captures
2. 🦐 Best Pawn Crackers - Most pawn captures
3. 🌙 Late Knight Show - Most knight moves after move 30
4. ⚡ Fastest Castling - Lowest average castling move number
5. 🚀 Space Invaders - Most pieces in enemy territory
6. ⚔️ Check Masters - Most checks delivered
7. 🔲 Corner Conquerors - Most corner square activity
8. 🏃 Marathon Runners - Most total moves
9. 💨 Speed Demons - Shortest average game length
10. 🐔 Chicken Champions - Most retreating moves
11. 🚫🐔 Bravest Team - Fewest retreating moves
12. 👑 Promotion Party - Most pawn promotions

**Team Roster Loading:**
- Team rosters loaded from Season API: `https://www.lichess4545.com/api/season/{season}/games.json`
- Creates O(1) player→team lookup map
- Team names use Syne Tactile font for display

**Team Hall of Fame:**
- Season overview aggregates best team performances across all rounds
- Tracks highest value for each award type
- Displayed in dedicated section on overview page

### Season Overview

**Purpose:** Aggregates all round statistics into season-wide superlatives, leaderboards, and trends.

**Components** (5 sections in `/components/stats/overview/`):
1. `overview-hero.tsx` - Season aggregates (total games, moves, pieces captured)
2. `piece-cemetery.tsx` - Creative graveyard with all captured pieces (1,100+ pieces)
3. `hall-of-fame-section.tsx` - Best player awards from all rounds (14 superlatives)
4. `team-hall-of-fame-section.tsx` - Best team performances from all rounds (12 awards)
5. `leaderboards-section.tsx` - Player rankings (9 leaderboards)
6. `trends-section.tsx` - Round-by-round visualization of key metrics

**Hall of Fame** (14 player superlatives):
- Cleanest Game, Wildest Game, Biggest Blunder
- Most Accurate, Worst ACPL
- Longest Game, Shortest Game
- Sportiest Queen, Most Retreats
- Longest Check Sequence, Longest Capture Spree
- Earliest Castling, Most Obscure Opening
- Biggest Comeback, Lucky Escape

**Leaderboards** (9 rankings):
- Most Awards, Best Average ACPL, Worst Average ACPL
- Most Improved, Most Games, Most Versatile
- Most Consistent, Highest Win Rate
- Most Blunders, Fewest Blunders

**Trends** (10 metrics tracked by round):
- Average ACPL, Average Accuracy, Average Game Length
- e4 Percentage, d4 Percentage
- Draw Rate, White Win Rate, Black Win Rate
- Blunders/Game, Mistakes/Game, Average Queen Distance

**Generation:**
- Run after 2+ rounds are complete
- Fast execution (~10 seconds) - aggregates existing round data
- Output: `public/stats/season-<N>-overview.json`
- View at: `http://localhost:3000/stats/<season>/overview`

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

## Workflow Quick Reference

**Trigger Manual Workflows:**
```bash
# Analyze single round with Stockfish
gh workflow run analyze-round.yml -f round=1 -f season=46 -f depth=15

# Analyze multiple rounds (batch)
gh workflow run analyze-multiple-rounds.yml -f rounds=1,2,3 -f season=46 -f depth=15

# Generate season overview
gh workflow run generate-overview.yml -f season=46

# Trigger weekly analysis (normally auto-runs Monday 12pm UTC)
gh workflow run weekly-analysis.yml -f depth=15

# Trigger mid-week update (normally auto-runs Thursday 12pm UTC)
gh workflow run midweek-update.yml
```

**Check Workflow Status:**
```bash
gh workflow list                    # List all workflows
gh run list --limit 5              # Show recent runs
gh run watch                       # Watch latest run
gh run view <run-id> --log         # View logs
```

## Automated Workflows (GitHub Actions)

### Scheduled Workflows (Automatic)

**Weekly Round Analysis** - `.github/workflows/weekly-analysis.yml`
- **Schedule**: Every Monday at 12:00 UTC (noon)
- **Purpose**: Analyze new rounds with Stockfish (depth 15)
- **Features**:
  - Auto-detects which round to analyze (checks game counts)
  - Re-analyzes incomplete rounds with latest games
  - Moves to next round when current is complete (game count matches expected)
  - Supports 8 rounds per season
  - Commits results automatically

**Mid-Week Stats Update** - `.github/workflows/midweek-update.yml`
- **Schedule**: Every Thursday at 12:00 UTC (mid-week)
- **Purpose**: Quick refresh of current round stats (no Stockfish)
- **Features**:
  - Updates stats for latest completed games
  - Fast execution (~5 minutes)
  - Auto-detects current round

**Season Overview Generation** - `.github/workflows/generate-overview.yml`
- **Schedule**: Every Monday at 14:00 UTC (2pm, 2 hours after round analysis)
- **Purpose**: Aggregate all rounds into season overview
- **Features**:
  - Generates hall of fame (player + team superlatives)
  - Creates leaderboards and trends
  - Includes piece cemetery
  - Fast execution (~10 seconds)

### Manual Workflows

**Single Round Analysis** - `.github/workflows/analyze-round.yml`
```bash
gh workflow run analyze-round.yml -f round=1 -f season=46 -f depth=15
```

**Batch Analysis** - `.github/workflows/analyze-multiple-rounds.yml`
```bash
gh workflow run analyze-multiple-rounds.yml -f rounds=1,2,3 -f season=46 -f depth=15
```

**Manual Overview** - `.github/workflows/generate-overview.yml`
```bash
gh workflow run generate-overview.yml -f season=46
```

### Key Features

- **Smart Round Detection**: Compares game counts to determine round completion
- **Auto-rebase**: Uses `git pull --rebase` to handle concurrent commits
- **Python/Stockfish Auto-detection**: Works on Ubuntu runners
- **Vercel Deployment**: Auto-triggers on commit
- **Execution Time**:
  - Round analysis: ~1-2 hours (with Stockfish)
  - Mid-week update: ~5 minutes (no Stockfish)
  - Overview: ~10 seconds (aggregates existing data)

See **REMOTE_ANALYSIS.md** for complete documentation.

## Important Notes

- Statistics generation can take 30-45s for basic stats, 7-15min locally with Stockfish
- Remote analysis via GitHub Actions takes 1-2 hours but runs hands-free in the cloud
- Always run stats generation in a separate terminal window (user's responsibility)
- The application uses static JSON files for fast page loads
- Game links use Lichess game IDs extracted from PGN headers
