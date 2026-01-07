import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h4 className="text-gradient">Akshaya Garments</h4>
                        <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.9rem' }}>
                            Premium quality clothing for the entire family.
                            Style meets comfort.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link href="/products">Collection</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/how-to-order">How to Order</Link></li>
                            <li><Link href="/register">Become a Dealer</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Categories</h4>
                        <ul className="footer-links">
                            <li><Link href="/products/mens">Mens</Link></li>
                            <li><Link href="/products/womens">Womens</Link></li>
                            <li><Link href="/products/girls">Girls</Link></li>
                            <li><Link href="/products/boys">Boys</Link></li>
                            <li><Link href="/products/babies">Babies</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul className="footer-links">
                            <li>📍 15, Military Colony 3rd street, Rayapuram, Tirupur 641601</li>
                            <li>📞 +91 95664 33713</li>
                            <li>💬 WhatsApp</li>
                            <li>📺 YouTube Channel</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Akshaya Garments. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
