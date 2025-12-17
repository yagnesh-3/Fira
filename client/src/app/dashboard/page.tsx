'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui';

const quickStats = [
    { label: 'Upcoming Events', value: '3', icon: 'calendar', color: 'violet' },
    { label: 'Active Tickets', value: '5', icon: 'ticket', color: 'green' },
    { label: 'Bookings', value: '2', icon: 'building', color: 'blue' },
    { label: 'Following', value: '12', icon: 'users', color: 'pink' },
];

const recentActivity = [
    { type: 'ticket', title: 'Purchased ticket for Neon Nights Festival', time: '2 hours ago' },
    { type: 'booking', title: 'Venue booking confirmed at The Grand Ballroom', time: '1 day ago' },
    { type: 'event', title: 'Created event: Birthday Bash', time: '3 days ago' },
];

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/signin');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
                </div>
            </DashboardLayout>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const getIcon = (name: string) => {
        const icons: Record<string, React.ReactNode> = {
            'calendar': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            'ticket': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            ),
            'building': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
            ),
            'users': (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        };
        return icons[name] || null;
    };

    const colorClasses: Record<string, string> = {
        violet: 'bg-violet-500/20 text-violet-400',
        green: 'bg-green-500/20 text-green-400',
        blue: 'bg-blue-500/20 text-blue-400',
        pink: 'bg-pink-500/20 text-pink-400',
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-400">Here&apos;s what&apos;s happening with your account.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.04] transition-all"
                        >
                            <div className={`w-12 h-12 rounded-xl ${colorClasses[stat.color]} flex items-center justify-center mb-4`}>
                                {getIcon(stat.icon)}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/create/event">
                            <Button variant="secondary">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Event
                            </Button>
                        </Link>
                        <Link href="/venues">
                            <Button variant="secondary">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Browse Venues
                            </Button>
                        </Link>
                        <Link href="/events">
                            <Button variant="secondary">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Find Events
                            </Button>
                        </Link>
                        {user?.role === 'venue_owner' && (
                            <Link href="/create/venue">
                                <Button variant="secondary">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    List Venue
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.type === 'ticket' ? 'bg-green-500/20 text-green-400' :
                                            activity.type === 'booking' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-violet-500/20 text-violet-400'
                                        }`}>
                                        {activity.type === 'ticket' && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                        )}
                                        {activity.type === 'booking' && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                                            </svg>
                                        )}
                                        {activity.type === 'event' && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white">{activity.title}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link href="/dashboard/notifications" className="block mt-4 text-sm text-violet-400 hover:text-violet-300">
                            View all activity →
                        </Link>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Your Upcoming Events</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">DEC</div>
                                        <div className="text-lg font-bold text-white">24</div>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">Neon Nights Festival</p>
                                    <p className="text-xs text-gray-400">9:00 PM • Skyline Terrace</p>
                                </div>
                                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Attending</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">DEC</div>
                                        <div className="text-lg font-bold text-white">28</div>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">Acoustic Evening</p>
                                    <p className="text-xs text-gray-400">7:00 PM • The Loft Studio</p>
                                </div>
                                <span className="px-2 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs">Organizing</span>
                            </div>
                        </div>
                        <Link href="/dashboard/events" className="block mt-4 text-sm text-violet-400 hover:text-violet-300">
                            View all events →
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
