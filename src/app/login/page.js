'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaBox, FaPhoneAlt, FaLock, FaArrowRight } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });

    // Check if user just registered
    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('Registration successful! Please login with your credentials.');
        }
    }, [searchParams]);

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            const callbackUrl = searchParams.get('callbackUrl') || '/';
            router.push(callbackUrl);
        }
    }, [user, authLoading, router, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.phone, formData.password);
            const callbackUrl = searchParams.get('callbackUrl') || '/';
            router.push(callbackUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
                <div className="w-16 h-16 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--color-bg-primary)]">
            {/* Left Panel - Visuals */}
            <div className="relative hidden lg:block overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-black z-0" />
                <img
                    src="/hero-cultural-bg.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

                <div className="relative z-20 h-full flex flex-col justify-between p-16">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-gradient">Akshaya</span>Garments
                    </Link>

                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-5xl font-bold leading-tight">
                            Welcome Back <br />
                            <span className="text-gradient">Partner</span>
                        </h1>
                        <p className="text-xl text-gray-300">
                            Access our exclusive wholesale collection and manage your orders efficiently.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-accent-primary)]">
                                    <FaShoppingCart />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Seamless Ordering</h4>
                                    <p className="text-sm">Continue where you left off</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-accent-primary)]">
                                    <FaBox />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Real-time Tracking</h4>
                                    <p className="text-sm">Monitor your shipments</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Akshaya Garments. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-10 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent-primary)] to-transparent opacity-50" />

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Login</h2>
                        <p className="text-gray-400">Enter your credentials to access your account</p>
                    </div>

                    {success && (
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                    <FaPhoneAlt />
                                </div>
                                <input
                                    type="tel"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn btn-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Login <FaArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-[var(--color-accent-primary)] font-medium hover:text-white transition-colors">
                                Register as Partner
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
