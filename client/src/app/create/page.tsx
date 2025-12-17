'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import PartyBackground from '@/components/PartyBackground';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePage() {
    const { user } = useAuth();
    const isVenueOwner = user?.role === 'venue_owner' || user?.role === 'admin';

    return (
        <>
            <PartyBackground />
            <Navbar />

            <main className="relative z-20 min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            What would you like to <span className="text-violet-400">create</span>?
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Start organizing your next unforgettable experience
                        </p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Create Event */}
                        <Link href="/create/event">
                            <div className="group h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-violet-500/30 transition-all duration-300 cursor-pointer">
                                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                                    Create an Event
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    Host a party, concert, workshop, or any gathering. Sell tickets or make it free. Public or private.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs">
                                        Public & Private
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs">
                                        Ticketing
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs">
                                        Free Events
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* List Venue */}
                        <Link href={isVenueOwner ? '/create/venue' : '/signup'}>
                            <div className="group h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-pink-500/30 transition-all duration-300 cursor-pointer">
                                <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                                    List a Venue
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    Own a space? List it on FIRA and start earning. Set your prices, availability, and rules.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs">
                                        Monetize
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs">
                                        Manage Bookings
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs">
                                        Get Verified
                                    </span>
                                </div>
                                {!isVenueOwner && (
                                    <p className="text-xs text-gray-500 mt-4">
                                        * Requires venue owner account
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-500 text-sm">
                            Need help getting started?{' '}
                            <Link href="/help" className="text-violet-400 hover:text-violet-300">
                                Check our guide
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
