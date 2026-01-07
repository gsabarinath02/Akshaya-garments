'use client';

import { useState } from 'react';

export default function SettingsClient({ initialConfig, admin }) {
    const [config, setConfig] = useState({
        whatsapp_number: initialConfig.whatsapp_number || ''
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            {/* WhatsApp Settings */}
            <div className="admin-card" style={{ padding: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>📱 WhatsApp Settings</h3>
                <div className="form-group">
                    <label className="form-label">WhatsApp Number for Orders</label>
                    <input
                        type="text"
                        className="form-input"
                        value={config.whatsapp_number}
                        onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                        placeholder="+91 98765 43210"
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                        Customer orders will be shared to this WhatsApp number
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    {saved && <span style={{ color: '#10b981', fontSize: '0.875rem' }}>✓ Saved!</span>}
                </div>
            </div>

            {/* Admin Info */}
            <div className="admin-card" style={{ padding: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>👤 Admin Account</h3>
                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                    <div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Name</span>
                        <p>{admin?.name}</p>
                    </div>
                    <div>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Email</span>
                        <p>{admin?.email}</p>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="admin-card" style={{ padding: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>🔗 Cloudinary Dashboard</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
                    Manage your uploaded images on Cloudinary
                </p>
                <a
                    href="https://cloudinary.com/console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                >
                    Open Cloudinary
                </a>
            </div>
        </div>
    );
}
