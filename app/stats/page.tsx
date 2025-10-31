'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StatsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Season 46 (current season)
    router.replace('/stats/46')
  }, [router])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-gray-500 dark:text-gray-400">Redirecting to Season 46...</div>
        </div>
      </div>
    </div>
  )
}
