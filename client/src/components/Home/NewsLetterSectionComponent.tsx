import { Mail, Send } from "lucide-react";

export const NewsLetterSectionComponent = () => {
    return (
        <div className=" flex justify-center items-center w-full bg-background-500 py-10 ">
            <div className=" bg-component-background-500 flex flex-col justify-center items-center p-10 gap-5 rounded-md">
                <div className="border border-white rounded-full  bg-blue-600 p-3">
                   <Mail className="w-10 h-10 text-white"></Mail>
                </div>
                <h1 className="text-white text-3xl font-bold">Stay in the Loop</h1>
                <h1 className="text-neutral-300 text-md w-[80%] text-center">Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special offers.</h1>
                {/* option to subscribe to the newsletter for this purpose */}
                <div className="flex flex-row justify-center items-center gap-5">
                    {/* here comes the newsletter input box for the user to inpout the email address for this purpose */}
                    <div className="flex flex-row justify-center items-center gap-5 shadow-2xl rounded-lg bg-gray-800 px-3 py-1">
                        <Mail className="text-gray-400"></Mail>
                        <input type="email" className="text-white p-3" placeholder="Enter you email address"/>
                    </div>

                    {/* subscribe button comes here */}
                    <button className="bg-blue-600 flex flex-row justify-center items-center gap-2 px-4 py-3 text-white rounded-md">
                        <Send></Send>
                        <p className="font-semibold">Subscribe</p>
                    </button>

                </div>

                <p className="text-neutral-300 text-sm">We respect your privacy. Unsubscribe at any time.</p>
            </div>
        </div>
    )
} 