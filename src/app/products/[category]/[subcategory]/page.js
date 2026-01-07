import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CategoryClient from '../CategoryClient';

async function getSubcategoryData(categorySlug, subcategorySlug) {
    try {
        const subcategory = await prisma.subCategory.findUnique({
            where: { slug: subcategorySlug },
            include: {
                category: true,
                products: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        designs: {
                            orderBy: { sortOrder: 'asc' },
                            take: 1
                        }
                    }
                }
            }
        });

        if (!subcategory || subcategory.category.slug !== categorySlug) return null;
        return subcategory;
    } catch (error) {
        console.error('Error fetching subcategory:', error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { category, subcategory } = await params;
    const data = await getSubcategoryData(category, subcategory);
    if (!data) return { title: 'Not Found' };

    return {
        title: `${data.name} - ${data.category.name} | Fashion Brand`,
        description: `Browse our ${data.name} collection for ${data.category.name}. Premium quality fashion.`,
    };
}

export default async function SubcategoryPage({ params }) {
    const { category, subcategory } = await params;
    const data = await getSubcategoryData(category, subcategory);

    if (!data) {
        notFound();
    }

    // Add subCategory info to products for the client component
    const productsWithMeta = data.products.map(p => ({
        ...p,
        subCategoryName: data.name,
        subCategorySlug: data.slug
    }));

    return (
        <>
            <Header />
            <CategoryClient
                name={`${data.name} Collection`}
                subCategories={[]} // We don't have siblings here without extra fetching, leaving empty is cleaner for now
                products={productsWithMeta}
                categorySlug={category}
            />
            <Footer />
        </>
    );
}
