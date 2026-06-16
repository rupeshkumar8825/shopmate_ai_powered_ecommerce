// useProduct — the product hook for the ADMIN dashboard.
// It is the single place that ties together the api layer (product.api.ts) and the
// recoil state (productStateAtom). Components should consume this hook rather than calling
// the api functions or touching the atom directly.
//
// Reminder: this dashboard is admin-only. The create/update/delete product routes on the
// backend are guarded by the auth + "Admin" role middleware (the fetch routes are public);
// here we surface any failure as a readable error message in the atom.

import { useSetRecoilState, useRecoilValue } from "recoil"
import { isAxiosError } from "axios"

import { productStateAtom } from "../recoil/atoms/product.atom"
import {
    productsSelector,
    productErrorSelector,
    isProductOperationInProgressSelector,
    productsCountSelector,
} from "../recoil/selectors/product.selectors"
import {
    getAllProductsApi,
    createProductApi,
    updateProductApi,
    deleteProductApi,
    getSingleProductApi,
} from "../api/product.api"
import type {
    FetchAllProductsRequestPayload,
    CreateProductRequestPayload,
    UpdateProductRequestPayload,
    DeleteProductRequestPayload,
    GetSingleProductRequestPayload,
    ProductDetail,
} from "../types/product.types"


// turns whatever was thrown (axios error or the plain Errors thrown by the api layer)
// into a human readable message
const extractErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
        return err.response?.data?.message ?? err.message ?? "Something went wrong"
    }
    if (err instanceof Error) {
        switch (err.message) {
            case "EMPTY_RESPONSE":
            case "INVALID_RESPONSE":
                return "Received an unexpected response from the server. Please try again."
            default:
                return err.message
        }
    }
    return "Something went wrong"
}


export const useProduct = () => {
    // ── read-only state pulled from the atom via selectors ──
    const products = useRecoilValue(productsSelector)
    const productsCount = useRecoilValue(productsCountSelector)
    const productOperationInProgress = useRecoilValue(isProductOperationInProgressSelector)
    const error = useRecoilValue(productErrorSelector)

    // single writer into the (object) product atom
    const setProductState = useSetRecoilState(productStateAtom)

    const clearError = () => {
        setProductState((prev) => ({ ...prev, error: null }))
    }


    // ── Fetch the (filtered + paginated) list of products (GET /v1/product/) ──────
    const fetchAllProducts = async (payload: FetchAllProductsRequestPayload = {}) => {
        setProductState((prev) => ({ ...prev, productOperationInProgress: true, error: null }))
        try {
            const response = await getAllProductsApi(payload)
            setProductState((prev) => ({
                ...prev,
                products: response.productList,
                productOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setProductState((prev) => ({
                ...prev,
                productOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Create a new product (POST /v1/product/admin/create) ──────────────────────
    const createProduct = async (payload: CreateProductRequestPayload) => {
        setProductState((prev) => ({ ...prev, productOperationInProgress: true, error: null }))
        try {
            const response = await createProductApi(payload)
            setProductState((prev) => ({
                ...prev,
                // surface the new product immediately by prepending it to the list
                products: [response.product, ...prev.products],
                productOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setProductState((prev) => ({
                ...prev,
                productOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Update an existing product (PUT /v1/product/:productId) ───────────────────
    const updateProduct = async (payload: UpdateProductRequestPayload) => {
        setProductState((prev) => ({ ...prev, productOperationInProgress: true, error: null }))
        try {
            const response = await updateProductApi(payload)
            const updatedProduct = response.updatedProduct
            setProductState((prev) => ({
                ...prev,
                // swap the updated product into the list in place
                products: prev.products.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                ),
                productOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setProductState((prev) => ({
                ...prev,
                productOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Delete a product (DELETE /v1/product/:productId) ──────────────────────────
    const deleteProduct = async (payload: DeleteProductRequestPayload) => {
        setProductState((prev) => ({ ...prev, productOperationInProgress: true, error: null }))
        try {
            await deleteProductApi(payload)
            setProductState((prev) => ({
                ...prev,
                // drop the deleted product from the list
                products: prev.products.filter((product) => product.id !== payload.productId),
                productOperationInProgress: false,
            }))
            return true
        } catch (err) {
            setProductState((prev) => ({
                ...prev,
                productOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return false
        }
    }


    // ── Fetch a single product by id (GET /v1/product/:productId) ─────────────────
    // returns the product (or null on failure) without storing it in the list — handy
    // for detail/edit views that need the freshest copy of one product
    const getSingleProduct = async (
        payload: GetSingleProductRequestPayload
    ): Promise<ProductDetail | null> => {
        setProductState((prev) => ({ ...prev, productOperationInProgress: true, error: null }))
        try {
            const response = await getSingleProductApi(payload)
            setProductState((prev) => ({ ...prev, productOperationInProgress: false }))
            return response.productDetails
        } catch (err) {
            setProductState((prev) => ({
                ...prev,
                productOperationInProgress: false,
                error: extractErrorMessage(err),
            }))
            return null
        }
    }


    return {
        // state
        products,
        productsCount,
        productOperationInProgress,
        error,

        // actions
        fetchAllProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getSingleProduct,
        clearError,
    }
}
