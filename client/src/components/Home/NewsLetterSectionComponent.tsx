import { Mail } from "lucide-react";

export const NewsLetterSectionComponent = () => {
    return (
        <div className="border border-white flex justify-center items-center w-full bg-background-500 ">
            <div className=" bg-component-background-500 flex flex-col justify-center items-center p-10 gap-5 rounded-md">
                <div className="border border-white rounded-full  bg-blue-600 p-3">
                   <Mail className="w-10 h-10 text-white"></Mail>
                </div>
                <h1 className="text-white text-3xl font-bold">Stay in the Loop</h1>
                <h1 className="text-neutral-300 text-sm w-[80%] text-center">Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special offers.</h1>
                {/* option to subscribe to the newsletter for this purpose */}
                <div className="flex flex-row justify-center items-center shadow-2xl bg-gray-800 rounded-lg p-2">
                    {/* here comes the newsletter input box for the user to inpout the email address for this purpose */}
                    <div className="flex flex-row justify-center items-center gap-5 shadow-2xl rounded-lg">
                        <Mail className="text-gray-400"></Mail>
                        <input type="email" className="text-white p-3" placeholder="Enter you email address"/>
                    </div>

                </div>

            </div>
        </div>
    )
} 