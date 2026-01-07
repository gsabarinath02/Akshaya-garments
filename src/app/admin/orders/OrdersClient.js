'use client';

import { useState } from 'react';

export default function OrdersClient({ initialOrders }) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });

            if (res.ok) {
                setOrders(orders.map(o =>
                    o.id === orderId ? { ...o, status: newStatus } : o
                ));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            }
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    return (
        <>
            {/* Filters */}
            <div className="admin-card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                    {['all', 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 400px' : '1fr', gap: 'var(--spacing-lg)' }}>
                {/* Orders Table */}
                <div className="admin-card">
                    {filteredOrders.length > 0 ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} style={{ background: selectedOrder?.id === order.id ? 'var(--color-bg-card-hover)' : '' }}>
                                        <td>#{order.id}</td>
                                        <td>{order.user?.name || 'Unknown'}</td>
                                        <td>{order.user?.phone}</td>
                                        <td>{order.items?.length || 0}</td>
                                        <td>
                                            <span className={`badge badge-${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--spacing-xl)' }}>
                            No orders found
                        </p>
                    )}
                </div>

                {/* Order Details Panel */}
                {selectedOrder && (
                    <div className="admin-card" style={{ position: 'sticky', top: 'var(--spacing-lg)', alignSelf: 'start' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h3>Order #{selectedOrder.id}</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Customer Info */}
                        <div style={{ marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--glass-border)' }}>
                            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Customer</h4>
                            <p><strong>{selectedOrder.user?.name}</strong></p>
                            <p style={{ fontSize: '0.875rem' }}>{selectedOrder.user?.phone}</p>
                            <p style={{ fontSize: '0.875rem' }}>{selectedOrder.user?.shopName}</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{selectedOrder.user?.address}</p>
                            <p style={{ fontSize: '0.875rem' }}>Pincode: {selectedOrder.user?.pincode}</p>
                            {selectedOrder.user?.gstNumber && (
                                <p style={{ fontSize: '0.875rem' }}>GST: {selectedOrder.user?.gstNumber}</p>
                            )}
                        </div>

                        {/* Items */}
                        <div style={{ marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--glass-border)' }}>
                            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Items</h4>
                            {selectedOrder.items?.map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    gap: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-xs) 0',
                                    borderBottom: i < selectedOrder.items.length - 1 ? '1px solid var(--glass-border)' : 'none'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                            {item.design?.product?.name || 'Product'} - {item.design?.name}
                                        </p>
                                        {item.color && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    backgroundColor: item.color.colorHex,
                                                    display: 'inline-block'
                                                }}></span>
                                                {item.color.colorName}
                                            </p>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.875rem' }}>×{item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        {/* Status Update */}
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>Update Status</h4>
                            <select
                                className="form-input"
                                style={{
                                    width: '100%',
                                    backgroundColor: 'var(--color-bg-card)',
                                    color: 'var(--color-text-primary)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em'
                                }}
                                value={selectedOrder.status}
                                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* WhatsApp Button */}
                        <a
                            href={`https://wa.me/${(selectedOrder.user?.phone || '').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            💬 Contact on WhatsApp
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
