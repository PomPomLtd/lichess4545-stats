#!/usr/bin/env node

/**
 * Fetches season game data from Lichess 4545 API
 *
 * Usage:
 *   node scripts/fetch-lichess-season.js --season=46 [--league=team4545]
 *
 * Output:
 *   data/season-46-games.json
 */

const fs = require('fs');
const path = require('path');

async function fetchSeasonGames(league, season) {
  const url = `https://www.lichess4545.com/api/get_season_games/?league=${league}&season=${season}&include_unplayed=False`;

  console.log(`📥 Fetching Season ${season} data from Lichess 4545...`);
  console.log(`   URL: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const games = data.games || [];

  // Filter out unplayed games (no game_id)
  const playedGames = games.filter(g => g.game_id);

  // Group by rounds
  const rounds = {};
  for (const game of playedGames) {
    const round = game.round;
    if (!rounds[round]) {
      rounds[round] = [];
    }
    rounds[round].push(game);
  }

  const roundNumbers = Object.keys(rounds).sort((a, b) => parseInt(a) - parseInt(b));
  console.log(`✓ Found ${playedGames.length} played games across ${roundNumbers.length} rounds`);

  // Display round breakdown
  for (const round of roundNumbers) {
    console.log(`   Round ${round}: ${rounds[round].length} games`);
  }

  // Save to data directory
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, `season-${season}-games.json`);
  const outputData = {
    season: parseInt(season),
    league,
    fetchedAt: new Date().toISOString(),
    totalGames: playedGames.length,
    rounds
  };

  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

  console.log(`\n✅ Saved to ${outputPath}`);

  return outputData;
}

// Parse command line args
const args = process.argv.slice(2);
const seasonArg = args.find(arg => arg.startsWith('--season='));
const leagueArg = args.find(arg => arg.startsWith('--league='));

if (!seasonArg) {
  console.error('Usage: node fetch-lichess-season.js --season=46 [--league=team4545]');
  process.exit(1);
}

const season = seasonArg.split('=')[1];
const league = leagueArg ? leagueArg.split('=')[1] : 'team4545';

fetchSeasonGames(league, season)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
