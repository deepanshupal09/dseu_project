"use client";
import React, { useEffect, useState } from "react";
import Header from "../dashboard/Header";
import Navbar from "../dashboard/Navbar";
import CampaignIcon from '@mui/icons-material/Campaign';
import { getAuth } from "../actions/cookie";
import { parseJwt } from "../actions/utils";
import { StudentDetails } from "../profile/page";

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Profile", "Exam Registration", "Help"];
  const [user, setUser] = useState<StudentDetails|null>(null);

  useEffect(() => {
    getAuth().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setUser(temp.user);

    });
  }, []);

  return (
    <>
      <div className="bg-[#dfdede] ">
        <Header username={user?.name as string} />
        <Navbar />
      </div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[120px] max-sm:top-[150px] sm:left-[250px] left-0 right-0 z-10 mx-4 sm:mx-12">
        <h1 className="text-3xl flex items-center space-x-4 text-white font-bold mt-4"><CampaignIcon className="scale-150" /> <div>Facing issue ??</div> </h1>
        <ol className="text-white font-normal">
            <li  className="my-6"> If {"there's"} any information that needs to be changed, kindly send an email to the campus director, who might then forward it to the COE.</li>
            <li className="my-6">For any technical difficulties, please reach out to the following email: dseu-exam@dseu.ac.in </li>
            {/* <li className="my-6">Contact: +919540167797</li> */}
          </ol>
      </div>
    </>
  );
}