"use client";
import React, { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import CampaignIcon from '@mui/icons-material/Campaign';

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Profile", "Exam Registration", "Help"];

  const recentChange = {
    title: "Exam Registerations",
    timestamp: "2024-04-19",
    details: "Current semester's final examination subjects were chosen and submitted.",
  };

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className="bg-[#dfdede] ">
        <Header username={"Abhinav M"} />
        <Navbar />
      </div>
      <div className="welcome py-2 px-4 rounded shadow absolute top-[150px] sm:left-[250px] left-0 right-0 z-10 mx-12 ">
        <h1 className="text-2xl text-white-800 font-bold ">Welcome {"Abhinav M"}</h1>
      </div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[220px] sm:left-[250px] left-0 right-0 z-10 mx-12">
        <h1 className="text-xl text-white font-bold"><CampaignIcon/>Announcement</h1>
          <ul className="text-white">
            <li  className="my-6">Examination Registrations about to close.</li>
            <li className="my-6">Course Details about to open.</li>
            <li className="my-6">Backlog exams for 2nd 4th semester.</li>
            <li className="my-6">More information.</li>
          </ul>
      </div>
      <div className="announcement bg-white py-2 px-4 rounded shadow absolute top-[500px] sm:left-[250px] left-0 right-0 z-10 mx-12 w-full sm:w-1/4 h-1/4">
        <h1 className="text-xl text-black font-bold">Recent Activity</h1>
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
      </div>
    </>
  );
}
