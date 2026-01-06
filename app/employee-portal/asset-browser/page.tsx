'use client'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { FaCopy, FaCheck, FaSpinner, FaLock, FaArrowLeft, FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaTimes } from 'react-icons/fa'
import { getClearanceInfo } from '@/lib/clearance'
import Link from 'next/link'

interface BrowsedAsset {
    id: string;
    url: string;
    name: string;
    mobType: string;
    ownerId: string;
    isOwner: boolean;
    created_at: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const MOB_TYPES = [
    { value: 'all', label: 'All Types' },
    { value: 'human', label: 'Human' },
    { value: 'villager', label: 'Villager' },
    { value: 'zombie-villager', label: 'Zombie Villager' },
    { value: 'skeleton', label: 'Skeleton' },
    { value: 'allay', label: 'Allay' },
    { value: 'cat', label: 'Cat' },
    { value: 'chicken', label: 'Chicken' },
    { value: 'iron-golem', label: 'Iron Golem' },
];

const getMobTypeLabel = (value: string) => {
    return MOB_TYPES.find(m => m.value === value)?.label || value;
};

const getMobTypeColor = (mobType: string) => {
    const colors: Record<string, string> = {
        'human': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'villager': 'bg-green-500/20 text-green-400 border-green-500/30',
        'zombie-villager': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'skeleton': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        'allay': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        'cat': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        'chicken': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'iron-golem': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[mobType] || 'bg-amber-500/20 text-amber-400 border-amber-500/30';
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

export default function AssetBrowser() {
    const [assets, setAssets] = useState<BrowsedAsset[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobTypeFilter, setMobTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [clearance, setClearance] = useState<number>(1);
    const [clearanceLoading, setClearanceLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState<BrowsedAsset | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchClearance();
    }, []);

    useEffect(() => {
        if (!clearanceLoading) {
            fetchAssets(currentPage);
        }
    }, [currentPage, clearanceLoading]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, mobTypeFilter]);

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

    const fetchAssets = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/assets/all?page=${page}&limit=20`);
            const data = await response.json();
            if (response.ok) {
                setAssets(data.assets || []);
                setPagination(data.pagination || null);
            }
        } catch (err) {
            console.error('Failed to fetch assets:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (asset: BrowsedAsset) => {
        await navigator.clipboard.writeText(asset.url);
        setCopiedId(asset.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setMobTypeFilter('all');
    };

    const clearanceInfo = getClearanceInfo(clearance);
    const activeFilterCount = (mobTypeFilter !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMobType = mobTypeFilter === 'all' || asset.mobType === mobTypeFilter;
        return matchesSearch && matchesMobType;
    });

    return (
        <main className="bg-zinc-900 min-h-screen">
            {/* Header Banner */}
            <section className="bg-zinc-800 border-b border-zinc-700 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link 
                        href="/employee-portal"
                        className="inline-flex items-center text-gray-400 hover:text-amber-500 mb-4 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Employee Portal
                    </Link>
                    <h1 className="text-amber-500 text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
                        Asset Browser
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Browse all personnel visualization assets uploaded by Vanguard employees. 
                        Copy any asset URL for use in field operations.
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
                            Please sign in through the Employee Portal to browse assets.
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
                                <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-amber-500 text-sm uppercase tracking-widest">Your Status</h3>
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
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="hidden lg:block bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                    <h3 className="text-amber-500 text-sm uppercase tracking-widest mb-4">Filters</h3>
                                    
                                    <div className="mb-4">
                                        <label className="text-gray-500 text-xs uppercase block mb-2">
                                            Mob Type
                                        </label>
                                        <select
                                            value={mobTypeFilter}
                                            onChange={(e) => setMobTypeFilter(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none appearance-none cursor-pointer"
                                        >
                                            {MOB_TYPES.map(mob => (
                                                <option key={mob.value} value={mob.value}>
                                                    {mob.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="w-full py-2 text-sm text-gray-400 hover:text-amber-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaTimes />
                                            Clear Filters ({activeFilterCount})
                                        </button>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                    <h3 className="text-amber-500 text-sm uppercase tracking-widest mb-4">Database Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 text-sm">Total Assets</span>
                                            <span className="text-white font-semibold">{pagination?.total || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 text-sm">Showing</span>
                                            <span className="text-white font-semibold">{filteredAssets.length}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Notice */}
                                <div className="bg-amber-500/10 border border-amber-500/30 p-4">
                                    <h4 className="text-amber-500 text-sm font-semibold uppercase mb-2">Notice</h4>
                                    <p className="text-gray-400 text-sm">
                                        All assets displayed are property of Vanguard Extraction Solutions.
                                    </p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                {/* Search Bar */}
                                <div className="bg-zinc-800 border border-zinc-700 p-4 mb-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="relative flex-grow">
                                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search assets by name..."
                                                className="w-full bg-zinc-900 border border-zinc-700 rounded pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>

                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
                                        >
                                            <FaFilter />
                                            Filters
                                            {activeFilterCount > 0 && (
                                                <span className="bg-amber-500 text-zinc-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                                                    {activeFilterCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                    {/* Mobile Filters */}
                                    {showFilters && (
                                        <div className="lg:hidden mt-4 pt-4 border-t border-zinc-700">
                                            <div className="mb-4">
                                                <label className="text-gray-500 text-xs uppercase block mb-2">
                                                    Mob Type
                                                </label>
                                                <select
                                                    value={mobTypeFilter}
                                                    onChange={(e) => setMobTypeFilter(e.target.value)}
                                                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none appearance-none cursor-pointer"
                                                >
                                                    {MOB_TYPES.map(mob => (
                                                        <option key={mob.value} value={mob.value}>
                                                            {mob.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Active Filters */}
                                {activeFilterCount > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {mobTypeFilter !== 'all' && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-gray-300">
                                                Type: {getMobTypeLabel(mobTypeFilter)}
                                                <button 
                                                    onClick={() => setMobTypeFilter('all')}
                                                    className="text-gray-500 hover:text-amber-500"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </span>
                                        )}
                                        {searchTerm && (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-gray-300">
                                                Search: &quot;{searchTerm}&quot;
                                                <button 
                                                    onClick={() => setSearchTerm('')}
                                                    className="text-gray-500 hover:text-amber-500"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Asset Grid */}
                                {isLoading ? (
                                    <div className="bg-zinc-800 border border-zinc-700 p-12 text-center">
                                        <FaSpinner className="text-amber-500 text-3xl animate-spin mx-auto mb-4" />
                                        <p className="text-gray-400">Loading asset database...</p>
                                    </div>
                                ) : filteredAssets.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                            {filteredAssets.map((asset) => (
                                                <div 
                                                    key={asset.id}
                                                    className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden hover:border-amber-500 transition-colors group"
                                                >
                                                    <div 
                                                        className="aspect-square bg-zinc-900 relative cursor-pointer"
                                                        onClick={() => setSelectedAsset(asset)}
                                                    >
                                                        <img 
                                                            src={asset.url} 
                                                            alt={asset.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {asset.isOwner && (
                                                            <div className="absolute top-2 left-2 bg-amber-500 text-zinc-900 text-xs px-2 py-1 rounded font-semibold">
                                                                YOURS
                                                            </div>
                                                        )}
                                                        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded border ${getMobTypeColor(asset.mobType)}`}>
                                                            {getMobTypeLabel(asset.mobType)}
                                                        </div>
                                                    </div>

                                                    <div className="p-3">
                                                        <p className="text-white text-sm font-medium truncate mb-1 capitalize">
                                                            {asset.name}
                                                        </p>
                                                        <p className="text-gray-500 text-xs mb-3">
                                                            {formatDate(asset.created_at)}
                                                        </p>
                                                        
                                                        <button
                                                            onClick={() => copyToClipboard(asset)}
                                                            className={`w-full py-2 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                                                                copiedId === asset.id
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-zinc-700 text-gray-300 hover:bg-amber-500 hover:text-zinc-900'
                                                            }`}
                                                        >
                                                            {copiedId === asset.id ? (
                                                                <>
                                                                    <FaCheck />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaCopy />
                                                                    Copy URL
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {pagination && pagination.totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className={`p-3 rounded transition-colors ${
                                                        currentPage === 1
                                                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                            : 'bg-zinc-800 text-white hover:bg-amber-500 hover:text-zinc-900'
                                                    }`}
                                                >
                                                    <FaChevronLeft />
                                                </button>
                                                
                                                <span className="text-gray-400">
                                                    Page {currentPage} of {pagination.totalPages}
                                                </span>
                                                
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                                    disabled={currentPage === pagination.totalPages}
                                                    className={`p-3 rounded transition-colors ${
                                                        currentPage === pagination.totalPages
                                                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                            : 'bg-zinc-800 text-white hover:bg-amber-500 hover:text-zinc-900'
                                                    }`}
                                                >
                                                    <FaChevronRight />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-zinc-800/50 border border-zinc-700 border-dashed p-12 text-center">
                                        <p className="text-gray-500 mb-4">
                                            {searchTerm || mobTypeFilter !== 'all'
                                                ? 'No assets found matching your filters.' 
                                                : 'No assets in the database yet.'}
                                        </p>
                                        {activeFilterCount > 0 && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-amber-500 hover:text-amber-400 text-sm font-semibold uppercase tracking-wider"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </SignedIn>
            </div>

            {/* Asset Preview Modal */}
            {selectedAsset && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedAsset(null)}
                >
                    <div 
                        className="bg-zinc-800 border border-zinc-700 rounded-lg max-w-2xl w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                            <div className="flex items-center gap-3">
                                <h3 className="text-white font-bold uppercase capitalize">{selectedAsset.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded border ${getMobTypeColor(selectedAsset.mobType)}`}>
                                    {getMobTypeLabel(selectedAsset.mobType)}
                                </span>
                            </div>
                            <button 
                                onClick={() => setSelectedAsset(null)}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="bg-zinc-900 rounded-lg overflow-hidden mb-4">
                                <img 
                                    src={selectedAsset.url} 
                                    alt={selectedAsset.name}
                                    className="w-full max-h-96 object-contain"
                                />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase mb-1">Asset URL</p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={selectedAsset.url}
                                            readOnly
                                            className="flex-grow bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-gray-300 text-sm"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(selectedAsset)}
                                            className={`px-4 py-2 font-semibold uppercase text-sm tracking-wider transition-colors ${
                                                copiedId === selectedAsset.id
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-amber-500 hover:bg-amber-600 text-zinc-900'
                                            }`}
                                        >
                                            {copiedId === selectedAsset.id ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase">Mob Type</p>
                                        <p className="text-white capitalize">{getMobTypeLabel(selectedAsset.mobType)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase">Uploaded</p>
                                        <p className="text-white">{formatDate(selectedAsset.created_at)}</p>
                                    </div>
                                    {selectedAsset.isOwner && (
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Owner</p>
                                            <p className="text-amber-500 font-semibold">You</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <section className="bg-zinc-950 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Vanguard Extraction Solutions reserves the right to monitor all asset browsing activity.
                    </p>
                </div>
            </section>
        </main>
    );
}