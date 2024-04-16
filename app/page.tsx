"use client"

import Input from "@mui/joy/Input";
import { useState } from "react";
import { Inter } from "next/font/google";
import { Button } from "@mui/joy";
import logo from "./images/logo.png";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [rollNo, setRollNo] = useState<string>("");
  const [Password, setPass] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);

  return (
    <>
      <div  className={`${inter.className} flex font-light  flex-col pt-[5vh] gap-y-5 items-center `}>
        <Image alt="logo" height={150} src={logo} className="" />
        <form onSubmit={(e)=>{ e.preventDefault(); console.log(rollNo)}} className="bg-[#F6F8FA] w-80 pt-4 mt-5 pb-6 px-4 border-2 rounded-lg flex flex-col gap-y-2 h-fit">
          <div className="my-1 text-sm">Roll No</div>
          <Input value={rollNo} onChange={(e)=>{setRollNo(e.target.value)}} autoFocus required />
          <div className="text-sm mt-4">Password</div>
          <Input value={Password} onChange={(e)=>{setPass(e.target.value)}}  type="password" required />
          <Button className="mt-3" color="primary" type="submit" >Sign In</Button>

        </form>
      </div>
    </>
  );
}
