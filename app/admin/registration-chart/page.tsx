"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import logo from "../../images/dseu.png";

import { getAuthAdmin } from "../../actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import {
  fetchCoursesBySemester,
  fetchExamRegistrationByProgramAndSemester,
} from "@/app/actions/api";
import Image from "next/image";
import { Course, User } from "../query/page";

interface ProgramList {
  [key: string]: string[];
}

interface Token {
  name: string;
  value: string;
  path: string;
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
interface IndexDataRow {
  sno: number;
  course_name: string;
  course_code: string;
  credit: number;
  course_type: string;
}
interface DropdownMenuProps {
  handleShowMain: () => void;
  handleShowIndex: () => void;
}

const programListByType: ProgramList = {
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
    "Diploma in Pharmacy",
    "Diploma in Printing Technology",
    "Diploma in Tool and Die Making",
    "Diploma in Artificial Intelligence and Machine Learning",
    "Diploma in Robotic and Process Automation",
    "Diploma in Electrical Engineering - Part Time",
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
    "Bachelor of Business Administration (Operation and Business Process Management)",
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
    "Bachelor of Technology (Electronics and Communication Engineering)",
    "Bachelor of Technology (Computer Science Engineering)",
    "Bachelor of Technology (Mechanical Engineering)",
    "Bachelor of Technology (Tool Engineering)",
    "Bachelor of Technology (Mechatronics Engineering)",
  ],
  PostGraduate: [
    "Master of Computer Applications",
    "Master of Technology (Mechanical Engineering)",
    "Master of Technology (Tool Engineering)",
    "Master of Technology (Computer Science Engineering with Specialization in Al & ML)",
    "Master of Technology (Electronic & Communication Engineering With Specialization in IOT)",
    "Master of Technology (Mechanical Engineering with Specialization in Thermal/Production/Design)",
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

const campusList = [
  "Arybhatt DSEU Ashok Vihar Campus",
  "Ambedkar DSEU Shakarpur Campus-I",
  "DSEU Okhla II Campus",
  "G.B. Pant DSEU Okhla I Campus",
  "Guru Nanak Dev DSEU Rohini Campus",
  "DSEU Dwarka Campus",
  "Kasturba DSEU Pitampura Campus",
  "Meerabai DSEU Maharani Bagh Campus",
  "DSEU Pusa Campus - I",
  "DSEU Rajokri Campus",
  "DSEU Sirifort Campus",
  "DSEU Wazirpur-I Campus",
  "Dr.H.J. Bhabha DSEU Mayur Vihar Campus",
  "DSEU Ranhola Campus",
  "G.B. Pant DSEU Okhla III Campus",
  "DSEU Jaffarpur Campus",
  "Bhai Parmanand DSEU Shakarpur II Campus",
  "DSEU Pusa II Campus",
  "DSEU Champs okhla II Campus",
  "Sir C.V. Raman DSEU Dheerpur Campus",
  "DSEU Vivek vihar Campus",
];

const semesterList = ["2", "4", "6"];

export default function Registration() {
  const [selectedProgramCategory, setSelectedProgramCategory] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [campus, setCampus] = useState("");
  const [token, setToken] = useState("");
  const [showMainTable, setShowMainTable] = useState(false);
  const [showIndexTable, setShowIndexTable] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [indexData, setIndexData] = useState<IndexDataRow[]>([]);
  const [detailSheetOption, setDetailSheetOption] = useState("");
  const [frontSheetOption, setFrontSheetOption] = useState("");
  const frontSheetRef = useRef(null);
  const detailSheetRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  //   useEffect(() => {
  //     const dummyData = [];

  //     setIndexData(dummyData);
  //   }, []);

  useEffect(() => {
    getAuthAdmin().then(async (t: any) => {
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        setCampus(data.user.campus);
        setUser(data.user);
        if (data.user.role === "admin") {
          setSelectedCampus(data.user.campus);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (user && selectedProgram !== "" && selectedSemester !== "") {
      fetchCoursesBySemester(
        token,
        selectedCampus,
        selectedProgram,
        selectedSemester
      ).then((response: Course[]) => {
        const temp: IndexDataRow[] = [];
        response.map((course: Course, index: number) => {
          temp.push({ sno: index + 1, ...course });
        });
        setIndexData(temp);
        console.log("response: ", response);
      });
    }
  }, [selectedProgram, selectedSemester]);

  useEffect(() => {
    if (studentsData.length > 0) {
      setShowMainTable(true);
      setShowIndexTable(true);
    } else {
      setShowMainTable(false);
      setShowIndexTable(false);
    }
  }, [studentsData]);

  const handleData = async () => {
    try {
      if (token) {
        const data: any = await fetchExamRegistrationByProgramAndSemester(
          token as string,
          selectedCampus,
          selectedProgramCategory,
          selectedProgram,
          selectedSemester
        );
        setStudentsData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [selectedOption, setSelectedOption] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "detailSheet") {
      handleShowMain();
    } else if (event.target.value === "frontSheet") {
      handleShowIndex();
    }
  };

  const handleChangeProgramCategory = (event: SelectChangeEvent) => {
    setSelectedProgramCategory(event.target.value);
    setSelectedProgram("");
    setSelectedSemester("");
  };

  const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
    setSelectedCampus(event.target.value);
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
  };

  const handleChangeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value);
    setSelectedSemester("");
  };

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
  };

  useEffect(() => {
    if (selectedCampus !== "") {
      handleData();
    }
  }, [selectedSemester]);

  const handleShowMain = () => {
    setShowMainTable(true);
    setShowIndexTable(false);
  };

  const handleShowIndex = () => {
    setShowIndexTable(true);
    setShowMainTable(false);
  };

  const handleClose = () => {
    setShowButtons(false);
    setShowCloseButton(false);
    setShowIndexTable(false);
    setShowMainTable(false);
  };

  return (
    <>
      <div className="bg-[#dfdede]">
        <Head username={"Campus Director"} />
        <Nav />
      </div>
      <div className="mt-[60px] max-sm:mt-[150px] px-4 sm:ml-[250px]">
        {/* abc */}
        <div className="bg-dseublue py-2 px-4 sm:mx-12 w-full rounded shadow mt-28  ">
          <h1 className="text-2xl text-white font-bold w-full text-center">
            Registration Chart
          </h1>
        </div>
        <div className="py-2 px-4 rounded shadow max-sm:w-full sm:mx-12 mt-20">
          <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">
            SELECT
          </h2>
          <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
            {user?.role === "super" && (
              <FormControl
                size="small"
                className="w-full md:w-1/3 sm:w-auto mt-5"
              >
                <InputLabel id="program-category-label">Campus</InputLabel>
                <Select
                  labelId="program-category-label"
                  id="program-category"
                  value={selectedCampus}
                  label="Program category"
                  onChange={handleChangeSelectedCampus}
                >
                  {campusList.map((campus, index) => (
                    <MenuItem key={index} value={campus}>
                      {campus}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="program-category-label">
                Program category
              </InputLabel>
              <Select
                labelId="program-category-label"
                id="program-category"
                value={selectedProgramCategory}
                label="Program category"
                onChange={handleChangeProgramCategory}
              >
                {programTypeList.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="select-program-label">Select Program</InputLabel>
              <Select
                labelId="select-program-label"
                id="select-program"
                value={selectedProgram}
                label="Select Program"
                onChange={handleChangeProgram}
                disabled={!selectedProgramCategory}
              >
                {programListByType[selectedProgramCategory]?.map(
                  (program, index) => (
                    <MenuItem key={index} value={program}>
                      {program}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                id="semester"
                value={selectedSemester}
                label="Semester"
                onChange={handleChangeSemester}
                disabled={!selectedProgram}
              >
                {semesterList.map((semester, index) => (
                  <MenuItem key={index} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {/* <div className="flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              disabled={
                !selectedProgram ||
                !selectedProgramCategory ||
                !selectedSemester
              }
            >
              Apply
            </Button>
          </div> */}
        </div>

        <div className="py-2 px-4 rounded shadow sm:mx-12 mt-6">
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                Print
              </Button>
            )}
            content={() => containerRef.current}
            // pageStyle="@page { size: landscape; }"
          />
          <div ref={containerRef} className=" h-auto">
            {/* <div className="announcement  front-sheet bg-white py-2 px-4 rounded shadow  mx-12 mt-6 "> */}
            <div
              ref={frontSheetRef}
              className="front-sheet hidden overflow-y-auto h-auto"
            >
              <Typography
                className="mt-4 mb-4"
                variant="h4"
                component="div"
                align="center"
                gutterBottom
              >
                <br />
                Exam Registration Chart
              </Typography>
              <div className="flex justify-between w-[60%] items-center ">
                <div className="text- ">
                  <p>
                    <strong>Exam date : </strong> ___________________
                  </p>
                  <p>
                    <strong>Campus : </strong> {selectedCampus}
                  </p>
                  <p>
                    <strong>Program Category : </strong>
                    {selectedProgramCategory}
                  </p>
                  <p>
                    <strong>Program : </strong>
                    {selectedProgram}
                  </p>
                  <p>
                    <strong>Semester : </strong>
                    {selectedSemester}
                  </p>
                </div>
                <Image className="w-48 h-48" src={logo} alt="DSEU Logo" />
              </div>
              <div className="mt-20 overflow-x-auto w-[60%] ">
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-bold">S.No</TableCell>
                        <TableCell className="font-bold">Course Name</TableCell>
                        <TableCell className="font-bold">Course Code</TableCell>
                        <TableCell className="font-bold">Credit</TableCell>
                        <TableCell className="font-bold">
                          Type of Course
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {indexData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.sno}</TableCell>
                          <TableCell>{row.course_name}</TableCell>
                          <TableCell>{row.course_code}</TableCell>
                          <TableCell>{row.credit}</TableCell>
                          <TableCell>{row.course_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <style jsx global>{`
                @media print {
                  .front-sheet {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    /* page-break-before: always; */
                    page-break-after: always;
                  }

                  @page {
                    size: portrait; /* Set the page size to portrait mode */
                  }

                  .front-sheet * {
                    margin: 0;
                    padding: 0;
                  }

                  .front-sheet table {
                    width: 100%;
                    border-collapse: collapse;
                  }

                  .front-sheet td,
                  .front-sheet th {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                  }

                  .front-sheet .landscape {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    page-break-before: always;
                  }

                  .front-sheet .landscape * {
                    margin: 0;
                    padding: 0;
                  }

                  .front-sheet .landscape table {
                    width: 100%;
                    border-collapse: collapse;
                  }

                  .front-sheet .landscape td,
                  .front-sheet .landscape th {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                  }
                }
              `}</style>
            </div>
            {/* </div> */}
            <div ref={detailSheetRef} className="detail-sheet">
              <div className="announcement bg-white py-2 px-4 rounded shadow ">
                <TableContainer component={Paper} className="mt-5 detail-sheet">
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{ border: "1px solid black" }}
                        >
                          Sno
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ border: "1px solid black" }}
                        >
                          Details
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ border: "1px solid black" }}
                        >
                          Course Codes
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ border: "1px solid black" }}
                        >
                          Signature
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentsData.map((student, index) => (
                        <TableRow key={index} sx={{}}>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            style={{ border: "1px solid black" }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{ border: "1px solid black" }}
                          >
                            {student.name}
                            <br />
                            {student.rollno}
                          </TableCell>
                          <TableCell style={{ border: "1px solid black" }}>
                            <div className="flex flex-wrap p-2">
                              {student.course_codes
                                .slice(0, 6)
                                .map((code, codeIndex) => (
                                  <div
                                    className="cell"
                                    key={codeIndex}
                                    style={{
                                      width: "16.66%",
                                      textAlign: "center",
                                    }}
                                  >
                                    {code}
                                  </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap">
                              {student.course_codes
                                .slice(6)
                                .map((code, codeIndex) => (
                                  <div
                                    key={codeIndex}
                                    className="cell"
                                    style={{
                                      width: "16.66%",
                                      textAlign: "center",
                                    }}
                                  >
                                    {code}
                                  </div>
                                ))}
                            </div>
                          </TableCell>
                          <TableCell
                            style={{ border: "1px solid black" }}
                          ></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <style jsx global>{`
                @media print {
                  .front-sheet {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    page-break-before: always;
                    /* page-break-after: always; */
                  }
                  .detail-sheet table {
                    page-break-inside: avoid;
                  }
                  .detail-sheet table tr:nth-child(7n + 7) {
                    page-break-after: always;
                  }

                  @page {
                    size: A4 landscape;
                  }

                  .front-sheet * {
                    margin: 0;
                    padding: 0;
                  }

                  .front-sheet table {
                    width: 100%;
                    border-collapse: collapse;
                  }

                  .cell {
                    /* padding-top: 50px; */
                    padding-right: 10px;
                    /* padding-bottom: 50px; */
                    padding-left: 10px;
                  }

                  .front-sheet td,
                  .front-sheet th {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                  }

                  .front-sheet .landscape {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    page-break-before: always;
                  }

                  .front-sheet .landscape * {
                    margin: 0;
                    padding: 0;
                  }

                  .front-sheet .landscape table {
                    width: 100%;
                    border-collapse: collapse;
                  }

                  .front-sheet .landscape td,
                  .front-sheet .landscape th {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                  }
                }
              `}</style>
            </div>
          </div>
          {/* <ReactToPrint
              trigger={() => (
                <Button variant="contained" color="primary">
                  Print Front Sheet
                </Button>
              )}
              content={() => frontSheetRef.current}
            /> */}
        </div>
      </div>
    </>
  );
}
