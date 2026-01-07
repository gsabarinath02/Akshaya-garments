import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId')?.value;
    if (!adminId) return null;
    try { return await prisma.admin.findUnique({ where: { id: parseInt(adminId) } }); }
    catch { return null; }
}

export async function POST(request) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { productId, name, image, sortOrder } = await request.json();
        const design = await prisma.productDesign.create({
            data: { productId, name, image, sortOrder: sortOrder || 0 }
        });
        return NextResponse.json({ design });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));
        await prisma.productDesign.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
