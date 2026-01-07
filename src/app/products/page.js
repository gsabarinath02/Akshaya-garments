import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CollectionCarousel from '@/components/CollectionCarousel';

// Category images - premium fashion photography
const categoryImages = {
    mens: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop',
    womens: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    girls: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?q=80&w=800&auto=format&fit=crop',
    boys: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop',
    babies: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
};

// Default categories
const defaultCategories = [
    { id: 1, name: 'Mens', slug: 'mens', _count: { subCategories: 3 } },
    { id: 2, name: 'Womens', slug: 'womens', _count: { subCategories: 0 } },
    { id: 3, name: 'Girls', slug: 'girls', _count: { subCategories: 0 } },
    { id: 4, name: 'Boys', slug: 'boys', _count: { subCategories: 0 } },
    { id: 5, name: 'Babies', slug: 'babies', _count: { subCategories: 0 } },
];

async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: {
                    select: { subCategories: true }
                }
            }
        });
        return categories.length > 0 ? categories : defaultCategories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return defaultCategories;
    }
}

export default async function ProductsPage() {
    const fetchedCategories = await getCategories();

    // Transform fetched categories to match Carousel expected format
    const carouselCategories = fetchedCategories.map((cat, index) => ({
        name: cat.name,
        slug: cat.slug,
        id: String(index + 1).padStart(2, '0'), // '01', '02', etc.
        image: categoryImages[cat.slug] || categoryImages.mens
    }));

    return (
        <>
            <Header />

            <main className="bg-black min-h-screen">
                <div style={{ paddingTop: '80px' }}> {/* Spacing for fixed header */}
                    <CollectionCarousel categories={carouselCategories} />
                </div>
            </main>

            <Footer />
        </>
    );
}
