import React from "react";
import { HeroSliderSectionComponent } from "../components/Home/HeroSliderSectionComponent";
import { CategorySectionComponent } from "../components/Home/CategorySectionComponent";
import { FeatureSectionComponent } from "../components/Home/FeatureSectionComponent";
import { NewsLetterSectionComponent } from "../components/Home/NewsLetterSectionComponent";
import { NavbarLayout } from "../components/Layout/NavbarLayout";

export const HomePage = () => {
    return <>
        <div className="">
            {/* Welcome to the home page. */}
            <NavbarLayout></NavbarLayout>
            <HeroSliderSectionComponent></HeroSliderSectionComponent>
            <CategorySectionComponent></CategorySectionComponent>
            <FeatureSectionComponent></FeatureSectionComponent>
            <NewsLetterSectionComponent></NewsLetterSectionComponent>
        </div>
    </>
}