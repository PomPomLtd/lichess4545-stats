import { TeamHallOfFame } from '@/app/stats/overview-types'
import { StatCard } from '../stat-card'

interface TeamHallOfFameSectionProps {
  teamHallOfFame: TeamHallOfFame
}

export function TeamHallOfFameSection({ teamHallOfFame }: TeamHallOfFameSectionProps) {
  return (
    <StatCard title="👥 Team Hall of Fame">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Bloodthirsty Team */}
        {teamHallOfFame.bloodthirstyTeam && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
            <div className="font-semibold text-red-900 dark:text-red-300 mb-1">🩸 Most Bloodthirsty</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.bloodthirstyTeam.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.bloodthirstyTeam.round} • <strong>{teamHallOfFame.bloodthirstyTeam.totalCaptures}</strong> total captures
            </div>
          </div>
        )}

        {/* Pawn Crackers */}
        {teamHallOfFame.pawnCrackers && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="font-semibold text-orange-900 dark:text-orange-300 mb-1">🦐 Best Pawn Crackers</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.pawnCrackers.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.pawnCrackers.round} • <strong>{teamHallOfFame.pawnCrackers.pawnCaptures}</strong> pawn captures
            </div>
          </div>
        )}

        {/* Late Knight Show */}
        {teamHallOfFame.lateKnightShow && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <div className="font-semibold text-indigo-900 dark:text-indigo-300 mb-1">🌙 Late Knight Show</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.lateKnightShow.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.lateKnightShow.round} • <strong>{teamHallOfFame.lateKnightShow.lateKnightMoves}</strong> knight moves after move 30
            </div>
          </div>
        )}

        {/* Castling Speed */}
        {teamHallOfFame.castlingSpeed && (
          <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700">
            <div className="font-semibold text-cyan-900 dark:text-cyan-300 mb-1">⚡ Fastest Castling</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.castlingSpeed.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.castlingSpeed.round} • Avg move <strong>{teamHallOfFame.castlingSpeed.averageCastlingMove}</strong>
            </div>
          </div>
        )}

        {/* Space Invaders */}
        {teamHallOfFame.spaceInvaders && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="font-semibold text-purple-900 dark:text-purple-300 mb-1">🚀 Space Invaders</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.spaceInvaders.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.spaceInvaders.round} • <strong>{teamHallOfFame.spaceInvaders.piecesInEnemyHalf}</strong> pieces in enemy territory
            </div>
          </div>
        )}

        {/* Check Masters */}
        {teamHallOfFame.checkMasters && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
            <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1">⚔️ Check Masters</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.checkMasters.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.checkMasters.round} • <strong>{teamHallOfFame.checkMasters.totalChecks}</strong> checks delivered
            </div>
          </div>
        )}

        {/* Corner Conquerors */}
        {teamHallOfFame.cornerConquerors && (
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-700">
            <div className="font-semibold text-teal-900 dark:text-teal-300 mb-1">🔲 Corner Conquerors</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.cornerConquerors.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.cornerConquerors.round} • <strong>{teamHallOfFame.cornerConquerors.cornerActivity}</strong> corner moves
            </div>
          </div>
        )}

        {/* Marathon Runners */}
        {teamHallOfFame.marathonRunners && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="font-semibold text-blue-900 dark:text-blue-300 mb-1">🏃 Marathon Runners</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.marathonRunners.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.marathonRunners.round} • <strong>{teamHallOfFame.marathonRunners.totalMoves}</strong> total moves
            </div>
          </div>
        )}

        {/* Speed Demons */}
        {teamHallOfFame.speedDemons && (
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-700">
            <div className="font-semibold text-pink-900 dark:text-pink-300 mb-1">💨 Speed Demons</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.speedDemons.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.speedDemons.round} • Avg <strong>{teamHallOfFame.speedDemons.averageGameLength}</strong> moves/game
            </div>
          </div>
        )}

        {/* Chicken Team */}
        {teamHallOfFame.chickenTeam && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">🐔 Chicken Champions</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.chickenTeam.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.chickenTeam.round} • <strong>{teamHallOfFame.chickenTeam.retreatingMoves}</strong> retreating moves
            </div>
          </div>
        )}

        {/* Non-Chicken Team */}
        {teamHallOfFame.nonChickenTeam && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <div className="font-semibold text-green-900 dark:text-green-300 mb-1">🚫🐔 Bravest Team</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.nonChickenTeam.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.nonChickenTeam.round} • Only <strong>{teamHallOfFame.nonChickenTeam.retreatingMoves}</strong> retreats
            </div>
          </div>
        )}

        {/* Promotion Party */}
        {teamHallOfFame.promotionParty && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-700">
            <div className="font-semibold text-rose-900 dark:text-rose-300 mb-1">👑 Promotion Party</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium font-syne-tactile">
              {teamHallOfFame.promotionParty.name}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Round {teamHallOfFame.promotionParty.round} • <strong>{teamHallOfFame.promotionParty.totalPromotions}</strong> promotions
            </div>
          </div>
        )}

      </div>
    </StatCard>
  )
}
