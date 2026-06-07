// Review section component
// Handles displaying all reviews and the add review form

import { useState } from "react"
import type { ProductDetail } from "../../types/product.types"
import type { DeleteProductReviewRequestPayload, PostProductReviewRequestPayload } from "../../types/product.types"

interface ReviewSectionComponentProps {
    product: ProductDetail
    currentUserId: string | null
    isAuthenticated: boolean
    isReviewGettingPosted: boolean
    isReviewGettingDeleted: boolean
    postProductReview: (payload: PostProductReviewRequestPayload) => Promise<void>
    deleteProductReview: (payload: DeleteProductReviewRequestPayload) => Promise<void>
}

// renders filled, half, or empty stars
const StarDisplay = ({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
    const sizeClass = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4"
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${sizeClass} ${star <= rating ? "text-yellow-400" : "text-gray-600"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                </svg>
            ))}
        </div>
    )
}

// interactive star picker for the add review form
const StarPicker = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform duration-100 hover:scale-110"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-7 w-7 transition-colors duration-100 ${
                            star <= (hovered || value) ? "text-yellow-400" : "text-gray-600"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                </button>
            ))}
        </div>
    )
}

export const ReviewSectionComponent = ({
    product,
    currentUserId,
    isAuthenticated,
    isReviewGettingPosted,
    isReviewGettingDeleted,
    postProductReview,
    deleteProductReview,
}: ReviewSectionComponentProps) => {
    const [reviewRating, setReviewRating] = useState(0)
    const [reviewComment, setReviewComment] = useState("")
    const [reviewError, setReviewError] = useState("")

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            setReviewError("Please select a rating.")
            return
        }
        if (reviewComment.trim().length < 5) {
            setReviewError("Comment must be at least 5 characters.")
            return
        }
        setReviewError("")
        await postProductReview({
            productId: product.id,
            rating: reviewRating,
            comment: reviewComment.trim(),
        })
        // reset form on success
        setReviewRating(0)
        setReviewComment("")
    }

    const handleDeleteReview = async (reviewId: string) => {
        await deleteProductReview({ productId: product.id})
    }

    // rating distribution for the summary bar
    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: product.reviewList.filter((r: any) => Math.round(r.rating) === star).length,
    }))

    return (
        <div className="flex flex-col gap-8">

            {/* Section heading */}
            <div className="flex items-center gap-3">
                <h2 className="text-white text-2xl font-bold">Reviews</h2>
                <span className="bg-blue-600/20 text-blue-400 text-sm font-semibold px-3 py-1 rounded-full">
                    {product.reviewList.length}
                </span>
            </div>

            {/* Rating summary */}
            {product.reviewList.length > 0 && (
                <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex flex-row gap-8 items-center">
                    {/* Overall score */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <span className="text-white text-5xl font-bold">{Number(product.ratings).toFixed(1)}</span>
                        <StarDisplay rating={Math.round(product.ratings)} size="md" />
                        <span className="text-gray-400 text-sm">{product.reviewList.length} reviews</span>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-white/10 self-stretch" />

                    {/* Bar breakdown */}
                    <div className="flex flex-col gap-2 flex-1">
                        {ratingCounts.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm w-3">{star}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                                </svg>
                                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: product.reviewList.length > 0
                                                ? `${(count / product.reviewList.length) * 100}%`
                                                : "0%",
                                        }}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm w-4 text-right">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add review form */}
            {isAuthenticated ? (
                <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                    <h3 className="text-white font-semibold text-lg">Write a Review</h3>

                    {/* Star picker */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Your Rating</label>
                        <StarPicker value={reviewRating} onChange={setReviewRating} />
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Your Review</label>
                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                            className="bg-background-500 border border-white/20 text-white text-sm rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-blue-500 transition-colors duration-200 placeholder-gray-600"
                        />
                    </div>

                    {/* Error */}
                    {reviewError && (
                        <p className="text-red-400 text-sm">{reviewError}</p>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmitReview}
                        disabled={isReviewGettingPosted}
                        className="self-start bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200"
                    >
                        {isReviewGettingPosted ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            ) : (
                <div className="bg-component-background-500 border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-gray-400 text-sm">Please log in to write a review.</p>
                </div>
            )}

            {/* Review list */}
            {product.reviewList.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {product.reviewList.map((review: any) => (
                        <div key={review.id} className="bg-component-background-500 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-4">
                                {/* Reviewer info */}
                                <div className="flex items-center gap-3">
                                    {/* Avatar placeholder */}
                                    <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center shrink-0">
                                        <span className="text-blue-400 text-sm font-bold">
                                            {review.user?.name?.[0]?.toUpperCase() ?? "U"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-white text-sm font-semibold">{review.user?.name ?? "Anonymous"}</span>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(review.createdAt ?? review.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Delete button — only for review owner */}
                                {currentUserId && review.user?.id === currentUserId && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        disabled={isReviewGettingDeleted}
                                        className="text-gray-500 hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
                                        title="Delete review"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Stars */}
                            <StarDisplay rating={review.rating} size="sm" />

                            {/* Comment */}
                            <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}