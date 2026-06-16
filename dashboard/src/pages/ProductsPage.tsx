// Products management page (admin).
// Lists products from the backend (GET /v1/product/, paginated 6 at a time) as cards,
// supports a search + availability filter, and lets the admin create, edit and delete
// products via the useProduct hook.
//
// Two backend quirks the UI has to respect:
//   1. The update route requires EVERY field plus at least one image — it replaces all of
//      a product's images on each update — so the edit form re-asks for images.
//   2. The list response does not keep a total page count in the atom, so paging uses the
//      "a short page means we've reached the end" heuristic (PAGE_SIZE = 6).

import { useEffect, useState } from "react"
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    PackageX,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Star,
    Trash2,
    X,
} from "lucide-react"
import { useProduct } from "../hooks/use.product.hook"
import type { AvailabilityFilter, ProductDetail } from "../types/product.types"

// the backend returns this many products per page (see ProductService.fetchAllProductsService)
const PAGE_SIZE = 6

// availability filter options — "all" plus the backend's three stock buckets
type AvailabilityOption = "all" | AvailabilityFilter
const AVAILABILITY_OPTIONS: { value: AvailabilityOption; label: string }[] = [
    { value: "all", label: "All availability" },
    { value: "in-stock", label: "In stock" },
    { value: "limited", label: "Limited" },
    { value: "out-of-stock", label: "Out of stock" },
]

const formatPrice = (price: number | string): string => `$${Number(price).toFixed(2)}`

// tinted stock badge matching the dashboard's translucent-pill convention
const stockBadge = (stock: number): { label: string; className: string } => {
    if (stock === 0) return { label: "Out of stock", className: "bg-red-500/10 border-red-500/30 text-red-400" }
    if (stock <= 5) return { label: `Low · ${stock}`, className: "bg-amber-500/10 border-amber-500/30 text-amber-400" }
    return { label: `${stock} in stock`, className: "bg-green-500/10 border-green-500/30 text-green-400" }
}


// ── form modal (create + edit share the same fields) ────────────────────────────
interface ProductFormModalProps {
    mode: "create" | "edit"
    initialProduct?: ProductDetail
    submitting: boolean
    categorySuggestions: string[]
    onClose: () => void
    onSubmit: (values: {
        name: string
        description: string
        price: number
        category: string
        stock: number
        images: File[]
    }) => void
}

const ProductFormModal = ({
    mode,
    initialProduct,
    submitting,
    categorySuggestions,
    onClose,
    onSubmit,
}: ProductFormModalProps) => {
    const [name, setName] = useState(initialProduct?.name ?? "")
    const [description, setDescription] = useState(initialProduct?.description ?? "")
    const [price, setPrice] = useState(initialProduct ? String(initialProduct.price) : "")
    const [category, setCategory] = useState(initialProduct?.category ?? "")
    const [stock, setStock] = useState(initialProduct ? String(initialProduct.stock) : "")
    const [images, setImages] = useState<File[]>([])

    const isValid =
        name.trim() !== "" &&
        description.trim() !== "" &&
        price.trim() !== "" &&
        Number(price) >= 0 &&
        category.trim() !== "" &&
        stock.trim() !== "" &&
        Number(stock) >= 0 &&
        // the backend requires at least one image for both create and update
        images.length > 0

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isValid) return
        onSubmit({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            stock: Number(stock),
            images,
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-background-500 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">
                {/* header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-white text-xl font-bold">
                        {mode === "create" ? "Add product" : "Edit product"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-component-background-500 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="bg-component-background-500 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Price</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-component-background-500 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Stock</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className="bg-component-background-500 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            list="product-category-suggestions"
                            className="bg-component-background-500 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
                        />
                        <datalist id="product-category-suggestions">
                            {categorySuggestions.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
                            className="text-gray-300 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500/10 file:border file:border-blue-500/30 file:text-blue-400 file:px-3 file:py-1.5 file:text-sm file:cursor-pointer"
                        />
                        {mode === "edit" && (
                            <p className="text-gray-500 text-xs">
                                Updating replaces all existing images, so please re-select the product images.
                            </p>
                        )}
                    </div>

                    {/* actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-component-background-500 hover:bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || submitting}
                            className="bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30 text-blue-400 text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors duration-200"
                        >
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {mode === "create" ? "Create product" : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export const ProductsPage = () => {
    // ── custom hook ──
    const { products, productOperationInProgress, error, fetchAllProducts, createProduct, updateProduct, deleteProduct } =
        useProduct()

    // ── filters / paging ──
    const [page, setPage] = useState(1)
    const [availability, setAvailability] = useState<AvailabilityOption>("all")
    const [searchInput, setSearchInput] = useState("")
    const [appliedSearch, setAppliedSearch] = useState("")

    // ── row-scoped action state ──
    const [pendingProductId, setPendingProductId] = useState<string | null>(null)
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

    // ── modal state ──
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null)
    const [editingProduct, setEditingProduct] = useState<ProductDetail | undefined>(undefined)

    // (re)load whenever the page or a committed filter changes (and once on mount)
    useEffect(() => {
        fetchAllProducts({
            page,
            availability: availability === "all" ? undefined : availability,
            search: appliedSearch || undefined,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, availability, appliedSearch])

    // commit the search box → reset to the first page
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        setAppliedSearch(searchInput.trim())
    }

    const handleDelete = async (productId: string) => {
        setPendingProductId(productId)
        await deleteProduct({ productId })
        setPendingProductId(null)
        setConfirmingDeleteId(null)
    }

    const handleModalSubmit = async (values: {
        name: string
        description: string
        price: number
        category: string
        stock: number
        images: File[]
    }) => {
        const ok =
            modalMode === "edit" && editingProduct
                ? await updateProduct({ productId: editingProduct.id, ...values })
                : await createProduct(values)
        // only close on success so the error banner stays visible on failure
        if (ok) {
            setModalMode(null)
            setEditingProduct(undefined)
        }
    }

    // unique categories already in the list, for the form's datalist suggestions
    const categorySuggestions = Array.from(new Set(products.map((p) => p.category))).sort()

    const isInitialLoading = productOperationInProgress && products.length === 0
    const hasNextPage = products.length === PAGE_SIZE

    return (
        <div className="px-8 py-10 flex flex-col gap-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl font-bold">Products</h1>
                    <p className="text-gray-400 text-sm">Create, edit and manage your product catalog.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            fetchAllProducts({
                                page,
                                availability: availability === "all" ? undefined : availability,
                                search: appliedSearch || undefined,
                            })
                        }
                        disabled={productOperationInProgress}
                        className="bg-component-background-500 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors duration-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${productOperationInProgress ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setEditingProduct(undefined)
                            setModalMode("create")
                        }}
                        className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Add product
                    </button>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search products…"
                            className="w-full bg-background-500 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
                        />
                    </div>
                </form>
                <select
                    value={availability}
                    onChange={(e) => {
                        setPage(1)
                        setAvailability(e.target.value as AvailabilityOption)
                    }}
                    className="bg-background-500 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors duration-200"
                >
                    {AVAILABILITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-background-500">
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {/* ── Content ── */}
            {isInitialLoading ? (
                <div className="flex items-center justify-center gap-2 text-gray-400 py-20">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading products…
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 text-gray-500 py-20">
                    <PackageX className="w-10 h-10" />
                    <p className="text-sm">
                        {appliedSearch || availability !== "all"
                            ? "No products match the current filters."
                            : "No products in the catalog yet."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.map((product) => {
                        const badge = stockBadge(product.stock)
                        return (
                            <div
                                key={product.id}
                                className="bg-component-background-500 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
                            >
                                {/* image */}
                                <div className="aspect-video bg-background-500 flex items-center justify-center overflow-hidden">
                                    {product.images?.[0]?.url ? (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <PackageX className="w-8 h-8 text-gray-600" />
                                    )}
                                </div>

                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    {/* name + category */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white text-sm font-semibold truncate">{product.name}</span>
                                        <span className="text-gray-500 text-xs">{product.category}</span>
                                    </div>

                                    {/* price + rating */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-white text-lg font-bold">{formatPrice(product.price)}</span>
                                        <span className="flex items-center gap-1 text-amber-400 text-xs">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                                            {Number(product.ratings).toFixed(1)}
                                        </span>
                                    </div>

                                    {/* stock badge */}
                                    <span
                                        className={`self-start text-xs font-medium rounded-full border px-2.5 py-1 ${badge.className}`}
                                    >
                                        {badge.label}
                                    </span>

                                    {/* actions */}
                                    <div className="flex items-center gap-2 border-t border-white/5 pt-4 mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingProduct(product)
                                                setModalMode("edit")
                                            }}
                                            className="flex-1 bg-component-background-500 hover:bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 flex items-center justify-center gap-2 transition-colors duration-200"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>

                                        {pendingProductId === product.id ? (
                                            <div className="flex items-center justify-center w-9 h-9 text-gray-400">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            </div>
                                        ) : confirmingDeleteId === product.id ? (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    title="Confirm delete"
                                                    onClick={() => handleDelete(product.id)}
                                                    className="flex items-center justify-center w-9 h-9 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-colors duration-200"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Cancel"
                                                    onClick={() => setConfirmingDeleteId(null)}
                                                    className="flex items-center justify-center w-9 h-9 bg-component-background-500 hover:bg-white/5 border border-white/10 text-gray-400 rounded-xl transition-colors duration-200"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                title="Delete product"
                                                onClick={() => setConfirmingDeleteId(product.id)}
                                                className="flex items-center justify-center w-9 h-9 bg-component-background-500 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 rounded-xl transition-colors duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── Pagination ── */}
            {!isInitialLoading && (page > 1 || hasNextPage) && (
                <div className="flex items-center justify-end gap-3">
                    <span className="text-gray-500 text-sm">Page {page}</span>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1 || productOperationInProgress}
                        className="bg-component-background-500 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 flex items-center gap-1 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={!hasNextPage || productOperationInProgress}
                        className="bg-component-background-500 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 flex items-center gap-1 transition-colors duration-200"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* ── Create / Edit modal ── */}
            {modalMode && (
                <ProductFormModal
                    mode={modalMode}
                    initialProduct={editingProduct}
                    submitting={productOperationInProgress}
                    categorySuggestions={categorySuggestions}
                    onClose={() => {
                        setModalMode(null)
                        setEditingProduct(undefined)
                    }}
                    onSubmit={handleModalSubmit}
                />
            )}
        </div>
    )
}
