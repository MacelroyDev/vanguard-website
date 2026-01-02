'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useState, useCallback } from 'react'
import { FaUpload, FaLink, FaCopy, FaCheck, FaTrash, FaExclamationTriangle } from 'react-icons/fa'
import Image from 'next/image'

interface UploadedAsset {
    id: string;
    url: string;
    name: string;
    uploadedAt: Date;
}

export default function EmployeePortal() {
    const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

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
        handleFiles(files);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        setIsUploading(true);
        
        // TODO: Replace with actual upload logic to your storage service
        // This is a placeholder that creates fake URLs
        for (const file of files) {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newAsset: UploadedAsset = {
                id: Math.random().toString(36).substring(7),
                url: `https://assets.vanguard-extraction.com/${file.name}`, // Replace with real URL
                name: file.name,
                uploadedAt: new Date(),
            };
            
            setUploadedAssets(prev => [...prev, newAsset]);
        }
        
        setIsUploading(false);
    };

    const copyToClipboard = async (asset: UploadedAsset) => {
        await navigator.clipboard.writeText(asset.url);
        setCopiedId(asset.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteAsset = (id: string) => {
        setUploadedAssets(prev => prev.filter(asset => asset.id !== id));
    };

    return (
        <main className="bg-zinc-900 min-h-screen">
            {/* Header Banner */}
            <section className="bg-zinc-800 border-b border-zinc-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-amber-500 text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                        Employee Portal
                    </h1>
                    <h1 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
                        Your identity. Our property.
                    </h1>
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
                                        <p className="text-white font-semibold">Standard Contractor</p>
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
                                    `}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileInput}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <FaUpload className={`text-4xl mx-auto mb-4 ${isDragging ? 'text-amber-500' : 'text-gray-500'}`} />
                                        <p className="text-white font-semibold mb-2">
                                            {isUploading ? 'Processing assets...' : 'Drop files here or click to upload'}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </label>
                                </div>
                            </div>

                            {/* Uploaded Assets List */}
                            {uploadedAssets.length > 0 && (
                                <div className="bg-zinc-800 border border-zinc-700 p-6">
                                    <h3 className="text-white text-lg font-bold uppercase mb-4">Your Assets</h3>
                                    <div className="space-y-3">
                                        {uploadedAssets.map((asset) => (
                                            <div 
                                                key={asset.id}
                                                className="flex items-center justify-between bg-zinc-900 border border-zinc-700 p-4 rounded"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-zinc-700 rounded flex items-center justify-center">
                                                        <FaLink className="text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{asset.name}</p>
                                                        <p className="text-gray-500 text-sm truncate max-w-xs">{asset.url}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => copyToClipboard(asset)}
                                                        className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                                                        title="Copy URL"
                                                    >
                                                        {copiedId === asset.id ? (
                                                            <FaCheck className="text-green-500" />
                                                        ) : (
                                                            <FaCopy />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAsset(asset.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {uploadedAssets.length === 0 && (
                                <div className="bg-zinc-800/50 border border-zinc-700 border-dashed p-8 text-center">
                                    <p className="text-gray-500">
                                        No assets uploaded yet. Your personnel file appears concerningly empty.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </SignedIn>
            </div>

            {/* Footer Disclaimer */}
            <section className="bg-zinc-950 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Vanguard Extraction Solutions is not responsible for any identity theft, 
                        interdimensional displacement, or spontaneous combustion resulting from asset uploads.
                    </p>
                </div>
            </section>
        </main>
    );
}