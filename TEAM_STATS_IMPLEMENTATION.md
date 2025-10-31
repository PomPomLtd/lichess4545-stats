# Team Statistics Implementation

## Summary

Successfully implemented team statistics foundation with two initial team awards. The system aggregates individual player game data by team and calculates team-level metrics.

## What Was Built

### 1. Core Utilities (`scripts/utils/`)

#### `team-loader.js` - Team Data Management
- **`loadSeasonGames(season)`** - Loads season data from `data/season-XX-games.json`
- **`extractTeamRosters(seasonData)`** - Extracts team rosters and player lists from season data
- **`buildPlayerTeamMap(teamRosters)`** - Creates player → team mapping for fast lookups
- **`getTeamForPlayer(playerName, map)`** - Retrieves team name for a player
- **`filterTeamGamesByRound(rosters, round)`** - Filters team games to specific round

#### `calculators/teams.js` - Team Stats Calculator
- **`calculateTeamStats(games, rosters, playerTeamMap)`** - Main calculator that:
  - Maps each parsed game to white/black teams
  - Aggregates captures and late knight moves by team
  - Tracks per-game contributions
- **`calculateTeamAwards(teamStats)`** - Determines award winners:
  - 🩸 **Bloodthirsty Team** - Most total captures
  - 🌙 **The Late Knight Show** - Most knight moves after move 30
- **`generateTeamLeaderboard(stats, key, limit)`** - Generic leaderboard generator

### 2. Stats Generation Integration

Modified `scripts/generate-stats.js` to:
- Load season games data automatically
- Extract team rosters for the current round
- Pass team data to stats calculator
- Display team awards in console output
- Include team data in JSON output

Modified `scripts/utils/stats-calculator.js` to:
- Accept optional `teamData` parameter
- Calculate team stats when team data is available
- Include teams section in output JSON

### 3. UI Components (`components/stats/`)

#### `team-awards-section.tsx` - React Component
- Displays team awards in card layout
- Shows team name, stats, and player count
- Responsive grid design (1 column mobile, 2 columns desktop)
- Dark mode support
- Conditional rendering (only shows if team data exists)

### 4. Page Integration

Updated `app/stats/[season]/round/[roundNumber]/page.tsx`:
- Added `TeamAwardsSection` import
- Extended `StatsData` interface with optional `teams` property
- Rendered team section after individual awards

## Test Results

### Season 46, Round 1 (158 games, 42 teams)

**Generated Successfully:**
```
👥 Team Awards:
   🩸 Bloodthirsty Team: Too OTH for OTB (98 captures, 12.3 avg)
   🌙 The Late Knight Show: Rim Reapers (30 late knight moves, 3.8 avg)
```

**Performance:**
- Stats generation: 140.22s (includes tactical analysis)
- Output file size: 129.48 KB
- Build: ✅ Successful (2.2s compile time)

**JSON Output:**
```json
{
  "teams": {
    "awards": {
      "bloodthirstyTeam": {
        "name": "Too OTH for OTB",
        "totalCaptures": 98,
        "averageCapturesPerGame": "12.3",
        "playerCount": 8
      },
      "lateKnightShow": {
        "name": "Rim Reapers",
        "lateKnightMoves": 30,
        "averageLateKnightMovesPerGame": "3.8",
        "playerCount": 8
      }
    },
    "totalTeams": 42
  }
}
```

## File Structure

```
lichess4545-stats/
├── scripts/
│   ├── utils/
│   │   ├── team-loader.js                    [NEW] Team data utilities
│   │   ├── stats-calculator.js               [MODIFIED] Added team stats
│   │   └── calculators/
│   │       └── teams.js                      [NEW] Team stats calculator
│   ├── generate-stats.js                     [MODIFIED] Integrated team data
│   └── test-team-extraction.js               [NEW] Test utility
├── components/
│   └── stats/
│       └── team-awards-section.tsx           [NEW] Team awards UI
├── app/
│   └── stats/
│       └── [season]/
│           └── round/
│               └── [roundNumber]/
│                   └── page.tsx              [MODIFIED] Added team section
└── data/
    └── season-46-teams.json                  [GENERATED] Team rosters

Documentation:
├── TEAM_STATS_BRAINSTORM.md                  [NEW] 50+ stat ideas
└── TEAM_STATS_IMPLEMENTATION.md              [NEW] This document
```

## Architecture

### Data Flow

```
season-46-games.json (from API)
       ↓
team-loader.js (extract rosters)
       ↓
season-46-round-1.pgn (game data)
       ↓
pgn-parser.js (parse games)
       ↓
teams.js (calculate team stats) ← player-team map
       ↓
stats-calculator.js (aggregate)
       ↓
season-46-round-1.json
       ↓
team-awards-section.tsx (display)
```

### Key Design Decisions

1. **Optional Team Data** - Team stats are optional; system works without them
2. **Round-Scoped** - Team stats calculated per round, not season-wide
3. **Extensible** - Easy to add new team metrics to calculator
4. **Type-Safe** - Full TypeScript interfaces for team data
5. **Performant** - Uses player-team map for O(1) lookups

## Current Statistics

### Implemented (2 stats)
- 🩸 **Bloodthirsty Team** - Most total captures across all games
- 🌙 **The Late Knight Show** - Most knight moves after move 30

### Ready to Implement (48+ more)
See `TEAM_STATS_BRAINSTORM.md` for complete list, including:
- PAnnini Team (most pawn moves)
- Fork Masters (most forks)
- Space Invaders (most aggressive positioning)
- Opening Diversity (unique ECO codes)
- Material Minimalists (won with least material)
- And 43+ more creative stats!

## How to Use

### Generate Stats with Team Data

```bash
# Ensure season games data exists
node scripts/fetch-lichess-season.js --season=46

# Generate round stats (team data loaded automatically)
cat data/season-46-round-1.pgn | node scripts/generate-stats.js --round 1 --season 46

# View output
cat public/stats/season-46-round-1.json | jq '.teams'
```

### Extract Team Rosters (Standalone)

```bash
# Generate team roster file
node scripts/test-team-extraction.js --season=46

# View output
cat data/season-46-teams.json | jq '.teams | keys'
```

### View in Browser

```bash
npm run dev
# Navigate to: http://localhost:3000/stats/46/round/1
# Team awards appear after individual awards section
```

## Next Steps

### Easy Additions (Use Existing Data)
1. **PAnnini Team** - Count pawn moves from `moveList`
2. **Fork Masters** - Use tactical analysis data
3. **Opening Diversity** - Count unique ECO codes from games
4. **Capture Rate** - Calculate avg captures/game per team

### Medium Complexity
5. **Space Invaders** - Analyze piece positions in opponent's half
6. **Material Minimalists** - Track piece counts at game end
7. **Promotion Factory** - Count pawn promotions per team
8. **Castling Speed** - Average move number for castling

### Advanced Features
9. **Team Leaderboard Component** - Sortable table with all stats
10. **Team Profile Pages** - Individual team pages with rosters
11. **Head-to-Head Stats** - Team vs team records
12. **Team Trends** - Performance over rounds

## Code Quality

✅ **Type Safety** - Full TypeScript interfaces
✅ **Build Success** - No compilation errors
✅ **Dark Mode** - Full theme support
✅ **Responsive** - Mobile-first design
✅ **Conditional** - Graceful handling when team data unavailable
✅ **Tested** - Successfully generated stats for Season 46 Round 1

## Dependencies

- `season-XX-games.json` - Required for team roster data
- `fetch-lichess-season.js` - Must run before stats generation
- chess.js - Already used for game analysis
- React 19 + Next.js 15 - UI framework
- TailwindCSS 4 - Styling

## Performance Impact

- Team data loading: < 1s
- Team stats calculation: Negligible (< 0.5s for 158 games)
- JSON size increase: ~0.5 KB per round
- Build time: No measurable impact

## Extensibility

Adding a new team statistic requires:

1. **Add calculation logic** in `calculators/teams.js`:
   ```javascript
   // In calculateGameTeamStats()
   let whiteSomeNewStat = 0;
   moveList.forEach(move => {
     // Calculate stat from move data
   });

   // In calculateTeamStats()
   teamStats[team].someNewStat += gameStats.whiteSomeNewStat;

   // In calculateTeamAwards()
   const someNewAward = teams.reduce(...);
   ```

2. **Update interface** in `page.tsx`:
   ```typescript
   teams?: {
     awards: {
       someNewAward: { name: string, value: number } | null
     }
   }
   ```

3. **Update component** in `team-awards-section.tsx`:
   ```tsx
   {someNewAward && (
     <div className="bg-blue-50">
       {someNewAward.name} - {someNewAward.value}
     </div>
   )}
   ```

That's it! No changes to parsing, loading, or other infrastructure.

## Conclusion

Successfully established a clean, extensible foundation for team statistics. The system:
- ✅ Loads team data automatically from API
- ✅ Aggregates player stats by team
- ✅ Calculates two initial team metrics
- ✅ Displays team awards in UI
- ✅ Builds successfully
- ✅ Ready for expansion to 48+ more statistics

Next steps: Pick additional stats from `TEAM_STATS_BRAINSTORM.md` and add them using the extensibility pattern above!
