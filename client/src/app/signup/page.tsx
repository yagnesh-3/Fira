'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';
import Navbar from '@/components/Navbar';
import PartyBackground from '@/components/PartyBackground';

export default function SignUpPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' as 'user' | 'venue_owner',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PartyBackground />
            <Navbar />

            <main className="relative z-20 min-h-screen flex items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
                        <p className="text-gray-400">Join FIRA and start organizing amazing events</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8">
                        {error && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                helperText="Must be at least 6 characters"
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                            />

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    I want to
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'user' })}
                                        className={`p-4 rounded-xl border text-left transition-all ${formData.role === 'user'
                                            ? 'bg-violet-500/10 border-violet-500/50 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                        <div className="font-medium text-sm">Attend Events</div>
                                        <div className="text-xs mt-1 text-gray-500">Find & book venues, buy tickets</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'venue_owner' })}
                                        className={`p-4 rounded-xl border text-left transition-all ${formData.role === 'venue_owner'
                                            ? 'bg-violet-500/10 border-violet-500/50 text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <div className="font-medium text-sm">List Venues</div>
                                        <div className="text-xs mt-1 text-gray-500">Monetize your space</div>
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Create Account
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            By creating an account, you agree to our{' '}
                            <Link href="/terms" className="text-violet-400 hover:text-violet-300">
                                Terms
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
                                Privacy Policy
                            </Link>
                        </p>

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
