'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PartyBackground from '@/components/PartyBackground';
import EventCard from '@/components/EventCard';
import { EventCardSkeleton, Input, Button } from '@/components/ui';
import { eventsApi } from '@/lib/api';
import { Event } from '@/lib/types';

const categories = ['All', 'Party', 'Concert', 'Wedding', 'Corporate', 'Birthday', 'Festival'];
const eventTypes = ['All', 'Public', 'Private'];
const ticketTypes = ['All', 'Free', 'Paid'];

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedEventType, setSelectedEventType] = useState('All');
    const [selectedTicketType, setSelectedTicketType] = useState('All');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const data = await eventsApi.getUpcoming();
            setEvents(data as Event[]);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            // Use mock data for demo
            setEvents(getMockEvents());
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' ||
            event.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesEventType = selectedEventType === 'All' ||
            event.eventType.toLowerCase() === selectedEventType.toLowerCase();
        const matchesTicketType = selectedTicketType === 'All' ||
            (selectedTicketType === 'Free' && event.ticketType === 'free') ||
            (selectedTicketType === 'Paid' && event.ticketType === 'paid');
        return matchesSearch && matchesCategory && matchesEventType && matchesTicketType;
    });

    return (
        <>
            <PartyBackground />
            <Navbar />

            <main className="relative z-20 min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Upcoming <span className="text-violet-400">Events</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Discover the hottest parties, concerts, and gatherings happening near you.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 mb-8">
                        <div className="flex flex-col gap-4">
                            {/* Search Bar */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        leftIcon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        }
                                    />
                                </div>
                                <Button variant="secondary">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Date
                                </Button>
                            </div>

                            {/* Category Filter */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Additional Filters */}
                            <div className="flex flex-wrap gap-4">
                                {/* Event Type */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Type:</span>
                                    <div className="flex gap-2">
                                        {eventTypes.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedEventType(type)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedEventType === type
                                                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                    : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ticket Type */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">Tickets:</span>
                                    <div className="flex gap-2">
                                        {ticketTypes.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedTicketType(type)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedTicketType === type
                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                    : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-400">
                            {isLoading ? 'Loading...' : `${filteredEvents.length} events found`}
                        </p>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <EventCardSkeleton key={i} />
                            ))
                        ) : filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                                <p className="text-gray-400">Try adjusting your filters or check back later</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

// Mock data for demo purposes
function getMockEvents(): Event[] {
    return [
        {
            _id: '1',
            organizer: { _id: 'u1', name: 'DJ Cosmic', email: '', avatar: null, phone: null, role: 'user', isVerified: true, verificationBadge: 'brand', socialLinks: { instagram: null, twitter: null, facebook: null, website: null }, followers: [], following: [], bankDetails: { accountName: null, accountNumber: null, ifscCode: null, bankName: null }, isActive: true, createdAt: '', updatedAt: '' },
            venue: { _id: 'v1', name: 'Skyline Terrace', owner: '', description: '', images: [], videos: [], capacity: { min: 0, max: 0 }, pricing: { basePrice: 0, pricePerHour: null, currency: 'INR' }, amenities: [], rules: [], location: { type: 'Point', coordinates: [0, 0] }, address: { street: '', city: 'Mumbai', state: '', pincode: '', country: '' }, availability: [], blockedDates: [], status: 'approved', rating: { average: 0, count: 0 }, isActive: true, createdAt: '', updatedAt: '' },
            booking: null,
            name: 'Neon Nights Festival',
            description: 'An electrifying night of EDM and visual art.',
            images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'],
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '21:00',
            endTime: '04:00',
            eventType: 'public',
            ticketType: 'paid',
            ticketPrice: 1500,
            maxAttendees: 500,
            currentAttendees: 342,
            privateCode: null,
            category: 'party',
            tags: ['EDM', 'Dance', 'Neon'],
            status: 'upcoming',
            isFeatured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '2',
            organizer: { _id: 'u2', name: 'Indie Collective', email: '', avatar: null, phone: null, role: 'user', isVerified: true, verificationBadge: 'band', socialLinks: { instagram: null, twitter: null, facebook: null, website: null }, followers: [], following: [], bankDetails: { accountName: null, accountNumber: null, ifscCode: null, bankName: null }, isActive: true, createdAt: '', updatedAt: '' },
            venue: { _id: 'v2', name: 'The Loft Studio', owner: '', description: '', images: [], videos: [], capacity: { min: 0, max: 0 }, pricing: { basePrice: 0, pricePerHour: null, currency: 'INR' }, amenities: [], rules: [], location: { type: 'Point', coordinates: [0, 0] }, address: { street: '', city: 'Bangalore', state: '', pincode: '', country: '' }, availability: [], blockedDates: [], status: 'approved', rating: { average: 0, count: 0 }, isActive: true, createdAt: '', updatedAt: '' },
            booking: null,
            name: 'Acoustic Evening',
            description: 'An intimate acoustic session with local artists.',
            images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'],
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '19:00',
            endTime: '22:00',
            eventType: 'public',
            ticketType: 'free',
            ticketPrice: 0,
            maxAttendees: 80,
            currentAttendees: 65,
            privateCode: null,
            category: 'concert',
            tags: ['Acoustic', 'Live Music', 'Indie'],
            status: 'upcoming',
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '3',
            organizer: { _id: 'u3', name: 'TechMeet India', email: '', avatar: null, phone: null, role: 'user', isVerified: false, verificationBadge: 'none', socialLinks: { instagram: null, twitter: null, facebook: null, website: null }, followers: [], following: [], bankDetails: { accountName: null, accountNumber: null, ifscCode: null, bankName: null }, isActive: true, createdAt: '', updatedAt: '' },
            venue: { _id: 'v3', name: 'Conference Center', owner: '', description: '', images: [], videos: [], capacity: { min: 0, max: 0 }, pricing: { basePrice: 0, pricePerHour: null, currency: 'INR' }, amenities: [], rules: [], location: { type: 'Point', coordinates: [0, 0] }, address: { street: '', city: 'Hyderabad', state: '', pincode: '', country: '' }, availability: [], blockedDates: [], status: 'approved', rating: { average: 0, count: 0 }, isActive: true, createdAt: '', updatedAt: '' },
            booking: null,
            name: 'Startup Mixer 2025',
            description: 'Network with founders, investors, and tech enthusiasts.',
            images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '10:00',
            endTime: '18:00',
            eventType: 'public',
            ticketType: 'paid',
            ticketPrice: 500,
            maxAttendees: 200,
            currentAttendees: 156,
            privateCode: null,
            category: 'corporate',
            tags: ['Startup', 'Networking', 'Tech'],
            status: 'upcoming',
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '4',
            organizer: { _id: 'u4', name: 'Priya & Rahul', email: '', avatar: null, phone: null, role: 'user', isVerified: false, verificationBadge: 'none', socialLinks: { instagram: null, twitter: null, facebook: null, website: null }, followers: [], following: [], bankDetails: { accountName: null, accountNumber: null, ifscCode: null, bankName: null }, isActive: true, createdAt: '', updatedAt: '' },
            venue: { _id: 'v4', name: 'Heritage Villa', owner: '', description: '', images: [], videos: [], capacity: { min: 0, max: 0 }, pricing: { basePrice: 0, pricePerHour: null, currency: 'INR' }, amenities: [], rules: [], location: { type: 'Point', coordinates: [0, 0] }, address: { street: '', city: 'Delhi', state: '', pincode: '', country: '' }, availability: [], blockedDates: [], status: 'approved', rating: { average: 0, count: 0 }, isActive: true, createdAt: '', updatedAt: '' },
            booking: null,
            name: 'Wedding Reception',
            description: 'Join us for an evening of celebration and joy.',
            images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'],
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '18:00',
            endTime: '23:00',
            eventType: 'private',
            ticketType: 'free',
            ticketPrice: 0,
            maxAttendees: 300,
            currentAttendees: 0,
            privateCode: 'PR2025',
            category: 'wedding',
            tags: ['Wedding', 'Reception', 'Celebration'],
            status: 'upcoming',
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '5',
            organizer: { _id: 'u5', name: 'RetroBeats Club', email: '', avatar: null, phone: null, role: 'user', isVerified: true, verificationBadge: 'organizer', socialLinks: { instagram: null, twitter: null, facebook: null, website: null }, followers: [], following: [], bankDetails: { accountName: null, accountNumber: null, ifscCode: null, bankName: null }, isActive: true, createdAt: '', updatedAt: '' },
            venue: { _id: 'v5', name: 'Beach Resort Pavilion', owner: '', description: '', images: [], videos: [], capacity: { min: 0, max: 0 }, pricing: { basePrice: 0, pricePerHour: null, currency: 'INR' }, amenities: [], rules: [], location: { type: 'Point', coordinates: [0, 0] }, address: { street: '', city: 'Chennai', state: '', pincode: '', country: '' }, availability: [], blockedDates: [], status: 'approved', rating: { average: 0, count: 0 }, isActive: true, createdAt: '', updatedAt: '' },
            booking: null,
            name: 'Retro Beach Party',
            description: '80s and 90s vibes at the beach with live DJs.',
            images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'],
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '17:00',
            endTime: '01:00',
            eventType: 'public',
            ticketType: 'paid',
            ticketPrice: 999,
            maxAttendees: 400,
            currentAttendees: 287,
            privateCode: null,
            category: 'party',
            tags: ['Retro', 'Beach', 'Party'],
            status: 'upcoming',
            isFeatured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '6',
            organizer: { _id: 'u6', name: 'Sarah', email: '', avatar: null, phone: null, role: 'user', isVerified: false, verificationBadge: 'none', socialLinks: { instagram: null, twitter: null, facebook: null, website: null }, followers: [], following: [], bankDetails: { accountName: null, accountNumber: null, ifscCode: null, bankName: null }, isActive: true, createdAt: '', updatedAt: '' },
            venue: { _id: 'v6', name: 'Garden Marquee', owner: '', description: '', images: [], videos: [], capacity: { min: 0, max: 0 }, pricing: { basePrice: 0, pricePerHour: null, currency: 'INR' }, amenities: [], rules: [], location: { type: 'Point', coordinates: [0, 0] }, address: { street: '', city: 'Pune', state: '', pincode: '', country: '' }, availability: [], blockedDates: [], status: 'approved', rating: { average: 0, count: 0 }, isActive: true, createdAt: '', updatedAt: '' },
            booking: null,
            name: 'Birthday Bash - Sarah Turns 30!',
            description: 'Celebrating three decades of awesomeness!',
            images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'],
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '19:00',
            endTime: '00:00',
            eventType: 'private',
            ticketType: 'free',
            ticketPrice: 0,
            maxAttendees: 50,
            currentAttendees: 0,
            privateCode: 'SARAH30',
            category: 'birthday',
            tags: ['Birthday', 'Party', 'Celebration'],
            status: 'upcoming',
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];
}
