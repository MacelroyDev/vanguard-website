import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import "./globals.css"
import ClientNavbar from '@/components/clientNavbar'

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Vanguard",
    description: "Sustainable Energy Begins Below.",
    icons: {
        icon: '/favicon.svg',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: '#f59e0b',
                    colorBackground: '#27272a',
                    colorText: '#ffffff',
                    colorTextSecondary: '#a1a1aa',
                    colorInputBackground: '#18181b',
                    colorInputText: '#ffffff',
                    borderRadius: '0.25rem',
                },
                elements: {
                    formButtonPrimary: 
                        'bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider',
                    card: 'bg-zinc-800 border border-zinc-700',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-gray-400',
                    socialButtonsBlockButton: 
                        'bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600',
                    formFieldLabel: 'text-gray-300',
                    formFieldInput: 
                        'bg-zinc-900 border-zinc-700 text-white',
                    footerActionLink: 'text-amber-500 hover:text-amber-400',
                }
            }}
        >
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}>
                    <ClientNavbar />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}