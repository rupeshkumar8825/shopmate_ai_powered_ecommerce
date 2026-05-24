import React from "react";
import { listOfSupportedFeaturesData } from "../../data/homePageConstants";
import type { FeaturesDataType } from "../../types/homePageTypes";

export const FeatureSectionComponent = () => {
    return (
        <div className="border border-black flex flex-wrap justify-around gap-5  items-center w-full bg-background-500 p-10">
            {
                listOfSupportedFeaturesData.map((currFeatureDetails : FeaturesDataType, index : number) => {
                    return (
                        <div className="flex flex-col flex-wrap gap-5 justify-center items-center text-white bg-component-background-500 w-[20%] p-5 rounded-sm">
                            <div className="bg-blue-600 p-2 rounded-full">
                                <currFeatureDetails.icon className="w-10 h-10"></currFeatureDetails.icon>
                            </div>
                            <h1 className="text-center font-semibold">{currFeatureDetails.title}</h1>
                            <h1 className="text-center text-gray-400">{currFeatureDetails.description}</h1>
                        </div>
                    )
                })
            }
        </div>
    )
}