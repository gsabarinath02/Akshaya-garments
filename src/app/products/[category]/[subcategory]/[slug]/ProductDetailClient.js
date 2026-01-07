'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTruck, FaUndo, FaShieldAlt, FaCheck, FaMinus, FaPlus } from 'react-icons/fa';

export default function ProductDetailClient({ product, category, subcategory }) {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedDesign, setSelectedDesign] = useState(product.designs[0] || null);
    const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const addToCart = async () => {
        if (!user) {
            router.push(`/login?callbackUrl=/products/${category}/${subcategory}/${product.slug}`);
            return;
        }

        if (!selectedDesign) {
            setMessage('Please select a design');
            return;
        }

        if (product.hasColorChoice && !selectedColor) {
            setMessage('Please select a color');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    designId: selectedDesign.id,
                    colorId: selectedColor?.id || null,
                    quantity,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('✓ Added to cart!');
                // Trigger cart count update in header
                window.dispatchEvent(new Event('cartUpdated'));
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(data.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            setMessage('Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-12 items-start py-8">
            {/* Image Gallery - Left Side */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] group">
                    {selectedDesign?.image ? (
                        <motion.img
                            key={selectedDesign.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            src={selectedDesign.image}
                            alt={selectedDesign.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-white/5">
                            👕
                        </div>
                    )}
                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                        New Arrival
                    </div>
                </div>

                {/* Thumbnails */}
                {product.designs.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {product.designs.map((design) => (
                            <button
                                key={design.id}
                                onClick={() => setSelectedDesign(design)}
                                className={`relative w-24 aspect-[4/5] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedDesign?.id === design.id ? 'border-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20 shadow-lg scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={design.image} alt={design.name} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Product Info - Right Side */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
            >
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold leading-tight">
                        {product.name}
                    </h1>
                    {product.description && (
                        <p className="text-xl text-gray-400 leading-relaxed font-light">
                            {product.description}
                        </p>
                    )}
                </div>

                <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

                {/* Color Selection */}
                {product.hasColorChoice && product.colors.length > 0 && (
                    <div className="space-y-4">
                        <label className="text-sm uppercase tracking-wider text-gray-400 font-medium">
                            Select Color: <span className="text-white ml-2">{selectedColor?.colorName}</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {product.colors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 shadow-sm ${selectedColor?.id === color.id ? 'border-[var(--color-accent-primary)] scale-110 ring-4 ring-[var(--color-accent-primary)]/20' : 'border-white/10 hover:border-white/30'}`}
                                    style={{ backgroundColor: color.colorHex }}
                                    title={color.colorName}
                                    aria-label={`Select ${color.colorName}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-end p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                    {/* Quantity */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block">Quantity</label>
                        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors disabled:opacity-30"
                            >
                                <FaMinus size={12} />
                            </button>
                            <span className="w-12 text-center font-medium text-lg font-mono">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors"
                            >
                                <FaPlus size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={addToCart}
                        disabled={loading}
                        className="flex-1 btn btn-primary py-4 text-lg flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all transform active:scale-95"
                    >
                        {loading ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <FaShoppingCart />
                                {message === '✓ Added to cart!' ? 'Added!' : 'Add to Order'}
                            </>
                        )}
                    </button>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-4 rounded-xl flex items-center gap-3 ${message.includes('✓') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                        >
                            {message.includes('✓') ? <FaCheck /> : null}
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center gap-4">
                        <FaTruck className="text-2xl text-[var(--color-accent-primary)]" />
                        <div>
                            <p className="font-bold text-sm text-white">Free Shipping</p>
                            <p className="text-xs text-gray-400">On orders &gt; ₹500</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center gap-4">
                        <FaUndo className="text-2xl text-[var(--color-accent-primary)]" />
                        <div>
                            <p className="font-bold text-sm text-white">Easy Returns</p>
                            <p className="text-xs text-gray-400">30-day policy</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center gap-4">
                        <FaShieldAlt className="text-2xl text-[var(--color-accent-primary)]" />
                        <div>
                            <p className="font-bold text-sm text-white">Premium</p>
                            <p className="text-xs text-gray-400">100% Cotton</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
