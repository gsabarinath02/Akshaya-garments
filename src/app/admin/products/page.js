import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductsClient from './ProductsClient';

async function getAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId')?.value;
    if (!adminId) return null;
    try { return await prisma.admin.findUnique({ where: { id: parseInt(adminId) } }); }
    catch { return null; }
}

async function getData() {
    try {
        const [categories, products] = await Promise.all([
            prisma.category.findMany({
                orderBy: { sortOrder: 'asc' },
                include: { subCategories: { orderBy: { sortOrder: 'asc' } } }
            }),
            prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    subCategory: { include: { category: true } },
                    designs: { orderBy: { sortOrder: 'asc' } },
                    colors: true
                }
            })
        ]);
        return { categories, products };
    } catch { return { categories: [], products: [] }; }
}

export default async function AdminProductsPage() {
    const admin = await getAdmin();
    if (!admin) redirect('/admin/login');

    const { categories, products } = await getData();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar admin={admin} />
            <main className="admin-main">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1>Product <span className="text-gradient">Management</span></h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage products, designs, and colors</p>
                </div>
                <ProductsClient
                    initialProducts={products}
                    categories={categories}
                    cloudinaryCloudName={process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                />
            </main>
        </div>
    );
}
