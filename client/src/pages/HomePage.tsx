import React from "react";
import { HeroSliderSectionComponent } from "../components/Home/HeroSliderSectionComponent";
import { CategorySectionComponent } from "../components/Home/CategorySectionComponent";
import { FeatureSectionComponent } from "../components/Home/FeatureSectionComponent";
import { NewsLetterSectionComponent } from "../components/Home/NewsLetterSectionComponent";
import { NavbarLayout } from "../components/Layout/NavbarLayout";
import { ProductSliderComponent } from "../components/Home/ProductSliderComponent";
import { useProduct } from "../hooks/useProduct";

export const HomePage = () => {

    // lets get the list of all products from the product hook 
    const { allProductList, topRatedProducts } = useProduct();

    return(
        <div className="">
            {/* Welcome to the home page. */}
            <HeroSliderSectionComponent autoPlay={true} autoPlayDuration={3000} pauseOnHover={true}></HeroSliderSectionComponent>
            <CategorySectionComponent></CategorySectionComponent>
            <FeatureSectionComponent></FeatureSectionComponent>
            {/* we will show the allProducts and topratedproducts product slider too */}
            <div className="w-full h-px bg-neutral-700 my-10">
                {
                    allProductList.length > 0 && (
                        <div className="flex flex-col gap-10">
                            <ProductSliderComponent listOfProducts={allProductList}></ProductSliderComponent>
                        </div>
                    )
                }
                {
                    topRatedProducts.length > 0 && (
                        <div className="flex flex-col gap-10">
                            <ProductSliderComponent listOfProducts={topRatedProducts}></ProductSliderComponent>
                        </div>
                    )
                }
            </div>
            <NewsLetterSectionComponent></NewsLetterSectionComponent>
        </div>
    )
}