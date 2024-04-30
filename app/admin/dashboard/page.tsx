"use client"; 
import React, { useState } from "react";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import CampaignIcon from '@mui/icons-material/Campaign';

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Registration Chart", "Admit Card", "Query"];

  return (
    <>
      <div className="bg-[#dfdede] mt-2">
        <Head username={"Campus Director"} />
        <Nav />
      </div>
      <div className="welcome py-2 px-4 rounded shadow absolute top-[150px] sm:left-[250px] left-0 right-0 z-10 mx-12 ">
        <h1 className="text-2xl text-white-800 font-bold ">Welcome Campus Director of {"GB Pant DSEU Okhla"}</h1>
      </div>
      

      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[220px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-12">
        <h1 className="text-xl text-white font-bold"><CampaignIcon/>Announcement</h1>
          <ul className="text-white">
            <li  className="my-6">No announcements.</li>
          </ul>
      </div>
    </>
  );
}