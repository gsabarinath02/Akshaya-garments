import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import CollectionCarousel from '@/components/CollectionCarousel';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { FaWhatsapp, FaYoutube, FaMapMarkerAlt, FaUserPlus, FaSearch, FaBoxOpen } from 'react-icons/fa';

async function getUser() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: { name: true }
        });

        return user;
    } catch (error) {
        return null;
    }
}

export default async function HomePage() {
    const user = await getUser();

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black">
                {/* Main Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-cultural-bg.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Main Gradient Overlay - Raspberry Fade to integrate with Navbar/Footer */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-primary)]/40 via-transparent to-transparent z-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-10" />
                <div className="absolute inset-0 bg-black/30 z-10" /> {/* General darkening for text readability */}

                {/* Hero Content */}
                <div className="container relative z-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-slideUp">
                        {user ? (
                            <>
                                Welcome back,
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-accent-primary)] drop-shadow-lg">
                                    {user.name.split(' ')[0]}
                                </span>
                            </>
                        ) : (
                            <>
                                Welcome to
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-accent-primary)] drop-shadow-lg">
                                    Akshaya Garments
                                </span>
                            </>
                        )}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed opacity-90 animate-fadeIn">
                        Discover our exclusive collection of premium clothing for the entire family.
                        Quality fabrics, timeless designs, and unbeatable comfort.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slideUp delay-100">
                        <Link
                            href="/products"
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[#FF8FA3] text-white font-bold text-lg shadow-[0_0_20px_rgba(212,51,94,0.5)] hover:shadow-[0_0_30px_rgba(212,51,94,0.8)] hover:scale-105 transition-all duration-300"
                        >
                            Explore Collection
                        </Link>
                        <Link
                            href="/how-to-order"
                            className="px-8 py-4 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                        >
                            How to Order
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3D Collection Carousel */}
            <CollectionCarousel />

            {/* Brand Story Section */}
            <section className="section section-alt">
                <div className="container">
                    <div className="story-section">
                        <div className="story-content">
                            <h2 className="mb-3">Our <span className="text-gradient">Story</span></h2>
                            <p className="mb-3">
                                Founded with a passion for quality and style, we have been serving
                                fashion-forward customers for over a decade. Our commitment to excellence
                                drives us to source the finest fabrics and create designs that stand the test of time.
                            </p>
                            <p className="mb-4">
                                We believe that great fashion should be accessible to everyone. That&apos;s why
                                we work directly with manufacturers to bring you premium quality at
                                competitive prices.
                            </p>
                            <Link href="/about" className="btn btn-secondary">
                                Learn More About Us
                            </Link>
                        </div>
                        <div className="card stats-section">
                            <div className="stats-grid-2x2">
                                <div className="stat-box">
                                    <span className="stat-number text-gradient">10+</span>
                                    <span className="stat-label">Years Experience</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-number text-gradient">2000+</span>
                                    <span className="stat-label">Unique Designs</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-number text-gradient">500+</span>
                                    <span className="stat-label">Happy Dealers</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-number text-gradient">5</span>
                                    <span className="stat-label">Categories</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Order Section */}
            <section className="section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2>How to <span className="text-gradient">Order</span></h2>
                        <p className="page-subtitle">
                            Simple steps to place your order with us
                        </p>
                    </div>

                    <div className="steps-section">
                        {[
                            { step: '01', title: 'Register', desc: 'Create your dealer account with your shop details and GST number', icon: <FaUserPlus /> },
                            { step: '02', title: 'Browse', desc: 'Explore our collection and add your favorite designs to cart', icon: <FaSearch /> },
                            { step: '03', title: 'WhatsApp', desc: 'Share your cart via WhatsApp to place your order', icon: <FaWhatsapp /> },
                            { step: '04', title: 'Receive', desc: 'We will confirm and dispatch your order promptly', icon: <FaBoxOpen /> },
                        ].map((item) => (
                            <div key={item.step} className="card step-box group hover:-translate-y-2 transition-transform duration-300">
                                <span className="step-emoji text-4xl text-[var(--color-accent-primary)] mb-4 block group-hover:scale-110 transition-transform">{item.icon}</span>
                                <span className="step-number text-gradient">{item.step}</span>
                                <h4 className="step-title">{item.title}</h4>
                                <p className="step-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5">
                        <Link href="/register" className="btn btn-primary">
                            Register Now to Start Ordering
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section section-alt">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2>Get in <span className="text-gradient">Touch</span></h2>
                    </div>

                    <div className="contact-section">
                        <a href="https://wa.me/919566433713" target="_blank" rel="noopener noreferrer" className="card contact-box group">
                            <span className="contact-icon text-5xl text-[var(--color-accent-primary)] mb-4 block w-fit mx-auto group-hover:scale-110 transition-transform"><FaWhatsapp /></span>
                            <h4 className="contact-title">WhatsApp</h4>
                            <p className="contact-desc">Chat with us</p>
                        </a>

                        <a href="https://youtube.com/@akshayagarments" target="_blank" rel="noopener noreferrer" className="card contact-box group">
                            <span className="contact-icon text-5xl text-[var(--color-accent-primary)] mb-4 block w-fit mx-auto group-hover:scale-110 transition-transform"><FaYoutube /></span>
                            <h4 className="contact-title">YouTube</h4>
                            <p className="contact-desc">Watch our videos</p>
                        </a>

                        <div className="card contact-box group">
                            <span className="contact-icon text-5xl text-[var(--color-accent-primary)] mb-4 block w-fit mx-auto group-hover:scale-110 transition-transform"><FaMapMarkerAlt /></span>
                            <h4 className="contact-title">Visit Us</h4>
                            <p className="contact-desc">15, Military Colony 3rd street,<br />Rayapuram, Tirupur 641601</p>
                            <p className="contact-desc mt-2">+91 95664 33713</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
