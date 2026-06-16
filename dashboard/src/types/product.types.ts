// All the types related to the product entity as consumed by the admin dashboard.
// These mirror what the backend ProductController returns for the routes the admin
// panel uses (all mounted under `/v1/product`):
//   POST   /v1/product/admin/create   -> createProductController      (admin only)
//   GET    /v1/product/               -> fetchAllProductsController    (public, used to list)
//   PUT    /v1/product/:productId     -> updateProductController       (admin only)
//   DELETE /v1/product/:productId     -> deleteProductController       (admin only)
//   GET    /v1/product/:productId     -> getSingleProductController
// The review (/review/*) and AI (/ai-recommended-products) routes are customer-facing
// and intentionally left out of the admin api layer.

import type { User } from "./auth.types"


// a product image as stored on cloudinary (the backend keeps these in a JSON column)
export interface ProductImage {
    public_id : string,
    url : string
}


// a single review attached to a product (the backend `include`s the reviewing user)
export interface ReviewDetail {
    id : string,
    product_id : string,
    user_id : string,
    rating : number,
    comment : string,
    created_at : Date,
    user : User
}


// a product together with its reviews, as returned whenever the backend query uses
// `include : { reviewList : { include : { user : true } } }`
export interface ProductDetail {
    id : string,
    name : string,
    description : string,
    price : number,
    category : string,
    ratings : number,
    images : ProductImage[],
    stock : number,
    created_by : string,
    created_at : Date,
    reviewList : ReviewDetail[]
}


// the newly-created / top-rated lists additionally carry an aliased review count
export interface ProductWithReviewCount extends ProductDetail {
    review_count : number
}


// ── GET /v1/product/ ──────────────────────────────────────────────────────────
// the stock availability buckets understood by the backend filter
export type AvailabilityFilter = "in-stock" | "limited" | "out-of-stock"

// every field is optional — the backend treats any missing query param as "no filter"
export interface FetchAllProductsRequestPayload {
    availability? : AvailabilityFilter,
    minPrice? : number,
    maxPrice? : number,
    minRating? : number,
    maxRating? : number,
    search? : string,
    category? : string,
    page? : number
}

export interface FetchAllProductsResponse {
    success : boolean,
    message : string,
    // the total count across every page (the backend paginates `productList` 6 at a time)
    totalNumberOfProducts : number,
    productList : ProductDetail[],
    newlyCreatedProductList : ProductWithReviewCount[],
    topRatedProducts : ProductWithReviewCount[]
}


// ── POST /v1/product/admin/create ───────────────────────────────────────────────
// sent as multipart/form-data; `images` carries the uploaded files
export interface CreateProductRequestPayload {
    name : string,
    description : string,
    price : number,
    category : string,
    stock : number,
    images? : File[]
}

export interface CreateProductResponse {
    success : boolean,
    message : string,
    product : ProductDetail
}


// ── PUT /v1/product/:productId ──────────────────────────────────────────────────
// also multipart/form-data; the backend currently requires every field to be present
export interface UpdateProductRequestPayload {
    productId : string,
    name : string,
    description : string,
    price : number,
    category : string,
    stock : number,
    images? : File[]
}

export interface UpdateProductResponse {
    success : boolean,
    message : string,
    updatedProduct : ProductDetail
}


// ── DELETE /v1/product/:productId ───────────────────────────────────────────────
export interface DeleteProductRequestPayload {
    productId : string
}

export interface DeleteProductResponse {
    success : boolean,
    message : string
}


// ── GET /v1/product/:productId ──────────────────────────────────────────────────
export interface GetSingleProductRequestPayload {
    productId : string
}

export interface GetSingleProductResponse {
    success : boolean,
    message : string,
    productDetails : ProductDetail
}


// the shape held by the product atom in recoil
export interface ProductAtomState {
    productOperationInProgress : boolean,
    products : ProductDetail[],
    error : string | null
}
