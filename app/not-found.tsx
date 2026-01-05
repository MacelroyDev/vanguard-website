import Link from 'next/link'
import { FaHardHat, FaHome, FaExclamationTriangle } from 'react-icons/fa'

export default function NotFound() {
    return (
        <main className="bg-zinc-900 min-h-screen flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                
                {/* Construction Icon */}
                <div className="relative inline-block mb-8">
                    <FaHardHat className="text-amber-500 text-8xl mx-auto" />
                    <FaExclamationTriangle className="text-amber-400 text-2xl absolute -top-2 -right-2 animate-pulse" />
                </div>

                {/* Error Code */}
                <h1 className="text-amber-500 text-9xl font-bold tracking-tighter mb-4">
                    404
                </h1>

                {/* Title */}
                <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                    Sector Under Construction
                </h2>

                {/* Message */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
                    <p className="text-gray-400 text-lg mb-4">
                        This area of the Vanguard facility is currently under construction. 
                        Our engineers are working around the clock to excavate this sector.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Some pages may be missing, incomplete, or temporarily sealed off due to 
                        ongoing structural reinforcement. We apologize for any inconvenience 
                        this may cause to your extraction operations.
                    </p>
                </div>

                {/* Warning Notice */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
                    <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
                        ⚠ Official Notice
                    </p>
                    <p className="text-gray-400 text-sm">
                        Unauthorized personnel found wandering in unfinished sectors will be 
                        escorted back to the main facility. Repeated offenses may result in 
                        clearance level review.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                    >
                        <FaHome className="mr-2" />
                        Return to Base
                    </Link>
                    <Link 
                        href="/employee-portal"
                        className="inline-flex items-center px-6 py-3 border-2 border-zinc-700 hover:border-amber-500 text-gray-300 hover:text-amber-500 font-semibold uppercase tracking-wider transition-colors duration-200"
                    >
                        Employee Portal
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-gray-600 text-xs mt-12">
                    Error Code: VES-404-SECTOR-NOT-FOUND | Incident logged and reported to Site Management
                </p>
            </div>
        </main>
    )
}