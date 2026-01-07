import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OrdersClient from './OrdersClient';

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

async function getOrders() {
    try {
        return await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
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
    } catch {
        return [];
    }
}

export default async function AdminOrdersPage() {
    const admin = await getAdmin();

    if (!admin) {
        redirect('/admin/login');
    }

    const orders = await getOrders();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar admin={admin} />

            <main className="admin-main">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1>Order <span className="text-gradient">Management</span></h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>View and manage customer orders</p>
                </div>

                <OrdersClient initialOrders={orders} />
            </main>
        </div>
    );
}
