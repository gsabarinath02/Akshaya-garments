const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@fashionbrand.com' },
        update: {},
        create: {
            email: 'admin@fashionbrand.com',
            password: hashedPassword,
            name: 'Admin User',
        },
    });
    console.log('✅ Admin created:', admin.email);

    // Create Categories
    const categories = [
        { name: 'Mens', slug: 'mens', sortOrder: 1 },
        { name: 'Womens', slug: 'womens', sortOrder: 2 },
        { name: 'Girls', slug: 'girls', sortOrder: 3 },
        { name: 'Boys', slug: 'boys', sortOrder: 4 },
        { name: 'Babies', slug: 'babies', sortOrder: 5 },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log('✅ Categories created');

    // Get Mens category
    const mensCategory = await prisma.category.findUnique({ where: { slug: 'mens' } });

    // Create Subcategories for Mens
    const mensSubcategories = [
        { name: 'T-Shirts', slug: 'mens-tshirts', sortOrder: 1, categoryId: mensCategory.id },
        { name: 'Shirts', slug: 'mens-shirts', sortOrder: 2, categoryId: mensCategory.id },
        { name: 'Pants', slug: 'mens-pants', sortOrder: 3, categoryId: mensCategory.id },
    ];

    for (const sub of mensSubcategories) {
        await prisma.subCategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: sub,
        });
    }
    console.log('✅ Subcategories created');

    // Get T-Shirts subcategory
    const tshirtsSubcategory = await prisma.subCategory.findUnique({ where: { slug: 'mens-tshirts' } });

    // Create Sample Products
    const products = [
        {
            name: 'Classic Crew Neck',
            slug: 'classic-crew-neck',
            description: 'Premium cotton crew neck t-shirt with a comfortable fit. Perfect for everyday wear.',
            hasColorChoice: true,
            subCategoryId: tshirtsSubcategory.id,
            sortOrder: 1,
        },
        {
            name: 'V-Neck Essential',
            slug: 'v-neck-essential',
            description: 'Soft and breathable v-neck t-shirt. A wardrobe essential for every man.',
            hasColorChoice: true,
            subCategoryId: tshirtsSubcategory.id,
            sortOrder: 2,
        },
        {
            name: 'Polo Classic',
            slug: 'polo-classic',
            description: 'Elegant polo shirt with collar. Perfect for casual Fridays and weekend outings.',
            hasColorChoice: true,
            subCategoryId: tshirtsSubcategory.id,
            sortOrder: 3,
        },
    ];

    for (const prod of products) {
        const existingProduct = await prisma.product.findUnique({ where: { slug: prod.slug } });

        if (!existingProduct) {
            const product = await prisma.product.create({ data: prod });

            // Add designs
            await prisma.productDesign.createMany({
                data: [
                    {
                        productId: product.id,
                        name: 'Design 1',
                        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
                        sortOrder: 1,
                    },
                    {
                        productId: product.id,
                        name: 'Design 2',
                        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
                        sortOrder: 2,
                    },
                ],
            });

            // Add colors
            await prisma.productColor.createMany({
                data: [
                    { productId: product.id, colorName: 'Black', colorHex: '#000000' },
                    { productId: product.id, colorName: 'White', colorHex: '#FFFFFF' },
                    { productId: product.id, colorName: 'Navy', colorHex: '#1e3a5f' },
                    { productId: product.id, colorName: 'Gray', colorHex: '#6b7280' },
                ],
            });

            console.log(`✅ Product created: ${product.name}`);
        }
    }

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📌 Admin Login:');
    console.log('   Email: admin@fashionbrand.com');
    console.log('   Password: admin123');
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
