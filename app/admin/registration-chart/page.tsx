"use client";
import React, { useState, useEffect } from "react";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {getAuthAdmin} from '../../actions/cookie';
import { parseJwt } from "@/app/actions/utils";
import { fetchExamRegistrationByProgramAndSemester } from "@/app/actions/api";

interface ProgramList {
    [key: string]: string[];
  }

export interface Token{
    name:string,
    value:string,
    path:string 
}

interface Student {
    rollno: string;
    name: string;
    dob: string;
    photo: string;
    program: string;
    semester: number;
    course_codes: string[];
}

const programListByType:ProgramList = {
  Diploma: [
    "Diploma in Applied Arts",
    "Diploma in Architecture",
    "Diploma in Automobile Engineering",
    "Diploma in Chemical Engineering",
    "Diploma in Civil Engineering",
    "Diploma in Computer Engineering",
    "Diploma in Cosmetology & Health",
    "Diploma in Electrical Engineering",
    "Diploma in Electronic Engineering",
    "Diploma in Fashion Design",
    "Diploma in Fashion Design and Garment Technology",
    "Diploma in Interior Design",
    "Diploma in Mechanical Engineering",
    "Diploma in Pharamacy",
    "Diploma in Printing Technology",
    "Diploma in Tool and Die Making",
    "Diploma in Artificial Intelligence and Machine Learning",
    "Diploma in Robotic and Process Automation",
    "Diploma in Electical Engineering - Part Time",
    "Diploma in Mechanical Engineering - Part Time",
    "Diploma in Automobile Engineering - Part Time",
    "Diploma in Civil Engineering - Part Time",
  ],
  Undergraduate: [
    "Bachelor of Arts (Aesthetics & Beauty Therapy)",
    "Bachelor of Science (Aesthetics & Beauty Therapy)",
    "Bachelor of Computer Applications",
    "Bachelor of Business Administration (Banking, Financial Services and Insurance)",
    "Bachelor of Commerce (Business Process Management)",
    "Bachelor of Business Administration (Operation & Business Process Management)",
    "Bachelor of Science (Data Analytics)",
    "Bachelor of Arts (Digital Media and Design)",
    "Bachelor of Management Studies (E-Commerce Operations)",
    "Bachelor of Business Administration (Facilities and Hygiene Management)",
    "Bachelor of Management Studies (Land Transportation)",
    "Bachelor of Science (Medical Laboratory Technology)",
    "Bachelor of Business Administration (Retail Management)",
    "Bachelor of Arts (Spanish)",
    "Bachelor of Business Administration (Automotive Retail Management)",
    "Bachelor of Business Administration (Hospital Management)",
    "Bachelor of Business Administration (Innovation and Entrepreneurship)",
    "Bachelor of Optometry",
    "Bachelor in Library Sciences",
    "Bachelor of Science (Dialysis Technology)",
    "Bachelor of Science (Emergency Medical Technology)",
    "Bachelor of Technology (Mechanical and Automation Engineering)",
    "Bachelor of Technology (Electronics & Communication Engineering)",
    "Bachelor of Technology (Computer Science Engineering)",
    "Bachelor of Technology (Mechanical Engineering)",
    "Bachelor of Technology (Tool Engineering)",
    "Bachelor of Technology (Mechatronics Engineering)",
  ],
  PostGraduate: [
    "Master of Computer Applications",
    "Master of Technology (Mechanical Engineering)",
    "Master of Technology (Tool Engineering)",
    "Master of Technology (Computer Science Engineering - AI & ML)",
    "Master of Technology (Electronics & Communication Engineering - IOT)",
    "Master of Technology (Mechanical Engineering - Thermal/Production/Design)",
    "Master of Science (Medical Laboratory Sciences)",
  ],
  Doctorate: [
    "Doctor of Philosophy (Computer Science and Engineering)",
    "Doctor of Philosophy (Computer Application)",
    "Doctor of Philosophy (Mechanical Engineering/Allied Branches)",
    "Doctor of Philosophy (Electronics and Communication Engineering/Allied Branches)",
  ],
  Certificate: [
    "Certificate Course in Modern Office Management & Secretarial Practice",
  ],
};

const programTypeList = [
  "Diploma",
  "Undergraduate",
  "PostGraduate",
  "Doctorate",
  "Certificate",
];

const semesterList = ["2", "4", "6"];

export default function Registration() {
    const [selected, setSelected] = useState(0);
    const options = ["Dashboard", "Registration Chart", "Admit Card", "Query"];
    const [selectedProgramCategory, setSelectedProgramCategory] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [showTable, setShowTable] = useState(false);
    const [studentsData, setStudentsData] = useState<Student[]>([]); // State to store fetched student data
    const [campus, setCampus] = useState("");
    const [token, setToken] = useState("");
    
    useEffect(()=>{
        getAuthAdmin().then(async(t:any)=>{
            console.log("t:",t)
            if(t){
                setToken(t.value);
                const data = await parseJwt(t.value);
                console.log("data:",data);
                setCampus(data.user.campus);
                console.log(data.user.campus);
            }
        
        })
    },[])

    useEffect(()=>{
        if(studentsData.length>0){
            setShowTable(true);
        }
        else{
            setShowTable(false);
        }
        console.log("data", studentsData);
    },[studentsData]);

    const handleData = async () => {
        try {
            console.log(campus,selectedProgram,selectedProgramCategory,selectedSemester);
            if(token){
                const data:any = await fetchExamRegistrationByProgramAndSemester(token as string, campus, selectedProgramCategory, selectedProgram, selectedSemester);
                setStudentsData(data); 
                console.log("campus:", campus);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleApplyFilters = () => {
        setShowTable(true);
    };

    const handleChangeProgramCategory = (event: SelectChangeEvent) => {
        setSelectedProgramCategory(event.target.value);
    };

    const handleChangeProgram = (event: SelectChangeEvent) => {
        setSelectedProgram(event.target.value);
    };

    const handleChangeSemester = (event: SelectChangeEvent) => {
        setSelectedSemester(event.target.value);
    };

    return (
        <>
            <div className="bg-[#dfdede] mt-2">
                <Head username={"Campus Director"} />
                <Nav />
            </div>
            <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[100px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6">
                <h1 className="text-2xl text-white font-bold text-center">Registration Chart</h1>
            </div>
            <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6">
                <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">SELECT</h2>
                <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
                    <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                        <InputLabel id="program-category-label">Program category</InputLabel>
                        <Select
                            labelId="program-category-label"
                            id="program-category"
                            value={selectedProgramCategory}
                            label="Program category"
                            onChange={handleChangeProgramCategory}
                        >
                            {programTypeList.map((category, index) => (
                                <MenuItem key={index} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                        <InputLabel id="select-program-label">Select Program</InputLabel>
                        <Select
                            labelId="select-program-label"
                            id="select-program"
                            value={selectedProgram}
                            label="Select Program"
                            onChange={handleChangeProgram}
                        >
                            {programListByType[selectedProgramCategory]?.map((program, index) => (
                                <MenuItem key={index} value={program}>{program}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                        <InputLabel id="semester-label">Semester</InputLabel>
                        <Select
                            labelId="semester-label"
                            id="semester"
                            value={selectedSemester}
                            label="Semester"
                            onChange={handleChangeSemester}
                        >
                            {semesterList.map((semester, index) => (
                                <MenuItem key={index} value={semester}>{semester}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=>{
                            handleApplyFilters()
                            handleData()
                        }}
                    >
                        Apply
                    </Button>
                </div>
                {showTable && (
                    <TableContainer component={Paper} className="mt-5">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center' style={{ border: '1px solid black' }}>Sno</TableCell>
                                    <TableCell align='center' style={{ border: '1px solid black' }}>Details</TableCell>
                                    <TableCell align='center' style={{ border: '1px solid black' }}>Course Codes</TableCell>
                                    <TableCell align='center' style={{ border: '1px solid black' }}>Signature</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {studentsData.map((student, index) => (
                                    <TableRow key={index} sx={{ }}>
                                        <TableCell align='center' component="th" scope="row" style={{ border: '1px solid black' }}>{index + 1}</TableCell>
                                        <TableCell align='center' style={{ border: '1px solid black' }}>{student.name}<br />{student.rollno}</TableCell>
                                        <TableCell style={{ border: '1px solid black' }}>
                                            <div className="flex flex-wrap p-2">
                                                {student.course_codes.slice(0, 7).map((code, codeIndex) => (
                                                    <div key={codeIndex} style={{ width: '14.28%', textAlign: 'center'}}>
                                                        {code}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap">
                                                {student.course_codes.slice(7).map((code, codeIndex) => (
                                                    <div key={codeIndex} style={{ width: '14.28%', textAlign: 'center'}}>
                                                        {code}
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ border: '1px solid black' }}></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

            </div>
        </>
    );
}

