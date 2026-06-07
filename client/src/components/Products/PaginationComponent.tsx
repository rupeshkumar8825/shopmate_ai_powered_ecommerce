// Pagination component for the products page
// Shows page navigation buttons based on total products and current page

interface PaginationComponentProps {
    totalNumberOfProducts: number
    currentPage: number
    productsPerPage?: number
    changePage: (page: number) => void
}

export const PaginationComponent = ({
    totalNumberOfProducts,
    currentPage,
    productsPerPage = 12,
    changePage,
}: PaginationComponentProps) => {

    const totalPages = Math.ceil(totalNumberOfProducts / productsPerPage)

    // don't render if there's only one page or no products
    if (totalPages <= 1) return null

    // build array of page numbers to show with ellipsis logic
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = []

        if (totalPages <= 7) {
            // show all pages if total is small
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            // always show first page
            pages.push(1)

            if (currentPage > 3) pages.push("...")

            // show pages around current page
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)
            for (let i = start; i <= end; i++) pages.push(i)

            if (currentPage < totalPages - 2) pages.push("...")

            // always show last page
            pages.push(totalPages)
        }

        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <div className="flex items-center justify-center gap-2 py-6">

            {/* Previous button */}
            <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${currentPage === 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Prev
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) =>
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className="text-gray-500 px-2">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => changePage(page as number)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors duration-200
                                ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next button */}
            <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${currentPage === totalPages
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
            >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>

        </div>
    )
}