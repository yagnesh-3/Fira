'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PartyBackground from '@/components/PartyBackground';
import { Button, Input } from '@/components/ui';

const mockBrands = [
    {
        id: '1',
        name: 'DJ Cosmic',
        type: 'brand',
        avatar: null,
        followers: 15420,
        description: 'Electronic music producer and DJ. Bringing cosmic vibes to your events.',
        eventsCount: 45,
        isVerified: true,
    },
    {
        id: '2',
        name: 'Indie Collective',
        type: 'band',
        avatar: null,
        followers: 8750,
        description: 'Acoustic melodies and soul-stirring performances. Music that moves you.',
        eventsCount: 32,
        isVerified: true,
    },
    {
        id: '3',
        name: 'RetroBeats Club',
        type: 'organizer',
        avatar: null,
        followers: 22100,
        description: 'The best 80s and 90s throwback parties in town. Nostalgia guaranteed.',
        eventsCount: 78,
        isVerified: true,
    },
    {
        id: '4',
        name: 'Night Owl Events',
        type: 'organizer',
        avatar: null,
        followers: 5600,
        description: 'Premium nightlife experiences and exclusive events.',
        eventsCount: 23,
        isVerified: true,
    },
    {
        id: '5',
        name: 'The Acoustic House',
        type: 'band',
        avatar: null,
        followers: 4200,
        description: 'Unplugged sessions and intimate musical experiences.',
        eventsCount: 18,
        isVerified: true,
    },
    {
        id: '6',
        name: 'Pulse Productions',
        type: 'brand',
        avatar: null,
        followers: 31000,
        description: 'Large-scale music festivals and concerts. Experience the pulse.',
        eventsCount: 12,
        isVerified: true,
    },
];

const filterTypes = ['All', 'Brand', 'Band', 'Organizer'];

export default function BrandsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [brands] = useState(mockBrands);

    const filteredBrands = brands.filter((brand) => {
        const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brand.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All' ||
            brand.type.toLowerCase() === selectedType.toLowerCase();
        return matchesSearch && matchesType;
    });

    const formatFollowers = (count: number) => {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    };

    return (
        <>
            <PartyBackground />
            <Navbar />

            <main className="relative z-20 min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Verified <span className="text-violet-400">Brands & Artists</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Discover verified event organizers, bands, and brands. Follow your favorites to never miss an event.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search brands, bands, organizers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    leftIcon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                {filterTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === type
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Brands Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBrands.map((brand) => (
                            <div
                                key={brand.id}
                                className="group bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                        {brand.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white truncate">{brand.name}</h3>
                                            <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${brand.type === 'brand' ? 'bg-violet-500/20 text-violet-400' :
                                            brand.type === 'band' ? 'bg-pink-500/20 text-pink-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {brand.type}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {brand.description}
                                </p>

                                <div className="flex items-center justify-between mb-4 text-sm">
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{formatFollowers(brand.followers)} followers</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{brand.eventsCount} events</span>
                                    </div>
                                </div>

                                <Button variant="secondary" className="w-full">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Follow
                                </Button>
                            </div>
                        ))}
                    </div>

                    {filteredBrands.length === 0 && (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                            <p className="text-gray-400">Try adjusting your search or filters</p>
                        </div>
                    )}

                    {/* CTA Section */}
                    <div className="mt-16 bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Are you a brand, band, or organizer?
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                            Get verified on FIRA to build your audience, increase visibility, and connect with your fans.
                        </p>
                        <Button>Apply for Verification</Button>
                    </div>
                </div>
            </main>
        </>
    );
}
