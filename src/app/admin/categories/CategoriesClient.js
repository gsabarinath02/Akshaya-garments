'use client';

import { useState } from 'react';

export default function CategoriesClient({ initialCategories }) {
    const [categories, setCategories] = useState(initialCategories);
    const [showForm, setShowForm] = useState(false);
    const [showSubForm, setShowSubForm] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', sortOrder: 0 });
    const [subFormData, setSubFormData] = useState({ name: '', sortOrder: 0 });

    const createSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/categories', {
                method: editingCategory ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingCategory?.id,
                    name: formData.name,
                    slug: createSlug(formData.name),
                    sortOrder: parseInt(formData.sortOrder)
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (editingCategory) {
                    setCategories(cats => cats.map(c => c.id === data.category.id ? { ...c, ...data.category } : c));
                } else {
                    setCategories(cats => [...cats, { ...data.category, subCategories: [], _count: { subCategories: 0 } }]);
                }
                setShowForm(false);
                setEditingCategory(null);
                setFormData({ name: '', sortOrder: 0 });
            }
        } catch (err) {
            alert('Failed to save category');
        }
    };

    const handleSubSubmit = async (e, categoryId) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/subcategories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId,
                    name: subFormData.name,
                    slug: createSlug(subFormData.name),
                    sortOrder: parseInt(subFormData.sortOrder)
                })
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(cats => cats.map(c =>
                    c.id === categoryId
                        ? { ...c, subCategories: [...c.subCategories, data.subCategory], _count: { subCategories: c._count.subCategories + 1 } }
                        : c
                ));
                setShowSubForm(null);
                setSubFormData({ name: '', sortOrder: 0 });
            }
        } catch (err) {
            alert('Failed to save subcategory');
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm('Delete this category and all its subcategories?')) return;
        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
            if (res.ok) setCategories(cats => cats.filter(c => c.id !== id));
        } catch { alert('Failed to delete'); }
    };

    const deleteSubCategory = async (categoryId, subId) => {
        if (!confirm('Delete this subcategory?')) return;
        try {
            const res = await fetch(`/api/admin/subcategories?id=${subId}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(cats => cats.map(c =>
                    c.id === categoryId
                        ? { ...c, subCategories: c.subCategories.filter(s => s.id !== subId), _count: { subCategories: c._count.subCategories - 1 } }
                        : c
                ));
            }
        } catch { alert('Failed to delete'); }
    };

    return (
        <>
            <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingCategory(null); setFormData({ name: '', sortOrder: 0 }); }} style={{ marginBottom: 'var(--spacing-lg)' }}>
                + Add Category
            </button>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{editingCategory ? 'Edit' : 'New'} Category</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Sort Order</label>
                            <input type="number" className="form-input" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {categories.map((cat) => (
                    <div key={cat.id} className="admin-card" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <div>
                                <h3>{cat.name}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>/{cat.slug} • {cat._count?.subCategories || 0} subcategories</p>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }} onClick={() => { setEditingCategory(cat); setFormData({ name: cat.name, sortOrder: cat.sortOrder }); setShowForm(true); }}>Edit</button>
                                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={() => deleteCategory(cat.id)}>Delete</button>
                            </div>
                        </div>

                        {cat.subCategories?.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-md)', paddingLeft: 'var(--spacing-md)', borderLeft: '2px solid var(--glass-border)' }}>
                                {cat.subCategories.map((sub) => (
                                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-xs) 0' }}>
                                        <span>{sub.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>/{sub.slug}</span></span>
                                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#ef4444' }} onClick={() => deleteSubCategory(cat.id, sub.id)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showSubForm === cat.id ? (
                            <form onSubmit={(e) => handleSubSubmit(e, cat.id)} style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}>
                                    <input className="form-input" placeholder="Subcategory name" value={subFormData.name} onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Add</button>
                                <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setShowSubForm(null)}>Cancel</button>
                            </form>
                        ) : (
                            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setShowSubForm(cat.id)}>+ Add Subcategory</button>
                        )}
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="admin-card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>No categories yet. Create your first category!</p>
                </div>
            )}
        </>
    );
}
