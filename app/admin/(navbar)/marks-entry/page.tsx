"use client";
import React, { use, useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  fetchAggregateMarks,
  fetchCoursesBySemester,
  fetchDepartDetailsByEmailid,
  fetchExamRegistrationByProgramAndSemester,
  fetchExternalMarks,
  fetchInternalMarks,
  fetchStudentByCourseCode,
  updateAggregateMarks,
  updateExternalMarks,
  updateInternalMarks,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import {
  ProgramListByTypeType,
  TransformedType,
  transformData,
  useData,
} from "@/contexts/DataContext";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import MarksTable from "./MarksTable";
import { useRouter } from "next/navigation";

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
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const [data, setData] = useState<TransformedType>();
  const [value, setValue] = React.useState(0);
  const [subjectType, setSubjectType] = useState(1);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (!save) {
      const res = window.confirm(
        "You have unsaved changes, Please save them before switching tabs or these unsaved changes will be lost!"
      );
      if (!res) {
        setValue(newValue);
        setSave(true);
      }
    } else {
      setValue(newValue);
    }
  };
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [freeze, setFreeze] = useState(false);
  const router = useRouter();
  const [globalFreeze, setGlobalFreeze] = useState(false);
  const [save, setSave] = useState(false);

  const academicYear: string[] = ["2023-2024"];

  useEffect(() => {
    const unloadCallback = (event:any) => {
      if (!save) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    if (!save) {
      window.addEventListener('beforeunload', unloadCallback);
    } else {
      window.removeEventListener('beforeunload', unloadCallback);
    }

    return () => {
      window.removeEventListener('beforeunload', unloadCallback);
    };
  }, [save]);

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
  }, [
    selectedProgram,
    selectedSemester,
    selectedProgramCategory,
    selectedCampus,
  ]);

  useEffect(() => {
    if (freeze) {
      setSave(true);
    }
  }, [freeze]);

  // useEffect(()=>{
  //    fetchStudentMarks(subjectType, value, studentList.map(student => student.rollno)).then((res)=>{
  //
  //     setStudentList(res);
  //     // setFreeze(res[0].freeze_marks)
  //    })
  // },[value])

  useEffect(() => {
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedCampus]);
  useEffect(() => {
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedProgramCategory]);
  useEffect(() => {
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedProgram]);
  useEffect(() => {
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedSemester]);

  useEffect(() => {
    setSelectedAcademicYear("");
  }, [selectedCourse]);

  useEffect(() => {
    getAuthAdmin().then(async (t: any) => {
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        setUser(data.user);
        if (data.user.role === "admin" || data.user.role === "dep") {
          setSelectedCampus(data.user.campus);
        }
      }
    });
  }, []);

  useEffect(() => {
    console.log(
      `campus: ${selectedCampus} program: ${selectedProgram} programcatergory: ${selectedProgramCategory} semester: ${selectedSemester} academic year ${selectedAcademicYear}`
    );
    if (
      selectedCampus !== "" &&
      selectedProgramCategory !== "" &&
      selectedProgram !== "" &&
      selectedSemester !== "" &&
      selectedCourse !== "" &&
      selectedAcademicYear !== ""
    ) {
      console.log("inside if");
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
    selectedAcademicYear,
  ]);

  useEffect(() => {
    if (user) {
      fetchDepartDetailsByEmailid(token, user.emailid).then((data) => {
        const campusList: string[] = Array.from(
          new Set(data.map((entry: any) => entry.campus))
        );
        const programTypeList: string[] = Array.from(
          new Set(data.map((entry: any) => entry.program_type))
        );
        const programListByType: ProgramListByTypeType = {};
        data.map((entry: any) => {
          if (!programListByType[entry.program_type]) {
            programListByType[entry.program_type] = [];
            programListByType[entry.program_type].push(entry.program);
          } else {
            if (
              !programListByType[entry.program_type].includes(entry.program)
            ) {
              programListByType[entry.program_type].push(entry.program);
            }
          }
        });

        const transfomedData = transformData(data);
        setData(transfomedData);
      });
    }
  }, [user]);

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
          setLoading(true);
          const res = await fetchStudentByCourseCode(
            token,
            course_code,
            selectedCampus,
            selectedProgramCategory,
            selectedProgram,
            selectedSemester,
            selectedAcademicYear
          );

          const formattedStudentList: StudentType[] = res.map(
            (student: Student, index: number) => ({
              sno: index + 1,
              rollno: student.rollno,
              name: student.name,
              marks: "",
            })
          );

          const freezeStatus = await fetchFreeze(
            formattedStudentList.map((student) => student.rollno)
          );
          setFreeze(freezeStatus);
          setGlobalFreeze(freezeStatus);
          if (!freezeStatus) {
            setOpen(true);
            setStudentList(formattedStudentList);
          } else {
            const internal = await fetchInternalMarks(token, {
              campus: selectedCampus,
              program_type: selectedProgramCategory,
              program: selectedProgram,
              semester: selectedSemester,
              academic_year: selectedAcademicYear,
              course_code: course_code,
              rollno: formattedStudentList.map((student) => student.rollno),
            });

            let marks;
            if (internal && internal.length > 0 && internal[0].freeze_marks) {
              setSubjectType(1);
              marks = await fetchStudentMarks(
                1,
                0,
                formattedStudentList.map((student) => student.rollno)
              );
            } else {
              setSubjectType(2);
              //
              marks = await fetchStudentMarks(
                2,
                0,
                formattedStudentList.map((student) => student.rollno)
              );
            }
            setStudentList(marks);
          }
          setLoading(false);
          // if (res.length > 0) {
          // }
        } catch (error) {
          setLoading(false);
        }
      }
    } else {
      setStudentList([]);
    }
  };

  async function fetchFreeze(rollno: Array<string>): Promise<boolean> {
    //
    const course_code = courseCodes.find(
      (course) => course.course_name === selectedCourse
    )?.course_code;
    if (!course_code) {
      return false;
    }
    if (rollno.length === 0) {
      return false;
    }

    const details = {
      campus: selectedCampus,
      program_type: selectedProgramCategory,
      program: selectedProgram,
      semester: selectedSemester,
      academic_year: selectedAcademicYear,
      course_code: course_code,
      rollno: rollno,
    };

    setLoading(true);
    const res = await fetchAggregateMarks(token, details);
    setLoading(false);

    if (res && res.length > 0) {
      return res[0].freeze_marks;
    } else {
      return false;
    }
  }

  async function fetchStudentMarks(
    subjectType: number,
    value: number,
    rollno: Array<string>
  ) {
    if (rollno.length === 0) {
      return [];
    }

    const course_code = courseCodes.find(
      (course) => course.course_name === selectedCourse
    )?.course_code;
    if (!course_code) {
      return [];
    }

    const details = {
      campus: selectedCampus,
      program_type: selectedProgramCategory,
      program: selectedProgram,
      semester: selectedSemester,
      academic_year: selectedAcademicYear,
      course_code: course_code,
      rollno: rollno,
    };

    try {
      setLoading(true);
      let res = [];

      if (subjectType === 1) {
        if (value === 0) {
          res = await fetchInternalMarks(token, details);
        }
        if (value == 1) {
          res = await fetchExternalMarks(token, details);
        }
        if (value === 2) {
          res = await fetchAggregateMarks(token, details);
        }
      } else if (subjectType === 2) {
        res = await fetchAggregateMarks(token, details);
      }

      setLoading(false);

      if (!res || res.length === 0) {
        return [];
      }

      setFreeze(res[0].freeze_marks);

      return res.map((student: any, index: number) => ({
        sno: index + 1,
        rollno: student.rollno,
        name: student.name,
        marks: student.marks,
      }));
    } catch (error) {
      setLoading(false);
      console.error("Error fetching marks:", error);
      return [];
    }
  }

  useEffect(() => {
    fetchStudentMarks(
      subjectType,
      value,
      studentList.map((student) => student.rollno)
    ).then((students) => {
      if (students && students.length > 0) {
        setStudentList(students);
      } else {
        const newStudentList: StudentType[] = studentList.map((student) => {
          return { ...student, marks: "" };
        });
        setFreeze(false);
        setStudentList(newStudentList);
      }
    });
  }, [value, subjectType]);

  const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
    setSelectedCampus(event.target.value);
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedAcademicYear("");
  };

  const handleChangeProgramCategory = (event: SelectChangeEvent) => {
    setSelectedProgramCategory(event.target.value);
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedAcademicYear("");
  };

  const handleChangeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value);
    setSelectedSemester("");
    setSelectedAcademicYear("");
  };

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
    setSelectedAcademicYear("");
  };

  const handleChangeCourse = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
    setSelectedAcademicYear("");
  };

  const handleChangeAcademicYear = (event: SelectChangeEvent) => {
    setSelectedAcademicYear(event.target.value);
  };

  useEffect(() => {}, [freeze]);

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
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="academic-year-label">Academic Year</InputLabel>
              <Select
                labelId="year-label"
                id="year"
                value={selectedAcademicYear}
                label="Academic Year"
                onChange={handleChangeAcademicYear}
              >
                {selectedCampus !== "" &&
                  selectedProgramCategory !== "" &&
                  selectedProgram !== "" &&
                  selectedSemester !== "" &&
                  selectedCourse !== "" &&
                  academicYear.map((year, index) => (
                    <MenuItem key={index} value={year}>
                      {year}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
        <div></div>
        <div className="my-10">
          <div className="text-2xl font-medium">
            {selectedAcademicYear === "" && "No Course Selected"}
            {selectedAcademicYear !== "" &&
              studentList.length === 0 &&
              "No Students Available "}
            {selectedAcademicYear !== "" && studentList.length > 0 && (
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
                        {
                          <Tab
                            label="Continuous Assessment"
                            {...a11yProps(1)}
                            key="tab-1"
                          />
                        }
                        {subjectType === 1 && (
                          <Tab
                            label="End Of Semester Assessment"
                            {...a11yProps(0)}
                            key="tab-0"
                          />
                        )}
                        {globalFreeze && !(subjectType === 2) && (
                          <Tab
                            label="Aggregate Marks"
                            {...a11yProps(2)}
                            key="tab-2"
                          />
                        )}
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                      <div className="w-full h-full flex justify-center items-center">
                        {loading && <CircularProgress className="mx-auto" />}
                      </div>
                      {!loading && (
                        <MarksTable
                          campus={selectedCampus}
                          program_type={selectedProgramCategory}
                          freeze={freeze}
                          setFreeze={setFreeze}
                          superAdmin={user?.role === "super"}
                          program={selectedProgram}
                          semester={selectedSemester}
                          setGlobalFreeze={setGlobalFreeze}
                          setSave={setSave}
                          course_code={
                            courseCodes.find(
                              (course) => course.course_name === selectedCourse
                            )?.course_code || ""
                          }
                          token={token}
                          academic_year={selectedAcademicYear}
                          subjectType="1"
                          setValue={setValue}
                          maxMarks={subjectType === 1 ? 75 : 100}
                          students={studentList}
                        />
                      )}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <div className="w-full h-full flex justify-center items-center">
                        {loading && <CircularProgress className="mx-auto" />}
                      </div>
                      {!loading && (
                        <MarksTable
                          campus={selectedCampus}
                          program_type={selectedProgramCategory}
                          program={selectedProgram}
                          semester={selectedSemester}
                          setGlobalFreeze={setGlobalFreeze}
                          freeze={freeze}
                          superAdmin={user?.role === "super"}
                          setFreeze={setFreeze}
                          setSave={setSave}
                          course_code={
                            courseCodes.find(
                              (course) => course.course_name === selectedCourse
                            )?.course_code || ""
                          }
                          token={token}
                          academic_year={selectedAcademicYear}
                          maxMarks={25}
                          setValue={setValue}
                          subjectType="2"
                          students={studentList}
                        />
                      )}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                      <div className="w-full h-full flex justify-center items-center">
                        {loading && <CircularProgress className="mx-auto" />}
                      </div>
                      {!loading && (
                        <MarksTable
                          campus={selectedCampus}
                          program_type={selectedProgramCategory}
                          program={selectedProgram}
                          semester={selectedSemester}
                          setGlobalFreeze={setGlobalFreeze}
                          freeze={freeze}
                          superAdmin={user?.role === "super"}
                          setValue={setValue}
                          setFreeze={setFreeze}
                          setSave={setSave}
                          course_code={
                            courseCodes.find(
                              (course) => course.course_name === selectedCourse
                            )?.course_code || ""
                          }
                          token={token}
                          academic_year={selectedAcademicYear}
                          maxMarks={100}
                          subjectType="2"
                          students={studentList}
                        />
                      )}
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
            Please select if this is subjects consists of both{" "}
            <strong>Continuous and End of Semester Assessment</strong> or only{" "}
            <strong>Continuous Assessment</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              setSubjectType(1);
              const students = await fetchStudentMarks(
                1,
                value,
                studentList.map((student) => student.rollno)
              );

              if (students && students?.length > 0) {
                setStudentList(students);
              }
              setOpen(false);
            }}
            color="primary"
          >
            Continuous and End of Semester Assessment
          </Button>
          <Button
            onClick={async () => {
              setSubjectType(2);
              const students = await fetchStudentMarks(
                2,
                value,
                studentList.map((student) => student.rollno)
              );

              if (students && students?.length > 0) {
                setStudentList(students);
              }
              setOpen(false);
            }}
            color="primary"
          >
            Continuous Assessment
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alert}
        autoHideDuration={6000}
        onClose={() => {
          setAlert(false);
        }}
        message={message}
      />
    </>
  );
}
