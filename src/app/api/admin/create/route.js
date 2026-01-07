import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { name, email, password, secret } = await request.json();

        // Simple secret to prevent unauthorized admin creation
        if (secret !== process.env.ADMIN_CREATE_SECRET) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!name || !email || !password) {
            return Response.json({ error: 'All fields required' }, { status: 400 });
        }

        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return Response.json({ error: 'Admin already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
            data: { name, email, password: hashedPassword }
        });

        return Response.json({
            success: true,
            message: 'Admin created',
            admin: { id: admin.id, name: admin.name, email: admin.email }
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
