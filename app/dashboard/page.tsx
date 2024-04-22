"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import CampaignIcon from "@mui/icons-material/Campaign";
import { getAuth } from "../actions/cookie";
import { parseJwt } from "../actions/utils";

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = [
    "Dashboard",
    "Profile",
    "Exam Registration",
    "Course Details",
  ];
  const [user, setUser] = useState();

  const recentChange = {
    title: "Exam Registerations",
    timestamp: "2024-04-19",
    details:
      "Current Semesters subjects were chosen and submitted for the exam.",
  };

  useEffect(() => {
    getAuth().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setUser(temp.user);
      console.log(temp.user);
    });
  }, []);

  // useEffect(() => {
  //   console.log("1",user.user)
  // },[user])

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="sm:flex">
      <Header username={user?.name} />
      <Navbar />

      <div className="sm:pl-[300px] sm:mt-[100px] space-y-5 mt-[140px] max-sm:space-y-6 w-full px-2 sm:pr-10 ">
        <div className="welcome py-2 px-4 rounded   z-10  ">
          <h1 className="text-2xl text-white-800 font-bold ">
            Welcome {user?.name}
          </h1>
        </div>
        <div className="announcement bg-dseublue py-2   px-4 rounded shadow w-full">
          <h1 className="text-xl text-white font-bold">
            <CampaignIcon /> Announcement
          </h1>
          <ul className="text-white">
            <li className="my-6">No announcements yet</li>
            {/* <li  className="my-6">Examination Registrations about to close.</li>
            <li className="my-6">Course Details about to open.</li>
            <li className="my-6">Backlog exams for 2nd 4th semester.</li>
            <li className="my-6">More information.</li> */}
          </ul>
        </div>
        <div className="announcement bg-white py-2 px-4 rounded shadow absolute   w-full sm:w-1/4 h-1/4">
          <h1 className="text-xl text-black font-bold">Recent Activity</h1>
          <div className="mt-4">
            <div
              className="border-b pb-2 mb-2 cursor-pointer"
              onClick={handleExpandToggle}
            >
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
      </div>
      <div className="welcome py-2 px-4 rounded shadow absolute top-[150px] sm:left-[250px] left-0 right-0 z-10 mx-12 ">
        <h1 className="text-2xl text-white-800 font-bold ">Welcome {"Abhinav M"}</h1>
      </div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[220px] sm:left-[250px] left-0 right-0 z-10 mx-12">
        <h1 className="text-xl text-white font-bold"><CampaignIcon/>Announcement</h1>
          <ul className="text-white">
            <li className="my-6">No announcements yet</li>
            {/* <li  className="my-6">Examination Registrations about to close.</li>
            <li className="my-6">Course Details about to open.</li>
            <li className="my-6">Backlog exams for 2nd 4th semester.</li>
            <li className="my-6">More information.</li> */}
          </ul>
        </div>
        <div className="announcement bg-white py-2 px-4 rounded shadow absolute   w-full sm:w-1/4 h-1/4">
          <h1 className="text-xl text-black font-bold">Recent Activity</h1>
          <div className="mt-4">
            <div
              className="border-b pb-2 mb-2 cursor-pointer"
              onClick={handleExpandToggle}
            >
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
      </div>
    </div>
  );
}
