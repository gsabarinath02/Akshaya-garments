import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ContentClient from './ContentClient';

async function getAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId')?.value;
    if (!adminId) return null;
    try { return await prisma.admin.findUnique({ where: { id: parseInt(adminId) } }); }
    catch { return null; }
}

async function getSiteConfig() {
    try {
        const configs = await prisma.siteConfig.findMany();
        const obj = {};
        configs.forEach(c => obj[c.key] = c.value);
        return obj;
    } catch { return {}; }
}

export default async function AdminContentPage() {
    const admin = await getAdmin();
    if (!admin) redirect('/admin/login');

    const config = await getSiteConfig();

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar admin={admin} />
            <main className="admin-main">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1>Site <span className="text-gradient">Content</span></h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Edit website content shown on About and Home pages</p>
                </div>
                <ContentClient initialConfig={config} />
            </main>
        </div>
    );
}
