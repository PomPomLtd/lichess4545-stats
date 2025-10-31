import { StatCard } from './stat-card'

interface TeamAward {
  name: string
  playerCount: number
}

interface TeamAwardsSectionProps {
  teams: {
    awards: {
      bloodthirstyTeam: (TeamAward & {
        totalCaptures: number
        averagePerGame: string
      }) | null
      pawnCrackers: (TeamAward & {
        pawnCaptures: number
        averagePerGame: string
      }) | null
      lateKnightShow: (TeamAward & {
        lateKnightMoves: number
        averagePerGame: string
      }) | null
      castlingSpeed: (TeamAward & {
        averageCastlingMove: string
        castlingGames: number
      }) | null
      spaceInvaders: (TeamAward & {
        invasionMoves: number
        averagePerGame: string
      }) | null
      checkMasters: (TeamAward & {
        checksDelivered: number
        averagePerGame: string
      }) | null
      cornerConquerors: (TeamAward & {
        cornerMoves: number
        averagePerGame: string
      }) | null
      marathonRunners: (TeamAward & {
        averageGameLength: string
      }) | null
      speedDemons: (TeamAward & {
        averageGameLength: string
      }) | null
      chickenTeam: (TeamAward & {
        retreatingMoves: number
        averagePerGame: string
      }) | null
      nonChickenTeam: (TeamAward & {
        retreatingMoves: number
        averagePerGame: string
      }) | null
      promotionParty: (TeamAward & {
        promotions: number
        averagePerGame: string
      }) | null
    }
    totalTeams: number
  }
}

export function TeamAwardsSection({ teams }: TeamAwardsSectionProps) {
  if (!teams || !teams.awards) {
    return null
  }

  const a = teams.awards

  return (
    <StatCard title="👥 Team Awards">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Statistics aggregated across all {teams.totalTeams} teams competing in this round
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {a.bloodthirstyTeam && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="font-semibold text-red-900 dark:text-red-300 mb-2">
              🩸 Bloodthirsty Team
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.bloodthirstyTeam.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.bloodthirstyTeam.totalCaptures} captures ({a.bloodthirstyTeam.averagePerGame}/game)
            </div>
          </div>
        )}

        {a.pawnCrackers && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <div className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
              🦐 Pawn Crackers
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.pawnCrackers.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.pawnCrackers.pawnCaptures} pawn captures ({a.pawnCrackers.averagePerGame}/game)
            </div>
          </div>
        )}

        {a.lateKnightShow && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              🌙 The Late Knight Show
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.lateKnightShow.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.lateKnightShow.lateKnightMoves} late knight moves ({a.lateKnightShow.averagePerGame}/game)
            </div>
          </div>
        )}

        {a.castlingSpeed && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              ⚡ Castling Speed
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.castlingSpeed.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Average move {a.castlingSpeed.averageCastlingMove} ({a.castlingSpeed.castlingGames} games)
            </div>
          </div>
        )}

        {a.spaceInvaders && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
              🚀 Space Invaders
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.spaceInvaders.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.spaceInvaders.invasionMoves} invasion moves ({a.spaceInvaders.averagePerGame}/game)
            </div>
          </div>
        )}

        {a.checkMasters && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="font-semibold text-green-900 dark:text-green-300 mb-2">
              ⚔️ Check Masters
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.checkMasters.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.checkMasters.checksDelivered} checks delivered ({a.checkMasters.averagePerGame}/game)
            </div>
          </div>
        )}

        {a.cornerConquerors && (
          <div className="bg-slate-50 dark:bg-slate-900/20 rounded-lg p-4">
            <div className="font-semibold text-slate-900 dark:text-slate-300 mb-2">
              🔲 Corner Conquerors
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.cornerConquerors.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.cornerConquerors.cornerMoves} corner moves ({a.cornerConquerors.averagePerGame}/game)
            </div>
          </div>
        )}

        {a.marathonRunners && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              🏃 Marathon Runners
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.marathonRunners.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Longest games: {a.marathonRunners.averageGameLength} avg moves/game
            </div>
          </div>
        )}

        {a.speedDemons && (
          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
            <div className="font-semibold text-cyan-900 dark:text-cyan-300 mb-2">
              💨 Speed Demons
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.speedDemons.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Shortest games: {a.speedDemons.averageGameLength} avg moves/game
            </div>
          </div>
        )}

        {a.chickenTeam && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
              🐔 Chicken Team
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.chickenTeam.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.chickenTeam.retreatingMoves} retreating moves ({a.chickenTeam.averagePerGame}/game)
            </div>
          </div>
        )}

        {a.nonChickenTeam && (
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4">
            <div className="font-semibold text-rose-900 dark:text-rose-300 mb-2">
              🚫🐔 Non-Chicken Team
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.nonChickenTeam.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Only {a.nonChickenTeam.retreatingMoves} retreating moves ({a.nonChickenTeam.averagePerGame}/game) - always forward!
            </div>
          </div>
        )}

        {a.promotionParty && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              👑 Promotion Party
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              {a.promotionParty.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {a.promotionParty.promotions} pawn promotions ({a.promotionParty.averagePerGame}/game)
            </div>
          </div>
        )}
      </div>
    </StatCard>
  )
}
