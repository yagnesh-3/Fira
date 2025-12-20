'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui';

type PaymentTab = 'transactions' | 'earnings' | 'methods';

const mockTransactions = [
    {
        id: '1',
        type: 'ticket',
        description: 'Neon Nights Festival - 2 tickets',
        amount: -2500,
        date: '2025-12-20',
        status: 'completed',
    },
    {
        id: '2',
        type: 'booking',
        description: 'The Grand Ballroom - Venue Booking',
        amount: -25000,
        date: '2025-12-18',
        status: 'completed',
    },
    {
        id: '3',
        type: 'refund',
        description: 'Refund - Cancelled Event Tickets',
        amount: 1200,
        date: '2025-12-15',
        status: 'completed',
    },
    {
        id: '4',
        type: 'earning',
        description: 'Birthday Bash - Ticket Sales',
        amount: 15000,
        date: '2025-12-10',
        status: 'completed',
    },
];

const mockPaymentMethods = [
    {
        id: '1',
        type: 'upi',
        name: 'UPI',
        details: 'user@paytm',
        isDefault: true,
    },
    {
        id: '2',
        type: 'card',
        name: 'Credit Card',
        details: '•••• •••• •••• 4242',
        isDefault: false,
    },
];

export default function PaymentsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();
    const [activeTab, setActiveTab] = useState<PaymentTab>('transactions');

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
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ticket':
                return (
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                );
            case 'booking':
                return (
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                        </svg>
                    </div>
                );
            case 'refund':
                return (
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </div>
                );
            case 'earning':
                return (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const totalEarnings = mockTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = Math.abs(
        mockTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
    );

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
                    <p className="text-gray-400">Track your transactions and manage payment methods</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
                        <div className="text-sm text-gray-400 mb-1">Total Spent</div>
                        <div className="text-2xl font-bold text-white">₹{totalSpent.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
                        <div className="text-sm text-gray-400 mb-1">Total Earnings</div>
                        <div className="text-2xl font-bold text-emerald-400">₹{totalEarnings.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-5">
                        <div className="text-sm text-violet-300 mb-1">Available Balance</div>
                        <div className="text-2xl font-bold text-white">₹{(totalEarnings - totalSpent + 50000).toLocaleString()}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {(['transactions', 'earnings', 'methods'] as PaymentTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all duration-200 ${activeTab === tab
                                    ? 'bg-white text-black shadow-lg shadow-white/10'
                                    : 'bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
                                }`}
                        >
                            {tab === 'methods' ? 'Payment Methods' : tab}
                        </button>
                    ))}
                </div>

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
                        <div className="divide-y divide-white/[0.05]">
                            {mockTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                                    {getTypeIcon(transaction.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{transaction.description}</p>
                                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                    </div>
                                    <div className={`text-right font-semibold ${transaction.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Earnings Tab */}
                {activeTab === 'earnings' && (
                    <div className="space-y-6">
                        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Earnings Summary</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">This Month</p>
                                    <p className="text-xl font-bold text-emerald-400">₹15,000</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Last Month</p>
                                    <p className="text-xl font-bold text-white">₹12,500</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/[0.05]">
                                <h3 className="font-semibold text-white">Recent Earnings</h3>
                            </div>
                            <div className="divide-y divide-white/[0.05]">
                                {mockTransactions
                                    .filter((t) => t.amount > 0)
                                    .map((transaction) => (
                                        <div key={transaction.id} className="flex items-center gap-4 p-4">
                                            {getTypeIcon(transaction.type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{transaction.description}</p>
                                                <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                                            </div>
                                            <div className="text-right font-semibold text-emerald-400">
                                                +₹{transaction.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Methods Tab */}
                {activeTab === 'methods' && (
                    <div className="space-y-4">
                        {mockPaymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
                                    {method.type === 'upi' ? (
                                        <span className="text-lg font-bold text-violet-400">UPI</span>
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-white">{method.name}</p>
                                        {method.isDefault && (
                                            <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">Default</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400">{method.details}</p>
                                </div>
                                <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                        ))}

                        <button className="w-full bg-white/[0.02] backdrop-blur-sm border border-dashed border-white/[0.15] rounded-2xl p-5 flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-white/[0.25] transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Payment Method
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
