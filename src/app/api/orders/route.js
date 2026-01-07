import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Get user from cookie
async function getUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return null;

    try {
        return await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });
    } catch {
        return null;
    }
}

// POST - Create order from cart and share to WhatsApp
export async function POST(request) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Please login to place an order' },
            { status: 401 }
        );
    }

    try {
        // Get cart items
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: {
                design: {
                    include: {
                        product: true
                    }
                },
                color: true
            }
        });

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: 'Your cart is empty' },
                { status: 400 }
            );
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                status: 'pending',
                items: {
                    create: cartItems.map(item => ({
                        designId: item.designId,
                        colorId: item.colorId,
                        quantity: item.quantity
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        design: {
                            include: {
                                product: true
                            }
                        },
                        color: true
                    }
                }
            }
        });

        // Clear cart
        await prisma.cartItem.deleteMany({
            where: { userId: user.id }
        });

        // Get WhatsApp number from config
        let whatsappNumber = '919876543210'; // Default
        try {
            const config = await prisma.siteConfig.findUnique({
                where: { key: 'whatsapp_number' }
            });
            if (config) whatsappNumber = config.value;
        } catch (e) {
            // Use default
        }

        // Generate WhatsApp message
        let message = `🛒 *New Order #${order.id}*\n\n`;
        message += `👤 *Customer:*\n`;
        message += `Name: ${user.name}\n`;
        message += `Phone: ${user.phone}\n`;
        message += `Shop: ${user.shopName}\n`;
        message += `Address: ${user.address}\n`;
        message += `Pincode: ${user.pincode}\n`;
        if (user.gstNumber) message += `GST: ${user.gstNumber}\n`;
        message += `\n📦 *Items:*\n`;

        order.items.forEach((item, i) => {
            message += `${i + 1}. ${item.design.product?.name || 'Product'} - ${item.design.name}`;
            if (item.color) message += ` (${item.color.colorName})`;
            message += ` x${item.quantity}\n`;
        });

        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        message += `\n*Total Items:* ${totalItems}`;

        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

        return NextResponse.json({
            order,
            whatsappUrl,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

// GET - Get user's orders
export async function GET() {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Please login to view orders' },
            { status: 401 }
        );
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        design: {
                            include: {
                                product: true
                            }
                        },
                        color: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { error: 'Failed to get orders' },
            { status: 500 }
        );
    }
}
