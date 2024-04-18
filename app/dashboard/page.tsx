"use client"
import { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import HamburgerMenu from "./Hamburgermenu";
import CampaignIcon from '@mui/icons-material/Campaign';

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Profile", "Exam Registration", "Course Details"];
  return (
    <>
      <div className="bg-[#dfdede] ">
        <Header username={"Abhinav M"} />
        <div className="sm:hidden">
          <HamburgerMenu options={options} selected={selected} setSelected={setSelected} />
        </div>
        <div className="hidden sm:block">
          <Navbar selected={selected} setSelected={setSelected} />
        </div>
      </div>
      <div className="welcome py-2 px-4 rounded shadow absolute top-[150px] left-[250px] right-0 z-10 mx-12 ">
        <h1 className="text-2xl text-white-800 font-bold ">Welcome {"Abhinav M"}</h1>
      </div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[200px] left-[250px] right-0 z-10 mx-12">
        <h1 className="text-xl text-white font-bold"><CampaignIcon/>Announcement</h1>
          <ul className="text-white">
            <li  className="my-6">Examination Registerations about to close.</li>
            <li className="my-6">Course Details about to open.</li>
            <li className="my-6">Backlog exams for 2nd 4th semester.</li>
            <li className="my-6">More information.</li>
          </ul>
      </div>
      <div className="announcement bg-white py-2 px-4 rounded shadow absolute top-[500px] left-[250px] right-0 z-10 mx-12 w-1/4 h-1/4">
        <h1 className="text-xl text-black font-bold">Recent Changes</h1>
          <p></p>
      </div>
    </>
  );
}