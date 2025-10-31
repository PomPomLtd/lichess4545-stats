import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Lichess 4545 League Statistics</h1>

      <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
        Comprehensive statistics and analysis for the Lichess 4545 Team League.
        Explore game data, player performance, opening trends, and much more.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/stats/46/overview"
          className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition"
        >
          <h2 className="text-2xl font-bold mb-2">Season 46</h2>
          <p className="text-gray-600 dark:text-gray-400">Current Season (In Progress)</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">2 rounds completed</p>
        </Link>

        <Link
          href="/stats/45/overview"
          className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition"
        >
          <h2 className="text-2xl font-bold mb-2">Season 45</h2>
          <p className="text-gray-600 dark:text-gray-400">Complete</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">8 rounds • 1,472 games</p>
        </Link>

        <Link
          href="/stats/44/overview"
          className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition"
        >
          <h2 className="text-2xl font-bold mb-2">Season 44</h2>
          <p className="text-gray-600 dark:text-gray-400">Complete</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">8 rounds • 1,408 games</p>
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
