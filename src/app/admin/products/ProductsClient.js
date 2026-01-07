'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

export default function ProductsClient({ initialProducts = [], categories = [], cloudinaryCloudName }) {
    const [products, setProducts] = useState(initialProducts || []);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', subCategoryId: '', description: '', hasColorChoice: false
    });

    const createSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/products', {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingProduct?.id,
                    ...formData,
                    slug: createSlug(formData.name),
                    subCategoryId: parseInt(formData.subCategoryId)
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (editingProduct) {
                    setProducts(p => p.map(x => x.id === data.product.id ? { ...x, ...data.product } : x));
                } else {
                    setProducts(p => [{ ...data.product, designs: [], colors: [] }, ...p]);
                }
                resetForm();
            }
        } catch { alert('Failed to save'); }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', subCategoryId: '', description: '', hasColorChoice: false });
    };

    const deleteProduct = async (id) => {
        if (!confirm('Delete this product and all its designs?')) return;
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) setProducts(p => p.filter(x => x.id !== id));
        } catch { alert('Failed'); }
    };

    const addDesign = async (productId, imageUrl, name) => {
        try {
            const res = await fetch('/api/admin/designs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, image: imageUrl, name: name || 'Design' })
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(p => p.map(x =>
                    x.id === productId ? { ...x, designs: [...x.designs, data.design] } : x
                ));
            }
        } catch { alert('Failed'); }
    };

    const deleteDesign = async (productId, designId) => {
        if (!confirm('Delete this design?')) return;
        try {
            const res = await fetch(`/api/admin/designs?id=${designId}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(p => p.map(x =>
                    x.id === productId ? { ...x, designs: x.designs.filter(d => d.id !== designId) } : x
                ));
            }
        } catch { alert('Failed'); }
    };

    const addColor = async (productId, colorName, colorHex) => {
        try {
            const res = await fetch('/api/admin/colors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, colorName, colorHex })
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(p => p.map(x =>
                    x.id === productId ? { ...x, colors: [...x.colors, data.color] } : x
                ));
            }
        } catch { alert('Failed'); }
    };

    const deleteColor = async (productId, colorId) => {
        try {
            const res = await fetch(`/api/admin/colors?id=${colorId}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(p => p.map(x =>
                    x.id === productId ? { ...x, colors: x.colors.filter(c => c.id !== colorId) } : x
                ));
            }
        } catch { alert('Failed'); }
    };

    return (
        <>
            <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginBottom: 'var(--spacing-lg)' }}>
                + Add Product
            </button>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{editingProduct ? 'Edit' : 'New'} Product</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subcategory</label>
                            <select className="form-input" value={formData.subCategoryId} onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })} required>
                                <option value="">Select...</option>
                                {categories.map(cat => (
                                    <optgroup key={cat.id} label={cat.name}>
                                        {cat.subCategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input form-textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.hasColorChoice} onChange={(e) => setFormData({ ...formData, hasColorChoice: e.target.checked })} />
                                Has color choice (customers must select a color)
                            </label>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        cloudinaryCloudName={cloudinaryCloudName}
                        onEdit={() => { setEditingProduct(product); setFormData({ name: product.name, subCategoryId: String(product.subCategoryId), description: product.description || '', hasColorChoice: product.hasColorChoice }); setShowForm(true); }}
                        onDelete={() => deleteProduct(product.id)}
                        onAddDesign={addDesign}
                        onDeleteDesign={deleteDesign}
                        onAddColor={addColor}
                        onDeleteColor={deleteColor}
                    />
                ))}
            </div>

            {products.length === 0 && (
                <div className="admin-card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>No products yet. Create categories first, then add products!</p>
                </div>
            )}
        </>
    );
}

function ProductCard({ product, cloudinaryCloudName, onEdit, onDelete, onAddDesign, onDeleteDesign, onAddColor, onDeleteColor }) {
    const [showDesigns, setShowDesigns] = useState(false);
    const [colorForm, setColorForm] = useState({ name: '', hex: '#000000' });

    return (
        <div className="admin-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                <div>
                    <h3>{product.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        {product.subCategory?.category?.name} → {product.subCategory?.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {product.designs?.length || 0} designs • {product.hasColorChoice ? `${product.colors?.length || 0} colors` : 'No color choice'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }} onClick={onEdit}>Edit</button>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#ef4444' }} onClick={onDelete}>Delete</button>
                </div>
            </div>

            {/* Designs Section */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                    <h4 style={{ fontSize: '0.875rem' }}>Designs</h4>
                    <CldUploadWidget
                        uploadPreset="ml_default"
                        options={{ folder: 'clothing-brand/designs' }}
                        onSuccess={(result) => {
                            onAddDesign(product.id, result.info.secure_url, `Design ${(product.designs?.length || 0) + 1}`);
                        }}
                    >
                        {({ open }) => (
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => open()}>
                                + Upload Design
                            </button>
                        )}
                    </CldUploadWidget>
                </div>

                {product.designs?.length > 0 ? (
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                        {product.designs.map((design) => (
                            <div key={design.id} style={{ position: 'relative', width: '80px' }}>
                                <img src={design.image} alt={design.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                <button
                                    onClick={() => onDeleteDesign(product.id, design.id)}
                                    style={{
                                        position: 'absolute', top: '2px', right: '2px',
                                        background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white',
                                        width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', fontSize: '12px'
                                    }}
                                >×</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No designs uploaded yet</p>
                )}
            </div>

            {/* Colors Section (if hasColorChoice) */}
            {product.hasColorChoice && (
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>Colors</h4>

                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap', marginBottom: 'var(--spacing-sm)' }}>
                        {product.colors?.map((color) => (
                            <div key={color.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--glass-bg)', padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>
                                <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: color.colorHex, border: '1px solid var(--glass-border)' }} />
                                {color.colorName}
                                <button onClick={() => onDeleteColor(product.id, color.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>×</button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); onAddColor(product.id, colorForm.name, colorForm.hex); setColorForm({ name: '', hex: '#000000' }); }} style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
                        <input type="color" value={colorForm.hex} onChange={(e) => setColorForm({ ...colorForm, hex: e.target.value })} style={{ width: '40px', height: '32px', padding: 0, border: 'none', cursor: 'pointer' }} />
                        <input className="form-input" placeholder="Color name" value={colorForm.name} onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })} style={{ flex: 1, padding: '0.5rem' }} required />
                        <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Add</button>
                    </form>
                </div>
            )}
        </div>
    );
}
