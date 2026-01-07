'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Fetch cart count
    useEffect(() => {
        const fetchCartCount = async () => {
            if (user) {
                try {
                    const res = await fetch('/api/cart');
                    const data = await res.json();
                    const items = data.cartItems || data.items || [];
                    setCartCount(items.length);
                } catch {
                    setCartCount(0);
                }
            } else {
                setCartCount(0);
            }
        };

        fetchCartCount();

        // Listen for cart updates
        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [user]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, []);

    // Search functionality with debounce
    const searchProducts = useCallback(async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchProducts]);

    // Close search on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Prevent body scroll when menu/search is open
    useEffect(() => {
        if (mobileMenuOpen || searchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen, searchOpen]);

    const handleSearchSelect = (result) => {
        setSearchOpen(false);
        setSearchQuery('');
        router.push(result.url);
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <>
            <header className="header">
                <div className="header-content">
                    <Link href="/" className="logo">
                        <img src="/logo.svg" alt="AG" className="logo-img" />
                        Akshaya Garments
                    </Link>

                    <nav className="nav">
                        <Link href="/" className="nav-link">Home</Link>
                        <Link href="/products" className="nav-link">Collection</Link>
                        <Link href="/about" className="nav-link">About</Link>
                        <Link href="/how-to-order" className="nav-link">How to Order</Link>
                    </nav>

                    <div className="nav-actions">
                        <button
                            className="btn btn-icon btn-secondary"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>

                        {loading ? (
                            <div className="header-skeleton"></div>
                        ) : user ? (
                            <>
                                <Link href="/cart" className="btn btn-icon btn-secondary cart-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </Link>
                                <div className="user-menu desktop-only">
                                    <button className="user-menu-trigger btn btn-secondary">
                                        <span className="user-avatar-sm">{user.name?.charAt(0).toUpperCase()}</span>
                                        <span>{user.name?.split(' ')[0]}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    <div className="user-dropdown">
                                        <div className="user-dropdown-header">
                                            <span className="user-dropdown-name">{user.name}</span>
                                            <span className="user-dropdown-shop">{user.shopName}</span>
                                        </div>
                                        <Link href="/cart" className="user-dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>
                                            My Cart
                                            {cartCount > 0 && <span className="dropdown-badge">{cartCount}</span>}
                                        </Link>
                                        <button onClick={handleLogout} className="user-dropdown-item user-dropdown-logout">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-secondary desktop-only">Login</Link>
                                <Link href="/register" className="btn btn-primary desktop-only">Register</Link>
                            </>
                        )}

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-md">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-md">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="mobile-menu-overlay"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* Mobile Menu */}
                <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                    <div className="mobile-menu-header">
                        <h3 className="text-xl font-bold">Menu</h3>
                        <button onClick={closeMobileMenu} className="btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="mobile-nav">
                        <Link href="/" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm text-muted">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            Home
                        </Link>
                        <Link href="/products" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm text-muted">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5c.07.286.074.58.012.865l-.897 4.27a.99.99 0 0 1-.969.782H7.935a.99.99 0 0 1-.969-.782l-.897-4.27a2.53 2.53 0 0 1 .012-.865l1.263-5a1.125 1.125 0 0 1 1.09-.852H14.66c.55 0 1.033.374 1.135.918ZM13.06 6a1.56 1.56 0 0 1-3.12 0V10.5a1.56 1.56 0 0 1 1.56 1.56v.03a1.56 1.56 0 0 1-1.56 1.56h.03a1.56 1.56 0 0 1 1.56-1.56V11" />
                            </svg>
                            Collection
                        </Link>
                        <Link href="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm text-muted">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                            About
                        </Link>
                        <Link href="/how-to-order" className="mobile-nav-link" onClick={closeMobileMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm text-muted">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>
                            How to Order
                        </Link>

                        <div className="mobile-menu-divider" />

                        {user ? (
                            <>
                                <div className="mobile-user-info">
                                    <span className="mobile-user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                                    <div>
                                        <span className="mobile-user-name">{user.name}</span>
                                        <span className="mobile-user-shop">{user.shopName}</span>
                                    </div>
                                </div>
                                <Link href="/cart" className="mobile-nav-link" onClick={closeMobileMenu}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm text-muted">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                    My Cart
                                    {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
                                </Link>
                                <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="mobile-nav-link mobile-logout">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-secondary mobile-menu-btn-full" onClick={closeMobileMenu}>
                                    Login
                                </Link>
                                <Link href="/register" className="btn btn-primary mobile-menu-btn-full" onClick={closeMobileMenu}>
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Search Modal */}
            {searchOpen && (
                <div className="search-overlay" onClick={() => setSearchOpen(false)}>
                    <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="search-input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-md text-muted search-icon-input">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="btn-icon text-muted"
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="search-results">
                            {searching ? (
                                <div className="search-message">
                                    <div className="spinner-sm"></div>
                                    <span>Searching...</span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        className="search-result-item"
                                        onClick={() => handleSearchSelect(result)}
                                    >
                                        <span className="search-result-icon-wrapper">
                                            {result.type === 'category' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                                                </svg>
                                            ) : result.type === 'subcategory' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-sm">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5c.07.286.074.58.012.865l-.897 4.27a.99.99 0 0 1-.969.782H7.935a.99.99 0 0 1-.969-.782l-.897-4.27a2.53 2.53 0 0 1 .012-.865l1.263-5a1.125 1.125 0 0 1 1.09-.852H14.66c.55 0 1.033.374 1.135.918ZM13.06 6a1.56 1.56 0 0 1-3.12 0V10.5a1.56 1.56 0 0 1 1.56 1.56v.03a1.56 1.56 0 0 1-1.56 1.56h.03a1.56 1.56 0 0 1 1.56-1.56V11" />
                                                </svg>
                                            )}
                                        </span>
                                        <div className="search-result-info">
                                            <span className="search-result-name">{result.name}</span>
                                            <span className="search-result-type">
                                                {result.type === 'product' && result.category && `${result.category} › ${result.subCategory}`}
                                                {result.type === 'subcategory' && result.category && `in ${result.category}`}
                                                {result.type === 'category' && 'Category'}
                                            </span>
                                        </div>
                                        <span className="search-arrow">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon-xs">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                            </svg>
                                        </span>
                                    </button>
                                ))
                            ) : searchQuery.length >= 2 ? (
                                <div className="search-message">
                                    <p>No results found for &quot;{searchQuery}&quot;</p>
                                </div>
                            ) : (
                                <div className="search-message empty">
                                    <p>Type to search...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
