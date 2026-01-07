import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

async function getCategoryData(slug) {
    try {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                subCategories: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
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
                }
            }
        });

        if (!category) return null;
        return category;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { category } = await params;
    const data = await getCategoryData(category);
    if (!data) return { title: 'Category Not Found' };

    return {
        title: `${data.name} Collection | Fashion Brand`,
        description: `Browse our ${data.name} clothing collection. Premium quality fashion.`,
    };
}

export default async function CategoryPage({ params }) {
    const { category } = await params;
    const data = await getCategoryData(category);

    if (!data) {
        notFound();
    }

    // Flatten all products from subcategories
    const allProducts = data.subCategories.flatMap(sub =>
        sub.products.map(p => ({ ...p, subCategoryName: sub.name, subCategorySlug: sub.slug }))
    );

    return (
        <>
            <Header />
            <CategoryClient
                name={data.name}
                subCategories={data.subCategories}
                products={allProducts}
                categorySlug={category}
            />
            <Footer />
        </>
    );
}
