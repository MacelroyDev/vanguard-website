import Image from 'next/image'
import Link from 'next/link'
import { FaHardHat, FaCogs, FaChartLine, FaShieldAlt, FaArrowRight, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function HomePage() {
    return (
        <main className="bg-zinc-900 min-h-screen">
            
            {/* Hero Banner Section */}
            <section className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <Image
                    src="/images/vanguard-hero-banner.png"
                    alt="Mining operations"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-transparent"></div>
                
                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                    <div className="max-w-2xl">
                        <h1 className="text-amber-500 text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">
                            Sustainable Energy
                            <span className="block text-white">Begins Below.</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-8">
                            Leading the industry in sustainable maximum yield. Pioneering extraction solutions for a profitable future.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link 
                                href="/projects"
                                className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                            >
                                View Projects
                                <FaArrowRight className="ml-2" />
                            </Link>
                            <Link 
                                href="/contact"
                                className="inline-flex items-center px-6 py-3 border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
            </section>

            {/* Stats Section */}
            <section className="bg-zinc-800 py-12 border-b border-zinc-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '85+', label: 'Years Experience' },
                            { value: '150+', label: 'Projects Completed' },
                            { value: '9.7%', label: 'Safety Record' },
                            { value: '50M+', label: 'Tons Extracted' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-amber-500 text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-amber-500 text-sm uppercase tracking-widest mb-3">What We Do</h2>
                        <h3 className="text-white text-4xl font-bold uppercase">Our Services</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { 
                                icon: FaHardHat, 
                                title: 'Extraction', 
                                description: 'State-of-the-art extraction techniques for maximum resource yield.'
                            },
                            { 
                                icon: FaCogs, 
                                title: 'Processing', 
                                description: 'Advanced processing facilities ensuring highest quality output.'
                            },
                            { 
                                icon: FaChartLine, 
                                title: 'Consulting', 
                                description: 'Expert geological and engineering consulting services.'
                            },
                            { 
                                icon: FaShieldAlt, 
                                title: 'Safety', 
                                description: 'Industry-leading safety protocols and training programs.'
                            },
                        ].map((service, index) => (
                            <div 
                                key={index}
                                className="bg-zinc-800 border border-zinc-700 p-6 hover:border-amber-500 transition-colors duration-300 group"
                            >
                                <service.icon className="text-amber-500 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <h4 className="text-white text-xl font-semibold uppercase mb-3">{service.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Project Section */}
            <section className="py-20 bg-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] overflow-hidden">
                            <Image
                                src="/images/pb-vanguard-city.png" 
                                alt="Featured Project"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 border-2 border-amber-500 m-4 pointer-events-none"></div>
                        </div>
                        
                        <div>
                            <h2 className="text-amber-500 text-sm uppercase tracking-widest mb-3">Featured Project</h2>
                            <h3 className="text-white text-4xl font-bold uppercase mb-6">Project Lorem Ipsum</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Our flagship deep crust penetration project, utilizing cutting-edge technology to access 
                                previously unreachable mineral deposits. This groundbreaking initiative represents the 
                                future of sustainable extraction.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {['Deep crust penetration technology', 'Maximum yield optimization', 'Environmental sustainability'].map((item, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <span className="w-2 h-2 bg-amber-500 mr-3"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link 
                                href="/projects"
                                className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold uppercase tracking-wider transition-colors duration-200"
                            >
                                View All Projects
                                <FaArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-500 skew-y-1 transform origin-top-left"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-zinc-900 text-4xl font-bold uppercase mb-4">Ready to Start Your Project?</h2>
                    <p className="text-zinc-800 text-lg mb-8 max-w-2xl mx-auto">
                        Partner with the industry leader in extraction solutions. Let's build the future together.
                    </p>
                    <Link 
                        href="/contact"
                        className="inline-flex items-center px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-amber-500 font-semibold uppercase tracking-wider transition-colors duration-200"
                    >
                        Get in Touch
                        <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-950 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <h4 className="text-white font-bold text-xl mb-4">VANGUARD</h4>
                            <p className="text-gray-400 mb-4 max-w-md">
                                Leading the industry in sustainable extraction solutions. 
                                Unearthing tomorrow, one crater at a time.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    <FaPhone />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    <FaEnvelope />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                    <FaMapMarkerAlt />
                                </a>
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h5 className="text-amber-500 font-semibold uppercase tracking-wider mb-4">Quick Links</h5>
                            <ul className="space-y-2">
                                {['Services', 'Projects', 'Safety', 'Contact'].map((link) => (
                                    <li key={link}>
                                        <Link href={`/${link.toLowerCase()}`} className="text-gray-400 hover:text-amber-500 transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Investors */}
                        <div>
                            <h5 className="text-amber-500 font-semibold uppercase tracking-wider mb-4">Investors</h5>
                            <ul className="space-y-2">
                                {['Annual Reports', 'Stock Info', 'News', 'Governance'].map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Bottom Bar */}
                    <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2025 Vanguard Extraction Solutions. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="#" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    )
}