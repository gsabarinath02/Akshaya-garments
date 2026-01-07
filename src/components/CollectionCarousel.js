'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';

const defaultCategories = [
    {
        name: 'Mens',
        slug: 'mens',
        id: '01',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Womens',
        slug: 'womens',
        id: '02',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Girls',
        slug: 'girls',
        id: '03',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Boys',
        slug: 'boys',
        id: '04',
        image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Babies',
        slug: 'babies',
        id: '05',
        image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    },
];

export default function CollectionCarousel({ categories = defaultCategories }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    };

    // Calculate which cards are visible
    // We want to show: prev, current, next.
    // But we iterate through ALL to position them absolutely.

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section
            className="py-24 overflow-hidden bg-black/95 relative min-h-[800px] flex flex-col justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background ambient elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent-primary)]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="text-5xl font-bold mb-4">
                    Our <span className="text-gradient">Collection</span>
                </h2>
                <p className="text-gray-400">Discover your style</p>
            </div>

            {/* Carousel Container */}
            <div className="relative w-full h-[500px] flex items-center justify-center perspective-container">
                <AnimatePresence mode='popLayout'>
                    {categories.map((category, index) => {
                        // Determine relative position in the circular buffer
                        // 0 = active, -1 = prev, 1 = next
                        // We need to handle the wrapping properly for distance calculation

                        const length = categories.length;
                        // Calculate offset from current index, handling wrapping
                        let offset = (index - currentIndex + length) % length;
                        // Adjust offset to be -2, -1, 0, 1, 2 for closer logic
                        if (offset > length / 2) offset -= length;

                        // Only render if within relevant range (optimization) or just render all for smoothness is fine for 5 items
                        const isActive = offset === 0;
                        const isPrev = offset === -1;
                        const isNext = offset === 1;

                        // Define styles based on offset
                        // Center
                        let x = 0;
                        let rotateY = 0;
                        let zIndex = 0;
                        let scale = 1;
                        let opacity = 1;
                        let blur = 0;

                        if (isActive) {
                            zIndex = 20;
                            scale = 1.1;
                        } else if (isPrev) {
                            x = -320; // Move left
                            rotateY = 25; // Tilt away
                            zIndex = 10;
                            scale = 0.9;
                            opacity = 0.7;
                        } else if (isNext) {
                            x = 320; // Move right
                            rotateY = -25; // Tilt away
                            zIndex = 10;
                            scale = 0.9;
                            opacity = 0.7;
                        } else {
                            // Others hidden behind or further out
                            x = offset * 250;
                            zIndex = 5;
                            scale = 0.7;
                            opacity = 0.3;
                            blur = 4;
                            // If it's too far, maybe hide explicitly?
                            if (Math.abs(offset) > 2) opacity = 0;
                        }

                        return (
                            <motion.div
                                key={category.slug}
                                className={clsx(
                                    "absolute w-[300px] h-[450px] md:w-[340px] md:h-[500px] rounded-3xl p-1",
                                    "cursor-pointer"
                                )}
                                initial={false}
                                animate={{
                                    x,
                                    rotateY,
                                    scale,
                                    zIndex,
                                    opacity,
                                    filter: `blur(${blur}px)`
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.16, 1, 0.3, 1], // Custom spring-like bezier
                                }}
                                onClick={() => {
                                    // Make clicked card active if it's prev/next
                                    if (isPrev) handlePrev();
                                    if (isNext) handleNext();
                                }}
                                style={{
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl group">
                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                                    </div>

                                    {/* Big Number */}
                                    <div className="absolute -top-6 -left-4 text-[6rem] font-bold text-white/5 font-serif select-none z-0">
                                        {category.id}
                                    </div>

                                    {/* Content (Only show details if active, or minimal on sides) */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-3xl font-serif font-bold text-white mb-2">
                                            {category.name}
                                        </h3>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Link
                                                    href={`/products/${category.slug}`}
                                                    className="inline-flex items-center gap-2 text-[var(--color-accent-primary)] font-medium hover:text-white transition-colors"
                                                >
                                                    View Collection <span>→</span>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30">
                <button
                    onClick={handlePrev}
                    className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Previous"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                </button>
                <button
                    onClick={handleNext}
                    className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Next"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                </button>
            </div>

            <style jsx global>{`
                .perspective-container {
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
}
