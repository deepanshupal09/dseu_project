  "use client";
  import React from "react";
  import { Inter } from "next/font/google";

  const inter = Inter({ subsets: ["latin"] });

  interface Props {
    selected: string
  }
  export default function Navbar({selected}:Props) {
    const options = ["Dashboard", "Profile", "Exam Registration"]
    return (
      <>
        <div className={` w-[250px] text-lg font-light px-8 py-48 space-y-10  h-full shadow-2xl shadow-slate-200 -z-20 bg-white absolute top-[60px] border-2  left-0`}>
          <div className="cursor-pointer hover:text-blue-600  "> Dashboard </div>
          <div className="cursor-pointer hover:text-blue-600  "> Profile </div>
          <div className="cursor-pointer hover:text-blue-600  "> Exam Registration </div>
          <div className="cursor-pointer hover:text-blue-600  "> Course Details </div>
        </div>
      </>
    );
  }
