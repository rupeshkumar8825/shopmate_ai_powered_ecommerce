import { atom } from "recoil";
import type { ProductDetail, ProductState } from "../../types/product.types";


// lets create a single productAtom object so that 
// we can keep all the information related to the product 
// in a single place and then we can use the selectors itself 
// to get the specific information
// the components can use the specific selectors and hence 
// they will not re-render when the other information in the
// productAtom changes. But please note that another approach 
// could have been the creation of multiple atoms for each information
// related to the product but that would have made the code a bit messy 
// and hard to maintain. 
// So we are going with the single productAtom approach
// and then we will create selectors to get the specific information from
// the productAtom.



export const productAtom = atom<ProductState>({
    key : "productAtom", 
    default : {
        allProducts : [],
        topRatedProducts : [],
        newArrivalProducts : [],
        productDetails : null,
        totalNumberOfProducts : 0,
        productError : "",
        loading : {
            isCreatingProduct : false,
            areProductsLoading : false,
            isAISearchResponseLoading : false,
            isReviewGettingDeleted : false,
            isReviewGettingPosted : false,
        }, 
        searchFilter : {
            availability : "in-stock", 
            minPrice : 0, 
            maxPrice : 100000, 
            category : undefined, 
            minRating : undefined, 
            maxRating : undefined,
            search : undefined, 
            page : 1 

        }
    }
});

