"use client";
"use client";
import React,{useState} from 'react';
import Navbar from '../dashboard/Navbar'; 
import Header from '../dashboard/Header';

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Profile", "Exam Registration", "Course Details"];

  const recentChange = {
    title: "B.Tech in computer science",
    timestamp: "2025",
    details: "sixth semester",
  };

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };  

  return (
    <>
      <div className="container mx-auto bg-[#dfdede]">
        <Header username={"Abhinav M"} />
        <Navbar selected={selected} setSelected={setSelected} />

      <div className='bg-white'>
        <div className="bg-dseublue py-2 px-4 rounded shadow mx-auto my-4 flex items-center justify-between max-w-6xl">
        <img src="../images/logo.png" alt="Profile" className="w-32 h-32 rounded-full" />
        <div>
          <h1 className="text-xl font-bold">Abhinav Mangalore</h1>
          <p>Roll No: 123456</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Phone:</p>
          <p>+918080808080</p>
          <p>Email: user@example.com</p>
        </div>
        </div>
      </div>

      <div className="md:w-2/3 bg-white">
              <h1 className="text-xl text-black font-bold">Enrolled Program</h1>
              <div className="mt-4">
                <div className="border-b pb-2 mb-2 cursor-pointer" onClick={handleExpandToggle}>
                  <h2 className="text-lg font-semibold">{recentChange.title}</h2>
                  <p className="text-xs text-gray-500">{recentChange.timestamp}</p>
                  {expanded && (
                    <div className="text-sm text-gray-700 mt-2">
                      <p>{recentChange.details}</p>
                    </div>
                  )}
                </div>

</div> 
</>
);
}