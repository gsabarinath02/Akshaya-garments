'use client';

import { useState } from 'react';

const configFields = [
    { key: 'brand_story', label: 'Brand Story', type: 'textarea', placeholder: 'Tell your brand story...' },
    { key: 'address', label: 'Business Address', type: 'text', placeholder: 'Full address' },
    { key: 'phone_number', label: 'Phone Number', type: 'text', placeholder: '+91 98765 43210' },
    { key: 'whatsapp_number', label: 'WhatsApp Number (for orders)', type: 'text', placeholder: '+91 98765 43210' },
    { key: 'youtube_channels', label: 'YouTube Channel URL', type: 'text', placeholder: 'https://youtube.com/@channel' },
];

export default function ContentClient({ initialConfig }) {
    const [config, setConfig] = useState(initialConfig);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (key, value) => {
        setConfig({ ...config, [key]: value });
        setSaved(false);
    };

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
        } catch (err) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="admin-card" style={{ padding: 'var(--spacing-lg)' }}>
                {configFields.map((field) => (
                    <div key={field.key} className="form-group">
                        <label className="form-label">{field.label}</label>
                        {field.type === 'textarea' ? (
                            <textarea
                                className="form-input form-textarea"
                                value={config[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                rows={6}
                            />
                        ) : (
                            <input
                                type="text"
                                className="form-input"
                                value={config[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saved && (
                        <span style={{ color: '#10b981', fontSize: '0.875rem' }}>
                            ✓ Saved successfully!
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}
