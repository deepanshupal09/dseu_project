import React from "react";

const Final = ({ onBackToLogin }:{onBackToLogin:() => void}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl  mb-4">Personal Details submitted successfully</h1>
      <p className="text-3xl font-bold mb-8">Login again to Register for Exams.</p>
      <button
        onClick={()=>{onBackToLogin()}}
        className="bg-black hover:bg-gray-800 focus:bg-gray-800 text-white font-bold py-2 px-4 rounded"
      >
        Back to Login Page
      </button>
    </div>
  );
};

export default Final;