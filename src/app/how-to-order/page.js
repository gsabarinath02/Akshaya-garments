import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getHowToOrderContent() {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { key: 'how_to_order' }
        });
        return config?.value || null;
    } catch {
        return null;
    }
}

export default async function HowToOrderPage() {
    const customContent = await getHowToOrderContent();

    const defaultSteps = [
        {
            step: '01',
            title: 'Create Your Account',
            description: 'Register as a dealer with your shop details, address, and GST number. This helps us serve you better and maintain proper records.',
            icon: '📝'
        },
        {
            step: '02',
            title: 'Browse Our Collection',
            description: 'Explore our extensive catalog organized by categories - Mens, Womens, Girls, Boys, and Babies. Each category has subcategories for easy navigation.',
            icon: '👀'
        },
        {
            step: '03',
            title: 'Add to Cart',
            description: 'Select your favorite designs and add them to your cart. For products with color options, choose your preferred colors. Adjust quantities as needed.',
            icon: '🛒'
        },
        {
            step: '04',
            title: 'Share via WhatsApp',
            description: 'Once your cart is ready, click "Share to WhatsApp". This will send your order details directly to us with all product information.',
            icon: '💬'
        },
        {
            step: '05',
            title: 'Confirmation Call',
            description: 'Our team will call you to confirm the order, discuss pricing, and answer any questions you may have about the products.',
            icon: '📞'
        },
        {
            step: '06',
            title: 'Payment & Dispatch',
            description: 'After confirmation, make the payment through your preferred method. We will dispatch your order and share tracking details.',
            icon: '🚚'
        }
    ];

    return (
        <>
            <Header />

            <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
                {/* Hero Section */}
                <section style={{
                    padding: 'var(--spacing-2xl) 0',
                    background: 'var(--color-bg-secondary)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div className="hero-orb hero-orb-2" style={{ opacity: 0.2, right: '20%' }}></div>
                    <div className="container text-center">
                        <h1>How to <span className="text-gradient">Order</span></h1>
                        <p style={{ maxWidth: '600px', margin: '0 auto', marginTop: 'var(--spacing-sm)' }}>
                            Simple steps to place your order with us. No payment gateway needed!
                        </p>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="section">
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {defaultSteps.map((item, index) => (
                                <div
                                    key={item.step}
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--spacing-lg)',
                                        marginBottom: 'var(--spacing-xl)',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Timeline line */}
                                    {index < defaultSteps.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '35px',
                                            top: '70px',
                                            bottom: '-40px',
                                            width: '2px',
                                            background: 'var(--glass-border)'
                                        }} />
                                    )}

                                    {/* Step number */}
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '50%',
                                        background: 'var(--color-accent-gradient)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        flexShrink: 0,
                                        zIndex: 1
                                    }}>
                                        {item.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="card" style={{ flex: 1, padding: 'var(--spacing-lg)' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)',
                                            marginBottom: 'var(--spacing-xs)'
                                        }}>
                                            <span className="text-gradient" style={{ fontWeight: '700' }}>
                                                Step {item.step}
                                            </span>
                                        </div>
                                        <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{item.title}</h3>
                                        <p style={{ fontSize: '0.95rem' }}>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Important Notes */}
                <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div className="container">
                        <h2 className="text-center mb-5">Important <span className="text-gradient">Notes</span></h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'var(--spacing-lg)',
                            maxWidth: '1000px',
                            margin: '0 auto'
                        }}>
                            <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <h4 style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    💰 No Online Payment
                                </h4>
                                <p style={{ fontSize: '0.9rem' }}>
                                    We dont have an online payment gateway. All payments are handled directly
                                    after order confirmation via bank transfer or other methods.
                                </p>
                            </div>

                            <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <h4 style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    📦 Minimum Order
                                </h4>
                                <p style={{ fontSize: '0.9rem' }}>
                                    Minimum order quantities may apply for certain products.
                                    Our team will inform you about this during confirmation.
                                </p>
                            </div>

                            <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <h4 style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    🎨 Color Availability
                                </h4>
                                <p style={{ fontSize: '0.9rem' }}>
                                    Some products have specific color options. Colors shown are indicative
                                    and may vary slightly in actual product.
                                </p>
                            </div>

                            <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                <h4 style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    📞 Support
                                </h4>
                                <p style={{ fontSize: '0.9rem' }}>
                                    Need help? Reach out to us via WhatsApp or phone.
                                    We are available Monday to Saturday, 10 AM to 7 PM.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section">
                    <div className="container text-center">
                        <h2 className="mb-3">Ready to <span className="text-gradient">Order?</span></h2>
                        <p style={{ maxWidth: '500px', margin: '0 auto', marginBottom: 'var(--spacing-lg)' }}>
                            Create your account today and start exploring our collection!
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/register" className="btn btn-primary">
                                Register Now
                            </Link>
                            <Link href="/products" className="btn btn-secondary">
                                Browse Collection
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
