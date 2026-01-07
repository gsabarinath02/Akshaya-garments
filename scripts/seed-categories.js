// Script to seed initial categories
// Run: node scripts/seed-categories.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
    { name: 'Mens', slug: 'mens', sortOrder: 1 },
    { name: 'Womens', slug: 'womens', sortOrder: 2 },
    { name: 'Girls', slug: 'girls', sortOrder: 3 },
    { name: 'Boys', slug: 'boys', sortOrder: 4 },
    { name: 'Babies', slug: 'babies', sortOrder: 5 },
];

async function main() {
    console.log('Seeding categories...\n');

    for (const cat of categories) {
        try {
            const created = await prisma.category.upsert({
                where: { slug: cat.slug },
                update: {},
                create: cat
            });
            console.log(`✅ ${created.name}`);
        } catch (error) {
            console.log(`❌ ${cat.name}: ${error.message}`);
        }
    }

    console.log('\nDone!');
    await prisma.$disconnect();
}

main();
