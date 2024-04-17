"use client"
import { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";

export default function Home() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <div className="bg-[#dfdede] ">
        <Header username={"Abhinav M"} />
        <Navbar selected={selected} setSelected={setSelected} />
      </div>
    </>
  );
}
