'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from './Icons';

export default function AdminSidebar({ admin }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        router.push('/admin/login');
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', Icon: Icons.Dashboard },
        { href: '/admin/orders', label: 'Orders', Icon: Icons.Orders },
        { href: '/admin/categories', label: 'Categories', Icon: Icons.Categories },
        { href: '/admin/products', label: 'Products', Icon: Icons.Products },
        { href: '/admin/users', label: 'Users', Icon: Icons.Users },
        { href: '/admin/content', label: 'Site Content', Icon: Icons.Content },
        { href: '/admin/settings', label: 'Settings', Icon: Icons.Settings },
    ];

    return (
        <aside className="admin-sidebar">
            {/* Brand Header */}
            <div className="admin-sidebar-header">
                <Link href="/admin" className="admin-brand">
                    <div className="admin-brand-icon">
                        <Icons.Dashboard size={20} />
                    </div>
                    <div className="admin-brand-text">
                        <span className="admin-brand-name">Akshaya Garments</span>
                        <span className="admin-brand-label">Admin Panel</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="admin-nav">
                <div className="admin-nav-section">
                    <span className="admin-nav-section-title">Main Menu</span>
                    {navItems.slice(0, 2).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <item.Icon size={18} />
                            <span>{item.label}</span>
                            {item.href === '/admin/orders' && (
                                <span className="admin-nav-badge">New</span>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="admin-nav-section">
                    <span className="admin-nav-section-title">Catalog</span>
                    {navItems.slice(2, 4).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <item.Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="admin-nav-section">
                    <span className="admin-nav-section-title">Management</span>
                    {navItems.slice(4).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <item.Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* User Profile & Logout */}
            <div className="admin-sidebar-footer">
                <div className="admin-user-card">
                    <div className="admin-user-avatar">
                        {(admin?.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-user-info">
                        <span className="admin-user-name">{admin?.name || 'Admin'}</span>
                        <span className="admin-user-role">Administrator</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="admin-logout-btn"
                >
                    <Icons.Logout size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
