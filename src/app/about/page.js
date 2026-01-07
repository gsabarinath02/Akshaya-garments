import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { FaLayerGroup, FaCut, FaHandHoldingUsd, FaGlobeAsia, FaYoutube, FaMapMarkerAlt, FaWhatsapp, FaPhoneAlt, FaCheckCircle, FaUsers, FaHistory } from 'react-icons/fa';

async function getPageContent() {
    const defaults = {
        brand_story: 'Akshaya Garments represents the pinnacle of textile craftsmanship. Established with a vision to bring premium quality clothing to every household, we have evolved from a humble beginning in Tirupur to a trusted name across the nation.\n\nOur journey is defined by an unyielding commitment to quality. We believe that true style lies in comfort and durability. Every garment we produce allows our customers to experience the perfect blend of traditional values and modern aesthetics.',
        address: '15, Military Colony 3rd street, Rayapuram, Tirupur 641601',
        whatsapp_number: '+91 95664 33713',
        youtube_channels: 'https://youtube.com/@akshayagarments',
        phone_number: '+91 95664 33713'
    };

    try {
        const configs = await prisma.siteConfig.findMany({
            where: {
                key: {
                    in: ['brand_story', 'address', 'whatsapp_number', 'youtube_channels', 'phone_number']
                }
            }
        });

        const content = { ...defaults };
        if (configs && configs.length > 0) {
            configs.forEach(c => {
                if (c.value) content[c.key] = c.value;
            });
        }
        return content;
    } catch (error) {
        console.error('Error loading content:', error);
        return defaults;
    }
}

export default async function AboutPage() {
    const content = await getPageContent();

    return (
        <>
            <Header />

            <main className="min-h-screen pt-[100px] bg-[var(--color-bg-primary)]">
                {/* Hero Section */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent-primary)]/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="container relative z-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Crafting <span className="text-gradient">Excellence</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Defining style for the modern family from the textile capital of India.
                        </p>
                    </div>
                </section>

                {/* Brand Narrative */}
                <section className="section">
                    <div className="container">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold">
                                    Our <span className="text-gradient">Heritage</span>
                                </h2>
                                <div className="prose prose-lg prose-invert text-gray-300">
                                    {content.brand_story.split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                                <div className="flex gap-8 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-4xl font-bold text-gradient">10+</span>
                                        <span className="text-sm text-gray-400 uppercase tracking-wider mt-1">Years of Excellence</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-4xl font-bold text-gradient">100%</span>
                                        <span className="text-sm text-gray-400 uppercase tracking-wider mt-1">Quality Guaranteed</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="card p-8 bg-gradient-to-br from-[var(--glass-bg)] to-transparent border border-[var(--glass-border)]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <FaUsers className="text-3xl text-[var(--color-accent-primary)]" />
                                            <h4 className="font-semibold text-white">Customer Focus</h4>
                                            <p className="text-sm text-gray-400">Building lasting relationships</p>
                                        </div>
                                        <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <FaHistory className="text-3xl text-[var(--color-accent-primary)]" />
                                            <h4 className="font-semibold text-white">Rich Legacy</h4>
                                            <p className="text-sm text-gray-400">Decades of textile expertise</p>
                                        </div>
                                        <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <FaCheckCircle className="text-3xl text-[var(--color-accent-primary)]" />
                                            <h4 className="font-semibold text-white">Quality Assured</h4>
                                            <p className="text-sm text-gray-400">Rigorous testing standards</p>
                                        </div>
                                        <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <FaGlobeAsia className="text-3xl text-[var(--color-accent-primary)]" />
                                            <h4 className="font-semibold text-white">Nationwide</h4>
                                            <p className="text-sm text-gray-400">Delivering across India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="section bg-[var(--color-bg-secondary)] relative">
                    <div className="container">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">The Akshaya <span className="text-gradient">Advantage</span></h2>
                            <p className="text-gray-400">Why leading retailers choose to partner with us</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <FaLayerGroup />,
                                    title: 'Premium Fabrics',
                                    desc: 'Sourced from the finest mills to ensure superior comfort and longevity.'
                                },
                                {
                                    icon: <FaCut />,
                                    title: 'Expert Craftsmanship',
                                    desc: 'Precision stitching and attention to detail in every garment.'
                                },
                                {
                                    icon: <FaHandHoldingUsd />,
                                    title: 'Manufacturer Value',
                                    desc: 'Direct-from-factory pricing without compromising on quality.'
                                },
                                {
                                    icon: <FaGlobeAsia />,
                                    title: 'Pan India Network',
                                    desc: 'Reliable logistics ensuring timely delivery to your doorstep.'
                                },
                            ].map((item, index) => (
                                <div key={index} className="card p-8 hover:-translate-y-2 transition-transform duration-300 border border-[var(--glass-border)] bg-[var(--glass-bg)]">
                                    <span className="text-4xl text-[var(--color-accent-primary)] mb-6 block">
                                        {item.icon}
                                    </span>
                                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Digital Presence */}
                <section className="section">
                    <div className="container">
                        <div className="card max-w-4xl mx-auto overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-primary)]/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative p-12 text-center">
                                <span className="text-6xl text-[var(--color-accent-primary)] mb-6 block mx-auto w-fit">
                                    <FaYoutube />
                                </span>
                                <h2 className="text-3xl font-bold mb-4">Experience Our Collections</h2>
                                <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                                    Subscribe to our official YouTube channel for exclusive lookbooks, manufacturing insights, and styling guides.
                                </p>
                                <a
                                    href={content.youtube_channels || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary px-8 py-3 text-lg"
                                >
                                    Visit Official Channel
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="section pb-24">
                    <div className="container">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold">Connect With <span className="text-gradient">Us</span></h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="card p-8 text-center hover:bg-white/5 transition-colors">
                                <span className="text-4xl text-[var(--color-accent-primary)] mb-4 block mx-auto w-fit">
                                    <FaMapMarkerAlt />
                                </span>
                                <h4 className="text-xl font-bold mb-2">Corporate Office</h4>
                                <p className="text-gray-400 text-sm">
                                    {content.address}
                                </p>
                            </div>

                            <a
                                href={`https://wa.me/${(content.whatsapp_number || '').replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card p-8 text-center hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                                <span className="text-4xl text-[var(--color-accent-primary)] mb-4 block mx-auto w-fit group-hover:scale-110 transition-transform">
                                    <FaWhatsapp />
                                </span>
                                <h4 className="text-xl font-bold mb-2">Business WhatsApp</h4>
                                <p className="text-gray-400 text-sm">
                                    {content.whatsapp_number}
                                </p>
                            </a>

                            <a
                                href={`tel:${(content.phone_number || '').replace(/\D/g, '')}`}
                                className="card p-8 text-center hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                                <span className="text-4xl text-[var(--color-accent-primary)] mb-4 block mx-auto w-fit group-hover:scale-110 transition-transform">
                                    <FaPhoneAlt />
                                </span>
                                <h4 className="text-xl font-bold mb-2">Support Line</h4>
                                <p className="text-gray-400 text-sm">
                                    {content.phone_number}
                                </p>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
