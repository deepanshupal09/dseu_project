  "use client";
  import React from "react";

  interface Props {
    selected: Number,
    setSelected: Function
  }
  export default function Navbar({selected,setSelected}:Props) {
    const options = ["Dashboard", "Profile", "Exam Registration", "Course Details"]
    return (
      <>
        <div className={` w-[250px] text-lg font-normal px-8 py-48 space-y-10  h-full shadow-2xl shadow-slate-200 -z-20 bg-white absolute top-[60px] border-2  left-0`}>
          {options.map((option,index)=>{
            return (
              <div key={index} className={`cursor-pointer hover:text-blue-600 ${selected===index?'text-blue-600':''} `}> {option}</div>
            )
          })}          
        </div>
      </>
    );
  }
