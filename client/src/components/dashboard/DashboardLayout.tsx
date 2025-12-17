'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { href: '/dashboard', icon: 'home', label: 'Overview' },
    { href: '/dashboard/events', icon: 'calendar', label: 'My Events' },
    { href: '/dashboard/bookings', icon: 'building', label: 'My Bookings' },
    { href: '/dashboard/tickets', icon: 'ticket', label: 'My Tickets' },
    { href: '/dashboard/payments', icon: 'credit-card', label: 'Payments' },
    { href: '/dashboard/notifications', icon: 'bell', label: 'Notifications' },
];

const venueOwnerItems = [
    { href: '/dashboard/venues', icon: 'building-office', label: 'My Venues' },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    const isVenueOwner = user?.role === 'venue_owner' || user?.role === 'admin';

    const getIcon = (name: string) => {
        const icons: Record<string, React.ReactNode> = {
            'home': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            'calendar': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            'building': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            'ticket': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            ),
            'credit-card': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            'bell': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            'building-office': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 21h20M2 21V3h8v18m0-18h12v18m-12 0V8m0 0h12" />
                </svg>
            ),
        };
        return icons[name] || null;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white/[0.02] border-r border-white/[0.05] z-40 hidden lg:block">
                {/* Logo */}
                <div className="p-6 border-b border-white/[0.05]">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-black font-bold text-sm">F</span>
                        </div>
                        <span className="text-xl font-semibold text-white">FIRA</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {getIcon(item.icon)}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Venue Owner Section */}
                    {isVenueOwner && (
                        <>
                            <div className="pt-4 pb-2">
                                <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Venue Management
                                </div>
                            </div>
                            {venueOwnerItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {getIcon(item.icon)}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-medium">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{user?.name || 'User'}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 flex-1 min-h-screen">
                {children}
            </main>
        </div>
    );
}
