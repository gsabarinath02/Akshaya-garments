'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaPhoneAlt, FaStore, FaBuilding, FaMapMarked, FaMapPin, FaLock, FaArrowRight, FaCheckCircle, FaPercentage, FaTruck, FaShieldAlt } from 'react-icons/fa';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        shopName: '',
        gstNumber: '',
        address: '',
        pincode: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            await register({
                name: formData.name,
                phone: formData.phone,
                shopName: formData.shopName,
                gstNumber: formData.gstNumber || null,
                address: formData.address,
                pincode: formData.pincode,
                password: formData.password,
            });

            router.push('/login?registered=true');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--color-bg-primary)]">
            {/* Left Panel - Visuals */}
            <div className="relative hidden lg:block overflow-hidden sticky top-0 h-screen">
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
                            Unlock Exclusive <br />
                            <span className="text-gradient">Wholesale Prices</span>
                        </h1>
                        <p className="text-xl text-gray-300">
                            Join our partner network and get access to premium clothing at unbeatable wholesale rates.
                        </p>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-accent-primary)]">
                                    <FaPercentage />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Wholesale Pricing</h4>
                                    <p className="text-sm">Best margins for your business</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-accent-primary)]">
                                    <FaTruck />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Fast Delivery</h4>
                                    <p className="text-sm">Priority shipping across India</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-accent-primary)]">
                                    <FaShieldAlt />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Premium Quality</h4>
                                    <p className="text-sm">Only the finest fabrics</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Akshaya Garments. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="flex items-center justify-center p-8 bg-[var(--color-bg-primary)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl space-y-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] p-10 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent-primary)] to-transparent opacity-50" />

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">Create Partner Account</h2>
                        <p className="text-gray-400">Fill in your business details to get started</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                        <FaUser />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                        <FaPhoneAlt />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                        placeholder="Mobile Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Shop Name</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                        <FaStore />
                                    </div>
                                    <input
                                        type="text"
                                        name="shopName"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                        placeholder="Your Business Name"
                                        value={formData.shopName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">GST Number <span className="text-gray-500 text-xs font-normal">(Optional)</span></label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                        <FaBuilding />
                                    </div>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                        placeholder="GSTIN"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Shop Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                    <FaMapMarked />
                                </div>
                                <textarea
                                    name="address"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all min-h-[100px]"
                                    placeholder="Full address with landmark"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Pincode</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                    <FaMapPin />
                                </div>
                                <input
                                    type="text"
                                    name="pincode"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                    placeholder="6-digit Pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                        <FaLock />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                        placeholder="Min 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--color-accent-primary)] transition-colors">
                                        <FaLock />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all"
                                        placeholder="Repeat password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                            <input
                                type="checkbox"
                                required
                                className="w-5 h-5 rounded border-gray-600 text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)] bg-gray-700"
                            />
                            <span className="text-sm text-gray-400">
                                I agree to the <Link href="/terms" className="text-[var(--color-accent-primary)] hover:underline">Terms & Conditions</Link>
                            </span>
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
                                    Create Account <FaArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[var(--color-accent-primary)] font-medium hover:text-white transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
