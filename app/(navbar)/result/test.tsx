
"use client";
import React, { useState, useEffect, useRef } from "react";
import { getAuth } from "../../actions/cookie";
import { parseJwt } from "../../actions/utils";
import { StudentDetails } from "../profile/page";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import { fetchUserByRollno } from "../../actions/api";
import ReactToPrint from "react-to-print";
import logo from "../../images/dseu.png";
import Image from "next/image";
import { SelectChangeEvent } from "@mui/material/Select";

export default function Home() {
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [token, setToken] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [academicYears, setAcademicYears] = useState<string[]>(["2023-2024"]);
  const [semesters, setSemesters] = useState<number[]>([1, 2, 4, 6]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPageFirstPage = 15; 
  const entriesPerPageSubsequentPages = 22; 
  const componentRef = useRef<HTMLDivElement>(null);

 const generateDummyData = () => {
    const dummyData = [];
    for (let i = 1; i <= 60; i++) {
      dummyData.push([
        i.toString(), 
        `41521${i.toString().padStart(2, '0')}`, 
        `Student ${i}`, 
        Math.floor(Math.random() * 100).toString(), 
        Math.random() > 0.5 ? "Regular" : "Reappear" 
      ]);
    }
    return dummyData;
  };
  
  const dummyData = generateDummyData();

  useEffect(() => {
    getAuth().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setToken(auth?.value);
      setUser(temp.user);
    });
  }, []);

  useEffect(() => {
    getAuth().then((auth) => {
      if (auth) {
        setToken(auth.value);
        const temp = parseJwt(auth?.value as string);
        fetchUserByRollno(temp.user.rollno, auth.value)
          .then((res) => {
            setUser(res[0]);
          })
          .catch((error: any) => {});
      }
    });
  }, []);

  const handleAcademicYearChange = (event: SelectChangeEvent<string>) => {
    setAcademicYear(event.target.value);
  };

  const handleSemesterChange = (event: SelectChangeEvent<string>) => {
    setSemester(event.target.value);
  };

  const handleSubmit = () => {
    if (academicYear && semester) {
      setIsSubmitted(true);
    }
  };

  const handlePrint = () => {
    if (componentRef.current) {
      window.print();
    }
  };

  const renderTableRows = () => {
    const entriesPerPage = currentPage === 1 ? entriesPerPageFirstPage : entriesPerPageSubsequentPages;
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return dummyData.slice(startIndex, endIndex).map((row, index) => (
      <tr key={index}>
        {row.map((cell, cellIndex) => (
          <td key={cellIndex} className="px-2 py-3 border border-black text-left text-xs font-roboto">
            {cell}
          </td>
        ))}
      </tr>
    ));
  };

  const totalPages = Math.ceil(dummyData.length / entriesPerPageSubsequentPages);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="bg-[#dfdede]"></div>
      <div className="mt-[104px] max-sm:mt-[150px] px-2 sm:ml-[250px]">
        <div className="bg-dseublue py-2 px-2 sm:mx-8 rounded shadow mt-28">
          <h1 className="text-2xl text-white font-bold text-center">Result</h1>
        </div>
        <div className="py-2 px-2 rounded shadow max-sm:w-full mt-5 sm:mx-8">
          <div className="flex mb-2 space-x-3">
            <FormControl fullWidth variant="outlined" className="my-2">
              <InputLabel id="academic-year-label">Academic Year</InputLabel>
              <Select
                labelId="academic-year-label"
                id="academic-year"
                value={academicYear}
                onChange={handleAcademicYearChange}
                label="Academic Year"
                IconComponent={ArrowDropDownIcon}
              >
                {academicYears.map((year, index) => (
                  <MenuItem key={index} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" className="my-2">
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                id="semester"
                value={semester}
                onChange={handleSemesterChange}
                label="Semester"
                IconComponent={ArrowDropDownIcon}
              >
                {semesters.map((sem, index) => (
                  <MenuItem key={index} value={sem}>
                    {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!academicYear || !semester}
            >
              Submit
            </Button>
          </div>
        </div>
        
        <ReactToPrint
          trigger={() => (
            <Button className="mx-12 mt-6" variant="contained" color="primary" onClick={handlePrint}>
              Print
            </Button>
          )}
          content={() => componentRef.current}
        />
        <div ref={componentRef} className="py-1 px-2 rounded sm:mx-8 mt-6">
          {currentPage === 1 && (
            <>
              <div className="flex flex-row mx-2">
                <div>
                  <Image className="w-32 h-32 mt-2" src={logo} alt="DSEU Logo" />
                </div>
                <div className="text-center flex flex-col mx-auto p-2">
                  <div className="text-dseublue text-2xl font-extrabold font-mono">
                    दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
                  </div>
                  <div className="text-dseublue text-4xl font-extrabold font-serif">
                    Delhi Skill & Entrepreneurship University
                  </div>
                  <div className="text-dseublue text-lg font-extrabold font-serif">
                    (A State University Established under Govt. of NCT of Delhi Act 04 of 2020)
                  </div>
                </div>
              </div>
              <div className="text-center flex flex-col mx-auto">
                <div className="text-xl font-extrabold font-serif p-1">
                  Campus Name: <span> G.B. Pant DSEU Okhla I </span>
                </div>
                <div className="text-xl font-extrabold font-serif p-1 mb-4">
                  Program Name: <span>B.Tech. (Computer Science Engineering)</span>
                </div>
              </div>
              <div className="text-center flex flex-col my-2 mr-5 px-14">
                <div className="flex">
                  <div className="w-4/12 text-left font-normal font-serif p-1">
                    Semester: <span className="font-semibold">{semester}</span>
                  </div>
                  <div className="w-4/12 text-left font-normal font-serif p-1">
                    Academic Year: <span className="font-semibold">{academicYear}</span>
                  </div>
                  <div className="w-4/12 text-left font-normal font-serif p-1">
                    Max Marks: <span className="font-semibold">{75}</span>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-4/12 text-left font-normal p-1">
                    Course Code: <span className="font-semibold">{"BT-CS-ES-069"}</span>
                  </div>
                  <div className="w-4/12 text-left font-normal font-serif p-1">
                    Course Name: <span className="font-semibold">{"Software Engineering"}</span>
                  </div>
                </div>
              </div>
            </>
          )}
          <table className="w-11/12 mx-auto leading-normal my-2">
            <thead>
              <tr>
                <th className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style={{ width: "5%" }}>
                                  S.No
              </th>
              <th className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style={{ width: "35%" }}>
                Roll No
              </th>
              <th className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style={{ width: "50%" }}>
                Name
              </th>
              <th className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style={{ width: "5%" }}>
                Marks
              </th>
              <th className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style={{ width: "5%" }}>
                Regular/Reappear
              </th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </table>

        <div className="text-center flex flex-col my-2 mr-6 px-32">
          <div className="flex">
            <div className="w-4/12 text-left font-normal font-serif p-1">
              <div className="inline-block">
                <span className="border-b border-black inline-block mb-1 w-full"></span>
                <span className="font-semibold block mt-1">Name and Sign of FIC(Dept.)</span>
              </div>
            </div>
            <div className="w-4/12 text-left font-normal font-serif p-1">
              <div className="inline-block">
                <span className="border-b border-black inline-block mb-1 w-full"></span>
                <span className="font-semibold block mt-1">Name and Sign of Campus Director</span>
              </div>
            </div>
            <div className="w-4/12 text-left font-normal font-serif p-1">
              <div className="inline-block">
                <span className="border-b border-black inline-block mb-1 w-full"></span>
                <span className="font-semibold block mt-1">Name and Sign of Faculty</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-4">{`Page ${currentPage} of ${totalPages}`}</div>

        
      </div>
      {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-4">
            <Button
              variant="contained"
              color="primary"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous Page
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next Page
            </Button>
          </div>
        )}
    </div>
  </>
);
}