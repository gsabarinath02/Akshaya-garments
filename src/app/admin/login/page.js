'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaEnvelope, FaFingerprint } from 'react-icons/fa';

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent-primary)]/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl skew-y-3 transform hover:skew-y-0 transition-transform duration-500 group">
                        <FaShieldAlt className="text-4xl text-[var(--color-accent-primary)] group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Admin <span className="text-gradient">Portal</span></h1>
                    <p className="text-gray-400">Secure Gateway Access</p>
                </div>

                <div className="auth-card p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-8 p-4 bg-red-500/10 border border-red-500/10 rounded-xl text-red-200 text-xs">
                        <FaFingerprint className="text-lg" />
                        <span>Restricted Area. Authorized Personnel Only.</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Identifier</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all font-mono text-sm"
                                    placeholder="admin@akshayagarments.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Passkey</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all font-mono text-sm"
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    suppressHydrationWarning
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
                                'Authenticate'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-xs text-gray-600 font-mono">
                    System ID: {Math.random().toString(36).substring(7).toUpperCase()}
                </p>
            </motion.div>
        </div>
    );
}
