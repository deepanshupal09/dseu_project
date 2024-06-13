"use client";
import React, { use, useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  fetchCoursesBySemester,
  fetchExamRegistrationByProgramAndSemester,
  fetchExternalMarks,
  fetchInternalMarks,
  fetchStudentByCourseCode,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { useData } from "@/contexts/DataContext";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import MarksTable from "./MarksTable";

interface ProgramList {
  [key: string]: string[];
}

export interface Course {
  course_name: string;
  course_code: string;
  course_type: string;
  credit: number;
  semester: number;
}

export interface Student {
  name: string;
  rollno: string;
  program: string;
  semester: number;
}

export interface User {
  emailid: string;
  role: string;
  campus: string;
}

type StudentType = {
  sno: number;
  rollno: string;
  name: string;
  marks: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Marks() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [courseList, setCourseList] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<Course[]>([]);
  const [studentList, setStudentList] = useState<StudentType[]>([]);
  const [internalMarks, setInternalMarks] = useState<StudentType[]>([]);
  const [externalMarks, setExternalMarks] = useState<StudentType[]>([]);
  const [finalMarks, setFinalMarks] = useState<StudentType[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [selectedProgramCategory, setSelectedProgramCategory] =
    useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const { data } = useData();
  const [value, setValue] = React.useState(0);
  const [subjectType, setSubjectType] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && selectedProgram !== "" && selectedSemester !== "") {
      fetchCoursesBySemester(
        token,
        selectedCampus,
        selectedProgram,
        selectedSemester,
        selectedProgramCategory
      )
        .then((response: Course[]) => {
          const temp: string[] = [];
          setCourseCodes(response);
          response.map((e) => temp.push(e.course_name));
          setCourseList(temp);
        })
        .catch((error) => {});
    }
  }, [selectedProgram, selectedSemester]);

  useEffect(() => {
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedCourse("");
  }, [selectedCampus]);
  useEffect(() => {
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedCourse("");
  }, [selectedProgramCategory]);
  useEffect(() => {
    setSelectedSemester("");
    setSelectedCourse("");
  }, [selectedProgram]);
  useEffect(() => {
    setSelectedCourse("");
  }, [selectedSemester]);

  useEffect(() => {
    getAuthAdmin().then(async (t: any) => {
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        setUser(data.user);
        if (data.user.role === "admin") {
          setSelectedCampus(data.user.campus);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (
      selectedCampus !== "" &&
      selectedProgramCategory !== "" &&
      selectedProgram !== "" &&
      selectedSemester !== "" &&
      selectedCourse !== ""
    ) {
      handleApplyFilters();
    } else {
      setStudentList([]);
    }
  }, [
    selectedCampus,
    selectedProgram,
    selectedProgramCategory,
    selectedSemester,
    selectedCourse,
  ]);

  // useEffect(() => {
  //   if (selectedCourse !== "") {

  //   }

  // },[selectedCourse, value])

  const handleApplyFilters = async () => {
    if (selectedCourse !== "") {
      const course_code = courseCodes.find(
        (course) => course.course_name === selectedCourse
      )?.course_code;
      if (course_code) {
        try {
          const res = await fetchStudentByCourseCode(
            token,
            course_code,
            selectedCampus,
            selectedProgramCategory,
            selectedProgram,
            selectedSemester,
            "2023-2024"
          );
          const formattedStudentList: StudentType[] = res.map(
            (student: Student, index: number) => ({
              sno: index + 1,
              rollno: student.rollno,
              name: student.name,
              marks: "",
            })
          );
          // if (res.length > 0) {
          // }
          console.log(formattedStudentList);
          setStudentList(formattedStudentList);
        } catch (error) {}
      }
    } else {
      setStudentList([]);
    }
  };

  useEffect(() => {
    if (subjectType === 1) {
      if (value === 0) {
        const course_code = courseCodes.find(
          (course) => course.course_name === selectedCourse
        )?.course_code;
        if (course_code) {
          const details = {
            campus: selectedCampus,
            program_type: selectedProgramCategory,
            program: selectedProgram,
            semester: selectedSemester,
            academic_year: "2023-2024",
            course_code: course_code,
            rollno: studentList.map((student) => student.rollno),
          };
          fetchInternalMarks(token, details)
            .then((res) => {
              console.log("res: ", res);
            })
            .catch((error) => {
              console.log("error: ", error);
            });
        }
      } else {
        const course_code = courseCodes.find(
          (course) => course.course_name === selectedCourse
        )?.course_code;
        if (course_code) {
          const details = {
            campus: selectedCampus,
            program_type: selectedProgramCategory,
            program: selectedProgram,
            semester: selectedSemester,
            academic_year: "2023-2024",
            course_code: course_code,
            rollno: studentList.map((student) => student.rollno),
          };
          fetchExternalMarks(token, details)
            .then((res) => {
              console.log("res: ", res);
            })
            .catch((error) => {
              console.log("error: ", error);
            });
        }
      }
    }
    if (subjectType === 2) {
    }
  }, [subjectType, value]);

  useEffect(() => {
    if (selectedCourse !== "") setOpen(true);
  }, [selectedCourse]);

  const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
    setSelectedCampus(event.target.value);
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
  };

  const handleChangeProgramCategory = (event: SelectChangeEvent) => {
    setSelectedProgramCategory(event.target.value);
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

  const handleChangeCourse = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <>
      <div className="bg-[#dfdede] mt-2"></div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">
          Marks Entry{" "}
        </h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
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
                  value={selectedCampus || ""}
                  label="Program category"
                  onChange={handleChangeSelectedCampus}
                >
                  {data &&
                    Object.keys(data)?.map((campus, index) => (
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
                value={selectedProgramCategory || ""}
                label="Program category"
                onChange={handleChangeProgramCategory}
              >
                {selectedCampus &&
                  selectedCampus !== "" &&
                  data &&
                  data[selectedCampus] &&
                  Object.keys(data[selectedCampus])?.map((category, index) => (
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
                value={selectedProgram || ""}
                label="Select Program"
                onChange={handleChangeProgram}
              >
                {selectedCampus &&
                  selectedProgramCategory &&
                  selectedCampus !== "" &&
                  selectedProgramCategory !== "" &&
                  data &&
                  data[selectedCampus] &&
                  data[selectedCampus][selectedProgramCategory] &&
                  Object.keys(
                    data[selectedCampus][selectedProgramCategory]
                  )?.map((program, index) => (
                    <MenuItem key={index} value={program}>
                      {program}
                    </MenuItem>
                  ))}
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
                value={selectedSemester || ""}
                label="Semester"
                onChange={handleChangeSemester}
              >
                {" "}
                {selectedCampus &&
                  selectedProgramCategory &&
                  selectedProgram &&
                  selectedCampus !== "" &&
                  selectedProgramCategory !== "" &&
                  selectedProgram !== "" &&
                  data &&
                  data[selectedCampus] &&
                  data[selectedCampus][selectedProgramCategory] &&
                  data[selectedCampus][selectedProgramCategory][
                    selectedProgram
                  ] &&
                  data[selectedCampus][selectedProgramCategory][
                    selectedProgram
                  ]?.map((semester, index) => (
                    <MenuItem key={index} value={semester}>
                      {semester}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="course-label">Course</InputLabel>
              <Select
                labelId="course-label"
                id="course"
                value={selectedCourse}
                label="Course"
                onChange={handleChangeCourse}
              >
                {selectedCampus !== "" &&
                  selectedProgramCategory !== "" &&
                  selectedProgram !== "" &&
                  selectedSemester !== "" &&
                  courseList.map((course, index) => (
                    <MenuItem key={index} value={course}>
                      {course}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
        <div></div>
        <div className="my-10">
          <div className="text-2xl font-medium">
            {selectedCourse === "" && "No Course Selected"}
            {selectedCourse !== "" && (
              <div className="space-y-5 px-2">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>{selectedCourse}</div>
                  </div>

                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab
                          label="Internal Assessment"
                          {...a11yProps(0)}
                          key="tab-0"
                        />

                        {subjectType === 1 && (
                          <Tab
                            label="External Assessment"
                            {...a11yProps(1)}
                            key="tab-1"
                          />
                        )}
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                      <MarksTable
                        campus={selectedCampus}
                        program_type={selectedProgramCategory}
                        program={selectedProgram}
                        semester={selectedSemester}
                        course_code={
                          courseCodes.find(
                            (course) => course.course_name === selectedCourse
                          )?.course_code || ""
                        }
                        token={token}
                        academic_year="2023-2024"
                        subjectType="1"
                        maxMarks={subjectType === 1 ? 25 : 100}
                        students={studentList}
                      />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <MarksTable
                        campus={selectedCampus}
                        program_type={selectedProgramCategory}
                        program={selectedProgram}
                        semester={selectedSemester}
                        course_code={
                          courseCodes.find(
                            (course) => course.course_name === selectedCourse
                          )?.course_code || ""
                        }
                        token={token}
                        academic_year="2023-2024"
                        subjectType="2"
                        maxMarks={75}
                        students={studentList}
                      />
                    </CustomTabPanel>
                  </Box>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false);
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>Please Select Type of Subject</DialogTitle>
        <DialogContent>
          <Typography>
            Please select if this is subjects consists of both internal and
            external assessment or only external assessment?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSubjectType(1);
              setOpen(false);
            }}
            color="primary"
          >
            Internal and External Assessment
          </Button>
          <Button
            onClick={() => {
              setSubjectType(2);
              setOpen(false);
            }}
            color="primary"
          >
            Internal Assessment Only
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
