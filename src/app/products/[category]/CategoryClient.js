'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaTag } from 'react-icons/fa';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function CategoryClient({ name, subCategories = [], products = [], categorySlug }) {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pt-[100px]">
            {/* Elegant Hero Section */}
            <div className="relative h-[40vh] min-h-[300px] flex items-end pb-12 justify-start overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-tertiary)] to-[var(--color-bg-primary)] z-0" />

                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[url('/hero-cultural-bg.png')] bg-cover bg-center" />

                <div className="container relative z-10 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-4xl"
                    >
                        <h6 className="text-[var(--color-accent-primary)] font-medium tracking-[0.2em] uppercase mb-4 text-sm">
                            Premium Collection
                        </h6>
                        <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
                            {name}
                        </h1>
                        <p className="text-gray-400 font-light max-w-xl text-lg">
                            Discover our curated selection of verified premium quality essentials.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container pt-12 pb-48">
                {/* Minimalist Filters */}
                {subCategories.length > 0 && (
                    <div className="flex flex-wrap gap-8 mb-16 border-b border-white/5 pb-1">
                        {subCategories.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/products/${categorySlug}/${sub.slug}`}
                                className="group relative pb-4"
                            >
                                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors uppercase tracking-wider">
                                    {sub.name}
                                    <sup className="ml-1 text-[10px] text-[var(--color-accent-primary)]">
                                        {sub.products.length}
                                    </sup>
                                </span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-accent-primary)] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Professional Grid */}
                {products.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16"
                    >
                        {products.map((product) => (
                            <motion.div key={product.id} variants={itemVariants}>
                                <Link
                                    href={`/products/${categorySlug}/${product.subCategorySlug}/${product.slug}`}
                                    className="group block"
                                >
                                    {/* Image Container - Sharper, Clean */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)] mb-6">
                                        {product.designs[0]?.image ? (
                                            <img
                                                src={product.designs[0].image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-700 bg-white/5">
                                                👕
                                            </div>
                                        )}

                                        {/* Minimal Overlay */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* View Button */}
                                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="w-full bg-white text-black py-3 text-sm font-bold uppercase tracking-wider text-center hover:bg-gray-100 transition-colors">
                                                View Product
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Meta */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-[var(--color-accent-primary)] uppercase tracking-wider font-medium">
                                            {product.subCategoryName}
                                        </p>
                                        <h3 className="text-base font-medium text-white group-hover:text-gray-300 transition-colors leading-tight">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {product.designs.length} Colorway{product.designs.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="py-24 text-center">
                        <h3 className="text-2xl font-serif text-white mb-2">Collection Arriving Soon</h3>
                        <p className="text-gray-500 font-light">
                            We are currently updating our inventory for this category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
