"use client";
import FAQItem from "./FAQItem";

// const faqs = [
//     {
//         question: "How is the default password determined?",
//         answer: "The default password consists of the first four letters of the student’s first name in CAPITALS, followed by the student’s Roll No. If the first name has fewer than 4 characters, the password will be the first name in CAPITALS followed by the Roll No.",
//     },
//     {
//         question: "What if I find any of my provided information incorrect after submission?",
//         answer: "If you discover incorrect information after the final submission, forward your application to the campus authorities, who will then forward it to the COE.",
//     },
//     {
//         question: "What should I do if I am unable to log in despite using the correct credentials?",
//         answer: "Ensure you enter your username and password correctly. If the issue persists, try resetting your password or contact technical support. 🤝🔑",
//     },
// ];

const FAQPage: React.FC = () => {
    return (
    <div className="overflow-scroll h-full  mx-auto py-8">
            <div className="bg-dseublue py-2 px-2 w-full sm:mx-8 rounded shadow mt-28">
                <h1 className="text-2xl text-white font-bold text-center">Admin FAQ's</h1>
            </div>
            <div className="mt-4 px-8 py-2 w-full sm:mt-5">
                <h1 className="text-xl font-bold text-left">Marks Entry Instructions</h1>
            
            <div className="mt-5">
                <h2 className="text-md mt-5 font-bold text-left"> Instruction set pdf</h2>
            </div>
            <div className="mt-5">    
                <iframe className="mx-auto" src="https://drive.google.com/file/d/1KTfUC4kUuPJNqObj-iL8wTs02F15I8yY/preview" width="540" height="380" allow="autoplay"></iframe>
            </div>
            </div>

        
            <div className="py-2 px-8 w-full sm:mt-5">
                <h1 className="text-xl font-bold text-left">Marks Entry Tutorial</h1>
            <div className="mt-5">
                <h2 className="text-md mt-5 font-bold text-left">Youtube Video Tutorial</h2>
            </div>
            <div className="mt-20">
                <iframe className="mx-auto border border-black" src="https://www.youtube.com/embed/0tah4QfcLJg?si=psrqJCbFkaBbwoHg" width="540" height="380"title="YouTube video player"></iframe>
            </div>
            </div>

        {/* <div>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>     */}
         
        <div className="py-2 px-8 w-full sm: mt-5">
            <h1 className="text-xl font-bold text-left">Admin Portal Tutorial</h1>

            <div className="mt-5">
            <h2 className="text-md mt-5 font-bold text-left">Youtube Video Tutorial</h2>
            </div>
            <div className="mt-20">
                <iframe className="mx-auto border border-black" src="https://www.youtube.com/embed/T65Gz9KiySo" width="540" height="380" title="YouTube video player"></iframe>
            </div>  
        </div>
    </div>
    );
};

export default FAQPage;
