// Product Details Page
// Shows full details of a single product including images, info, description, and reviews

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"
import { useCart } from "../hooks/useCart"
import { useAuth } from "../hooks/useAuth"
import type { CartItem } from "../types/cartType"
import { ReviewSectionComponent } from "../components/Products/ReviewSectionComponent"

// ─── Star Display Helper ──────────────────────────────────────────────────────
const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
            </svg>
        ))}
    </div>
)

// ─── Stock Badge ──────────────────────────────────────────────────────────────
const StockBadge = ({ stock }: { stock: number }) => {
    if (stock === 0) {
        return (
            <span className="bg-red-500/15 text-red-400 border border-red-500/30 text-sm font-semibold px-3 py-1 rounded-full">
                Out of Stock
            </span>
        )
    }
    if (stock <= 10) {
        return (
            <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-sm font-semibold px-3 py-1 rounded-full">
                Limited Stock — only {stock} left
            </span>
        )
    }
    return (
        <span className="bg-green-500/15 text-green-400 border border-green-500/30 text-sm font-semibold px-3 py-1 rounded-full">
            In Stock
        </span>
    )
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const ProductDetailsSkeleton = () => (
    <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
        <div className="flex flex-col gap-4 lg:w-1/2">
            <div className="w-full h-96 bg-white/10 rounded-2xl" />
            <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-20 h-20 bg-white/10 rounded-xl" />
                ))}
            </div>
        </div>
        <div className="flex flex-col gap-4 lg:w-1/2">
            <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
            <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
            <div className="h-10 w-1/3 bg-white/10 rounded-lg" />
            <div className="h-6 w-1/4 bg-white/10 rounded-full" />
            <div className="h-12 w-full bg-white/10 rounded-xl mt-4" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
        </div>
    </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
export const ProductDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const {
        productDetails,
        areProductsLoading,
        productError,
        isReviewGettingPosted,
        isReviewGettingDeleted,
        fetchSingleProductDetails,
        postProductReview,
        deleteProductReview,
    } = useProduct()

    const { addToCart } = useCart()
    const { user, isAuthenticated } = useAuth()

    // local state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // fetch product details on mount / when id changes
    useEffect(() => {
        if (id) {
            fetchSingleProductDetails({ productId: id })
        }
    }, [id])

    // reset selected image when product changes
    useEffect(() => {
        setSelectedImageIndex(0)
        setQuantity(1)
    }, [productDetails?.id])

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleAddToCart = () => {
        if (!productDetails) return
        const cartItem: CartItem = {
            id: productDetails.id,
            name: productDetails.name,
            price: productDetails.price,
            quantity,
            image: productDetails.images[0]?.url,
            stock: productDetails.stock,
        }
        addToCart(cartItem)
    }

    const handleBuyNow = () => {
        handleAddToCart()
        navigate("/cart")
    }

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => {
            const next = prev + delta
            if (next < 1) return 1
            if (productDetails && next > productDetails.stock) return productDetails.stock
            return next
        })
    }

    // ── Loading state ─────────────────────────────────────────────────────────
    if (areProductsLoading) {
        return (
            <div className="min-h-screen bg-background-500">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <ProductDetailsSkeleton />
                </div>
            </div>
        )
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (productError) {
        return (
            <div className="min-h-screen bg-background-500 flex items-center justify-center">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-10 py-8 flex flex-col items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-400 font-semibold text-lg">Failed to load product</p>
                    <p className="text-gray-400 text-sm">{productError}</p>
                    <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                        ← Go back
                    </button>
                </div>
            </div>
        )
    }

    // ── No product found ──────────────────────────────────────────────────────
    if (!productDetails) return null

    const product = productDetails

    return (
        <div className="min-h-screen bg-background-500">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-16">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500">
                    <button onClick={() => navigate("/")} className="hover:text-white transition-colors">Home</button>
                    <span>/</span>
                    <button onClick={() => navigate("/products")} className="hover:text-white transition-colors">Products</button>
                    <span>/</span>
                    <span className="text-gray-300 truncate max-w-xs">{product.name}</span>
                </nav>

                {/* ── Top section: image + product info ── */}
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* LEFT — Image gallery */}
                    <div className="flex flex-col gap-4 lg:w-1/2 w-full">
                        {/* Main image */}
                        <div className="bg-component-background-500 border border-white/10 rounded-2xl overflow-hidden w-full aspect-square flex items-center justify-center">
                            <img
                                src={product.images[selectedImageIndex]?.url}
                                alt={product.name}
                                className="w-full h-full object-contain p-4"
                            />
                        </div>

                        {/* Thumbnails — only show if more than one image */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3 flex-wrap">
                                {product.images.map((image: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200
                                            ${selectedImageIndex === index
                                                ? "border-blue-500 scale-105"
                                                : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Product info */}
                    <div className="flex flex-col gap-5 lg:w-1/2 w-full">

                        {/* Category pill */}
                        {product.category && (
                            <span className="self-start bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                {product.category}
                            </span>
                        )}

                        {/* Product name */}
                        <h1 className="text-white text-3xl font-bold leading-snug">{product.name}</h1>

                        {/* Rating row */}
                        <div className="flex items-center gap-3">
                            <StarDisplay rating={product.ratings} />
                            <span className="text-yellow-400 font-semibold text-sm">{Number(product.ratings).toFixed(1)}</span>
                            <span className="text-gray-400 text-sm">({product.reviewList.length} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-white text-4xl font-bold">${Number(product.price).toFixed(2)}</span>
                        </div>

                        {/* Stock badge */}
                        <StockBadge stock={product.stock} />

                        {/* Divider */}
                        <div className="border-t border-white/10" />

                        {/* Quantity selector */}
                        {product.stock > 0 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-400 text-sm font-medium">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-9 h-9 rounded-lg bg-component-background-500 border border-white/20 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="text-white text-lg font-semibold w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="w-9 h-9 rounded-lg bg-component-background-500 border border-white/20 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 min-w-36 bg-component-background-500 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 min-w-36 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Buy Now
                            </button>
                        </div>

                    </div>
                </div>

                {/* ── Description section ── */}
                {product.description && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-white text-2xl font-bold">Description</h2>
                        <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6">
                            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Reviews section ── */}
                <ReviewSectionComponent
                    product={product}
                    currentUserId={user?.id ?? null}
                    isAuthenticated={isAuthenticated}
                    isReviewGettingPosted={isReviewGettingPosted}
                    isReviewGettingDeleted={isReviewGettingDeleted}
                    postProductReview={postProductReview}
                    deleteProductReview={deleteProductReview}
                />

            </div>
        </div>
    )
}