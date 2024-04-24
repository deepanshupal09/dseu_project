import React from "react";

const Final = ({ onBackToLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Registration Successful</h1>
      <p className="text-lg mb-8">All details submitted successfully.</p>
      <button
        onClick={onBackToLogin}
        className="bg-black hover:bg-gray-800 focus:bg-gray-800 text-white font-bold py-2 px-4 rounded"
      >
        Back to Login Page
      </button>
    </div>
  );
};

export default Final;