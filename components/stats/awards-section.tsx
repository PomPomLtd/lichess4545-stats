import { PlayerVs } from './player-name'

interface AwardsSectionProps {
  awards: {
    bloodbath: {
      white: string
      black: string
      captures: number
      gameId: string | null
    }
    pacifist: {
      white: string
      black: string
      captures: number
      gameId: string | null
    }
    speedDemon: {
      white: string
      black: string
      moves: number
      winner: string
      gameId: string | null
    } | null
    endgameWizard: {
      white: string
      black: string
      endgameMoves: number
      gameId: string | null
    }
    openingSprinter: {
      white: string
      black: string
      openingMoves: number
      gameId: string | null
    } | null
  }
}

function AwardCard({ gameId, children }: { gameId?: string | null, children: React.ReactNode }) {
  const cardClasses = `${gameId ? 'cursor-pointer hover:ring-2 hover:ring-white/50 transition-all relative group' : ''}`

  if (!gameId) {
    return <div>{children}</div>
  }

  return (
    <a href={`https://lichess.org/${gameId}`} target="_blank" rel="noopener noreferrer" className={cardClasses}>
      {children}
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  )
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-900 dark:to-orange-900 rounded-lg shadow-xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">🏆 Round Awards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Awards */}
        <AwardCard gameId={awards.bloodbath.gameId}>
          <div>
            <div className="text-lg font-semibold mb-2">🩸 Bloodbath Award</div>
            <div className="text-yellow-100 dark:text-yellow-200">
              <PlayerVs white={awards.bloodbath.white} black={awards.bloodbath.black} />
            </div>
            <div className="text-sm text-yellow-200 dark:text-yellow-300 mt-1">{awards.bloodbath.captures} captures!</div>
          </div>
        </AwardCard>

        <AwardCard gameId={awards.pacifist.gameId}>
          <div>
            <div className="text-lg font-semibold mb-2">🕊️ Pacifist Award</div>
            <div className="text-yellow-100 dark:text-yellow-200">
              <PlayerVs white={awards.pacifist.white} black={awards.pacifist.black} />
            </div>
            <div className="text-sm text-yellow-200 dark:text-yellow-300 mt-1">{awards.pacifist.captures} captures</div>
          </div>
        </AwardCard>

        {awards.speedDemon && (
          <AwardCard gameId={awards.speedDemon.gameId}>
            <div>
              <div className="text-lg font-semibold mb-2">⚡ Speed Demon</div>
              <div className="text-yellow-100 dark:text-yellow-200">
                <PlayerVs white={awards.speedDemon.white} black={awards.speedDemon.black} />
              </div>
              <div className="text-sm text-yellow-200 dark:text-yellow-300 mt-1">Mate in {awards.speedDemon.moves} moves</div>
            </div>
          </AwardCard>
        )}

        <AwardCard gameId={awards.endgameWizard.gameId}>
          <div>
            <div className="text-lg font-semibold mb-2">🧙 Endgame Wizard</div>
            <div className="text-yellow-100 dark:text-yellow-200">
              <PlayerVs white={awards.endgameWizard.white} black={awards.endgameWizard.black} />
            </div>
            <div className="text-sm text-yellow-200 dark:text-yellow-300 mt-1">{awards.endgameWizard.endgameMoves} endgame moves!</div>
          </div>
        </AwardCard>
      </div>
    </div>
  )
}
