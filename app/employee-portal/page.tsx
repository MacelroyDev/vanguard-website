'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { FaExclamationTriangle, FaSpinner, FaLock, FaImages, FaMap, FaFileAlt, FaCog, FaChartBar, FaUsers, FaSearch } from 'react-icons/fa'
import { getClearanceInfo, canAccessUploader, canAccessClientFeatures, CLEARANCE_LEVELS } from '@/lib/clearance'
import Link from 'next/link'

interface Tool {
    name: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    minClearance: number;
    status: 'available' | 'coming-soon' | 'restricted';
}

const tools: Tool[] = [
    {
        name: 'Asset Management',
        description: 'Upload and manage your personnel visualization assets for integration with Vanguard field systems.',
        href: '/employee-portal/asset-management',
        icon: FaImages,
        minClearance: 3,
        status: 'available',
    },
    {
        name: 'Asset Browser',
        description: 'Browse all personnel visualization assets uploaded by Vanguard employees.',
        href: '/employee-portal/asset-browser',
        icon: FaSearch,
        minClearance: 1,
        status: 'available',
    },
    {
        name: 'Transit Network',
        description: "View the Vanguard-sponsored ANL Transit Network map and plan your route to extraction sites.",
        href: '/employee-portal/transit',
        icon: FaMap,
        minClearance: 2,
        status: 'available',
    },
    {
        name: 'Documentation',
        description: 'Access official Vanguard documentation, protocols, and (optional) safety guidelines.',
        href: '/employee-portal/docs',
        icon: FaFileAlt,
        minClearance: 2,
        status: 'coming-soon',
    },
    {
        name: 'System Settings',
        description: 'Configure your personal Vanguard system preferences and notifications.',
        href: '/employee-portal/settings',
        icon: FaCog,
        minClearance: 1,
        status: 'coming-soon',
    },
    {
        name: 'Performance Metrics',
        description: 'View your extraction performance metrics and quarterly evaluations.',
        href: '/employee-portal/metrics',
        icon: FaChartBar,
        minClearance: 3,
        status: 'coming-soon',
    },
    {
        name: 'Team Directory',
        description: 'Browse the Vanguard employee directory and contact information.',
        href: '/employee-portal/directory',
        icon: FaUsers,
        minClearance: 3,
        status: 'coming-soon',
    },
];

export default function EmployeePortal() {
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

    const getToolStatus = (tool: Tool): 'available' | 'coming-soon' | 'locked' => {
        if (tool.status === 'coming-soon') return 'coming-soon';
        if (clearance < tool.minClearance) return 'locked';
        return 'available';
    };

    return (
        <main className="bg-zinc-900 min-h-screen">
            {/* Header Banner */}
            <section className="bg-zinc-800 border-b border-zinc-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-amber-500 text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                        Employee Portal
                    </h1>
                    <h2 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                        Your identity. Our property.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Access your Vanguard-assigned resources and tools. Your clearance level determines available features.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Signed Out State */}
                <SignedOut>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-12 text-center max-w-2xl mx-auto">
                        <FaExclamationTriangle className="text-amber-500 text-6xl mx-auto mb-6" />
                        <h2 className="text-white text-2xl font-bold uppercase mb-4">
                            Unauthorized Access Detected
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Please verify your employment status to access the Employee Portal. 
                            Unauthorized access attempts will be reported to HR and/or local authorities.
                        </p>
                        <SignInButton mode="modal">
                            <button className="inline-flex items-center px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200">
                                Verify Employment Status
                            </button>
                        </SignInButton>
                        <p className="text-gray-500 text-sm mt-6">
                            By logging in, you agree to surrender all likeness rights to Vanguard Extraction Solutions™
                        </p>
                    </div>
                </SignedOut>

                {/* Signed In State */}
                <SignedIn>
                    {clearanceLoading ? (
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-12 text-center max-w-2xl mx-auto">
                            <FaSpinner className="text-amber-500 text-4xl animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Verifying clearance level...</p>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-4 gap-8">
                            
                            {/* Sidebar - Employee Info */}
                            <div className="lg:col-span-1">
                                <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-amber-500 text-sm uppercase tracking-widest">Employee Status</h3>
                                        <UserButton 
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-10 h-10"
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Clearance Level</p>
                                            <p className={`font-semibold ${clearanceInfo.color}`}>
                                                Level {clearance}: {clearanceInfo.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Department</p>
                                            <p className="text-white font-semibold">Field Operations</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Corporate Notice */}
                                <div className="bg-amber-500/10 border border-amber-500/30 p-4">
                                    <h4 className="text-amber-500 text-sm font-semibold uppercase mb-2">Notice</h4>
                                    <p className="text-gray-400 text-sm">
                                        Tool access is determined by your clearance level. 
                                        Contact HR for clearance upgrade requests.
                                    </p>
                                </div>
                            </div>

                            {/* Main Content - Tools Grid */}
                            <div className="lg:col-span-3">
                                <h2 className="text-white text-2xl font-bold uppercase mb-6">Available Tools</h2>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    {tools.map((tool) => {
                                        const status = getToolStatus(tool);
                                        const isAvailable = status === 'available';
                                        const isLocked = status === 'locked';
                                        const isComingSoon = status === 'coming-soon';

                                        return (
                                            <div
                                                key={tool.name}
                                                className={`
                                                    relative bg-zinc-800 border rounded-lg p-6 transition-all duration-200
                                                    ${isAvailable 
                                                        ? 'border-zinc-700 hover:border-amber-500 cursor-pointer' 
                                                        : 'border-zinc-700/50 opacity-60'
                                                    }
                                                `}
                                            >
                                                {isAvailable ? (
                                                    <Link href={tool.href} className="absolute inset-0 z-10" />
                                                ) : null}

                                                <div className="flex items-start justify-between mb-4">
                                                    <tool.icon className={`text-3xl ${isAvailable ? 'text-amber-500' : 'text-gray-600'}`} />
                                                    
                                                    {isLocked && (
                                                        <div className="flex items-center gap-1 text-red-500 text-xs uppercase">
                                                            <FaLock />
                                                            <span>Level {tool.minClearance}+</span>
                                                        </div>
                                                    )}
                                                    
                                                    {isComingSoon && (
                                                        <span className="text-amber-500 text-xs uppercase font-semibold">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                    
                                                    {isAvailable && (
                                                        <span className="text-green-500 text-xs uppercase font-semibold">
                                                            Available
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`text-lg font-bold uppercase mb-2 ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
                                                    {tool.name}
                                                </h3>
                                                
                                                <p className="text-gray-400 text-sm">
                                                    {tool.description}
                                                </p>

                                                {isLocked && (
                                                    <p className="text-red-400/80 text-xs mt-4">
                                                        Requires {getClearanceInfo(tool.minClearance).name} clearance or higher.
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
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
                        Vanguard Extraction Solutions is not responsible for any identity theft, 
                        tectonic displacement, or spontaneous combustion resulting from portal usage.
                    </p>
                </div>
            </section>
        </main>
    );
}