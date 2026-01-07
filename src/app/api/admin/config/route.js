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

export async function GET() {
    try {
        const configs = await prisma.siteConfig.findMany();
        const obj = {};
        configs.forEach(c => obj[c.key] = c.value);
        return NextResponse.json(obj);
    } catch {
        return NextResponse.json({});
    }
}

export async function POST(request) {
    const admin = await getAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await request.json();

        for (const [key, value] of Object.entries(data)) {
            await prisma.siteConfig.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value), type: 'text' }
            });
        }

        return NextResponse.json({ message: 'Saved' });
    } catch (error) {
        console.error('Config save error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
