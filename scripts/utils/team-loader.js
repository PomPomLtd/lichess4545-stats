/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Team Data Loader
 *
 * Loads team roster and game data from season-XX-games.json
 * Provides utilities to map games to teams and aggregate team statistics
 *
 * @module team-loader
 */

const fs = require('fs');
const path = require('path');

/**
 * Load season games data with team information
 * @param {number} season - Season number
 * @returns {Object|null} Season data or null if file doesn't exist
 */
function loadSeasonGames(season) {
  const dataDir = path.join(__dirname, '../../data');
  const filePath = path.join(dataDir, `season-${season}-games.json`);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Team data not found: ${filePath}`);
    console.warn(`   Run: node scripts/fetch-lichess-season.js --season=${season}`);
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data;
  } catch (error) {
    console.error(`❌ Error loading team data: ${error.message}`);
    return null;
  }
}

/**
 * Extract team rosters from season games data
 * @param {Object} seasonData - Season games data
 * @returns {Object} Team rosters map: { teamName: { players: Set, games: [] } }
 */
function extractTeamRosters(seasonData) {
  const teams = {};

  // Iterate through all rounds
  for (const [roundNum, games] of Object.entries(seasonData.rounds)) {
    games.forEach(game => {
      const { white, black, white_team, black_team } = game;

      // Initialize teams if not exists
      if (!teams[white_team]) {
        teams[white_team] = {
          name: white_team,
          players: new Set(),
          games: []
        };
      }
      if (!teams[black_team]) {
        teams[black_team] = {
          name: black_team,
          players: new Set(),
          games: []
        };
      }

      // Add players to their teams
      teams[white_team].players.add(white);
      teams[black_team].players.add(black);

      // Track games for each team
      teams[white_team].games.push({
        round: parseInt(roundNum),
        player: white,
        opponent: black,
        opponentTeam: black_team,
        color: 'white',
        result: game.result,
        game_id: game.game_id
      });

      teams[black_team].games.push({
        round: parseInt(roundNum),
        player: black,
        opponent: white,
        opponentTeam: white_team,
        color: 'black',
        result: game.result,
        game_id: game.game_id
      });
    });
  }

  // Convert Sets to Arrays
  for (const teamName in teams) {
    teams[teamName].players = Array.from(teams[teamName].players).sort();
  }

  return teams;
}

/**
 * Build player-to-team mapping for fast lookups
 * @param {Object} teamRosters - Team rosters from extractTeamRosters
 * @returns {Object} Map of player username to team name
 */
function buildPlayerTeamMap(teamRosters) {
  const playerTeamMap = {};

  for (const [teamName, teamData] of Object.entries(teamRosters)) {
    teamData.players.forEach(player => {
      playerTeamMap[player] = teamName;
    });
  }

  return playerTeamMap;
}

/**
 * Get team name for a player (with fallback)
 * @param {string} playerName - Player username
 * @param {Object} playerTeamMap - Player to team mapping
 * @returns {string} Team name or 'Unknown Team'
 */
function getTeamForPlayer(playerName, playerTeamMap) {
  return playerTeamMap[playerName] || 'Unknown Team';
}

/**
 * Filter games for a specific round
 * @param {Object} teamRosters - Team rosters with all games
 * @param {number} roundNumber - Round number to filter
 * @returns {Object} Team rosters with only games from specified round
 */
function filterTeamGamesByRound(teamRosters, roundNumber) {
  const filtered = {};

  for (const [teamName, teamData] of Object.entries(teamRosters)) {
    filtered[teamName] = {
      ...teamData,
      games: teamData.games.filter(g => g.round === roundNumber)
    };
  }

  return filtered;
}

module.exports = {
  loadSeasonGames,
  extractTeamRosters,
  buildPlayerTeamMap,
  getTeamForPlayer,
  filterTeamGamesByRound
};
