'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaChartLine, FaArrowUp, FaArrowDown, FaHandshake, FaEnvelope } from 'react-icons/fa'

// Fake stock data
interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

// Fake sponsor/investor data
interface Sponsor {
    name: string;
    logo: string;
    tier: 'gold' | 'silver' | 'copper';
}

const sponsors: Sponsor[] = [
    { name: 'Triton Engineering', logo: "/images/triton-logo.svg", tier: 'gold' },
    { name: 'ANL Railways Group', logo: "/images/vanguard-logo.svg", tier: 'gold' },
    { name: 'WBCU', logo: "/images/vanguard-logo.svg", tier: 'gold' },
    { name: 'Lorem Ipsum', logo: "/images/vanguard-logo.svg", tier: 'silver' },
    { name: 'City of Gentriville', logo: "/images/vanguard-logo.svg", tier: 'silver' },
    { name: 'Big Grin', logo: "/images/vanguard-logo.svg", tier: 'silver' },
    { name: 'PLR', logo: "/images/vanguard-logo.svg", tier: 'copper' },
    { name: 'Adam Ville Pharmacy', logo: "/images/vanguard-logo.svg", tier: 'copper' },
    { name: 'PUBES Banking', logo: "/images/vanguard-logo.svg", tier: 'copper' },
];

// Seeded random for consistent "randomness"
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export default function InvestorsPage() {
    const [stocks, setStocks] = useState<StockData[]>([
        { symbol: 'VES', name: 'Vanguard Extraction Solutions', price: 847.32, change: 23.45, changePercent: 2.85 },
        { symbol: 'IMV', name: 'Innovative Medicines Vanguard', price: 234.56, change: -5.67, changePercent: -2.36 },
        { symbol: 'ANL', name: 'ANL Railways Group', price: 156.78, change: 8.90, changePercent: 6.02 },
        { symbol: 'TRTN', name: 'Triton Engineering', price: 512.34, change: 12.34, changePercent: 2.47 },
        { symbol: 'PLR', name: 'Peace Love Ruin', price: 12.45, change: -2.34, changePercent: -2.55 },
        { symbol: 'WBCU', name: 'World Building Commission Union', price: 345.67, change: 4.56, changePercent: 1.34 },
    ]);

    // Animate stock prices
    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(prevStocks => 
                prevStocks.map((stock, index) => {
                    const seed = Date.now() + index;
                    const randomChange = (seededRandom(seed) - 0.5) * 5;
                    const newPrice = Math.max(10, stock.price + randomChange);
                    const newChange = stock.change + randomChange * 0.1;
                    const newChangePercent = (newChange / newPrice) * 100;
                    
                    return {
                        ...stock,
                        price: Math.round(newPrice * 100) / 100,
                        change: Math.round(newChange * 100) / 100,
                        changePercent: Math.round(newChangePercent * 100) / 100,
                    };
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getTierStyle = (tier: string) => {
        switch (tier) {
            case 'gold':
                return 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-zinc-800';
            case 'silver':
                return 'border-gray-400/50 bg-gradient-to-br from-gray-400/10 to-zinc-800';
            case 'copper':
                return 'border-orange-700/50 bg-gradient-to-br from-orange-700/10 to-zinc-800';
            default:
                return 'border-zinc-700 bg-zinc-800';
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'gold':
                return 'text-amber-400';
            case 'silver':
                return 'text-gray-400';
            case 'copper':
                return 'text-orange-600';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <main className="bg-zinc-900 min-h-screen">
            {/* Stock Ticker Bar */}
            <div className="bg-zinc-950 border-b border-zinc-800 py-3 overflow-hidden">
                <div className="flex whitespace-nowrap animate-ticker">
                    {/* Triplicate stocks for seamless loop */}
                    {[...stocks, ...stocks, ...stocks].map((stock, index) => (
                        <div 
                            key={`${stock.symbol}-${index}`}
                            className="inline-flex items-center gap-3 px-6 border-r border-zinc-800"
                        >
                            <span className="text-white font-bold w-16">{stock.symbol}</span>
                            <span className="text-gray-400 w-24 text-right font-mono">${stock.price.toFixed(2)}</span>
                            <span className={`flex items-center gap-1 w-20 justify-end font-mono ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stock.change >= 0 ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
                                {Math.abs(stock.changePercent).toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Header Banner */}
            <section className="bg-zinc-800 border-b border-zinc-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <FaChartLine className="text-amber-500 text-4xl" />
                        <h1 className="text-amber-500 text-4xl md:text-5xl font-bold uppercase tracking-tight">
                            Investor Relations
                        </h1>
                    </div>
                    <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                        Extracting value. Delivering returns.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Join the industry leaders who have invested in the future of extraction technology. 
                        Vanguard Extraction Solutions offers unparalleled growth potential in the resource sector.
                    </p>
                </div>
            </section>

            {/* Stock Performance Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-white text-2xl font-bold uppercase mb-8">Market Performance</h2>
                    
                    {/* Main Stock Card - VES */}
                    <div className="bg-zinc-800 border border-zinc-700 p-8 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-amber-500 text-3xl font-bold">VES</span>
                                    <span className="text-gray-400">SASDIQ</span>
                                </div>
                                <p className="text-gray-500">Vanguard Extraction Solutions Inc.</p>
                            </div>
                            
                            <div className="text-right">
                                <p className="text-white text-4xl font-bold font-mono mb-1">
                                    ${stocks[0].price.toFixed(2)}
                                </p>
                                <p className={`text-lg flex items-center justify-end gap-2 font-mono ${stocks[0].change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {stocks[0].change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                    {stocks[0].change >= 0 ? '+' : ''}{stocks[0].change.toFixed(2)} ({stocks[0].changePercent.toFixed(2)}%)
                                </p>
                            </div>
                        </div>

                        {/* Fake Chart */}
                        <div className="mt-8 h-48 bg-zinc-900 rounded-lg flex items-end justify-around gap-1 p-4">
                            {Array.from({ length: 30 }).map((_, i) => {
                                const height = 30 + seededRandom(i * 100) * 70;
                                const isRecent = i > 25;
                                return (
                                    <div 
                                        key={i}
                                        className={`flex-1 rounded-t transition-all duration-300 ${
                                            isRecent ? 'bg-amber-500' : 'bg-zinc-700'
                                        }`}
                                        style={{ height: `${height}%` }}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-2 text-gray-500 text-xs">
                            <span>30 days ago</span>
                            <span>Today</span>
                        </div>
                    </div>

                    {/* Other Stocks Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {stocks.slice(1).map((stock) => (
                            <div key={stock.symbol} className="bg-zinc-800 border border-zinc-700 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white font-bold">{stock.symbol}</span>
                                    <span className={`flex items-center gap-1 text-sm font-mono ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {stock.change >= 0 ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
                                        {Math.abs(stock.changePercent).toFixed(2)}%
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-2 truncate">{stock.name}</p>
                                <p className="text-white text-2xl font-bold font-mono">${stock.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <p className="text-gray-600 text-xs mt-4 text-center">
                        * Stock prices shown are simulated and do not reflect actual market data. 
                        Vanguard Extraction Solutions is a fictional company. Past performance does not guarantee future results, 
                        especially when dealing with volatile extraction operations.
                    </p>
                </div>
            </section>

            {/* Key Metrics */}
            <section className="py-16 bg-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-white text-2xl font-bold uppercase mb-8 text-center">Key Metrics</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-6">
                            <p className="text-amber-500 text-4xl md:text-5xl font-bold mb-2">$4.2T</p>
                            <p className="text-gray-400 uppercase text-sm tracking-wider">Market Cap</p>
                        </div>
                        <div className="text-center p-6">
                            <p className="text-amber-500 text-4xl md:text-5xl font-bold mb-2">127%</p>
                            <p className="text-gray-400 uppercase text-sm tracking-wider">YoY Growth</p>
                        </div>
                        <div className="text-center p-6">
                            <p className="text-amber-500 text-4xl md:text-5xl font-bold mb-2">50M+</p>
                            <p className="text-gray-400 uppercase text-sm tracking-wider">Tons Extracted</p>
                        </div>
                        <div className="text-center p-6">
                            <p className="text-amber-500 text-4xl md:text-5xl font-bold mb-2">9.7%</p>
                            <p className="text-gray-400 uppercase text-sm tracking-wider">Safety Record*</p>
                        </div>
                    </div>

                    <p className="text-gray-600 text-xs mt-6 text-center">
                        * Safety record excludes The Pulverizer Incident (Both), Vanguard North, and all reports classified under The A.S.I.A. Building.
                    </p>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="py-20 relative overflow-hidden">
                {/* Angled Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 transform -skew-y-2 scale-110" />
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <FaHandshake className="text-zinc-900 text-6xl mx-auto mb-6" />
                    <h2 className="text-zinc-900 text-3xl md:text-4xl font-bold uppercase mb-4">
                        Become a Partner
                    </h2>
                    <p className="text-zinc-800 text-lg mb-8 max-w-2xl mx-auto">
                        Interested in investment opportunities? Our investor relations team is ready to discuss 
                        how Vanguard Extraction Solutions can deliver exceptional returns for your portfolio.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold uppercase tracking-wider transition-colors duration-200"
                        >
                            <FaEnvelope />
                            Contact Investor Relations
                        </Link>
                        <a 
                            href="#sponsors"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-semibold uppercase tracking-wider transition-colors duration-200"
                        >
                            View Our Partners
                        </a>
                    </div>
                </div>
            </section>

            {/* Sponsors/Investors Section */}
            <section id="sponsors" className="py-20 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-white text-3xl font-bold uppercase mb-4">Our Partners & Investors</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Vanguard Extraction Solutions is proud to partner with industry-leading organizations 
                            committed to advancing extraction technology and sustainable resource management.
                        </p>
                    </div>

                    {/* Gold Partners */}
                    <div className="mb-12">
                        <h3 className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-6 text-center">
                            Gold Partners
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {sponsors.filter(s => s.tier === 'gold').map((sponsor) => (
                                <div 
                                    key={sponsor.name}
                                    className={`border rounded-lg p-8 text-center transition-all duration-300 hover:scale-105 ${getTierStyle(sponsor.tier)}`}
                                >
                                    <div className="relative w-64 h-32 mx-auto mb-4">
                                        <Image 
                                            src={sponsor.logo}
                                            alt={`${sponsor.name} logo`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="text-white font-bold text-lg uppercase tracking-wide">{sponsor.name}</p>
                                    <p className={`text-xs uppercase tracking-widest mt-2 ${getTierColor(sponsor.tier)}`}>
                                        Gold Partner
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Silver Partners */}
                    <div className="mb-12">
                        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6 text-center">
                            Silver Partners
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {sponsors.filter(s => s.tier === 'silver').map((sponsor) => (
                                <div 
                                    key={sponsor.name}
                                    className={`border rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 ${getTierStyle(sponsor.tier)}`}
                                >
                                    <div className="relative w-64 h-20 mx-auto mb-4">
                                        <Image 
                                            src={sponsor.logo}
                                            alt={`${sponsor.name} logo`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="text-white font-bold uppercase tracking-wide">{sponsor.name}</p>
                                    <p className={`text-xs uppercase tracking-widest mt-2 ${getTierColor(sponsor.tier)}`}>
                                        Silver Partner
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Copper Partners */}
                    <div>
                        <h3 className="text-orange-600 text-sm font-semibold uppercase tracking-widest mb-6 text-center">
                            Copper Partners
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {sponsors.filter(s => s.tier === 'copper').map((sponsor) => (
                                <div 
                                    key={sponsor.name}
                                    className={`border rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 ${getTierStyle(sponsor.tier)}`}
                                >
                                    <div className="relative w-64 h-20 mx-auto mb-4">
                                        <Image 
                                            src={sponsor.logo}
                                            alt={`${sponsor.name} logo`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="text-white font-semibold text-sm uppercase tracking-wide">{sponsor.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Become a Partner CTA */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-500 mb-4">Interested in becoming a partner?</p>
                        <Link 
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                        >
                            <FaHandshake />
                            Partner With Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Disclaimer */}
            <section className="bg-zinc-900 py-8 border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600 text-sm">
                        All investments carry risk, however Vanguard can ensure* return on investment. Please
                        <span className="underline decoration-solid mx-1">DO NOT</span>
                        consult with a financial advisor before making any decisions.
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        *Vanguard Extraction Solutions is not responsible for any financial losses resulting from investment activities.
                    </p>
                </div>
            </section>
        </main>
    );
}