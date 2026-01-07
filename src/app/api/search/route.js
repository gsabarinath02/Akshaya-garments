import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');

        if (!q || q.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const [categories, subCategories, products] = await Promise.all([
            prisma.category.findMany({
                where: { name: { contains: q, mode: 'insensitive' } },
                take: 3
            }),
            prisma.subCategory.findMany({
                where: { name: { contains: q, mode: 'insensitive' } },
                include: { category: true },
                take: 5
            }),
            prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } }
                    ]
                },
                include: {
                    subCategory: { include: { category: true } },
                    designs: { take: 1 }
                },
                take: 10
            })
        ]);

        const results = [
            ...categories.map(c => ({ type: 'category', id: c.id, name: c.name, slug: c.slug, url: `/products/${c.slug}` })),
            ...subCategories.map(s => ({ type: 'subcategory', id: s.id, name: s.name, category: s.category?.name, url: `/products/${s.category?.slug}/${s.slug}` })),
            ...products.map(p => ({ type: 'product', id: p.id, name: p.name, category: p.subCategory?.category?.name, subCategory: p.subCategory?.name, image: p.designs?.[0]?.image, url: `/products/${p.subCategory?.category?.slug}/${p.subCategory?.slug}/${p.slug}` }))
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ results: [] });
    }
}
