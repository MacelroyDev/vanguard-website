'use client'

import { useState } from 'react'
import { FaEnvelope, FaPaperPlane, FaExclamationTriangle, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Pretend to submit
        setSubmitted(true);
    };

    return (
        <main className="bg-zinc-900 min-h-screen">
            {/* Header Banner */}
            <section className="bg-zinc-800 border-b border-zinc-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <FaEnvelope className="text-amber-500 text-4xl" />
                        <h1 className="text-amber-500 text-4xl md:text-5xl font-bold uppercase tracking-tight">
                            Contact Us
                        </h1>
                    </div>
                    <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                        We&apos;re here to listen.*
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Have questions about our extraction operations? Concerns about that tremor near your property? 
                        We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-zinc-800 border border-zinc-700 p-12 text-center">
                                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaPaperPlane className="text-amber-500 text-3xl" />
                                </div>
                                <h3 className="text-white text-2xl font-bold uppercase mb-4">
                                    Message Received!
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Thank you for your inquiry. Your message has been successfully 
                                    forwarded to our automated disposal system.
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Expected response time: Never
                                </p>
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setFormData({ name: '', email: '', subject: '', message: '' });
                                    }}
                                    className="mt-8 px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-900 font-semibold uppercase tracking-wider transition-colors"
                                >
                                    Submit Another Inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-zinc-800 border border-zinc-700 p-8">
                                <h3 className="text-white text-xl font-bold uppercase mb-6">Send Us a Message</h3>
                                
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Vanguard Wagey"
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="wagey@example.com"
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                                    >
                                        <option value="">Select a subject...</option>
                                        <option value="investment">Investment Opportunities</option>
                                        <option value="partnership">Partnership Inquiry</option>
                                        <option value="employment">Employment (We&apos;re always hiring)</option>
                                        <option value="complaint">Complaint (Not recommended)</option>
                                        <option value="sinkhole">Sinkhole on Property</option>
                                        <option value="tremors">Unexplained Tremors</option>
                                        <option value="missing">Missing Family Member (Field Operations)</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        placeholder="Please describe your inquiry in detail. Include any relevant incident numbers, coordinates of sinkholes, or last known locations..."
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex items-start gap-3 mb-6">
                                    <input
                                        type="checkbox"
                                        id="consent"
                                        required
                                        className="mt-1 w-4 h-4 accent-amber-500"
                                    />
                                    <label htmlFor="consent" className="text-gray-500 text-sm">
                                        I understand that by submitting this form, I waive all rights to legal action against 
                                        Vanguard Extraction Solutions and its subsidiaries, regardless of outcome. <span className="text-red-500">*</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaPaperPlane />
                                    Submit Inquiry
                                </button>
                            </form>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-8 bg-red-500/10 border border-red-500/30 p-6">
                            <div className="flex items-start gap-4">
                                <FaExclamationTriangle className="text-red-500 text-2xl flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-red-500 font-bold uppercase mb-2">Important Disclaimer</h4>
                                    <p className="text-gray-400 text-sm mb-3">
                                        All inquiries submitted through this form will be automatically scrapped and 
                                        <span className="text-red-400 font-semibold"> will not be read </span> 
                                        by any human employee. This form exists purely for regulatory compliance purposes.
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        * &quot;Listening&quot; is defined as the technical receipt of data packets and does not 
                                        imply comprehension, consideration, or response. Vanguard Extraction Solutions 
                                        maintains a strict policy of strategic non-engagement with all external communications.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Contact Info */}
                        <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                            <h3 className="text-amber-500 text-sm uppercase tracking-widest mb-6">Contact Information</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <FaPhone className="text-amber-500 mt-1" />
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Phone</p>
                                        <p className="text-white">1-800-EXTRACT</p>
                                        <p className="text-gray-500 text-xs">(Automated system only)</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <FaEnvelope className="text-amber-500 mt-1" />
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Email</p>
                                        <p className="text-white">vanguard@none.com</p>
                                        <p className="text-gray-500 text-xs">(Derelict)</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-amber-500 mt-1" />
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Headquarters</p>
                                        <p className="text-white">212 Vanguard Ave. West</p>
                                        <p className="text-white">Vanguard City, Server</p>
                                        <p className="text-gray-500 text-xs">(Visitors not permitted)</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <FaClock className="text-amber-500 mt-1" />
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase mb-1">Business Hours</p>
                                        <p className="text-white">24/7/365</p>
                                        <p className="text-gray-500 text-xs">(Extraction never sleeps)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Response Times */}
                        <div className="bg-zinc-800 border border-zinc-700 p-6 mb-6">
                            <h3 className="text-amber-500 text-sm uppercase tracking-widest mb-4">Expected Response Times</h3>
                            <ul className="space-y-3">
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-400">Investment Inquiries</span>
                                    <span className="text-green-500">2-3 minutes</span>
                                </li>
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-400">Partnership</span>
                                    <span className="text-amber-500">1-2 days</span>
                                </li>
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-400">Employment</span>
                                    <span className="text-amber-500">1-2 hours</span>
                                </li>
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-400">Complaints</span>
                                    <span className="text-red-500">Never</span>
                                </li>
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-400">Sinkhole Reports</span>
                                    <span className="text-red-500">Denied</span>
                                </li>
                                <li className="flex justify-between text-sm">
                                    <span className="text-gray-400">Missing Persons</span>
                                    <span className="text-red-500">Classified</span>
                                </li>
                            </ul>
                            <p className="text-gray-600 text-xs mt-4">
                                * Immediate deployment to nearest active extraction site
                            </p>
                        </div>

                    
                    </div>
                </div>
            </div>

            {/* Footer Disclaimer */}
            <section className="bg-zinc-950 py-8 border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Vanguard Extraction Solutions is legally required to provide a contact form. 
                        We are not legally required to read it.
                    </p>
                </div>
            </section>
        </main>
    );
}