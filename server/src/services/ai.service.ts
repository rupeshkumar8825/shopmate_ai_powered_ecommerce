import { ENV } from "../config/env";
import { StatusCodes } from "../error/statusCodes";
import { Product } from "../generated/prisma/client";
import AppError from "../middlware/errorHandler";

export class AIService {

    // service layer function which returns the AI recommended products based on the 
    // given product list and the user prompt. Please note that the product list is 
    // taken from the database itself. 
    static async getAIRecommendationService (products : Product[], userPrompt : string) {
        const GEMINI_API_KEY : string = ENV.GEMINI_API_KEY;
        const URL = "TODO : Add the URL in this case that needs to be hit using the API key";

        // lets use the try catch blocks here as we want to have some custom handling
        // for failures in the AI service layer.     
        try {
            const geminiPrompt = `
                Here is a list of available products : 
                ${JSON.stringify(products, null, 2)}

                Based on the following user request, filter and suggest the best matching porducts : 
                ${userPrompt}

                Only return the matching products in JSON format. 
            `

            // lets call the fetch api to the gemini 
            const response = await fetch(URL, {
                method : "POST", 
                headers : {"Content-Type": "application/json"}, 
                body : JSON.stringify({
                    contents : [{parts : [{text : geminiPrompt}]}],
                }),
            });

            const data = await response.json();
            const aiResponseData = data?.candidates?.[0]?.content?.parts?.text?.trim() || "";
            const cleanedText = aiResponseData.replace(/```json```/g, ``).trim();

            if(!cleanedText){
                // this means that the response from the AI was invalid
                // hence lets throw an error here 
                // please note that it may be the case that the errors thrown by the 
                // ai layer will be captured and handled by the service layer
                // or else it could be possible that it could not be handled 
                // and in that case anyways it will popup and eventually will be handled 
                // be the global errormiddleware for this purpose. 
                throw new AppError("AI repsonse is empty for the given prompt", StatusCodes.BAD_REQUEST_400);
            }

            let parsedProducts = null;
            try{
                parsedProducts = JSON.parse(cleanedText);

            }catch(error){
                // the ai response parsing failed. lets return the error for this purpose
                throw new AppError("Failed to parse AI response", StatusCodes.INTERNAL_ERROR_500);
            }

            // we got the ai recommendation finally, lets return a positive response to the service layer 
            return parsedProducts;
        }catch (error){
            // some error occurred here. lets throw an another error 
            throw new AppError("Internal server error while using ai recommendation system", StatusCodes.INTERNAL_ERROR_500);
        }
    }
}