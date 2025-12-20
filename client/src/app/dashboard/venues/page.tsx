'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui';

const mockVenues = [
    {
        id: '1',
        name: 'The Grand Ballroom',
        location: 'Mumbai, Maharashtra',
        capacity: 500,
        status: 'active',
        rating: 4.8,
        totalBookings: 156,
        pendingRequests: 3,
        monthlyEarnings: 125000,
        image: '/venue1.jpg',
    },
    {
        id: '2',
        name: 'Skyline Terrace',
        location: 'Bangalore, Karnataka',
        capacity: 200,
        status: 'active',
        rating: 4.6,
        totalBookings: 89,
        pendingRequests: 1,
        monthlyEarnings: 78000,
        image: '/venue2.jpg',
    },
    {
        id: '3',
        name: 'The Loft Studio',
        location: 'Delhi, NCR',
        capacity: 100,
        status: 'inactive',
        rating: 4.5,
        totalBookings: 45,
        pendingRequests: 0,
        monthlyEarnings: 0,
        image: '/venue3.jpg',
    },
];

export default function VenuesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

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

    // Check if user is venue owner
    const isVenueOwner = user?.role === 'venue_owner' || user?.role === 'admin';

    if (!isVenueOwner) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="text-center">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-white mb-2">Venue Owner Access Required</h3>
                        <p className="text-gray-400 mb-6">You need to be a venue owner to access this page.</p>
                        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const totalPendingRequests = mockVenues.reduce((sum, v) => sum + v.pendingRequests, 0);
    const totalMonthlyEarnings = mockVenues.reduce((sum, v) => sum + v.monthlyEarnings, 0);

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Venues</h1>
                        <p className="text-gray-400">Manage your venues and booking requests</p>
                    </div>
                    <Link href="/create/venue">
                        <Button>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Venue
                        </Button>
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
                        <div className="text-sm text-gray-400 mb-1">Total Venues</div>
                        <div className="text-2xl font-bold text-white">{mockVenues.length}</div>
                    </div>
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
                        <div className="text-sm text-gray-400 mb-1">Active Venues</div>
                        <div className="text-2xl font-bold text-green-400">{mockVenues.filter((v) => v.status === 'active').length}</div>
                    </div>
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
                        <div className="text-sm text-gray-400 mb-1">Pending Requests</div>
                        <div className="text-2xl font-bold text-yellow-400">{totalPendingRequests}</div>
                    </div>
                    <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-5">
                        <div className="text-sm text-violet-300 mb-1">This Month&apos;s Earnings</div>
                        <div className="text-2xl font-bold text-white">₹{totalMonthlyEarnings.toLocaleString()}</div>
                    </div>
                </div>

                {/* Venues Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockVenues.map((venue) => (
                        <div
                            key={venue.id}
                            className="group bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Venue Image */}
                                <div className="md:w-48 h-40 md:h-auto bg-gradient-to-br from-violet-500/30 to-blue-500/30 flex items-center justify-center relative">
                                    <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${venue.status === 'active'
                                                ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                                : 'bg-gray-500/20 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {venue.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {/* Venue Details */}
                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                                                {venue.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {venue.location}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-sm font-medium">{venue.rating}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Capacity</p>
                                            <p className="text-sm font-medium text-white">{venue.capacity}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Bookings</p>
                                            <p className="text-sm font-medium text-white">{venue.totalBookings}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">This Month</p>
                                            <p className="text-sm font-medium text-emerald-400">₹{(venue.monthlyEarnings / 1000).toFixed(0)}K</p>
                                        </div>
                                    </div>

                                    {/* Pending Requests Alert */}
                                    {venue.pendingRequests > 0 && (
                                        <div className="mb-4 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-yellow-400">{venue.pendingRequests} pending request{venue.pendingRequests > 1 ? 's' : ''}</span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-white/[0.05]">
                                        <Button variant="secondary" size="sm" className="flex-1">Manage</Button>
                                        <Button variant="ghost" size="sm" className="flex-1">View Bookings</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {mockVenues.length === 0 && (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                        </svg>
                        <h3 className="text-xl font-semibold text-white mb-2">No venues yet</h3>
                        <p className="text-gray-400 mb-6">Start listing your venues to receive bookings!</p>
                        <Link href="/create/venue">
                            <Button>Add Your First Venue</Button>
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
