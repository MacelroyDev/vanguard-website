'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FaSkull, FaHome, FaRedo } from 'react-icons/fa'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="bg-zinc-900 min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                
                <FaSkull className="text-red-500 text-8xl mx-auto mb-8" />

                <h1 className="text-red-500 text-6xl font-bold tracking-tighter mb-4">
                    CRITICAL ERROR
                </h1>

                <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">
                    System Malfunction Detected
                </h2>

                <div className="bg-zinc-800 border border-red-500/30 rounded-lg p-6 mb-8">
                    <p className="text-gray-400 text-lg mb-4">
                        A critical error has occurred in the Vanguard systems. 
                        Our automated repair drones have been dispatched.
                    </p>
                    <p className="text-gray-600 text-sm font-mono">
                        {error.digest && `Error ID: ${error.digest}`}
                    </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8">
                    <p className="text-red-400 text-sm">
                        This incident has been automatically reported to Vanguard IT. 
                        Please do not attempt to replicate the error. 
                        Doing so may void your employment contract.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                    >
                        <FaRedo className="mr-2" />
                        Retry Operation
                    </button>
                    <Link 
                        href="/"
                        className="inline-flex items-center px-6 py-3 border-2 border-zinc-700 hover:border-amber-500 text-gray-300 hover:text-amber-500 font-semibold uppercase tracking-wider transition-colors duration-200"
                    >
                        <FaHome className="mr-2" />
                        Return to Base
                    </Link>
                </div>

                <p className="text-gray-600 text-xs mt-12">
                    Error Code: VES-500-SYSTEM-FAILURE | Maintenance team notified
                </p>
            </div>
        </main>
    )
}