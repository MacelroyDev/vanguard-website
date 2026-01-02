import Image from 'next/image'
import Link from 'next/link'
import { FaSearch } from 'react-icons/fa'
import Logo from '../public/images/vanguard-logo.svg'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs'

interface NavbarProps {
    pathname: string;
}

export default function Navbar({ pathname }: NavbarProps) {

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

    return (
        <nav className="bg-zinc-900 border-b border-zinc-800 shadow-lg">
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

                    {/* Navigation Links */}
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

                    {/* Right Side - Auth */}
                    <div className="flex items-center space-x-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 text-sm font-medium text-amber-500 hover:text-amber-400 uppercase tracking-wider transition-colors duration-200">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        
                        <SignedIn>
                            <div className="flex items-center space-x-3">
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8"
                                        }
                                    }}
                                />
                                <SignOutButton>
                                    <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors duration-200">
                                        Sign Out
                                    </button>
                                </SignOutButton>
                            </div>
                        </SignedIn>
                    </div>

                    {/* Search Icon */}
                    <div className="flex items-center">
                        <button 
                            className="p-2 text-gray-400 hover:text-amber-500 transition-colors duration-200"
                            aria-label="Search"
                        >
                            <FaSearch className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            className="p-2 text-gray-400 hover:text-amber-500"
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Optional: Accent line at bottom */}
            <div className="h-0.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
        </nav>
    )
}