// Script to reset and reseed products (clears existing sample products first)
// Run: node scripts/reset-products.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Clearing existing products, designs, and subcategories...\n');

    // Delete in order: designs -> products -> subcategories
    await prisma.productDesign.deleteMany({});
    console.log('   ✅ Deleted all designs');

    await prisma.product.deleteMany({});
    console.log('   ✅ Deleted all products');

    await prisma.subCategory.deleteMany({});
    console.log('   ✅ Deleted all subcategories');

    console.log('\n✨ Done! Now run: node scripts/seed-products.js');
    await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
