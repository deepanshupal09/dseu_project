"use client";
import React, { useState } from "react";
import Header from "../dashboard/Header";
import Navbar from "../dashboard/Navbar";
import CampaignIcon from '@mui/icons-material/Campaign';

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Profile", "Exam Registration", "Help"];

  return (
    <>
      <div className="bg-[#dfdede] ">
        <Header username={"Abhinav M"} />
        <Navbar />
      </div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[120px] sm:left-[250px] left-0 right-0 z-10 mx-12">
        <h1 className="text-3xl text-white font-bold mt-4"><CampaignIcon/>Facing issue ??</h1>
        <ul className="text-white font-normal">
            <li  className="my-6">Contact authorities and tell your problems.</li>
            <li className="my-6">Email: abcd@dseu.ac.in</li>
            <li className="my-6">Contact: +912323232323</li>
          </ul>
      </div>
    </>
  );
}
