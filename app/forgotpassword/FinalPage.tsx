import { useRouter } from "next/navigation";
import React from "react";


const FinalPage = () => {
    const router = useRouter();
    const onBackToLogin = () => {
        router.push("/")
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold  mb-4">Password changed successfully!</h1>
      {/* <p className="text-lg mb-8">Password changed successfully</p> */}
      <button
        onClick={()=>{onBackToLogin()}}
        className="bg-black hover:bg-gray-800 focus:bg-gray-800 text-white font-bold mt-5 py-2 px-4 rounded"
      >
        Back to Login Page
      </button>
    </div>
  );
};

export default FinalPage;