import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

async function getProductData(categorySlug, subcategorySlug, productSlug) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: productSlug },
            include: {
                subCategory: {
                    include: { category: true }
                },
                designs: { orderBy: { sortOrder: 'asc' } },
                colors: { orderBy: { id: 'asc' } }
            }
        });

        if (!product) return null;
        if (product.subCategory.slug !== subcategorySlug) return null;
        if (product.subCategory.category.slug !== categorySlug) return null;

        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function getRelatedProducts(subcategoryId, currentProductId) {
    try {
        return await prisma.product.findMany({
            where: {
                subCategoryId: subcategoryId,
                id: { not: currentProductId }
            },
            take: 4,
            include: {
                designs: { take: 1 }
            }
        });
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { category, subcategory, slug } = await params;
    const product = await getProductData(category, subcategory, slug);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} | Fashion Brand`,
        description: product.description || `Shop ${product.name} from our premium collection.`,
    };
}

export default async function ProductDetailPage({ params }) {
    const { category, subcategory, slug } = await params;
    console.log('ProductPage Params:', { category, subcategory, slug });
    const product = await getProductData(category, subcategory, slug);
    console.log('Product Fetch Result:', product ? 'Found' : 'Null');

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.subCategoryId, product.id);

    return (
        <>
            <Header />
            <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs mb-4">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/products">Collection</Link>
                        <span>/</span>
                        <Link href={`/products/${category}`}>{product.subCategory.category.name}</Link>
                        <span>/</span>
                        <Link href={`/products/${category}/${subcategory}`}>{product.subCategory.name}</Link>
                        <span>/</span>
                        <span>{product.name}</span>
                    </nav>

                    {/* Product Detail */}
                    <div className="section">
                        <ProductDetailClient
                            product={product}
                            category={category}
                            subcategory={subcategory}
                        />
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="section">
                            <h2 className="mb-4">You Might Also Like</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedProducts.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/products/${category}/${subcategory}/${p.slug}`}
                                        className="product-card group"
                                    >
                                        <div className="product-card-image">
                                            {p.designs[0]?.image ? (
                                                <img src={p.designs[0].image} alt={p.name} loading="lazy" />
                                            ) : (
                                                <div className="product-card-placeholder">👕</div>
                                            )}
                                        </div>
                                        <div className="product-card-content">
                                            <h3 className="product-card-title">{p.name}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
