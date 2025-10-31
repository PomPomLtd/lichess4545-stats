import { StatCard } from './stat-card'
import { PlayerName } from './player-name'

interface GamePhasesProps {
  gamePhases: {
    averageOpening: number
    averageMiddlegame: number
    averageEndgame: number
    longestWaitTillCapture: {
      moves: number
      white: string
      black: string
      game: string
      gameId: string | null
    }
    longestMiddlegame: {
      moves: number
      white: string
      black: string
      game: string
      gameId: string | null
    }
    longestEndgame: {
      moves: number
      white: string
      black: string
      game: string
      gameId: string | null
    }
  }
}

function PhaseCard({ gameId, className, children }: { gameId?: string | null, className: string, children: React.ReactNode }) {
  const cardClasses = `p-3 ${className} rounded-lg ${gameId ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all relative group' : ''}`

  if (!gameId) {
    return <div className={cardClasses}>{children}</div>
  }

  return (
    <a href={`https://lichess.org/${gameId}`} target="_blank" rel="noopener noreferrer" className={cardClasses}>
      {children}
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}

export function GamePhases({ gamePhases }: GamePhasesProps) {
  return (
    <StatCard title="⏱️ Game Phases">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(gamePhases.averageOpening)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Opening</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(gamePhases.averageMiddlegame)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Middlegame</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(gamePhases.averageEndgame)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Endgame</div>
        </div>
      </div>
      <div className="space-y-4">
        <PhaseCard gameId={gamePhases.longestWaitTillCapture.gameId} className="bg-blue-50 dark:bg-blue-900/20">
          <div className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Longest Wait Till First Capture: {gamePhases.longestWaitTillCapture.moves} moves</div>
          <div className="text-sm text-gray-700 dark:text-gray-300"><PlayerName name={gamePhases.longestWaitTillCapture.game} /></div>
        </PhaseCard>
        <PhaseCard gameId={gamePhases.longestMiddlegame.gameId} className="bg-purple-50 dark:bg-purple-900/20">
          <div className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Longest Middlegame: {gamePhases.longestMiddlegame.moves} moves</div>
          <div className="text-sm text-gray-700 dark:text-gray-300"><PlayerName name={gamePhases.longestMiddlegame.game} /></div>
        </PhaseCard>
        <PhaseCard gameId={gamePhases.longestEndgame.gameId} className="bg-green-50 dark:bg-green-900/20">
          <div className="font-semibold text-green-900 dark:text-green-300 mb-1">Longest Endgame: {gamePhases.longestEndgame.moves} moves</div>
          <div className="text-sm text-gray-700 dark:text-gray-300"><PlayerName name={gamePhases.longestEndgame.game} /></div>
        </PhaseCard>
      </div>
    </StatCard>
  )
}
