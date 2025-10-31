#!/usr/bin/env node

/**
 * Downloads PGNs from Lichess.org for a season/round
 *
 * Usage:
 *   node scripts/download-pgns.js --season=46 --round=1
 *
 * Input:
 *   data/season-46-games.json (from fetch-lichess-season.js)
 *
 * Output:
 *   data/season-46-round-1.pgn (combined PGN file)
 */

const fs = require('fs');
const path = require('path');

// Rate limiting helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadPGN(gameId) {
  const url = `https://lichess.org/game/export/${gameId}?evals=true&clocks=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  ⚠️  Failed to fetch ${gameId}: HTTP ${response.status}`);
      return null;
    }

    const pgn = await response.text();
    return pgn;
  } catch (error) {
    console.warn(`  ⚠️  Error fetching ${gameId}: ${error.message}`);
    return null;
  }
}

async function downloadRoundPGNs(season, round) {
  const dataPath = path.join(__dirname, '..', 'data', `season-${season}-games.json`);

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Season data not found: ${dataPath}`);
    console.error('   Run fetch-lichess-season.js first');
    process.exit(1);
  }

  const seasonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const roundGames = seasonData.rounds[round];

  if (!roundGames) {
    console.error(`❌ Round ${round} not found in Season ${season}`);
    console.error(`   Available rounds: ${Object.keys(seasonData.rounds).sort((a, b) => parseInt(a) - parseInt(b)).join(', ')}`);
    process.exit(1);
  }

  console.log(`📥 Downloading ${roundGames.length} PGNs for Season ${season}, Round ${round}...`);
  console.log(`   Rate limit: 1 request per 100ms (Lichess.org courtesy)`);

  const pgns = [];
  let downloaded = 0;
  let failed = 0;

  for (const game of roundGames) {
    if (!game.game_id) {
      failed++;
      continue;
    }

    process.stdout.write(`\r  Progress: ${downloaded + failed}/${roundGames.length} (${downloaded} ok, ${failed} failed)`);

    const pgn = await downloadPGN(game.game_id);
    if (pgn) {
      pgns.push(pgn);
      downloaded++;
    } else {
      failed++;
    }

    // Rate limiting: 100ms between requests (~10 req/sec)
    await sleep(100);
  }

  console.log(`\n✓ Downloaded ${downloaded} PGNs (${failed} failed)`);

  // Combine all PGNs
  const combinedPGN = pgns.join('\n\n');

  // Save to data directory
  const outputPath = path.join(__dirname, '..', 'data', `season-${season}-round-${round}.pgn`);
  fs.writeFileSync(outputPath, combinedPGN, 'utf-8');

  console.log(`\n✅ Saved to ${outputPath}`);
  console.log(`   Size: ${(combinedPGN.length / 1024).toFixed(2)} KB`);
  console.log(`   Games: ${downloaded}`);

  return outputPath;
}

// Parse command line args
const args = process.argv.slice(2);
const seasonArg = args.find(arg => arg.startsWith('--season='));
const roundArg = args.find(arg => arg.startsWith('--round='));

if (!seasonArg || !roundArg) {
  console.error('Usage: node download-pgns.js --season=46 --round=1');
  process.exit(1);
}

const season = seasonArg.split('=')[1];
const round = roundArg.split('=')[1];

downloadRoundPGNs(season, round)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
