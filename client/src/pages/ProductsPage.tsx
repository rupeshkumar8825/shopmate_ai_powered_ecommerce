// Products page — combines FilterComponent, ProductSectionComponent and PaginationComponent

import { useProduct } from "../hooks/useProduct"
import { ProductSectionComponent } from "../components/Products/ProductSectionComponent"
import { PaginationComponent } from "../components/Products/PaginationComponent"
import { FilterComponent } from "../components/Products/FilterSectionComponent"
import { Sparkle, Sparkles } from "lucide-react"

const PRODUCTS_PER_PAGE = 6

export const ProductsPage = () => {
    const {
        allProductList,
        totalNumbertOfProducts,
        areProductsLoading,
        productError,
        searchFilter,
        updateFilters,
        changePage,
    } = useProduct()

    return (
        <div className=" bg-background-500">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">

                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-4xl font-bold">Products</h1>
                    <p className="text-gray-400 text-sm">
                        Browse our collection and find what you're looking for.
                    </p>
                </div>

                

                {/* Main layout — filter sidebar + product section */}
                <div className="flex flex-row gap-8 items-start">

                    {/* Left — Filter sidebar */}
                    <FilterComponent
                        searchFilter={searchFilter}
                        updateFilters={updateFilters}
                        />

                    {/* Right — Products + Pagination */}
                    <div className="flex flex-col gap-6 flex-1 min-w-0">
                        {/* here comes the Search query where we can search the product with its name */}
                        <div className="flex flex-row justify-between items-center gap-5 w-full">
                            {/* here comes the actual search bar */}
                            <input type="search" className="p-3 bg-component-background-500 text-white w-[80%] rounded-lg" placeholder="Search Products" />
                            {/* AI search button comes here  */}
                            <button className="px-4 py-2 rounded-lg bg-component-background-500 text-white font-semibold border-2 border-pink-400 flex justify-center items-center gap-2">
                                <Sparkles className="w-4 h-4"></Sparkles>    
                                <p>AI Search</p>
                            </button>
                        </div>


                        {/* Product grid */}
                        <ProductSectionComponent
                            allProductList={allProductList}
                            areProductsLoading={areProductsLoading}
                            productError={productError}
                            totalNumberOfProducts={totalNumbertOfProducts}
                        />

                        {/* Pagination */}
                        <PaginationComponent
                            totalNumberOfProducts={totalNumbertOfProducts}
                            currentPage={searchFilter.page ?? 1}
                            productsPerPage={PRODUCTS_PER_PAGE}
                            changePage={changePage}
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}