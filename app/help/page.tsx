"use client";
import React, { useEffect, useState } from "react";
import Header from "../dashboard/Header";
import Navbar from "../dashboard/Navbar";
import CampaignIcon from '@mui/icons-material/Campaign';
import { getAuth } from "../actions/cookie";

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Profile", "Exam Registration", "Help"];
  const [user, setUser] = useState();

  useEffect(() => {
    getAuth().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setUser(temp.user);
      console.log(temp.user);
    });
  }, []);

  return (
    <>
      <div className="bg-[#dfdede] ">
        <Header username={user?.name} />
        <Navbar />
      </div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[120px] max-sm:top-[150px] sm:left-[250px] left-0 right-0 z-10 mx-4 sm:mx-12">
        <h1 className="text-3xl flex items-center space-x-4 text-white font-bold mt-4"><CampaignIcon className="scale-150" /> <div>Facing issue ??</div> </h1>
        <ul className="text-white font-normal">
            <li  className="my-6">Contact authorities and tell your problems.</li>
            <li className="my-6">Email: abcd@dseu.ac.in</li>
            <li className="my-6">Contact: +912323232323</li>
          </ul>
      </div>
    </>
  );
}