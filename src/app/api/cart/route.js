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

// GET - Get cart items
export async function GET() {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Please login to view your cart' },
            { status: 401 }
        );
    }

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: {
                design: {
                    include: {
                        product: {
                            include: {
                                subCategory: {
                                    include: {
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                },
                color: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ cartItems });
    } catch (error) {
        console.error('Get cart error:', error);
        return NextResponse.json(
            { error: 'Failed to get cart' },
            { status: 500 }
        );
    }
}

// POST - Add item to cart
export async function POST(request) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Please login to add items to cart' },
            { status: 401 }
        );
    }

    try {
        const { designId, colorId, quantity = 1 } = await request.json();

        if (!designId) {
            return NextResponse.json(
                { error: 'Design ID is required' },
                { status: 400 }
            );
        }

        // Check if item already exists in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                userId: user.id,
                designId,
                colorId: colorId || null
            }
        });

        if (existingItem) {
            // Update quantity
            const updated = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
            return NextResponse.json({ cartItem: updated, message: 'Cart updated' });
        }

        // Create new cart item
        const cartItem = await prisma.cartItem.create({
            data: {
                userId: user.id,
                designId,
                colorId: colorId || null,
                quantity
            }
        });

        return NextResponse.json({ cartItem, message: 'Added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        return NextResponse.json(
            { error: 'Failed to add to cart' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from cart
export async function DELETE(request) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Please login' },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('id');

        if (!itemId) {
            return NextResponse.json(
                { error: 'Item ID is required' },
                { status: 400 }
            );
        }

        // Verify item belongs to user
        const item = await prisma.cartItem.findFirst({
            where: {
                id: parseInt(itemId),
                userId: user.id
            }
        });

        if (!item) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        await prisma.cartItem.delete({
            where: { id: parseInt(itemId) }
        });

        return NextResponse.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        return NextResponse.json(
            { error: 'Failed to remove from cart' },
            { status: 500 }
        );
    }
}

// PATCH - Update item quantity
export async function PATCH(request) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json(
            { error: 'Please login' },
            { status: 401 }
        );
    }

    try {
        const { itemId, quantity } = await request.json();

        if (!itemId || quantity < 1) {
            return NextResponse.json(
                { error: 'Valid item ID and quantity required' },
                { status: 400 }
            );
        }

        // Verify item belongs to user
        const item = await prisma.cartItem.findFirst({
            where: {
                id: parseInt(itemId),
                userId: user.id
            }
        });

        if (!item) {
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        const updated = await prisma.cartItem.update({
            where: { id: parseInt(itemId) },
            data: { quantity }
        });

        return NextResponse.json({ cartItem: updated });
    } catch (error) {
        console.error('Update cart error:', error);
        return NextResponse.json(
            { error: 'Failed to update cart' },
            { status: 500 }
        );
    }
}
