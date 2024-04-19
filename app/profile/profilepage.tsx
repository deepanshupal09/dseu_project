import React,{useState} from 'react';
import Navbar from '../dashboard/Navbar'; 
import Header from '../dashboard/Header';

export default function ProfilePage() {
    const [selected, setSelected] = useState(0);
    const options = ["Dashboard", "Profile", "Exam Registration", "Course Details"];
  return (
    <>
      <div className="bg-[#dfdede] ">
        <Header username={"Abhinav M"} />
        <Navbar selected={selected} setSelected={setSelected} />
        </div>
      
    </>
  );
}


