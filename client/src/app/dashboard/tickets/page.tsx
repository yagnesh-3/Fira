'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui';

const mockTickets = [
    {
        id: '1',
        ticketId: 'TKT-A1B2C3D4E5F6',
        eventName: 'Neon Nights Festival',
        eventDate: '2025-12-24',
        eventTime: '21:00',
        venue: 'Skyline Terrace, Mumbai',
        quantity: 2,
        status: 'active',
        qrCode: 'mock-qr-code',
    },
    {
        id: '2',
        ticketId: 'TKT-X7Y8Z9A0B1C2',
        eventName: 'Acoustic Evening',
        eventDate: '2025-12-28',
        eventTime: '19:00',
        venue: 'The Loft Studio, Bangalore',
        quantity: 1,
        status: 'active',
        qrCode: 'mock-qr-code-2',
    },
    {
        id: '3',
        ticketId: 'TKT-M3N4O5P6Q7R8',
        eventName: 'Tech Startup Mixer',
        eventDate: '2025-12-15',
        eventTime: '10:00',
        venue: 'Conference Center, Hyderabad',
        quantity: 1,
        status: 'used',
        qrCode: 'mock-qr-code-3',
    },
];

export default function TicketsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

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
            year: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Tickets</h1>
                    <p className="text-gray-400">Your purchased tickets and event passes</p>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {mockTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* QR Code Section */}
                                <div className="md:w-48 p-6 bg-white/[0.03] flex items-center justify-center border-b md:border-b-0 md:border-r border-white/[0.08]">
                                    <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 text-gray-800 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                            <span className="text-xs text-gray-600">Scan to enter</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Details */}
                                <div className="flex-1 p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-white">{ticket.eventName}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ticket.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {ticket.status === 'active' ? 'Valid' : 'Used'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-1">{ticket.venue}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(ticket.eventDate)} • {ticket.eventTime}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Ticket ID</p>
                                            <p className="text-sm font-mono text-white">{ticket.ticketId}</p>
                                            <p className="text-xs text-gray-500 mt-2">{ticket.quantity}x General Admission</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/[0.05] flex flex-wrap gap-3">
                                        <Button variant="secondary" size="sm">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            View Event
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {mockTickets.length === 0 && (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-white mb-2">No tickets yet</h3>
                        <p className="text-gray-400 mb-6">Start exploring events to get your first ticket!</p>
                        <Button onClick={() => router.push('/events')}>Browse Events</Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
