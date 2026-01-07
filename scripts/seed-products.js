// Script to seed sample products
// Run: node scripts/seed-products.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleData = {
    mens: {
        subCategories: [
            { name: 'T-Shirts', slug: 'mens-tshirts' },
            { name: 'Shirts', slug: 'mens-shirts' },
            { name: 'Pants', slug: 'mens-pants' },
        ],
        products: [
            { subCat: 'mens-tshirts', name: 'Classic Crew Neck', slug: 'mens-classic-crew-neck', designs: ['Design A', 'Design B', 'Design C'] },
            { subCat: 'mens-tshirts', name: 'V-Neck Premium', slug: 'mens-vneck-premium', designs: ['Solid Black', 'Solid White', 'Navy Blue'] },
            { subCat: 'mens-shirts', name: 'Formal Oxford', slug: 'mens-formal-oxford', designs: ['White Oxford', 'Blue Oxford', 'Grey Oxford'] },
            { subCat: 'mens-pants', name: 'Slim Fit Chinos', slug: 'mens-slim-chinos', designs: ['Khaki', 'Navy', 'Olive'] },
        ]
    },
    womens: {
        subCategories: [
            { name: 'Tops', slug: 'womens-tops' },
            { name: 'Kurtis', slug: 'womens-kurtis' },
            { name: 'Salwar Sets', slug: 'womens-salwar' },
        ],
        products: [
            { subCat: 'womens-tops', name: 'Floral Print Top', slug: 'womens-floral-top', designs: ['Pink Floral', 'Blue Floral', 'Yellow Floral'] },
            { subCat: 'womens-kurtis', name: 'Cotton Straight Kurti', slug: 'womens-cotton-kurti', designs: ['Red', 'Maroon', 'Teal'] },
            { subCat: 'womens-salwar', name: 'Printed Salwar Set', slug: 'womens-printed-salwar', designs: ['Traditional', 'Modern Print', 'Geometric'] },
        ]
    },
    girls: {
        subCategories: [
            { name: 'Frocks', slug: 'girls-frocks' },
            { name: 'Tops', slug: 'girls-tops' },
        ],
        products: [
            { subCat: 'girls-frocks', name: 'Party Frock', slug: 'girls-party-frock', designs: ['Pink Princess', 'Blue Fairy', 'Purple Dream'] },
            { subCat: 'girls-tops', name: 'Casual Top', slug: 'girls-casual-top', designs: ['Cartoon Print', 'Striped', 'Polka Dots'] },
        ]
    },
    boys: {
        subCategories: [
            { name: 'T-Shirts', slug: 'boys-tshirts' },
            { name: 'Shorts', slug: 'boys-shorts' },
        ],
        products: [
            { subCat: 'boys-tshirts', name: 'Superhero Tee', slug: 'boys-superhero-tee', designs: ['Spider Print', 'Captain Print', 'Iron Print'] },
            { subCat: 'boys-shorts', name: 'Denim Shorts', slug: 'boys-denim-shorts', designs: ['Light Blue', 'Dark Blue', 'Black'] },
        ]
    },
    babies: {
        subCategories: [
            { name: 'Rompers', slug: 'babies-rompers' },
            { name: 'Sets', slug: 'babies-sets' },
        ],
        products: [
            { subCat: 'babies-rompers', name: 'Cotton Romper', slug: 'babies-cotton-romper', designs: ['Yellow Duck', 'Pink Bear', 'Blue Bunny'] },
            { subCat: 'babies-sets', name: 'Comfort Set', slug: 'babies-comfort-set', designs: ['Pastel Pink', 'Pastel Blue', 'Pastel Green'] },
        ]
    },
};

async function main() {
    console.log('🌱 Seeding sample products...\n');

    for (const [catSlug, data] of Object.entries(sampleData)) {
        // Find category
        const category = await prisma.category.findUnique({ where: { slug: catSlug } });
        if (!category) {
            console.log(`❌ Category ${catSlug} not found, skipping...`);
            continue;
        }
        console.log(`📁 ${category.name}`);

        // Create subcategories
        for (const subCat of data.subCategories) {
            const existing = await prisma.subCategory.findUnique({ where: { slug: subCat.slug } });
            if (!existing) {
                await prisma.subCategory.create({
                    data: {
                        name: subCat.name,
                        slug: subCat.slug,
                        categoryId: category.id,
                        image: `https://placehold.co/400x300/1a1a1a/d4335e?text=${encodeURIComponent(subCat.name)}`
                    }
                });
                console.log(`   ✅ SubCategory: ${subCat.name}`);
            } else {
                console.log(`   ⏭️  SubCategory exists: ${subCat.name}`);
            }
        }

        // Create products
        for (const prod of data.products) {
            const subCategory = await prisma.subCategory.findUnique({ where: { slug: prod.subCat } });
            if (!subCategory) continue;

            const existingProduct = await prisma.product.findUnique({ where: { slug: prod.slug } });
            if (!existingProduct) {
                const product = await prisma.product.create({
                    data: {
                        name: prod.name,
                        slug: prod.slug,
                        description: `Premium quality ${prod.name} from Akshaya Garments.`,
                        subCategoryId: subCategory.id,
                    }
                });

                // Create designs
                for (let i = 0; i < prod.designs.length; i++) {
                    await prisma.productDesign.create({
                        data: {
                            name: prod.designs[i],
                            image: `https://placehold.co/600x800/1a1a1a/d4335e?text=${encodeURIComponent(prod.designs[i])}`,
                            sortOrder: i,
                            productId: product.id
                        }
                    });
                }
                console.log(`      ✅ Product: ${prod.name} (${prod.designs.length} designs)`);
            } else {
                console.log(`      ⏭️  Product exists: ${prod.name}`);
            }
        }
    }

    console.log('\n✨ Done seeding products!');
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
