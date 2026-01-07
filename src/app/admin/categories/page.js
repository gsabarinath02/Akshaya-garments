import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CategoriesClient from './CategoriesClient';

async function getAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId')?.value;
    if (!adminId) return null;

    try {
        return await prisma.admin.findUnique({ where: { id: parseInt(adminId) } });
    } catch { return null; }
}

async function getCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                subCategories: { orderBy: { sortOrder: 'asc' } },
                _count: { select: { subCategories: true } }
            }
        });
    } catch { return []; }
}

export default async function AdminCategoriesPage() {
    const admin = await getAdmin();
    if (!admin) redirect('/admin/login');

    const categories = await getCategories();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar admin={admin} />
            <main className="admin-main">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1>Category <span className="text-gradient">Management</span></h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage product categories and subcategories</p>
                </div>
                <CategoriesClient initialCategories={categories} />
            </main>
        </div>
    );
}
