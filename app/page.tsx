import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Lichess 4545 League Statistics</h1>

      <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
        Comprehensive statistics and analysis for the Lichess 4545 Team League.
        Explore game data, player performance, opening trends, and much more.
      </p>

      <div className="max-w-md">
        <Link
          href="/stats/46"
          className="block p-8 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <h2 className="text-3xl font-bold mb-2">Season 46</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Current Season (In Progress)</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">2 rounds completed • 316 games analyzed</p>
          <div className="mt-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
            View Statistics
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-xl font-bold mb-4">About Lichess 4545</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Lichess 4545 League is a team chess league where players compete in classical time control (45+45).
          Each season consists of 8 rounds with 42 teams competing across 8 boards per match.
        </p>
        <a
          href="https://www.lichess4545.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Visit Lichess 4545 League →
        </a>
      </div>
    </div>
  );
}
