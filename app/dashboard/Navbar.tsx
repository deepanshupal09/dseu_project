  "use client";
  import React from "react";
  import { Inter } from "next/font/google";

  const inter = Inter({ subsets: ["latin"] });

  export default function Navbar() {
    return (
      <>
        <div className={` w-[250px] ${inter.className} px-6 py-48 space-y-10  h-full shadow-2xl shadow-slate-200 -z-20 bg-white absolute top-[60px] border-2  left-0`}>
          <div className=""> Dashboard </div>
          <div className=""> Profile </div>
          <div className=""> Exam Registration </div>
        </div>
      </>
    );
  }
