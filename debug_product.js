const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProduct() {
    console.log('Checking for product slug: classic-crew-neck');
    const product = await prisma.product.findFirst({
        where: { slug: 'classic-crew-neck' },
        include: {
            subCategory: {
                include: { category: true }
            }
        }
    });

    if (product) {
        console.log('Product Found:', product.name);
        console.log('Category Slug:', product.subCategory.category.slug);
        console.log('Subcategory Slug:', product.subCategory.slug);
        console.log('Product Slug:', product.slug);

        console.log('--- Comparison ---');
        console.log('Expected Category (mens):', product.subCategory.category.slug === 'mens');
        console.log('Expected Sub (mens-tshirts):', product.subCategory.slug === 'mens-tshirts');
    } else {
        console.log('Product NOT FOUND in Database');
        const allProducts = await prisma.product.findMany({ select: { slug: true } });
        console.log('Available slugs:', allProducts.map(p => p.slug));
    }
}

checkProduct()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
