'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useState, useCallback, useEffect } from 'react'
import { FaUpload, FaCopy, FaCheck, FaTrash, FaExclamationTriangle, FaSpinner, FaTimes, FaLock } from 'react-icons/fa'
import { getClearanceInfo, canAccessUploader, CLEARANCE_LEVELS, ClearanceLevel } from '@/lib/clearance'

interface UploadedAsset {
    id: string;
    url: string;
    name: string;
    created_at: string;
}

interface PendingFile {
    file: File;
    customName: string;
    preview: string;
}

export default function EmployeePortal() {
    const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clearance, setClearance] = useState<number>(1);
    const [clearanceLoading, setClearanceLoading] = useState(true);

    // Fetch user clearance on mount
    useEffect(() => {
        fetchClearance();
    }, []);

    // Fetch assets only if user has access
    useEffect(() => {
        if (!clearanceLoading && canAccessUploader(clearance)) {
            fetchAssets();
        } else if (!clearanceLoading) {
            setIsLoading(false);
        }
    }, [clearance, clearanceLoading]);

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

    const fetchAssets = async () => {
        try {
            const response = await fetch('/api/assets');
            const data = await response.json();

            if (response.ok) {
                setUploadedAssets(data.assets || []);
            }
        } catch (err) {
            console.error('Failed to fetch assets:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        addPendingFiles(files);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            addPendingFiles(files);
        }
        e.target.value = '';
    };

    const addPendingFiles = (files: File[]) => {
        const newPending: PendingFile[] = files.map(file => ({
            file,
            customName: file.name.replace(/\.[^/.]+$/, ''),
            preview: URL.createObjectURL(file),
        }));
        setPendingFiles(prev => [...prev, ...newPending]);
    };

    const updatePendingName = (index: number, newName: string) => {
        setPendingFiles(prev => prev.map((item, i) => 
            i === index ? { ...item, customName: newName } : item
        ));
    };

    const removePendingFile = (index: number) => {
        setPendingFiles(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const uploadFiles = async () => {
        if (pendingFiles.length === 0) return;
        
        setIsUploading(true);
        setError(null);

        for (const pending of pendingFiles) {
            try {
                const formData = new FormData();
                formData.append('file', pending.file);
                formData.append('customName', pending.customName);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Upload failed');
                }

                URL.revokeObjectURL(pending.preview);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload failed');
            }
        }

        setPendingFiles([]);
        setIsUploading(false);
        fetchAssets();
    };

    const copyToClipboard = async (asset: UploadedAsset) => {
        await navigator.clipboard.writeText(asset.url);
        setCopiedId(asset.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteAsset = async (key: string) => {
        try {
            const response = await fetch(`/api/assets?key=${encodeURIComponent(key)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUploadedAssets(prev => prev.filter(asset => asset.id !== key));
            } else {
                setError('Failed to delete asset');
            }
        } catch (err) {
            setError('Failed to delete asset');
        }
    };

    const clearanceInfo = getClearanceInfo(clearance);
    const hasUploaderAccess = canAccessUploader(clearance);

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
                        Access your Vanguard-assigned resources and manage your corporate likeness assets.
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
                            Please verify your employment status to access the Asset Management Portal. 
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
                    ) : !hasUploaderAccess ? (
                        /* Insufficient Clearance State */
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-12 text-center max-w-2xl mx-auto">
                            <FaLock className="text-red-500 text-6xl mx-auto mb-6" />
                            <h2 className="text-white text-2xl font-bold uppercase mb-4">
                                Insufficient Clearance
                            </h2>
                            <p className="text-gray-400 mb-4">
                                Your current clearance level does not permit access to the Asset Management Portal.
                            </p>
                            <div className="bg-zinc-900 border border-zinc-700 rounded p-4 mb-6 inline-block">
                                <p className="text-gray-500 text-xs uppercase mb-1">Your Clearance</p>
                                <p className={`text-xl font-bold ${clearanceInfo.color}`}>
                                    Level {clearance}: {clearanceInfo.name}
                                </p>
                            </div>
                            <p className="text-gray-500 mb-6">
                                Asset Management requires <span className="text-green-400">Level 3: Standard Contractor</span> or higher.
                            </p>
                            <p className="text-gray-600 text-sm">
                                If you believe this is an error, please contact your supervisor or submit a clearance upgrade request to HR.
                                Note: Bribery attempts will result in immediate termination and possible orbital relocation.
                            </p>
                            <div className="mt-6">
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        /* Has Access - Show Full Portal */
                        <div className="grid lg:grid-cols-3 gap-8">
                            
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
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Assets Uploaded</p>
                                            <p className="text-white font-semibold">{uploadedAssets.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Corporate Notice */}
                                <div className="bg-amber-500/10 border border-amber-500/30 p-4">
                                    <h4 className="text-amber-500 text-sm font-semibold uppercase mb-2">Notice</h4>
                                    <p className="text-gray-400 text-sm">
                                        All uploaded assets become property of Vanguard Extraction Solutions. 
                                        Do not upload classified materials or images of The Pulverizer Incident.
                                    </p>
                                </div>
                            </div>

                            {/* Main Content - Upload Area */}
                            <div className="lg:col-span-2">
                                <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                    <h2 className="text-white text-xl font-bold uppercase mb-2">Asset Management</h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Upload your personnel visualization assets for integration with Vanguard systems.
                                    </p>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6 rounded flex items-center justify-between">
                                            <p className="text-red-400 text-sm">{error}</p>
                                            <button 
                                                onClick={() => setError(null)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Zone */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`
                                            border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 cursor-pointer
                                            ${isDragging 
                                                ? 'border-amber-500 bg-amber-500/10' 
                                                : 'border-zinc-600 hover:border-zinc-500'
                                            }
                                            ${isUploading ? 'pointer-events-none opacity-50' : ''}
                                        `}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            multiple
                                            accept="image/png,image/jpeg,image/gif,image/webp"
                                            onChange={handleFileInput}
                                            disabled={isUploading}
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <FaUpload className={`text-4xl mx-auto mb-4 ${isDragging ? 'text-amber-500' : 'text-gray-500'}`} />
                                            <p className="text-white font-semibold mb-2">
                                                Drop files here or click to select
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                PNG, JPG, GIF, WebP up to 10MB
                                            </p>
                                        </label>
                                    </div>
                                </div>

                                {/* Pending Files - Name Input */}
                                {pendingFiles.length > 0 && (
                                    <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                                        <h3 className="text-white text-lg font-bold uppercase mb-4">Ready to Upload</h3>
                                        <div className="space-y-4">
                                            {pendingFiles.map((pending, index) => (
                                                <div 
                                                    key={index}
                                                    className="flex items-center gap-4 bg-zinc-900 border border-zinc-700 p-4 rounded"
                                                >
                                                    <div className="w-16 h-16 bg-zinc-700 rounded flex-shrink-0 overflow-hidden">
                                                        <img 
                                                            src={pending.preview} 
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex-grow">
                                                        <label className="text-gray-500 text-xs uppercase block mb-1">
                                                            Asset Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={pending.customName}
                                                            onChange={(e) => updatePendingName(index, e.target.value)}
                                                            className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                                                            placeholder="Enter a name for this asset"
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={() => removePendingFile(index)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                        title="Remove"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={uploadFiles}
                                            disabled={isUploading || pendingFiles.length === 0}
                                            className={`
                                                mt-6 w-full py-3 font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2
                                                ${isUploading 
                                                    ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' 
                                                    : 'bg-amber-500 hover:bg-amber-600 text-zinc-900'
                                                }
                                            `}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <FaSpinner className="animate-spin" />
                                                    Uploading to Vanguard Servers...
                                                </>
                                            ) : (
                                                <>
                                                    <FaUpload />
                                                    Upload {pendingFiles.length} {pendingFiles.length === 1 ? 'Asset' : 'Assets'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Uploaded Assets List */}
                                {isLoading ? (
                                    <div className="bg-zinc-800 border border-zinc-700 p-8 text-center">
                                        <FaSpinner className="text-amber-500 text-2xl animate-spin mx-auto mb-4" />
                                        <p className="text-gray-400">Loading your assets...</p>
                                    </div>
                                ) : uploadedAssets.length > 0 ? (
                                    <div className="bg-zinc-800 border border-zinc-700 p-6">
                                        <h3 className="text-white text-lg font-bold uppercase mb-4">Your Assets</h3>
                                        <div className="space-y-3">
                                            {uploadedAssets.map((asset) => (
                                                <div 
                                                    key={asset.id}
                                                    className="flex items-center justify-between bg-zinc-900 border border-zinc-700 p-4 rounded"
                                                >
                                                    <div className="flex items-center space-x-4 min-w-0">
                                                        <div className="w-12 h-12 bg-zinc-700 rounded flex-shrink-0 overflow-hidden">
                                                            <img 
                                                                src={asset.url} 
                                                                alt={asset.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-white font-medium truncate">{asset.name}</p>
                                                            <p className="text-gray-500 text-sm truncate">{asset.url}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                                        <button
                                                            onClick={() => copyToClipboard(asset)}
                                                            className={`p-2 transition-colors ${
                                                                copiedId === asset.id 
                                                                    ? 'text-green-500' 
                                                                    : 'text-gray-400 hover:text-amber-500'
                                                            }`}
                                                            title="Copy URL"
                                                        >
                                                            {copiedId === asset.id ? <FaCheck /> : <FaCopy />}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteAsset(asset.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                            title="Delete asset"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : pendingFiles.length === 0 && (
                                    <div className="bg-zinc-800/50 border border-zinc-700 border-dashed p-8 text-center">
                                        <p className="text-gray-500">
                                            No assets uploaded yet. Your personnel file appears concerningly empty.
                                        </p>
                                    </div>
                                )}
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
                        tectonic displacement, or spontaneous combustion resulting from asset uploads.
                    </p>
                </div>
            </section>
        </main>
    );
}