'use client';
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { FaMap, FaExternalLinkAlt, FaExclamationTriangle, FaTrain, FaRoute, FaClock, FaArrowLeft, FaLock, FaSpinner } from 'react-icons/fa'
import { getClearanceInfo } from '@/lib/clearance'
import TransitMap from '@/components/transitMap'
import { TrackStyleProvider } from '@/components/TrackStyleContext';
import TransitMapTest from '@/components/TransitMapTest'
import { transitMapConfig } from '@/config/transitMapConfig'



export default function TransitNetwork() {
    const [clearance, setClearance] = useState<number>(1);
    const [clearanceLoading, setClearanceLoading] = useState(true);

    useEffect(() => {
        fetchClearance();
    }, []);

    const fetchClearance = async () => {
        try {
            const response = await fetch('/api/user/clearance');
            const data = await response.json();
            if (response.ok) {
                setClearance(data.clearance || 1);
            }
        } catch (err) {
            console.error('Failed to fetch clearance:', err);
            setClearance(1);
        } finally {
            setClearanceLoading(false);
        }
    };

    const clearanceInfo = getClearanceInfo(clearance);

    // Calculate transit stats from config
    const activeLines = transitMapConfig.lines.length;
    const totalStations = transitMapConfig.lines.reduce((acc, line) => acc + line.stations.length, 0);

    return (
        <main className="bg-zinc-900 min-h-screen">
            <TrackStyleProvider 
                storageKey="my-transit-styles"
                apiEndpoint="/api/assets/track-styles"
            >
                {/* Header Banner */}
                <section className="relative bg-zinc-800 border-b border-zinc-700 py-16 overflow-hidden">
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link 
                            href="/employee-portal"
                            className="inline-flex items-center text-gray-400 hover:text-amber-500 mb-4 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Employee Portal
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <FaTrain className="text-amber-500 text-4xl" />
                            <h1 className="text-amber-500 text-4xl md:text-5xl font-bold uppercase tracking-tight">
                                Transit Network
                            </h1>
                        </div>
                        <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                            Getting workers to the crater, every time.
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Navigate the Vanguard-sponsored ANL Transit System with our comprehensive rail network map. 
                            Plan your route to extraction sites across the Server.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


                    <SignedOut>
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-12 text-center max-w-2xl mx-auto">
                            <FaLock className="text-red-500 text-6xl mx-auto mb-6" />
                            <h2 className="text-white text-2xl font-bold uppercase mb-4">
                                Authentication Required
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Please sign in through the Employee Portal to access the Transit Network map.
                            </p>
                            <Link 
                                href="/employee-portal"
                                className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                            >
                                Go to Employee Portal
                            </Link>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        {clearanceLoading ? (
                            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-12 text-center max-w-2xl mx-auto">
                                <FaSpinner className="text-amber-500 text-4xl animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">Verifying clearance level...</p>
                            </div>
                        ) : (

                            <div className="grid lg:grid-cols-4 gap-8">
                                
                                {/* Sidebar */}
                                <div className="lg:col-span-1">
                                    {/* Quick Stats */}
                                    <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                        <h3 className="text-amber-500 text-sm uppercase tracking-widest mb-4">Network Status</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">System Status</span>
                                                <span className="text-green-500 text-sm font-semibold">Operational</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">Active Lines</span>
                                                <span className="text-white text-sm font-semibold">{activeLines}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">Total Stations</span>
                                                <span className="text-white text-sm font-semibold">{totalStations}+</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Destinations */}
                                    <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                        <h3 className="text-amber-500 text-sm uppercase tracking-widest mb-4">Key Destinations</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className="text-gray-300 text-sm">Progress</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                <span className="text-gray-300 text-sm">Gentriville</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                <span className="text-gray-300 text-sm">Vanguard City</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <span className="text-gray-300 text-sm">Magicannot</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                                                <span className="text-gray-300 text-sm">New Wasserstadt</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Service Alert */}
                                    <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaExclamationTriangle className="text-red-500" />
                                            <h4 className="text-red-500 text-sm font-semibold uppercase">Service Alert</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            Magicannot Line: Route closed due to the Vanguard Pulverizer MK. IV pulverizing itself into a wall. (Again)<br/>
                                            Water shuttle service available.
                                        </p>
                                    </div>

                                    {/* External Link */}
                                    <a 
                                        href="http://vanguard.hopto.org:3876/" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                                    >
                                        <FaExternalLinkAlt />
                                        Open Original Map
                                    </a>
                                </div>

                                {/* Main Content - Map */}
                                <div className="lg:col-span-3">
                                    <div className="bg-zinc-800 border border-zinc-700 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-white text-xl font-bold uppercase mb-1">Interactive Rail Map</h2>
                                                <p className="text-gray-400 text-sm">
                                                    Click and drag to navigate. Scroll to zoom. Hover for details.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Transit Map Component */}
                                        <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
                                            <TransitMap 
                                                config={transitMapConfig}
                                                className="w-full h-[600px]"
                                                adminMode={clearanceInfo.name === "Engineer" || clearanceInfo.name === "CEO"}
                                            />
                                        </div>

                                        {/* Map Legend */}
                                        <div className="mt-6 pt-6 border-t border-zinc-700">
                                            <h3 className="text-white text-sm font-semibold uppercase mb-4">Map Legend</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-1 bg-green-500 rounded"></div>
                                                    <span className="text-gray-400 text-sm">Hankyu Line</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-1 bg-blue-500 rounded"></div>
                                                    <span className="text-gray-400 text-sm">Shinkansen Line</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-1 bg-amber-500 rounded"></div>
                                                    <span className="text-gray-400 text-sm">Progress Line</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-1 bg-red-500 rounded-full opacity-50"></div>
                                                    <span className="text-gray-400 text-sm">Magicannot (Closed)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-1 bg-teal-500 rounded-full"></div>
                                                    <span className="text-gray-400 text-sm">Wasserbahn Line</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-1 bg-pink-300 rounded-full"></div>
                                                    <span className="text-gray-400 text-sm">PLR Water Shuttle</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Cards */}
                                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                                        <div className="bg-zinc-800 border border-zinc-700 p-4">
                                            <FaTrain className="text-amber-500 text-2xl mb-3" />
                                            <h4 className="text-white font-semibold uppercase mb-1">Frequent Service</h4>
                                            <p className="text-gray-400 text-sm">
                                                Trains run every 20 minutes during peak hours.
                                            </p>
                                        </div>
                                        <div className="bg-zinc-800 border border-zinc-700 p-4">
                                            <FaRoute className="text-amber-500 text-2xl mb-3" />
                                            <h4 className="text-white font-semibold uppercase mb-1">Network Coverage</h4>
                                            <p className="text-gray-400 text-sm">
                                                Connected routes across all extraction zones.
                                            </p>
                                        </div>
                                        <div className="bg-zinc-800 border border-zinc-700 p-4">
                                            <FaClock className="text-amber-500 text-2xl mb-3" />
                                            <h4 className="text-white font-semibold uppercase mb-1">24/7 Operations</h4>
                                            <p className="text-gray-400 text-sm">
                                                The extraction never stops, neither do we.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SignedIn>     
                </div>

                {/* Footer Disclaimer */}
                <section className="bg-zinc-950 py-8 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-600 text-sm">
                            Vanguard Extraction Solutions & ANL Transit are not responsible for delays caused by cave-ins, 
                            rogue mining equipment, or insurgent groups. Travel at your own risk.
                        </p>
                    </div>
                </section>
            </TrackStyleProvider>
        </main>
    );
}
