// Product section component for the products page
// Renders the grid of ProductCardComponents with loading and empty states

import type { ProductDetail } from "../../types/product.types"
import { ProductCardComponent } from "./ProductCardComponent"

interface ProductSectionComponentProps {
    allProductList: ProductDetail[]
    areProductsLoading: boolean
    productError: string
    totalNumberOfProducts: number
}

const ProductCardSkeleton = () => (
    <div className="bg-component-background-500 shrink-0 flex flex-col gap-3 items-center border border-white/10 p-5 rounded-2xl w-64 animate-pulse">
        <div className="rounded-lg w-60 h-40 bg-white/10" />
        <div className="h-4 w-40 bg-white/10 rounded" />
        <div className="h-4 w-20 bg-white/10 rounded" />
        <div className="flex gap-2">
            <div className="h-6 w-16 bg-white/10 rounded-full" />
            <div className="h-6 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="h-9 w-32 bg-white/10 rounded-lg mt-2" />
    </div>
)

export const ProductSectionComponent = ({
    allProductList,
    areProductsLoading,
    productError,
    totalNumberOfProducts,
}: ProductSectionComponentProps) => {

    // loading state — show skeleton cards
    if (areProductsLoading) {
        return (
            <div className="flex flex-wrap gap-6 justify-start">
                {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    // error state
    if (productError) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 w-full">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-8 py-6 flex flex-col items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-400 font-semibold text-lg">Something went wrong</p>
                    <p className="text-gray-400 text-sm text-center">{productError}</p>
                </div>
            </div>
        )
    }

    // empty state
    if (allProductList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 w-full">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-10 flex flex-col items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-white font-semibold text-lg">No products found</p>
                    <p className="text-gray-400 text-sm text-center">Try adjusting your filters to find what you're looking for.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Result count */}
            <p className="text-gray-400 text-sm">
                Showing <span className="text-white font-semibold">{allProductList.length}</span> of{" "}
                <span className="text-white font-semibold">{totalNumberOfProducts}</span> products
            </p>

            {/* Product grid */}
            <div className="flex flex-wrap gap-6 justify-start">
                {allProductList.map((currProduct: ProductDetail) => (
                    <ProductCardComponent key={currProduct.id} {...currProduct} />
                ))}
            </div>
        </div>
    )
}