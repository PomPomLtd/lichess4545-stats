import { StatCard } from './stat-card'
import { PlayerVs } from './player-name'

interface NotableGamesProps {
  overview: {
    longestGame: {
      moves: number
      white: string
      black: string
      result: string
      gameId: string | null
    }
    shortestGame: {
      moves: number
      white: string
      black: string
      result: string
      gameId: string | null
    }
  }
  longestNonCaptureStreak: {
    moves: number
    white: string
    black: string
    gameId: string | null
  }
}

function GameCard({ gameId, className, children }: { gameId?: string | null, className: string, children: React.ReactNode }) {
  const cardClasses = `p-4 ${className} rounded-lg ${gameId ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all relative group' : ''}`

  if (!gameId) {
    return <div className={cardClasses}>{children}</div>
  }

  return (
    <a href={`https://lichess.org/${gameId}`} target="_blank" rel="noopener noreferrer" className={cardClasses}>
      {children}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}

export function NotableGames({ overview, longestNonCaptureStreak }: NotableGamesProps) {
  return (
    <StatCard title="🎯 Notable Games">
      <div className="space-y-4">
        <GameCard gameId={overview.longestGame.gameId} className="bg-purple-50 dark:bg-purple-900/20">
          <div className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Longest Game</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <PlayerVs white={overview.longestGame.white} black={overview.longestGame.black} />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {overview.longestGame.moves} moves • Result: {overview.longestGame.result}
          </div>
        </GameCard>

        <GameCard gameId={overview.shortestGame.gameId} className="bg-blue-50 dark:bg-blue-900/20">
          <div className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Shortest Game</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <PlayerVs white={overview.shortestGame.white} black={overview.shortestGame.black} />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {overview.shortestGame.moves} moves • Result: {overview.shortestGame.result}
          </div>
        </GameCard>

        <GameCard gameId={longestNonCaptureStreak.gameId} className="bg-green-50 dark:bg-green-900/20">
          <div className="font-semibold text-green-900 dark:text-green-300 mb-1">Longest Non-Capture Streak</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <PlayerVs white={longestNonCaptureStreak.white} black={longestNonCaptureStreak.black} />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {longestNonCaptureStreak.moves} consecutive moves without captures
          </div>
        </GameCard>
      </div>
    </StatCard>
  )
}
