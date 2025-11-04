#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Stats Generation Script
 *
 * Generates comprehensive chess statistics from PGN data.
 *
 * Usage:
 *   node scripts/generate-stats.js --round 1
 *   node scripts/generate-stats.js --round 2 --season 2
 *
 * @module generate-stats
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseMultipleGames } = require('./utils/pgn-parser');
const { calculateStats } = require('./utils/stats-calculator');
const { loadSeasonGames, extractTeamRosters, buildPlayerTeamMap, filterTeamGamesByRound } = require('./utils/team-loader');

// Get Python command (venv if available, otherwise system python3)
function getPythonCommand() {
  const venvPython = path.join(__dirname, '..', 'venv', 'bin', 'python');
  if (fs.existsSync(venvPython)) {
    return venvPython;
  }
  return 'python3';
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    round: null,
    season: null, // Required parameter
    analyze: false, // Stockfish analysis flag
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--round' || args[i] === '-r') {
      options.round = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--season' || args[i] === '-s') {
      options.season = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--analyze' || args[i] === '-a') {
      options.analyze = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }

  return options;
}

// Display help
function showHelp() {
  console.log(`
Lichess 4545 League - Statistics Generator

Usage:
  node scripts/generate-stats.js --round <number> --season <number> [--analyze]

Options:
  --round, -r <number>   Round number to generate stats for (required)
  --season, -s <number>  Season number (required)
  --analyze, -a          Run Stockfish analysis (optional, requires python-chess)
  --help, -h             Show this help message

Examples:
  node scripts/generate-stats.js --round 1 --season 46
  node scripts/generate-stats.js --round 1 --season 46 --analyze

Workflow:
  1. Fetch season data:    node scripts/fetch-lichess-season.js --season=46
  2. Download PGNs:        node scripts/download-pgns.js --season=46 --round=1
  3. Generate stats:       node scripts/generate-stats.js --round 1 --season 46
  4. Generate overview:    node scripts/generate-overview.js --season 46

Output:
  Generates JSON file at: public/stats/season-<season>-round-<round>.json

Note:
  PGNs from Lichess.org already include Stockfish evaluations.
  The --analyze flag runs additional local analysis (depth 15).
  `);
}

// Fetch PGN data from data directory
async function fetchPGN(roundNumber, seasonNumber) {
  console.log(`📥 Fetching PGN data for Season ${seasonNumber}, Round ${roundNumber}...`);

  // Read from data directory
  const pgnFile = path.join(__dirname, '..', 'data', `season-${seasonNumber}-round-${roundNumber}.pgn`);

  if (!fs.existsSync(pgnFile)) {
    throw new Error(
      `PGN file not found: ${pgnFile}\n` +
      `Please run: node scripts/download-pgns.js --season=${seasonNumber} --round=${roundNumber}`
    );
  }

  const pgnData = fs.readFileSync(pgnFile, 'utf-8');
  console.log(`✅ PGN data loaded (${pgnData.length} bytes)`);

  return pgnData;
}

// Run tactical analysis on parsed games (pins, forks, skewers)
function analyzeTactics(parsedGames) {
  const startTime = Date.now();

  try {
    // Extract normalized PGN from parsed games
    const normalizedPgn = parsedGames.map(g => g.pgn).join('\n\n');

    console.log('🎯 Running tactical analysis (pins, forks, skewers)...');

    // Run Python tactical analyzer
    const tacticsOutput = execSync(
      `${getPythonCommand()} scripts/analyze-tactics.py`,
      {
        input: normalizedPgn,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        cwd: path.join(__dirname, '..'),
        stdio: ['pipe', 'pipe', 'inherit'] // stdin: pipe, stdout: pipe, stderr: inherit (show progress)
      }
    );

    const tacticsData = JSON.parse(tacticsOutput);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`✅ Tactical analysis complete in ${elapsed}s`);

    return tacticsData;

  } catch (error) {
    console.error('❌ Tactical analysis failed:', error.message);
    if (error.stderr) {
      console.error('Error output:', error.stderr);
    }
    throw error;
  }
}

// Run Stockfish analysis on parsed games
function analyzeGames(parsedGames) {
  const startTime = Date.now();

  try {
    // Extract normalized PGN from parsed games
    const normalizedPgn = parsedGames.map(g => g.pgn).join('\n\n');

    console.log('\n🔬 Running Stockfish analysis (accuracy, blunders)...');

    // Run Python analyzer (depth 15, analyze all moves for maximum accuracy)
    const analysisOutput = execSync(
      `${getPythonCommand()} scripts/analyze-pgn.py --depth 15 --sample 1`,
      {
        input: normalizedPgn,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        cwd: path.join(__dirname, '..'),
        stdio: ['pipe', 'pipe', 'inherit'] // stdin: pipe, stdout: pipe, stderr: inherit (show progress)
      }
    );

    const analysisData = JSON.parse(analysisOutput);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`✅ Stockfish analysis complete in ${elapsed}s`);
    console.log(`📊 Games analyzed: ${analysisData.games.length}`);

    if (analysisData.summary.accuracyKing) {
      const king = analysisData.summary.accuracyKing;
      const playerName = king.player === 'white' ? king.white : king.black;
      console.log(`👑 Accuracy King: ${playerName} (${king.accuracy}% accuracy, ${king.acpl} ACPL)`);
    }

    return analysisData;

  } catch (error) {
    console.error('❌ Stockfish analysis failed:', error.message);
    if (error.stderr) {
      console.error('Error output:', error.stderr);
    }
    throw error;
  }
}

// Main execution
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (!options.round || !options.season) {
    console.error('❌ Error: --round and --season parameters are required\n');
    showHelp();
    process.exit(1);
  }

  console.log('🎯 Lichess 4545 League - Stats Generator\n');
  console.log(`Season: ${options.season}`);
  console.log(`Round: ${options.round}\n`);

  const startTime = Date.now();

  try {
    // Step 1: Fetch PGN data
    const pgnData = await fetchPGN(options.round, options.season);

    // Step 2: Parse PGN
    console.log('🔍 Parsing PGN data...');
    const parseResults = parseMultipleGames(pgnData);

    console.log(`✅ Parsed ${parseResults.validCount}/${parseResults.totalGames} games successfully`);

    if (parseResults.errorCount > 0) {
      console.warn(`⚠️  ${parseResults.errorCount} games failed to parse`);
      parseResults.errors.forEach(err => {
        console.warn(`   Game ${err.gameIndex + 1}: Parse error`);
      });
    }

    // Step 3: Run tactical analysis (optional - requires python-chess)
    let tacticsData = null;
    try {
      console.log('');
      tacticsData = analyzeTactics(parseResults.valid);
    } catch (error) {
      console.log('\n⚠️  Skipping tactical analysis (python-chess not available - optional)');
      console.log(`   Error: ${error.message}`);
    }

    // Step 4: Run Stockfish analysis (optional - slow!)
    let analysisData = null;
    if (options.analyze) {
      analysisData = analyzeGames(parseResults.valid);
    }

    // Step 5: Load team data (optional - for team statistics)
    console.log('\n👥 Loading team data...');
    let teamData = null;
    const seasonGames = loadSeasonGames(options.season);
    if (seasonGames) {
      const allTeamRosters = extractTeamRosters(seasonGames);
      const teamRosters = filterTeamGamesByRound(allTeamRosters, options.round);
      const playerTeamMap = buildPlayerTeamMap(allTeamRosters);

      teamData = {
        rosters: teamRosters,
        playerTeamMap
      };

      console.log(`✅ Loaded ${Object.keys(teamRosters).length} teams`);
    } else {
      console.log('⚠️  Team data not available - skipping team statistics');
    }

    // Step 6: Calculate statistics (pass tactical data and team data)
    console.log('\n📊 Calculating statistics...');
    const stats = calculateStats(parseResults.valid, options.round, options.season, tacticsData, teamData);

    // Step 6: Merge tactical and analysis data into stats
    if (tacticsData) {
      stats.tacticalPatterns = tacticsData;
      console.log('✅ Tactical data merged into stats');
    }
    if (analysisData) {
      stats.analysis = analysisData;
      console.log('✅ Stockfish analysis data merged into stats');
    }

    // Step 7: Save to JSON file
    const outputDir = path.join(__dirname, '../public/stats');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, `season-${options.season}-round-${options.round}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(stats, null, 2));

    const fileSize = (fs.statSync(outputFile).size / 1024).toFixed(2);
    console.log(`✅ Stats saved to: ${outputFile}`);
    console.log(`📦 File size: ${fileSize} KB`);

    // Step 5: Display summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Completed in ${duration}s\n`);

    console.log('📈 Statistics Summary:');
    console.log(`   Games: ${stats.overview.totalGames}`);
    console.log(`   Total Moves: ${stats.overview.totalMoves}`);
    console.log(`   Avg Game Length: ${stats.overview.averageGameLength.toFixed(1)} moves`);
    console.log(`   White Wins: ${stats.results.whiteWins} (${stats.results.whiteWinPercentage.toFixed(1)}%)`);
    console.log(`   Black Wins: ${stats.results.blackWins} (${stats.results.blackWinPercentage.toFixed(1)}%)`);
    console.log(`   Draws: ${stats.results.draws} (${stats.results.drawPercentage.toFixed(1)}%)`);
    console.log(`   Total Captures: ${stats.tactics.totalCaptures}`);
    console.log(`   En Passant Games: ${stats.tactics.enPassantGames.length}`);
    console.log(`   Promotions: ${stats.tactics.promotions}`);

    console.log('\n🏆 Awards:');
    console.log(`   🩸 Bloodbath: ${stats.awards.bloodbath.white} vs ${stats.awards.bloodbath.black} (${stats.awards.bloodbath.captures} captures)`);
    console.log(`   🕊️  Pacifist: ${stats.awards.pacifist.white} vs ${stats.awards.pacifist.black} (${stats.awards.pacifist.captures} captures)`);
    if (stats.awards.speedDemon) {
      console.log(`   ⚡ Speed Demon: ${stats.awards.speedDemon.white} vs ${stats.awards.speedDemon.black} (mate in ${stats.awards.speedDemon.moves} moves)`);
    }
    console.log(`   🧙 Endgame Wizard: ${stats.awards.endgameWizard.white} vs ${stats.awards.endgameWizard.black} (${stats.awards.endgameWizard.endgameMoves} moves)`);

    console.log('\n🗺️  Board Heatmap:');
    console.log(`   🩸 Bloodiest Square: ${stats.boardHeatmap.bloodiestSquare.square} (${stats.boardHeatmap.bloodiestSquare.captures} captures)`);
    console.log(`   🔥 Most Popular: ${stats.boardHeatmap.mostPopularSquare.square} (${stats.boardHeatmap.mostPopularSquare.visits} visits)`);
    console.log(`   🏜️  Least Popular: ${stats.boardHeatmap.leastPopularSquare.square} (${stats.boardHeatmap.leastPopularSquare.visits} visits)`);
    if (stats.boardHeatmap.quietestSquares.length > 0) {
      console.log(`   😴 Never Visited: ${stats.boardHeatmap.quietestSquares.join(', ')}`);
    } else {
      console.log(`   ✨ All squares saw action!`);
    }

    if (tacticsData && tacticsData.summary) {
      console.log('\n🐔 Chicken Awards:');
      if (tacticsData.summary.homebody) {
        const h = tacticsData.summary.homebody;
        const name = h.player === 'white' ? h.white : h.black;
        console.log(`   🏠 Homeboy: ${name} (${h.piecesInEnemy} pieces in enemy territory)`);
      }
      if (tacticsData.summary.lateBloomer) {
        const lb = tacticsData.summary.lateBloomer;
        const name = lb.player === 'white' ? lb.white : lb.black;
        console.log(`   🐢 Late Bloomer: ${name} (first invasion move ${Math.floor((lb.moveNumber + 1) / 2)})`);
      }
      if (tacticsData.summary.quickDraw) {
        const qd = tacticsData.summary.quickDraw;
        const name = qd.player === 'white' ? qd.white : qd.black;
        console.log(`   🔫 Fastest Gun: ${name} (first invasion move ${Math.floor((qd.moveNumber + 1) / 2)})`);
      }
    }

    if (stats.teams) {
      console.log('\n👥 Team Awards:');
      const a = stats.teams.awards;

      if (a.bloodthirstyTeam) {
        console.log(`   🩸 Bloodthirsty Team: ${a.bloodthirstyTeam.name} (${a.bloodthirstyTeam.totalCaptures} captures, ${a.bloodthirstyTeam.averagePerGame} avg)`);
      }
      if (a.pawnCrackers) {
        console.log(`   🦐 Pawn Crackers: ${a.pawnCrackers.name} (${a.pawnCrackers.pawnCaptures} pawn captures, ${a.pawnCrackers.averagePerGame} avg)`);
      }
      if (a.lateKnightShow) {
        console.log(`   🌙 The Late Knight Show: ${a.lateKnightShow.name} (${a.lateKnightShow.lateKnightMoves} late knight moves, ${a.lateKnightShow.averagePerGame} avg)`);
      }
      if (a.castlingSpeed) {
        console.log(`   ⚡ Castling Speed: ${a.castlingSpeed.name} (avg move ${a.castlingSpeed.averageCastlingMove})`);
      }
      if (a.spaceInvaders) {
        console.log(`   🚀 Space Invaders: ${a.spaceInvaders.name} (${a.spaceInvaders.invasionMoves} invasion moves, ${a.spaceInvaders.averagePerGame} avg)`);
      }
      if (a.checkMasters) {
        console.log(`   ⚔️ Check Masters: ${a.checkMasters.name} (${a.checkMasters.checksDelivered} checks delivered, ${a.checkMasters.averagePerGame} avg)`);
      }
      if (a.cornerConquerors) {
        console.log(`   🔲 Corner Conquerors: ${a.cornerConquerors.name} (${a.cornerConquerors.cornerMoves} corner moves, ${a.cornerConquerors.averagePerGame} avg)`);
      }
      if (a.marathonRunners) {
        console.log(`   🏃 Marathon Runners: ${a.marathonRunners.name} (${a.marathonRunners.averageGameLength} avg moves/game)`);
      }
      if (a.speedDemons) {
        console.log(`   💨 Speed Demons: ${a.speedDemons.name} (${a.speedDemons.averageGameLength} avg moves/game)`);
      }
      if (a.chickenTeam) {
        console.log(`   🐔 Chicken Team: ${a.chickenTeam.name} (${a.chickenTeam.retreatingMoves} retreating moves, ${a.chickenTeam.averagePerGame} avg)`);
      }
      if (a.nonChickenTeam) {
        console.log(`   🚫🐔 Non-Chicken Team: ${a.nonChickenTeam.name} (${a.nonChickenTeam.retreatingMoves} retreating moves, ${a.nonChickenTeam.averagePerGame} avg)`);
      }
      if (a.promotionParty) {
        console.log(`   👑 Promotion Party: ${a.promotionParty.name} (${a.promotionParty.promotions} promotions, ${a.promotionParty.averagePerGame} avg)`);
      }
    }

    console.log('\n✅ Done! Stats are ready to use.\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error generating stats:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, parseArgs, fetchPGN };
