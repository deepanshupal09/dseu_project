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
import logo from "../../../images/dseu.png";

import { getAuthAdmin } from "../../../actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import {
  fetchCourseDetailsByCourseCode,
  fetchCoursesBySemester,
  fetchExamRegistrationByProgramAndSemester,
} from "@/app/actions/api";
import Image from "next/image";
import { Course, User } from "../query/page";
import { useData } from "@/contexts/DataContext";

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



export default function Registration() {
  const { data } = useData();
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
  const [selectedProgramCategory, setSelectedProgramCategory] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [courseCodes,setCourseCodes] = useState<string[]>([]);
  // const [semesterList, setSemesterList]=useState<string[]>(["2","4","6"]);

  

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
      fetchCourseDetailsByCourseCode(
        token,
        {coursecode: courseCodes,campus: selectedCampus,program: selectedProgram }
      ).then((response: Course[]) => {
        const temp: IndexDataRow[] = [];
        response.map((course: Course, index: number) => {
          temp.push({ sno: index + 1, ...course });
        });
        
        setIndexData(temp);
        
      }).catch((error)=>{
        
      })
    }
  }, [courseCodes]);

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
        
        let set = new Set<string>();
        data.map((student: Student)=>{
          student.course_codes.map((courseCode: string)=>{
            set.add(courseCode);
          })
        })
        const array = Array.from(set);
        setCourseCodes(array);
        


        setStudentsData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   console.log(`Campus ${selectedCampus} Program ${selectedProgram} ProgramType ${selectedProgramCategory} semester ${selectedSemester}` )
  // },[selectedCampus,selectedProgram,selectedProgramCategory,selectedSemester])
  // console.log(`Campus ${selectedCampus} Program ${selectedProgram} ProgramType ${selectedProgramCategory} semester ${selectedSemester}` )

  const [selectedOption, setSelectedOption] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "detailSheet") {
      handleShowMain();
    } else if (event.target.value === "frontSheet") {
      handleShowIndex();
    }
  };
  // useEffect(()=>{
  //   setSelectedProgramCategory(Object.keys(data[selectedCampus])[0])
  // },[selectedCampus])
  // useEffect(()=>{
  //   setSelectedProgram(Object.keys(data[selectedCampus][selectedProgramCategory])[0])
  // },[selectedProgramCategory])
  // useEffect(()=>{
  //   setSelectedSemester(data[selectedCampus][selectedProgramCategory][selectedProgram][0])
  // },[selectedProgram])
  // console.log(data)

  const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
    setSelectedCampus(event.target.value);
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
      </div>
      <div className="mt-[154px] max-sm:mt-[150px] px-2 sm:ml-[250px]">
        {/* abc */}
        <div className="bg-dseublue py-2 px-2 sm:mx-8  rounded shadow mt-28  ">
          <h1 className="text-2xl text-white font-bold  text-center">
            Registration Chart
          </h1>
        </div>
        <div className="py-2 px-2 rounded shadow max-sm:w-full mt-5 sm:mx-8 ">
          <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">
            SELECT
          </h2>
          {data && (
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
                  {Object.keys(data)?.map((campus, index) => (
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
                {selectedCampus !== "" && (

                Object.keys(data[selectedCampus])?.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))
                )}
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
                {selectedCampus !== "" && selectedProgramCategory !== "" && (
                  Object.keys(data[selectedCampus][selectedProgramCategory])?.map(
                    (program, index) => (
                      <MenuItem key={index} value={program}>
                        {program}
                      </MenuItem>
                    )
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
                {selectedCampus !== "" && selectedProgramCategory !== "" && selectedProgram !== "" && (
                data[selectedCampus][selectedProgramCategory][selectedProgram]?.map((semester, index) => (
                  <MenuItem key={index} value={semester}>
                    {semester}
                  </MenuItem>
                ))
                )}
              </Select>
            </FormControl>
          </div>
          )}
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

        <div className="py-2 px-2 rounded shadow sm:mx-8 mt-6">
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
            {/* <div className="announcement  front-sheet bg-white py-2 px-2 rounded shadow  mx-12 mt-6 "> */}
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
              <div className="announcement bg-white py-2 px-2 rounded shadow ">
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
                          Student
                          <br />
                           Sign.
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
                                      width: `${100/student.course_codes.slice(0,6).length}%`,
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
                                      width: `${100/student.course_codes.slice(0,6).length}%`,
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
