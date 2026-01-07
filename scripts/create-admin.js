// Script to create an admin user
// Run: node scripts/create-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function main() {
    console.log('\n=== Create Admin User ===\n');

    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    if (!name || !email || !password) {
        console.log('All fields are required!');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const admin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        console.log('\n✅ Admin created successfully!');
        console.log(`   Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`\nYou can now login at /admin/login\n`);
    } catch (error) {
        if (error.code === 'P2002') {
            console.log('\n❌ An admin with this email already exists!');
        } else {
            console.log('\n❌ Error creating admin:', error.message);
        }
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

main();
