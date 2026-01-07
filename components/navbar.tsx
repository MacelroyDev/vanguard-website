'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaSearch, FaTimes, FaBars } from 'react-icons/fa'
import Logo from '../public/images/vanguard-logo.svg'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

interface NavbarProps {
    pathname: string;
}

export default function Navbar({ pathname }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services' },
        { href: '/projects', label: 'Projects' },
        { href: '/investors', label: 'Investors' },
        { href: '/employee-portal', label: 'Employee Portal' },
        { href: '/contact', label: 'Contact' },
    ];

    function getLinkStyle(href: string) {
        const baseStyle = "relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200";
        
        if (pathname === href) {
            return `${baseStyle} text-amber-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-500`;
        }
        return `${baseStyle} text-gray-300 hover:text-amber-500`;
    }

    function getMobileLinkStyle(href: string) {
        const baseStyle = "block px-4 py-3 text-base font-medium tracking-wide uppercase transition-colors duration-200 border-b border-zinc-800";
        
        if (pathname === href) {
            return `${baseStyle} text-amber-500 bg-zinc-800/50`;
        }
        return `${baseStyle} text-gray-300 hover:text-amber-500 hover:bg-zinc-800/50`;
    }

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            <nav className="bg-zinc-900 border-b border-zinc-800 shadow-lg relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        
                        {/* Logo Section */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                                <Logo className="h-14 w-auto text-amber-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm tracking-wider">VANGUARD</span>
                                <span className="text-amber-500 text-xs tracking-widest">EXTRACTION SOLUTIONS</span>
                            </div>
                        </div>

                        {/* Navigation Links - Desktop */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                    className={getLinkStyle(link.href)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side - Auth & Search */}
                        <div className="flex items-center space-x-4">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="hidden sm:block px-4 py-2 text-sm font-medium text-amber-500 hover:text-amber-400 uppercase tracking-wider transition-colors duration-200">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                            
                            <SignedIn>
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8"
                                        }
                                    }}
                                />
                            </SignedIn>

                            {/* Search Icon - Desktop */}
                            <button 
                                className="hidden md:block p-2 text-gray-400 hover:text-amber-500 transition-colors duration-200"
                                aria-label="Search"
                            >
                                <FaSearch className="w-4 h-4" />
                            </button>

                            {/* Mobile Menu Button */}
                            <button 
                                className="md:hidden p-2 text-gray-400 hover:text-amber-500 transition-colors duration-200"
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <FaTimes className="w-6 h-6" />
                                ) : (
                                    <FaBars className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Accent line at bottom */}
                <div className="h-0.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${
                    mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeMobileMenu}
            />

            {/* Mobile Menu Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <span className="text-amber-500 font-bold uppercase tracking-wider">Menu</span>
                    <button 
                        onClick={closeMobileMenu}
                        className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                        aria-label="Close menu"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="py-2">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href}
                            className={getMobileLinkStyle(link.href)}
                            onClick={closeMobileMenu}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button 
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                                onClick={closeMobileMenu}
                            >
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    
                    <SignedIn>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10"
                                        }
                                    }}
                                />
                                <span className="text-gray-400 text-sm">Account</span>
                            </div>
                        </div>
                    </SignedIn>

                    {/* Vanguard Branding */}
                    <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                        <p className="text-gray-600 text-xs">
                            © {new Date().getFullYear()} Vanguard Extraction Solutions
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}