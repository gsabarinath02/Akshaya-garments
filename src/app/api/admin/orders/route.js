import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId')?.value;
    if (!adminId) return null;

    try {
        return await prisma.admin.findUnique({
            where: { id: parseInt(adminId) }
        });
    } catch {
        return null;
    }
}

// GET all orders
export async function GET() {
    const admin = await getAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                items: {
                    include: {
                        design: { include: { product: true } },
                        color: true
                    }
                }
            }
        });
        return NextResponse.json({ orders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// PATCH - Update order status
export async function PATCH(request) {
    const admin = await getAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { orderId, status, notes } = await request.json();

        const order = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                status,
                ...(notes && { notes })
            }
        });

        return NextResponse.json({ order });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
