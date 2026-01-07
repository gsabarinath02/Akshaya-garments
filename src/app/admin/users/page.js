import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';

async function getAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId')?.value;
    if (!adminId) return null;
    try { return await prisma.admin.findUnique({ where: { id: parseInt(adminId) } }); }
    catch { return null; }
}

async function getUsers() {
    try {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { orders: true } } }
        });
    } catch { return []; }
}

export default async function AdminUsersPage() {
    const admin = await getAdmin();
    if (!admin) redirect('/admin/login');

    const users = await getUsers();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar admin={admin} />
            <main className="admin-main">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1>Registered <span className="text-gradient">Users</span></h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>View registered dealers and customers</p>
                </div>

                <div className="admin-card">
                    {users.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Shop Name</th>
                                    <th>Address</th>
                                    <th>Pincode</th>
                                    <th>GST</th>
                                    <th>Orders</th>
                                    <th>Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: '500' }}>{user.name}</td>
                                        <td>
                                            <a href={`https://wa.me/${user.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-primary)' }}>
                                                {user.phone}
                                            </a>
                                        </td>
                                        <td>{user.shopName}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.address}</td>
                                        <td>{user.pincode}</td>
                                        <td>{user.gstNumber || '-'}</td>
                                        <td>{user._count?.orders || 0}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--spacing-xl)' }}>
                            No registered users yet
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
