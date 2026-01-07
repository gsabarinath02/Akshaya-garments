import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

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

async function getDashboardStats() {
    try {
        const [orders, users, categories, products] = await Promise.all([
            prisma.order.count(),
            prisma.user.count(),
            prisma.category.count(),
            prisma.product.count()
        ]);

        const pendingOrders = await prisma.order.count({
            where: { status: 'pending' }
        });

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                _count: { select: { items: true } }
            }
        });

        return { orders, users, categories, products, pendingOrders, recentOrders };
    } catch {
        return { orders: 0, users: 0, categories: 0, products: 0, pendingOrders: 0, recentOrders: [] };
    }
}

// SVG Icons for stats cards
const OrdersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const PendingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ProductsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16.5 9.4l-9-5.19" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export default async function AdminDashboard() {
    const admin = await getAdmin();

    if (!admin) {
        redirect('/admin/login');
    }

    const stats = await getDashboardStats();

    const statCards = [
        {
            label: 'Total Orders',
            value: stats.orders,
            Icon: OrdersIcon,
            color: 'var(--color-accent-primary)',
            bg: 'rgba(232, 115, 111, 0.1)'
        },
        {
            label: 'Pending Orders',
            value: stats.pendingOrders,
            Icon: PendingIcon,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)'
        },
        {
            label: 'Registered Users',
            value: stats.users,
            Icon: UsersIcon,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)'
        },
        {
            label: 'Total Products',
            value: stats.products,
            Icon: ProductsIcon,
            color: '#6366f1',
            bg: 'rgba(99, 102, 241, 0.1)'
        },
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar admin={admin} />

            <main className="admin-main">
                {/* Header */}
                <header className="admin-header">
                    <div>
                        <h1 className="admin-page-title">
                            Welcome back, <span className="text-gradient">{admin.name}</span>
                        </h1>
                        <p className="admin-page-subtitle">Here&apos;s what&apos;s happening with your store today</p>
                    </div>
                    <Link href="/" className="admin-header-link" target="_blank">
                        <span>View Store</span>
                        <ArrowRightIcon />
                    </Link>
                </header>

                {/* Stats Grid */}
                <div className="admin-stats-grid">
                    {statCards.map((stat, i) => (
                        <div key={i} className="admin-stat-card">
                            <div className="admin-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                                <stat.Icon />
                            </div>
                            <div className="admin-stat-content">
                                <span className="admin-stat-value" style={{ color: stat.color }}>{stat.value}</span>
                                <span className="admin-stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Recent Orders</h3>
                        <Link href="/admin/orders" className="admin-card-action">
                            View All
                            <ArrowRightIcon />
                        </Link>
                    </div>

                    {stats.recentOrders.length > 0 ? (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="admin-table-id">#{order.id}</td>
                                            <td>
                                                <div className="admin-table-customer">
                                                    <span className="admin-table-customer-name">{order.user?.name || 'Unknown'}</span>
                                                    <span className="admin-table-customer-phone">{order.user?.phone}</span>
                                                </div>
                                            </td>
                                            <td>{order._count?.items || 0} items</td>
                                            <td>
                                                <span className={`admin-status admin-status-${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="admin-table-date">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                <Link href="/admin/orders" className="admin-table-action">
                                                    <EyeIcon />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="admin-empty-state">
                            <OrdersIcon />
                            <p>No orders yet</p>
                            <span>Orders will appear here once customers start ordering</span>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="admin-quick-actions">
                    <h3 className="admin-section-title">Quick Actions</h3>
                    <div className="admin-actions-grid">
                        <Link href="/admin/products" className="admin-action-card">
                            <ProductsIcon />
                            <span>Add Product</span>
                        </Link>
                        <Link href="/admin/categories" className="admin-action-card">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>Add Category</span>
                        </Link>
                        <Link href="/admin/orders" className="admin-action-card">
                            <OrdersIcon />
                            <span>View Orders</span>
                        </Link>
                        <Link href="/admin/settings" className="admin-action-card">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                            <span>Settings</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
