#!/usr/bin/env node

/**
 * Test script to extract team rosters from season games data
 *
 * This script:
 * 1. Reads season-XX-games.json
 * 2. Extracts team rosters (team -> players mapping)
 * 3. Validates team sizes (should be ~8 players per team)
 * 4. Displays team information
 *
 * Usage:
 *   node scripts/test-team-extraction.js --season=46
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract team rosters from season games data
 * @param {Object} seasonData - Season games data from JSON
 * @returns {Object} Team rosters map: { teamName: { players: Set, games: [] } }
 */
function extractTeamRosters(seasonData) {
  const teams = {};

  // Iterate through all rounds
  for (const [roundNum, games] of Object.entries(seasonData.rounds)) {
    games.forEach(game => {
      const { white, black, white_team, black_team } = game;

      // Initialize team if not exists
      if (!teams[white_team]) {
        teams[white_team] = {
          players: new Set(),
          games: []
        };
      }
      if (!teams[black_team]) {
        teams[black_team] = {
          players: new Set(),
          games: []
        };
      }

      // Add players to their teams
      teams[white_team].players.add(white);
      teams[black_team].players.add(black);

      // Track games
      teams[white_team].games.push({
        round: roundNum,
        player: white,
        opponent: black,
        opponentTeam: black_team,
        color: 'white',
        result: game.result,
        game_id: game.game_id
      });

      teams[black_team].games.push({
        round: roundNum,
        player: black,
        opponent: white,
        opponentTeam: white_team,
        color: 'black',
        result: game.result,
        game_id: game.game_id
      });
    });
  }

  // Convert Sets to Arrays for easier manipulation
  for (const teamName in teams) {
    teams[teamName].players = Array.from(teams[teamName].players).sort();
  }

  return teams;
}

/**
 * Calculate team statistics
 * @param {Object} teams - Team rosters with games
 * @returns {Object} Team statistics
 */
function calculateTeamStats(teams) {
  const stats = {};

  for (const [teamName, teamData] of Object.entries(teams)) {
    const { players, games } = teamData;

    // Calculate wins/losses/draws
    let wins = 0, losses = 0, draws = 0;

    games.forEach(game => {
      const result = game.result;
      const isWhite = game.color === 'white';

      if (result === '1/2-1/2') {
        draws++;
      } else if (
        (result === '1-0' && isWhite) ||
        (result === '0-1' && !isWhite)
      ) {
        wins++;
      } else {
        losses++;
      }
    });

    stats[teamName] = {
      playerCount: players.length,
      totalGames: games.length,
      wins,
      losses,
      draws,
      winRate: games.length > 0 ? (wins / games.length * 100).toFixed(1) : 0,
      players
    };
  }

  return stats;
}

/**
 * Display team information in a readable format
 * @param {Object} teamStats - Team statistics
 */
function displayTeamInfo(teamStats) {
  const teams = Object.entries(teamStats)
    .sort((a, b) => b[1].wins - a[1].wins); // Sort by wins

  console.log('\n📊 TEAM ROSTERS & STATISTICS\n');
  console.log('='.repeat(80));

  teams.forEach(([teamName, stats], index) => {
    console.log(`\n${index + 1}. ${teamName}`);
    console.log('-'.repeat(80));
    console.log(`   Players (${stats.playerCount}): ${stats.players.join(', ')}`);
    console.log(`   Games: ${stats.totalGames} | W: ${stats.wins} | L: ${stats.losses} | D: ${stats.draws}`);
    console.log(`   Win Rate: ${stats.winRate}%`);
  });

  console.log('\n' + '='.repeat(80));

  // Summary
  const totalTeams = teams.length;
  const avgPlayersPerTeam = (teams.reduce((sum, [, s]) => sum + s.playerCount, 0) / totalTeams).toFixed(1);
  const teamsWith8Players = teams.filter(([, s]) => s.playerCount === 8).length;

  console.log(`\n📈 SUMMARY`);
  console.log(`   Total Teams: ${totalTeams}`);
  console.log(`   Average Players per Team: ${avgPlayersPerTeam}`);
  console.log(`   Teams with exactly 8 players: ${teamsWith8Players}/${totalTeams}`);
  console.log('');
}

/**
 * Save team rosters to JSON file
 * @param {Object} teams - Team rosters
 * @param {number} season - Season number
 */
function saveTeamRosters(teams, season) {
  const dataDir = path.join(__dirname, '..', 'data');
  const outputPath = path.join(dataDir, `season-${season}-teams.json`);

  // Convert to a cleaner format for saving
  const teamRosters = {};
  for (const [teamName, teamData] of Object.entries(teams)) {
    teamRosters[teamName] = {
      players: teamData.players,
      gameCount: teamData.games.length
    };
  }

  const output = {
    season,
    generatedAt: new Date().toISOString(),
    totalTeams: Object.keys(teamRosters).length,
    teams: teamRosters
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n💾 Team rosters saved to: ${outputPath}`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const seasonArg = args.find(arg => arg.startsWith('--season='));

  if (!seasonArg) {
    console.error('Usage: node scripts/test-team-extraction.js --season=46');
    process.exit(1);
  }

  const season = seasonArg.split('=')[1];
  const dataDir = path.join(__dirname, '..', 'data');
  const inputPath = path.join(dataDir, `season-${season}-games.json`);

  // Check if file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    console.error(`   Run: node scripts/fetch-lichess-season.js --season=${season}`);
    process.exit(1);
  }

  console.log(`🎯 Lichess 4545 - Team Roster Extraction`);
  console.log(`   Season: ${season}`);
  console.log(`   Input: ${inputPath}\n`);

  // Load season data
  const seasonData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`✓ Loaded ${seasonData.totalGames} games`);

  // Extract team rosters
  const teams = extractTeamRosters(seasonData);
  console.log(`✓ Extracted ${Object.keys(teams).length} teams`);

  // Calculate statistics
  const teamStats = calculateTeamStats(teams);

  // Display information
  displayTeamInfo(teamStats);

  // Save to file
  saveTeamRosters(teams, season);

  console.log(`\n✅ Done!`);
}

if (require.main === module) {
  main();
}

module.exports = { extractTeamRosters, calculateTeamStats };
