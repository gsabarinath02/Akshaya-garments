'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?callbackUrl=/cart');
        } else if (!authLoading && user) {
            fetchCart();
        }
    }, [authLoading, user, router]);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart');
            const data = await res.json();
            setCartItems(data.items || data.cartItems || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        try {
            await fetch('/api/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, quantity }),
            });
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (id) => {
        try {
            await fetch(`/api/cart?id=${id}`, { method: 'DELETE' });
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const placeOrder = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
            });
            const data = await res.json();

            if (data.whatsappUrl) {
                setCartItems([]);
                window.open(data.whatsappUrl, '_blank');
                router.refresh();
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error creating order');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <>
                <Header />
                <main className="main-content" style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="text-center">
                        <div className="spinner"></div>
                        <p style={{ marginTop: 'var(--spacing-md)' }}>Loading your cart...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const totalDesigns = cartItems.length;
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <Header />
            <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container">
                    <div className="section">
                        <h1 className="mb-5">Your <span className="text-gradient">Cart</span></h1>

                        {cartItems.length === 0 ? (
                            <div className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--spacing-md)' }}>🛒</span>
                                <h3>Your cart is empty</h3>
                                <p className="mb-4">Looks like you haven&apos;t added any designs yet.</p>
                                <Link href="/products" className="btn btn-primary">
                                    Browse Collection
                                </Link>
                            </div>
                        ) : (
                            <div className="cart-layout">
                                <div className="cart-items">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="card cart-item mb-3">
                                            {/* Design Image */}
                                            <div className="cart-item-image">
                                                <img
                                                    src={item.design?.image}
                                                    alt={item.design?.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                                />
                                            </div>

                                            {/* Info */}
                                            <div style={{ flex: 1, padding: '0 var(--spacing-md)' }}>
                                                <h4>{item.design?.name}</h4>
                                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                    Product: {item.design?.product?.name}
                                                    {item.color && <span style={{ marginLeft: '10px' }}>Color: {item.color.colorName}</span>}
                                                </p>
                                                {item.color && (
                                                    <div className="color-swatch" style={{ background: item.color.colorHex, width: '20px', height: '20px', cursor: 'default', marginTop: '5px', borderRadius: '50%' }}></div>
                                                )}
                                            </div>

                                            {/* Quantity and Actions */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn btn-icon btn-secondary"
                                                    onClick={() => removeItem(item.id)}
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="card" style={{ padding: 'var(--spacing-lg)', position: 'sticky', top: '120px' }}>
                                    <h3 className="mb-4">Order Summary</h3>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                                        <span>Total Designs:</span>
                                        <strong>{totalDesigns}</strong>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                                        <span>Total Items:</span>
                                        <strong>{totalItems}</strong>
                                    </div>

                                    <div className="mb-4 p-3" style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                                        <p>📦 <strong>Note:</strong> We don&apos;t take payments online.</p>
                                        <p style={{ marginTop: '5px' }}>Clicking &quot;Place Order&quot; will generate a WhatsApp message with your order details sent directly to our team.</p>
                                    </div>

                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                        onClick={placeOrder}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Creating Order...' : (
                                            <>
                                                <span>💬</span> Place Order on WhatsApp
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
