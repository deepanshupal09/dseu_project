"use client"; 
import React, { useEffect, useState } from "react";
import Head from "./Head";
import Nav from "./Nav";
import CampaignIcon from '@mui/icons-material/Campaign';
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";

interface User {
  emailid: string;
  role: string;
  campus: string;
}

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Registration Chart", "Admit Card", "Query"];
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    getAuthAdmin().then(async cookie => {
      if (cookie) {
        const data = await parseJwt(cookie.value);
        setUser(data.user);
      }
    })
  },[])

  return (
    <>
      <div className="bg-[#dfdede] mt-2">
      </div>
      <div className="welcome py-2 px-4 rounded shadow absolute top-[150px] sm:left-[250px] left-0 right-0 z-10 mx-2 sm:mx-12 ">
        <h1 className="text-2xl text-white-800 font-bold ">Welcome  {user?.campus}!</h1>
      </div>
      

      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[220px] sm:left-[250px] left-0 right-0 z-10 mx-2 sm:mx-12 mt-12">
        <h1 className="text-xl text-white font-bold"><CampaignIcon/>Announcement</h1>
          <ul className="text-white">
            <li  className="my-6">No announcements.</li>
          </ul>
      </div>
    </>
  );
}