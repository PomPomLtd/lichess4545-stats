/**
 * Adapts Lichess 4545 data to our expected format
 */

function parseResult(resultStr) {
  // Handle various result formats from Lichess 4545
  const resultMap = {
    '1-0': '1-0',
    '0-1': '0-1',
    '1/2-1/2': '1/2-1/2',
    '1X-0F': '1-0',  // White wins by forfeit
    '0F-1X': '0-1',  // Black wins by forfeit
    '1/2Z-1/2Z': '1/2-1/2',  // Zero-tolerance draw (both players late)
    '': null  // Unplayed
  };

  return resultMap[resultStr] || null;
}

function adaptGameData(lichessGame) {
  return {
    gameId: lichessGame.game_id,
    white: lichessGame.white,
    black: lichessGame.black,
    result: parseResult(lichessGame.result),
    round: lichessGame.round,
    whiteTeam: lichessGame.white_team,
    blackTeam: lichessGame.black_team,
    isForfeit: lichessGame.result.includes('F') || lichessGame.result.includes('X'),
    isZeroTolerance: lichessGame.result.includes('Z')
  };
}

function adaptSeasonData(lichessSeasonData) {
  const adapted = {
    season: lichessSeasonData.season,
    league: lichessSeasonData.league,
    rounds: {}
  };

  for (const [roundNum, games] of Object.entries(lichessSeasonData.rounds)) {
    adapted.rounds[roundNum] = games
      .filter(g => g.game_id)  // Only games with IDs (exclude forfeits/unplayed)
      .map(adaptGameData);
  }

  return adapted;
}

module.exports = {
  parseResult,
  adaptGameData,
  adaptSeasonData
};
