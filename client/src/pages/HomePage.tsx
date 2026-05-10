import React from "react";
import { HeroSliderSectionComponent } from "../components/Home/HeroSliderSectionComponent";
import { CategorySectionComponent } from "../components/Home/CategorySectionComponent";
import { FeatureSectionComponent } from "../components/Home/FeatureSectionComponent";
import { NewsLetterSectionComponent } from "../components/Home/NewsLetterSectionComponent";

export const HomePage = () => {
    return <>
        <div>
            {/* Welcome to the home page. */}
            <HeroSliderSectionComponent></HeroSliderSectionComponent>
            <CategorySectionComponent></CategorySectionComponent>
            <FeatureSectionComponent></FeatureSectionComponent>
            <NewsLetterSectionComponent></NewsLetterSectionComponent>
        </div>
    </>
}