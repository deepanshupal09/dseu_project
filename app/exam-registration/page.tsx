"use client";
import React, { useState } from "react";
import Header from "../dashboard/Header";
import Navbar from "../dashboard/Navbar";
import ProfileHeader from "./ProfileHeader";
import CourseSubjectsTable from "./SubjectsTable";
import BacklogsTable from "./Backlogs";
import { Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ParentComponent from "./ParentComponent";

export default function Home() {
  const prof1 = {
    username: "Abhinav Mangalore",
    rollNumber: 41521001,
    semester: 5,
    campusName: "GB Pant Okhla - 1",
    programName: "B.Tech CSE",
  };

  const subjectsData = [
    { name: "Universal Human Values", code: "BT-HS601", type: "Compulsory" },
    { name: "Computer Networks", code: "BT-CS-ES601", type: "Compulsory" },
    { name: "Machine Learning", code: "BT-CS-ES602", type: "Compulsory" },
    { name: "Web Engineering", code: "BT-CS-ES603", type: "Compulsory" },
    { name: "Introduction to scripting languages", code: "BT-CS-PE601", type: "Program Elective" },
    { name: "Web Development", code: "BT-CS-PE602", type: "Program Elective" },
    { name: "Spanish", code: "BT-OE601", type: "Open Elective" },
    { name: "German", code: "BT-OE602", type: "Open Elective" },
    { name: "French", code: "BT-OE603", type: "Open Elective" },
    { name: "Russian", code: "BT-OE604", type: "Open Elective" },
    { name: "Japanese", code: "BT-OE605", type: "Open Elective" },
    { name: "Seminar", code: "BT-SM601", type: "Compulsory" },
    { name: "Health and Well Being*", code: "BT-AU601", type: "Compulsory" },
  ];


  const backlogsData = [
    { subject: "Engg Mechanics", subjectCode: "BT-CS-ES103", examType: "Compulsory", semester: 1 },
    { subject: "DBMS", subjectCode: "BT-CS-ES601", examType: "Compulsory", semester: 3 },
    { subject: "Applied Physics", subjectCode: "BT-CS-ES601", examType: "Compulsory", semester: 2 },
    { subject: "Digital Circuits and Electronics", subjectCode: "BT-CS-ES601", examType: "Compulsory", semester: 3 },
    { subject: "Electronics Prac", subjectCode: "BT-CS-ES109", examType: "Program Elective", semester: 1 },
    { subject: "Web Engineering", subjectCode: "BT-CS-ES603", examType: "Compulsory", semester: 4 },
  ];

  const hasBacklogs = backlogsData.length > 0;

  return (
    <>
      <Header username={"Abhinav M"} />
      <Navbar />
      <div className="relative md:ml-60 mt-6 md:w-auto">
        <ProfileHeader
          username={prof1.username}
          rollno={prof1.rollNumber}
          semester={prof1.semester}
          campusName={prof1.campusName}
          programName={prof1.programName}
        />
      </div >
      <div className="relative md:ml-60 mt-6 md:w-auto">
      <ParentComponent
        subjectsData={subjectsData}
        backlogsData={backlogsData}
        currentSemester={prof1.semester}
      />
      </div>
    </>
  );
}