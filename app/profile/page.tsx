"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../dashboard/Navbar";
import Header from "../dashboard/Header";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import Face6RoundedIcon from "@mui/icons-material/Face6Rounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { getAuth } from "../actions/cookie";
import { parseJwt } from "../actions/utils";

export interface StudentDetails {
  name: string;
  rollno: string;
  program: string;
  semester: number;
  phone: string;
  aadhar?: string; // Optional field
  abc_id?: string; // Optional field
  alternate_phone?: string | null; // Optional field which can be null
  campus: string;
  emailid: string;
  father: string;
  gender: string;
  guardian: string | null; // Optional field which can be null
  last_modified: string;
  mother: string;
  password: string;
  photo: string;
  program_type: string;
  pwbd_certificate: string;
  year_of_admission: string;
}

export default function Home() {
  const [user, setUser] = useState<StudentDetails|null>(null);

  

  useEffect(() => {
    getAuth().then((auth) => {
      const temp = parseJwt(auth?.value as string);
      console.log("user: ", temp.user)
      setUser(temp.user);
    });
  }, []);

  return (
    <div className="max-sm:mt-[120px] mt-[120px]">
      <div className=" bg-[#dfdede] ">
        <Header username={user?.name as string} />
        <Navbar />
      </div>

    <div className="relative md:ml-60 mt-6 md:w-auto">
        <div className="bg-dseublue py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl text-white">
          <AccountBoxRoundedIcon className="ml-10" />
          <div>
            <h1 className="text-xl font-bold">
              {user?.name}
              <span>{"'s"} profile</span>
            </h1>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-bold">Roll Number:</p>
            <p>{user?.rollno}</p>
            <p className="font-bold">Semester: </p>
            <p>{user?.semester}</p>
          </div>
        </div>
      </div>

    <div className="relative md:ml-60 mt-8 w-full md:w-auto shadow-sm">
        <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
          <h2 className="text-xl font-bold mb-4 w-1/2">Personal Details</h2>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center mb-2">
                <PersonIcon className="mr-2" />
                <p>
                  <span className="font-bold">Name:</span>
                  <br /> {user?.name}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <PersonIcon className="mr-2" />
                <p>
                  <span className="font-bold">{"Father's Name:"}</span>
                  <br /> {user?.father}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <PersonIcon className="mr-2" />
                <p>
                  <span className="font-bold">{"Mother's Name:"}</span>
                  <br /> {user?.mother}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <PhoneIcon className="mr-2" />
                <p>
                  <span className="font-bold">Mobile Number:</span>
                  <br /> {user?.phone}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <MailIcon className="mr-2" />
                <p>
                  <span className="font-bold">Email:</span>
                  <br /> {user?.emailid}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <Face6RoundedIcon className="mr-2" />
                <p>
                  <span className="font-bold">Gender:</span>
                  <br /> {user?.gender}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <CreditCardRoundedIcon className="mr-2" />
                <p>
                  <span className="font-bold">Aadhar Card:</span>
                  <br /> {user?.aadhar}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    <div className="relative md:ml-60 mt-8 w-full md:w-auto shadow-sm">
        <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
          <h2 className="text-xl font-bold mb-4 w-1/2">University Details</h2>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex  mb-2">
                <SchoolIcon className="mr-2" />
                <p>
                  <span className="font-bold">Campus Name:</span>
                  <br /> {user?.campus}
                </p>
              </div>
              <div className="flex  mb-2">
                <BookIcon className="mr-2" />
                <p>
                  <span className="font-bold">Program Type:</span>
                  <br /> {user?.program_type}
                </p>
              </div>
              <div className="flex  mb-2">
                <ClassIcon className="mr-2" />
                <p>
                  <span className="font-bold">Program Name:</span>
                  <br /> {user?.program}
                </p>
              </div>
              <div className="flex  mb-2">
                <PersonIcon className="mr-2" />
                <p>
                  <span className="font-bold">Roll Number:</span>
                  <br /> {user?.rollno}
                </p>
              </div>
              <div className="flex  mb-2">
                <CalendarTodayIcon className="mr-2" />
                <p>
                  <span className="font-bold">Semester:</span>
                  <br /> {user?.semester}
                </p>
              </div>
              <div className="flex  mb-2">
                <VpnKeyIcon className="mr-2" />
                <p>
                  <span className="font-bold">abc_id:</span>
                  <br /> {user?.abc_id}
                </p>
              </div>
              <div className="flex  mb-2">
                <PersonIcon className="mr-2" />
                <p>
                  <span className="font-bold">Role:</span>
                  <br /> Student
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}