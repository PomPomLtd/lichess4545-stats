/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Team Statistics Calculator
 *
 * Calculates aggregate statistics for teams based on individual game data.
 * Maps parsed games to teams and computes team-level metrics.
 *
 * @module teams-calculator
 */

const { getPlayerNames } = require('./helpers');

/**
 * Corner squares on the chessboard
 */
const CORNER_SQUARES = new Set(['a1', 'a8', 'h1', 'h8']);

/**
 * Calculate team statistics from parsed games
 *
 * @param {Array} parsedGames - Array of parsed game objects
 * @param {Object} teamRosters - Team rosters from team-loader
 * @param {Object} playerTeamMap - Player to team mapping from team-loader
 * @returns {Object} Team statistics
 */
function calculateTeamStats(parsedGames, teamRosters, playerTeamMap) {
  // Initialize team stats
  const teamStats = {};

  for (const teamName of Object.keys(teamRosters)) {
    teamStats[teamName] = {
      name: teamName,
      playerCount: teamRosters[teamName].players.length,
      totalGames: 0,
      totalMoves: 0,
      totalCaptures: 0,
      pawnCaptures: 0,
      lateKnightMoves: 0,
      castlingMoveNumbers: [], // Store move numbers when castling occurred
      piecesInEnemyHalf: 0,
      checksDelivered: 0, // Checks delivered to opponent king
      cornerActivity: 0,
      retreatingMoves: 0, // Moves toward own side (chicken behavior)
      promotions: 0, // Pawn promotions
      games: [] // Will store game-level details
    };
  }

  // Process each game
  parsedGames.forEach(game => {
    const { white, black } = getPlayerNames(game);
    const whiteTeam = playerTeamMap[white];
    const blackTeam = playerTeamMap[black];

    // Skip if teams not found
    if (!whiteTeam || !blackTeam) {
      return;
    }

    // Track total games
    if (teamStats[whiteTeam]) teamStats[whiteTeam].totalGames++;
    if (teamStats[blackTeam]) teamStats[blackTeam].totalGames++;

    // Calculate per-game stats
    const gameStats = calculateGameTeamStats(game);

    // Aggregate white team stats
    if (teamStats[whiteTeam]) {
      teamStats[whiteTeam].totalMoves += gameStats.whiteMoves;
      teamStats[whiteTeam].totalCaptures += gameStats.whiteCaptures;
      teamStats[whiteTeam].pawnCaptures += gameStats.whitePawnCaptures;
      teamStats[whiteTeam].lateKnightMoves += gameStats.whiteLateKnightMoves;
      teamStats[whiteTeam].piecesInEnemyHalf += gameStats.whitePiecesInEnemyHalf;
      teamStats[whiteTeam].checksDelivered += gameStats.whiteChecksDelivered;
      teamStats[whiteTeam].cornerActivity += gameStats.whiteCornerActivity;
      teamStats[whiteTeam].retreatingMoves += gameStats.whiteRetreatingMoves;
      teamStats[whiteTeam].promotions += gameStats.whitePromotions;

      if (gameStats.whiteCastlingMove !== null) {
        teamStats[whiteTeam].castlingMoveNumbers.push(gameStats.whiteCastlingMove);
      }

      teamStats[whiteTeam].games.push({
        player: white,
        opponent: black,
        color: 'white',
        result: game.result,
        moves: gameStats.whiteMoves
      });
    }

    // Aggregate black team stats
    if (teamStats[blackTeam]) {
      teamStats[blackTeam].totalMoves += gameStats.blackMoves;
      teamStats[blackTeam].totalCaptures += gameStats.blackCaptures;
      teamStats[blackTeam].pawnCaptures += gameStats.blackPawnCaptures;
      teamStats[blackTeam].lateKnightMoves += gameStats.blackLateKnightMoves;
      teamStats[blackTeam].piecesInEnemyHalf += gameStats.blackPiecesInEnemyHalf;
      teamStats[blackTeam].checksDelivered += gameStats.blackChecksDelivered;
      teamStats[blackTeam].cornerActivity += gameStats.blackCornerActivity;
      teamStats[blackTeam].retreatingMoves += gameStats.blackRetreatingMoves;
      teamStats[blackTeam].promotions += gameStats.blackPromotions;

      if (gameStats.blackCastlingMove !== null) {
        teamStats[blackTeam].castlingMoveNumbers.push(gameStats.blackCastlingMove);
      }

      teamStats[blackTeam].games.push({
        player: black,
        opponent: white,
        color: 'black',
        result: game.result,
        moves: gameStats.blackMoves
      });
    }
  });

  // Calculate averages
  for (const teamName in teamStats) {
    const team = teamStats[teamName];

    if (team.totalGames > 0) {
      team.averageGameLength = team.totalMoves / team.totalGames;

      if (team.castlingMoveNumbers.length > 0) {
        const sum = team.castlingMoveNumbers.reduce((a, b) => a + b, 0);
        team.averageCastlingMove = sum / team.castlingMoveNumbers.length;
      } else {
        team.averageCastlingMove = null;
      }
    }
  }

  return teamStats;
}

/**
 * Calculate team-relevant stats for a single game
 *
 * @param {Object} game - Parsed game object
 * @returns {Object} Game stats broken down by color
 */
function calculateGameTeamStats(game) {
  const moveList = game.moveList || [];

  let whiteCaptures = 0;
  let blackCaptures = 0;
  let whitePawnCaptures = 0;
  let blackPawnCaptures = 0;
  let whiteLateKnightMoves = 0;
  let blackLateKnightMoves = 0;
  let whiteCastlingMove = null;
  let blackCastlingMove = null;
  let whitePiecesInEnemyHalf = 0;
  let blackPiecesInEnemyHalf = 0;
  let whiteChecksDelivered = 0;
  let blackChecksDelivered = 0;
  let whiteCornerActivity = 0;
  let blackCornerActivity = 0;
  let whiteRetreatingMoves = 0;
  let blackRetreatingMoves = 0;
  let whitePromotions = 0;
  let blackPromotions = 0;

  // Count moves per color
  let whiteMoves = 0;
  let blackMoves = 0;

  moveList.forEach((move, index) => {
    const isWhite = move.color === 'w';
    const moveNumber = Math.floor(index / 2) + 1;

    // Count moves
    if (isWhite) {
      whiteMoves++;
    } else {
      blackMoves++;
    }

    // Count checks delivered (check SAN for + or #)
    if (move.san && (move.san.includes('+') || move.san.includes('#'))) {
      if (isWhite) {
        whiteChecksDelivered++;
      } else {
        blackChecksDelivered++;
      }
    }

    // Count promotions
    if (move.promotion) {
      if (isWhite) {
        whitePromotions++;
      } else {
        blackPromotions++;
      }
    }

    // Count captures
    if (move.captured) {
      if (isWhite) {
        whiteCaptures++;
        // Check if capturing piece is a pawn
        if (move.piece === 'p') {
          whitePawnCaptures++;
        }
      } else {
        blackCaptures++;
        if (move.piece === 'p') {
          blackPawnCaptures++;
        }
      }
    }

    // Count late knight moves (after move 30)
    if (move.piece === 'n' && moveNumber > 30) {
      if (isWhite) {
        whiteLateKnightMoves++;
      } else {
        blackLateKnightMoves++;
      }
    }

    // Track castling move number (first occurrence)
    if (move.flags.includes('k') || move.flags.includes('q')) {
      if (isWhite && whiteCastlingMove === null) {
        whiteCastlingMove = moveNumber;
      } else if (!isWhite && blackCastlingMove === null) {
        blackCastlingMove = moveNumber;
      }
    }

    // Count pieces in enemy half (based on destination square)
    const toRank = parseInt(move.to[1]);
    if (isWhite && toRank >= 5) {
      whitePiecesInEnemyHalf++;
    } else if (!isWhite && toRank <= 4) {
      blackPiecesInEnemyHalf++;
    }

    // Count corner activity (moves to or from corner squares)
    if (CORNER_SQUARES.has(move.from) || CORNER_SQUARES.has(move.to)) {
      if (isWhite) {
        whiteCornerActivity++;
      } else {
        blackCornerActivity++;
      }
    }

    // Count retreating moves (moves toward own side)
    const fromRank = parseInt(move.from[1]);
    // toRank already declared above for enemy half calculation

    if (isWhite && toRank < fromRank) {
      // White moving toward rank 1 (backward)
      whiteRetreatingMoves++;
    } else if (!isWhite && toRank > fromRank) {
      // Black moving toward rank 8 (backward)
      blackRetreatingMoves++;
    }
  });

  return {
    whiteMoves,
    blackMoves,
    whiteCaptures,
    blackCaptures,
    whitePawnCaptures,
    blackPawnCaptures,
    whiteLateKnightMoves,
    blackLateKnightMoves,
    whiteCastlingMove,
    blackCastlingMove,
    whitePiecesInEnemyHalf,
    blackPiecesInEnemyHalf,
    whiteChecksDelivered,
    blackChecksDelivered,
    whiteCornerActivity,
    blackCornerActivity,
    whiteRetreatingMoves,
    blackRetreatingMoves,
    whitePromotions,
    blackPromotions
  };
}

/**
 * Find team awards based on calculated stats
 *
 * @param {Object} teamStats - Team statistics from calculateTeamStats
 * @returns {Object} Team awards
 */
function calculateTeamAwards(teamStats) {
  const teams = Object.values(teamStats);

  // Filter out teams with no games
  const teamsWithGames = teams.filter(t => t.totalGames > 0);

  if (teamsWithGames.length === 0) {
    return {
      bloodthirstyTeam: null,
      lateKnightShow: null,
      pawnCrackers: null,
      castlingSpeed: null,
      spaceInvaders: null,
      checkMasters: null,
      cornerConquerors: null,
      marathonRunners: null,
      speedDemons: null,
      chickenTeam: null,
      nonChickenTeam: null,
      promotionParty: null
    };
  }

  // Find Bloodthirsty Team (most total captures)
  const bloodthirstyTeam = teamsWithGames.reduce((max, team) => {
    return team.totalCaptures > max.totalCaptures ? team : max;
  }, teamsWithGames[0]);

  // Find The Late Knight Show (most knight moves after move 30)
  const lateKnightShow = teamsWithGames.reduce((max, team) => {
    return team.lateKnightMoves > max.lateKnightMoves ? team : max;
  }, teamsWithGames[0]);

  // Find Pawn Crackers (most pawn captures)
  const pawnCrackers = teamsWithGames.reduce((max, team) => {
    return team.pawnCaptures > max.pawnCaptures ? team : max;
  }, teamsWithGames[0]);

  // Find Castling Speed (earliest average castling move)
  const teamsWithCastling = teamsWithGames.filter(t => t.averageCastlingMove !== null);
  const castlingSpeed = teamsWithCastling.length > 0
    ? teamsWithCastling.reduce((min, team) => {
        return team.averageCastlingMove < min.averageCastlingMove ? team : min;
      }, teamsWithCastling[0])
    : null;

  // Find Space Invaders (most pieces in enemy half)
  const spaceInvaders = teamsWithGames.reduce((max, team) => {
    return team.piecesInEnemyHalf > max.piecesInEnemyHalf ? team : max;
  }, teamsWithGames[0]);

  // Find Check Masters (most checks delivered)
  const checkMasters = teamsWithGames.reduce((max, team) => {
    return team.checksDelivered > max.checksDelivered ? team : max;
  }, teamsWithGames[0]);

  // Find Corner Conquerors (most corner activity)
  const cornerConquerors = teamsWithGames.reduce((max, team) => {
    return team.cornerActivity > max.cornerActivity ? team : max;
  }, teamsWithGames[0]);

  // Find Marathon Runners (longest average game)
  const marathonRunners = teamsWithGames.reduce((max, team) => {
    return team.averageGameLength > max.averageGameLength ? team : max;
  }, teamsWithGames[0]);

  // Find Speed Demons (shortest average game)
  const speedDemons = teamsWithGames.reduce((min, team) => {
    return team.averageGameLength < min.averageGameLength ? team : min;
  }, teamsWithGames[0]);

  // Find Chicken Team (most retreating moves)
  const chickenTeam = teamsWithGames.reduce((max, team) => {
    return team.retreatingMoves > max.retreatingMoves ? team : max;
  }, teamsWithGames[0]);

  // Find Non-Chicken Team (fewest retreating moves)
  const nonChickenTeam = teamsWithGames.reduce((min, team) => {
    return team.retreatingMoves < min.retreatingMoves ? team : min;
  }, teamsWithGames[0]);

  // Find Promotion Party (most pawn promotions)
  const promotionParty = teamsWithGames.reduce((max, team) => {
    return team.promotions > max.promotions ? team : max;
  }, teamsWithGames[0]);

  return {
    bloodthirstyTeam: {
      name: bloodthirstyTeam.name,
      totalCaptures: bloodthirstyTeam.totalCaptures,
      averagePerGame: (bloodthirstyTeam.totalCaptures / bloodthirstyTeam.totalGames).toFixed(1),
      playerCount: bloodthirstyTeam.playerCount
    },
    lateKnightShow: {
      name: lateKnightShow.name,
      lateKnightMoves: lateKnightShow.lateKnightMoves,
      averagePerGame: (lateKnightShow.lateKnightMoves / lateKnightShow.totalGames).toFixed(1),
      playerCount: lateKnightShow.playerCount
    },
    pawnCrackers: {
      name: pawnCrackers.name,
      pawnCaptures: pawnCrackers.pawnCaptures,
      averagePerGame: (pawnCrackers.pawnCaptures / pawnCrackers.totalGames).toFixed(1),
      playerCount: pawnCrackers.playerCount
    },
    castlingSpeed: castlingSpeed ? {
      name: castlingSpeed.name,
      averageCastlingMove: castlingSpeed.averageCastlingMove.toFixed(1),
      castlingGames: castlingSpeed.castlingMoveNumbers.length,
      playerCount: castlingSpeed.playerCount
    } : null,
    spaceInvaders: {
      name: spaceInvaders.name,
      invasionMoves: spaceInvaders.piecesInEnemyHalf,
      averagePerGame: (spaceInvaders.piecesInEnemyHalf / spaceInvaders.totalGames).toFixed(1),
      playerCount: spaceInvaders.playerCount
    },
    checkMasters: {
      name: checkMasters.name,
      checksDelivered: checkMasters.checksDelivered,
      averagePerGame: (checkMasters.checksDelivered / checkMasters.totalGames).toFixed(1),
      playerCount: checkMasters.playerCount
    },
    cornerConquerors: {
      name: cornerConquerors.name,
      cornerMoves: cornerConquerors.cornerActivity,
      averagePerGame: (cornerConquerors.cornerActivity / cornerConquerors.totalGames).toFixed(1),
      playerCount: cornerConquerors.playerCount
    },
    marathonRunners: {
      name: marathonRunners.name,
      averageGameLength: marathonRunners.averageGameLength.toFixed(1),
      playerCount: marathonRunners.playerCount
    },
    speedDemons: {
      name: speedDemons.name,
      averageGameLength: speedDemons.averageGameLength.toFixed(1),
      playerCount: speedDemons.playerCount
    },
    chickenTeam: {
      name: chickenTeam.name,
      retreatingMoves: chickenTeam.retreatingMoves,
      averagePerGame: (chickenTeam.retreatingMoves / chickenTeam.totalGames).toFixed(1),
      playerCount: chickenTeam.playerCount
    },
    nonChickenTeam: {
      name: nonChickenTeam.name,
      retreatingMoves: nonChickenTeam.retreatingMoves,
      averagePerGame: (nonChickenTeam.retreatingMoves / nonChickenTeam.totalGames).toFixed(1),
      playerCount: nonChickenTeam.playerCount
    },
    promotionParty: {
      name: promotionParty.name,
      promotions: promotionParty.promotions,
      averagePerGame: (promotionParty.promotions / promotionParty.totalGames).toFixed(1),
      playerCount: promotionParty.playerCount
    }
  };
}

/**
 * Generate team leaderboard for a specific stat
 *
 * @param {Object} teamStats - Team statistics
 * @param {string} statKey - Key of the stat to rank by
 * @param {number} limit - Number of teams to include (default: 10)
 * @returns {Array} Sorted array of teams with rankings
 */
function generateTeamLeaderboard(teamStats, statKey, limit = 10) {
  const teams = Object.values(teamStats);

  // Filter out teams with no games
  const teamsWithGames = teams.filter(t => t.totalGames > 0);

  // Sort by stat (descending)
  const sorted = teamsWithGames.sort((a, b) => {
    return (b[statKey] || 0) - (a[statKey] || 0);
  });

  // Take top N teams
  return sorted.slice(0, limit).map((team, index) => ({
    rank: index + 1,
    name: team.name,
    value: team[statKey],
    playerCount: team.playerCount,
    totalGames: team.totalGames
  }));
}

module.exports = {
  calculateTeamStats,
  calculateTeamAwards,
  generateTeamLeaderboard
};
