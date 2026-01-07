// Script to seed sample products
// Run: node scripts/seed-products.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Real clothing images from Unsplash
const sampleData = {
    mens: {
        subCategories: [
            { name: 'T-Shirts', slug: 'mens-tshirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop' },
            { name: 'Shirts', slug: 'mens-shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop' },
            { name: 'Pants', slug: 'mens-pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=300&fit=crop' },
        ],
        products: [
            {
                subCat: 'mens-tshirts',
                name: 'Classic Crew Neck',
                slug: 'mens-classic-crew-neck',
                designs: [
                    { name: 'White Classic', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop' },
                    { name: 'Black Classic', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&h=800&fit=crop' },
                    { name: 'Navy Blue', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop' },
                ]
            },
            {
                subCat: 'mens-tshirts',
                name: 'V-Neck Premium',
                slug: 'mens-vneck-premium',
                designs: [
                    { name: 'Grey V-Neck', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop' },
                    { name: 'Maroon V-Neck', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop' },
                ]
            },
            {
                subCat: 'mens-shirts',
                name: 'Formal Oxford',
                slug: 'mens-formal-oxford',
                designs: [
                    { name: 'White Oxford', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop' },
                    { name: 'Blue Oxford', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop' },
                    { name: 'Striped', image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&h=800&fit=crop' },
                ]
            },
            {
                subCat: 'mens-pants',
                name: 'Slim Fit Chinos',
                slug: 'mens-slim-chinos',
                designs: [
                    { name: 'Khaki', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop' },
                    { name: 'Navy', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop' },
                ]
            },
        ]
    },
    womens: {
        subCategories: [
            { name: 'Tops', slug: 'womens-tops', image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&h=300&fit=crop' },
            { name: 'Kurtis', slug: 'womens-kurtis', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop' },
            { name: 'Dresses', slug: 'womens-dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop' },
        ],
        products: [
            {
                subCat: 'womens-tops',
                name: 'Casual Blouse',
                slug: 'womens-casual-blouse',
                designs: [
                    { name: 'White Blouse', image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop' },
                    { name: 'Floral Print', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop' },
                ]
            },
            {
                subCat: 'womens-kurtis',
                name: 'Cotton Kurti',
                slug: 'womens-cotton-kurti',
                designs: [
                    { name: 'Red Pattern', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop' },
                    { name: 'Blue Ethnic', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop' },
                ]
            },
            {
                subCat: 'womens-dresses',
                name: 'Summer Dress',
                slug: 'womens-summer-dress',
                designs: [
                    { name: 'Floral Summer', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop' },
                    { name: 'Solid Color', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop' },
                ]
            },
        ]
    },
    girls: {
        subCategories: [
            { name: 'Frocks', slug: 'girls-frocks', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=300&fit=crop' },
            { name: 'Tops', slug: 'girls-tops', image: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&h=300&fit=crop' },
        ],
        products: [
            {
                subCat: 'girls-frocks',
                name: 'Party Frock',
                slug: 'girls-party-frock',
                designs: [
                    { name: 'Pink Princess', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop' },
                    { name: 'Blue Fairy', image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=600&h=800&fit=crop' },
                ]
            },
        ]
    },
    boys: {
        subCategories: [
            { name: 'T-Shirts', slug: 'boys-tshirts', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop' },
            { name: 'Shorts', slug: 'boys-shorts', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=300&fit=crop' },
        ],
        products: [
            {
                subCat: 'boys-tshirts',
                name: 'Cool Graphic Tee',
                slug: 'boys-graphic-tee',
                designs: [
                    { name: 'Blue Print', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop' },
                    { name: 'Red Print', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop' },
                ]
            },
        ]
    },
    babies: {
        subCategories: [
            { name: 'Rompers', slug: 'babies-rompers', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=300&fit=crop' },
            { name: 'Sets', slug: 'babies-sets', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop' },
        ],
        products: [
            {
                subCat: 'babies-rompers',
                name: 'Cotton Romper',
                slug: 'babies-cotton-romper',
                designs: [
                    { name: 'Yellow Duck', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop' },
                    { name: 'Pink Bear', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=800&fit=crop' },
                ]
            },
        ]
    },
};

async function main() {
    console.log('🌱 Seeding sample products...\n');

    for (const [catSlug, data] of Object.entries(sampleData)) {
        const category = await prisma.category.findUnique({ where: { slug: catSlug } });
        if (!category) {
            console.log(`❌ Category ${catSlug} not found`);
            continue;
        }
        console.log(`📁 ${category.name}`);

        for (const subCat of data.subCategories) {
            const existing = await prisma.subCategory.findUnique({ where: { slug: subCat.slug } });
            if (!existing) {
                await prisma.subCategory.create({
                    data: { name: subCat.name, slug: subCat.slug, categoryId: category.id, image: subCat.image }
                });
                console.log(`   ✅ SubCategory: ${subCat.name}`);
            }
        }

        for (const prod of data.products) {
            const subCategory = await prisma.subCategory.findUnique({ where: { slug: prod.subCat } });
            if (!subCategory) continue;

            const existingProduct = await prisma.product.findUnique({ where: { slug: prod.slug } });
            if (!existingProduct) {
                const product = await prisma.product.create({
                    data: {
                        name: prod.name,
                        slug: prod.slug,
                        description: `Premium quality ${prod.name} from Akshaya Garments. Comfortable and stylish.`,
                        subCategoryId: subCategory.id,
                    }
                });

                for (let i = 0; i < prod.designs.length; i++) {
                    await prisma.productDesign.create({
                        data: {
                            name: prod.designs[i].name,
                            image: prod.designs[i].image,
                            sortOrder: i,
                            productId: product.id
                        }
                    });
                }
                console.log(`      ✅ Product: ${prod.name} (${prod.designs.length} designs)`);
            }
        }
    }

    console.log('\n✨ Done!');
    await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });

