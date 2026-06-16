// All the API calls related to the product endpoints used by the admin dashboard.
// These map to the ProductController routes on the backend (mounted under `/v1/product`):
//   POST   /v1/product/admin/create   -> createProductApi   (admin only, multipart)
//   GET    /v1/product/               -> getAllProductsApi   (filters + pagination)
//   PUT    /v1/product/:productId     -> updateProductApi    (admin only, multipart)
//   DELETE /v1/product/:productId     -> deleteProductApi    (admin only)
//   GET    /v1/product/:productId     -> getSingleProductApi
// This layer abstracts the backend HTTP calls away from the rest of the dashboard.
//
// Note: create/update send multipart/form-data (the backend reads the uploaded files via
// `express-fileupload` under the `images` field), so they override the axios instance's
// default `application/json` content-type.

import type {
    FetchAllProductsRequestPayload,
    FetchAllProductsResponse,
    CreateProductRequestPayload,
    CreateProductResponse,
    UpdateProductRequestPayload,
    UpdateProductResponse,
    DeleteProductRequestPayload,
    DeleteProductResponse,
    GetSingleProductRequestPayload,
    GetSingleProductResponse,
} from "../types/product.types";
import { axiosInstance } from "./axios.instance";


// builds the multipart body shared by create + update. Every scalar is appended as a
// string (FormData coerces them anyway) and each selected file is appended under `images`,
// which is the field name the backend's express-fileupload reads.
const buildProductFormData = (
    payload: CreateProductRequestPayload | UpdateProductRequestPayload
): FormData => {
    const formData = new FormData()
    formData.append("name", payload.name)
    formData.append("description", payload.description)
    formData.append("price", String(payload.price))
    formData.append("category", payload.category)
    formData.append("stock", String(payload.stock))
    if (payload.images) {
        for (const image of payload.images) {
            formData.append("images", image)
        }
    }
    return formData
}


// fetches the (filtered + paginated) list of products (GET /v1/product/)
export const getAllProductsApi = async (
    payload: FetchAllProductsRequestPayload
): Promise<FetchAllProductsResponse> => {
    const response = await axiosInstance.get("/v1/product/", {
        // axios drops undefined params, so unset filters are simply not sent
        params: {
            availability: payload.availability,
            minPrice: payload.minPrice,
            maxPrice: payload.maxPrice,
            minRating: payload.minRating,
            maxRating: payload.maxRating,
            search: payload.search,
            category: payload.category,
            page: payload.page,
        },
    });

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.productList) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as FetchAllProductsResponse
}


// creates a new product (POST /v1/product/admin/create)
export const createProductApi = async (
    payload: CreateProductRequestPayload
): Promise<CreateProductResponse> => {
    const response = await axiosInstance.post(
        "/v1/product/admin/create",
        buildProductFormData(payload),
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.product) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as CreateProductResponse
}


// updates an existing product (PUT /v1/product/:productId)
export const updateProductApi = async (
    payload: UpdateProductRequestPayload
): Promise<UpdateProductResponse> => {
    const response = await axiosInstance.put(
        // productId is a path param
        `/v1/product/${payload.productId}`,
        buildProductFormData(payload),
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.updatedProduct) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as UpdateProductResponse
}


// deletes a product (DELETE /v1/product/:productId)
export const deleteProductApi = async (
    payload: DeleteProductRequestPayload
): Promise<DeleteProductResponse> => {
    const response = await axiosInstance.delete(
        // productId is a path param
        `/v1/product/${payload.productId}`
    );

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    // say everything went fine
    return response.data as DeleteProductResponse
}


// fetches a single product by id (GET /v1/product/:productId)
export const getSingleProductApi = async (
    payload: GetSingleProductRequestPayload
): Promise<GetSingleProductResponse> => {
    const response = await axiosInstance.get(
        // productId is a path param
        `/v1/product/${payload.productId}`
    );

    if (!response.data) {
        throw new Error("EMPTY_RESPONSE")
    }

    if (!response.data.productDetails) {
        throw new Error("INVALID_RESPONSE")
    }

    // say everything went fine
    return response.data as GetSingleProductResponse
}
