// Filter component for the products page
// Handles availability, price range, category, and rating filters

import type { FetchAllProductsRequestPayload } from "../../types/product.types"

interface FilterComponentProps {
    searchFilter: FetchAllProductsRequestPayload
    updateFilters: (updatedFilters: Partial<FetchAllProductsRequestPayload>) => void
}

const CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
    "Kids and Baby",
]

type AvailabilityOptionValue = "in-stock" | "out-of-stock" | "limited" | undefined

const AVAILABILITY_OPTIONS: { label: string; value: AvailabilityOptionValue }[] = [
    { label: "All", value: undefined },
    { label: "In Stock", value: "in-stock" },
    { label: "Out of Stock", value: "out-of-stock" },
    { label: "Limited", value: "limited" },
]

const RATING_OPTIONS = [
    { label: "All Ratings", value: undefined },
    { label: "4★ & above", value: 4 },
    { label: "3★ & above", value: 3 },
    { label: "2★ & above", value: 2 },
]

export const FilterComponent = ({ searchFilter, updateFilters }: FilterComponentProps) => {

    const handleClearFilters = () => {
        updateFilters({
            availability: undefined,
            minPrice: 0,
            maxPrice: 100000,
            category: undefined,
            minRating: undefined,
            maxRating: undefined,
            search: undefined,
            page: 1,
        })
    }

    return (
        <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 w-72 shrink-0 h-fit sticky top-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-white text-xl font-bold">Filters</h2>
                <button
                    onClick={handleClearFilters}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                >
                    Clear All
                </button>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Availability */}
            <div className="flex flex-col gap-3">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Availability</h3>
                <div className="flex flex-col gap-2">
                    {AVAILABILITY_OPTIONS.map((option) => (
                        <button
                            key={option.label}
                            onClick={() => updateFilters({ availability: option.value })}
                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 
                                ${searchFilter.availability === option.value
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "text-gray-300 hover:bg-white/10"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Price Range */}
            <div className="flex flex-col gap-3">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Price Range</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-6">$</span>
                        <input
                            type="number"
                            min={0}
                            max={searchFilter.maxPrice}
                            value={searchFilter.minPrice}
                            onChange={(e) => updateFilters({ minPrice: Number(e.target.value) })}
                            placeholder="Min"
                            className="bg-background-500 border border-white/20 text-white text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-6">$</span>
                        <input
                            type="number"
                            min={searchFilter.minPrice}
                            value={searchFilter.maxPrice}
                            onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) })}
                            placeholder="Max"
                            className="bg-background-500 border border-white/20 text-white text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Category */}
            <div className="flex flex-col gap-3">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Category</h3>
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => updateFilters({ category: undefined })}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 
                            ${searchFilter.category === undefined
                                ? "bg-blue-600 text-white font-semibold"
                                : "text-gray-300 hover:bg-white/10"
                            }`}
                    >
                        All Categories
                    </button>
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => updateFilters({ category })}
                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 
                                ${searchFilter.category === category
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "text-gray-300 hover:bg-white/10"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Rating */}
            <div className="flex flex-col gap-3">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Minimum Rating</h3>
                <div className="flex flex-col gap-2">
                    {RATING_OPTIONS.map((option) => (
                        <button
                            key={option.label}
                            onClick={() => updateFilters({ minRating: option.value })}
                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 
                                ${searchFilter.minRating === option.value
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "text-gray-300 hover:bg-white/10"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    )
}