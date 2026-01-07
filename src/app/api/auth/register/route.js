import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, phone, shopName, address, gstNumber, pincode, password } = body;

        // Validate required fields
        if (!name || !phone || !shopName || !address || !pincode || !password) {
            return NextResponse.json(
                { error: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'A user with this phone number already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                phone,
                shopName,
                address,
                gstNumber: gstNumber || null,
                pincode,
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                shopName: user.shopName,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        );
    }
}
