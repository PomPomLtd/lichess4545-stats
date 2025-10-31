import { StatCard } from './stat-card'
import { PlayerVs } from './player-name'

interface CheckmatesSectionProps {
  checkmates: {
    byPiece: Record<string, number>
    fastest: {
      moves: number
      gameIndex: number
      gameId: string | null
      white: string
      black: string
      winner: string
    } | null
  }
}

function CheckmateCard({ gameId, children }: { gameId?: string | null, children: React.ReactNode }) {
  const cardClasses = `p-4 bg-red-50 dark:bg-red-900/20 rounded-lg ${gameId ? 'cursor-pointer hover:ring-2 hover:ring-red-500 dark:hover:ring-red-400 transition-all relative group' : ''}`

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

export function CheckmatesSection({ checkmates }: CheckmatesSectionProps) {
  return (
    <StatCard title="☠️ Checkmates">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">By Piece</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(checkmates.byPiece)
              .filter(([piece]) => piece !== 'king')
              .map(([piece, count]) => (
              <div key={piece} className="text-center p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
                <div className="font-bold text-gray-900 dark:text-white">{count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{piece}</div>
              </div>
            ))}
          </div>
        </div>

        {checkmates.fastest && (
          <CheckmateCard gameId={checkmates.fastest.gameId}>
            <div className="font-semibold text-red-900 dark:text-red-300 mb-1">⚡ Fastest Checkmate</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <PlayerVs white={checkmates.fastest.white} black={checkmates.fastest.black} />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {checkmates.fastest.moves} moves • Winner: {checkmates.fastest.winner}
            </div>
          </CheckmateCard>
        )}
      </div>
    </StatCard>
  )
}
