'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui';

type EventTab = 'attending' | 'organizing';

const mockEvents = {
    attending: [
        {
            id: '1',
            name: 'Neon Nights Festival',
            date: '2025-12-24',
            time: '21:00',
            venue: 'Skyline Terrace, Mumbai',
            image: '/event1.jpg',
            status: 'upcoming',
            ticketCount: 2,
        },
        {
            id: '2',
            name: 'Acoustic Evening',
            date: '2025-12-28',
            time: '19:00',
            venue: 'The Loft Studio, Bangalore',
            image: '/event2.jpg',
            status: 'upcoming',
            ticketCount: 1,
        },
    ],
    organizing: [
        {
            id: '3',
            name: 'Birthday Bash',
            date: '2025-12-31',
            time: '20:00',
            venue: 'Private Venue, Delhi',
            image: '/event3.jpg',
            status: 'upcoming',
            attendees: 45,
            capacity: 100,
        },
        {
            id: '4',
            name: 'New Year Celebration',
            date: '2026-01-01',
            time: '23:00',
            venue: 'Grand Ballroom, Hyderabad',
            image: '/event4.jpg',
            status: 'draft',
            attendees: 0,
            capacity: 200,
        },
    ],
};

export default function EventsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<EventTab>('attending');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/signin');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
                </div>
            </DashboardLayout>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
                    <p className="text-gray-400">Manage your events and see what you&apos;re attending</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('attending')}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'attending'
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
                            }`}
                    >
                        Attending
                    </button>
                    <button
                        onClick={() => setActiveTab('organizing')}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'organizing'
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
                            }`}
                    >
                        Organizing
                    </button>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {activeTab === 'attending' &&
                        mockEvents.attending.map((event) => (
                            <div
                                key={event.id}
                                className="group bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
                            >
                                {/* Event Image */}
                                <div className="h-40 bg-gradient-to-br from-violet-500/30 to-pink-500/30 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium backdrop-blur-sm border border-green-500/20">
                                            Upcoming
                                        </span>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                                        {event.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(event.date)} • {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {event.venue}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                                        <span className="text-sm text-gray-400">
                                            {event.ticketCount} ticket{event.ticketCount > 1 ? 's' : ''}
                                        </span>
                                        <Link href={`/dashboard/tickets`}>
                                            <Button variant="ghost" size="sm">
                                                View Tickets
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {activeTab === 'organizing' &&
                        mockEvents.organizing.map((event) => (
                            <div
                                key={event.id}
                                className="group bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
                            >
                                {/* Event Image */}
                                <div className="h-40 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${event.status === 'upcoming'
                                                ? 'bg-violet-500/20 text-violet-300 border-violet-500/20'
                                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20'
                                            }`}>
                                            {event.status === 'upcoming' ? 'Live' : 'Draft'}
                                        </span>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                                        {event.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(event.date)} • {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {event.venue}
                                    </div>

                                    {/* Attendees Progress */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Attendees</span>
                                            <span className="text-white">{event.attendees}/{event.capacity}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all"
                                                style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-white/[0.05]">
                                        <Button variant="secondary" size="sm" className="flex-1">
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="sm" className="flex-1">
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Empty State */}
                {((activeTab === 'attending' && mockEvents.attending.length === 0) ||
                    (activeTab === 'organizing' && mockEvents.organizing.length === 0)) && (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
                            <p className="text-gray-400 mb-6">
                                {activeTab === 'attending'
                                    ? 'Start exploring events to attend!'
                                    : 'Create your first event and start organizing!'}
                            </p>
                            <Button onClick={() => router.push(activeTab === 'attending' ? '/events' : '/create/event')}>
                                {activeTab === 'attending' ? 'Browse Events' : 'Create Event'}
                            </Button>
                        </div>
                    )}

                {/* Create Event FAB for organizing tab */}
                {activeTab === 'organizing' && (
                    <Link href="/create/event">
                        <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 z-50">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </Link>
                )}
            </div>
        </DashboardLayout>
    );
}
