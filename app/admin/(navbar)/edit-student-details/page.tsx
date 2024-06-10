"use client";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import Face6RoundedIcon from "@mui/icons-material/Face6Rounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { getAuth, getAuthAdmin } from "../../../actions/cookie";
import { parseJwt } from "../../../actions/utils";
import { StudentDetails } from "@/app/(navbar)/profile/page";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  setRef,
} from "@mui/material";
import {
  addExamRegisterations,
  addExamRegisterationsAdmin,
  deleteExamRegistration,
  fetchCoursesByRollNo,
  fetchCoursesByRollNoAdmin,
  fetchExamRegisterations,
  fetchExamRegisterationsByRollNo,
  getUserByRollNo,
  updateDetails,
} from "@/app/actions/api";
import { SelectChangeEvent } from "@mui/material/Select";
// import {
//   campusList,
//   programListByType,
//   programTypeList,
// } from "@/app/getuserdetails/[rollno]/page";
import { useDebouncedCallback } from "use-debounce";
import { DeleteForever } from "@mui/icons-material";

import { useData } from "@/contexts/DataContext";
import { deepEqual } from "@/utils";
import { useRouter } from "next/navigation";
import { Deselect, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

interface Subject {
  name: string;
  code: string;
  type: string;
}

interface SelectedSubjects {
  [key: string]: boolean;
}

interface Backlog {
  subject: string;
  subjectCode: string;
  semester: number;
}

function Home() {
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [rollno, setRollno] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [original, setOriginal] = useState<StudentDetails | null>(null);
  const [confirmSubmission, setConfirmSumbission] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const { data } = useData();
  const [previewSelection, setPreviewSelection] = useState(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [confirmExamRegistration, setConfirmExamRegistration] = useState(false);

  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);
  const [backlogsData, setBacklogsData] = useState<Backlog[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>(
    {}
  );
  const [selectedBacklogs, setSelectedBacklogs] = useState<Backlog[]>([]);
  const [giveBacklogExams, setGiveBacklogExams] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [chosen, setChosen] = useState(true);
  const [selectedSub, setSelectedSub] = useState<Subject[]>([]);

  const [reload, setReload] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  useEffect(() => {
    if (original) {
      setReload(false);
    }
  }, [original]);

  useEffect(() => {
    if (user && data && user !== original) {
      const program_type = Object.keys(data[user.campus])[0];
      const program = Object.keys(data[user.campus][program_type])[0];
      const semester = parseInt(data[user.campus][program_type][program][0]);

      setUser({
        ...user,
        program_type: program_type,
        program: program,
        semester: semester,
      });
    }
  }, [user?.campus]);
  useEffect(() => {
    if (user && data && user !== original) {
      const program = Object.keys(data[user.campus][user.program_type])[0];
      const semester = parseInt(
        data[user.campus][user.program_type][program][0]
      );
      setUser({
        ...user,
        program: program,
        semester: semester,
      });
    }
  }, [user?.program_type, reload]);
  useEffect(() => {
    if (user && data && user !== original) {
      setUser({
        ...user,
        semester: parseInt(
          data[user.campus][user.program_type][user.program][0]
        ),
      });
    }
  }, [user?.program]);

  useEffect(() => {
    function validateSelectedSubjects() {
      const selectedSubjects = getSelectedSubjects();
      const selectedTypes = new Set(
        selectedSubjects.map((subject) => subject.type)
      );
      const availableTypes = new Set(
        subjectsData
          .filter((subject) => subject.type !== "CC")
          .map((subject) => subject.type)
      );

      // Convert Sets to Arrays for iteration
      const selectedTypesArray = Array.from(selectedTypes);
      const availableTypesArray = Array.from(availableTypes);

      // Check if every type in availableTypes is present in selectedTypes
      const missingTypes = availableTypesArray.some(
        (type) => !selectedTypesArray.includes(type)
      );

      // Set warning if any type exists in subjectsData but not in selectedSubjects
      if (missingTypes) {
        setWarning(true);
        setPreviewSelection(false);
      } else {
        setWarning(false);
      }
    }

    if (previewSelection) {
      validateSelectedSubjects();
    }
  }, [previewSelection, subjectsData]);

  useEffect(() => {
    const initialSelection: Record<string, boolean> = {};
    subjectsData.forEach((subject) => {
      if (subject.type === "CC") {
        initialSelection[subject.code] = true;
      } else {
        initialSelection[subject.code] = false;
      }
    });
    setSelectedSubjects(initialSelection);
  }, [subjectsData]);

  useEffect(() => {
    if (user) {
      const rollno = user.rollno;

      fetchExamRegisterationsByRollNo(rollno, token)
        .then((res: any) => {
          console.log(res);
          if (res.length > 0) {
            const temp: Subject[] = [];
            res.forEach((subject: any) => {
              temp.push({
                name: subject.course_name,
                code: subject.course_code,
                type: subject.course_type,
              });
            });
            setSelectedSub(temp);
            setChosen(true);
          } else {
            setChosen(false);
          }
        })
        .catch((error) => {});
    }
  }, [user, refresh]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const rollno = user.rollno;
        try {
          const courses = await fetchCoursesByRollNoAdmin(rollno, token);

          const userSemester = user.semester;
          let subDataTemp: Subject[] = [],
            backlogDataTemp: Backlog[] = [];

          courses.forEach((course: any) => {
            if (course.semester < user.semester)
              backlogDataTemp.push({
                subject: course.course_name,
                subjectCode: course.course_code,
                semester: course.semester,
              });
            else
              subDataTemp.push({
                name: course.course_name,
                code: course.course_code,
                type: course.course_type,
              });
          });
          const temp: string[] = [];
          subDataTemp.forEach((subject) => {
            if (subject.type === "CC") {
              temp.push(subject.code);
            }
          });

          setSelectedSubjects((prevSelected) => {
            const updatedSelection = { ...prevSelected };
            temp.forEach((code) => {
              if (!(code in updatedSelection)) {
                updatedSelection[code] = false;
              }
            });
            return updatedSelection;
          });

          setSubjectsData(subDataTemp);
          setBacklogsData(backlogDataTemp);
        } catch (error) {}
      }
    };

    fetchData();
  }, [user, refresh]);

  const handleSelectSubject = (subject: Subject) => {
    if (subject.type === "CC") {
      return;
    }

    const alreadySelected = selectedSubjects[subject.code];
    const deselectPreviousElective = (type: string) => {
      const previousElective = Object.keys(selectedSubjects).find(
        (key) =>
          subjectsData.find((subject) => subject.code === key)?.type === type &&
          selectedSubjects[key]
      );
      if (previousElective) {
        setSelectedSubjects((prevSelected) => ({
          ...prevSelected,
          [previousElective]: false,
        }));
      }
    };
    if (alreadySelected) {
      setSelectedSubjects((prevSelected) => ({
        ...prevSelected,
        [subject.code]: false,
      }));
    } else {
      if (subject.type !== "CC") {
        deselectPreviousElective(subject.type);
      }

      // Toggle the selection of the subject
      setSelectedSubjects((prevSelected) => ({
        ...prevSelected,
        [subject.code]: true,
      }));
    }
  };

  const handleSelectBacklog = (backlog: any) => {
    setSelectedBacklogs((prevBacklogs: Backlog[]) => {
      const existingBacklogIndex = prevBacklogs.findIndex(
        (b) =>
          b.subjectCode === backlog.subjectCode &&
          b.semester === backlog.semester
      );

      if (existingBacklogIndex !== -1) {
        return prevBacklogs.filter(
          (b, index) => index !== existingBacklogIndex
        );
      } else {
        return [...prevBacklogs, backlog];
      }
    });
  };

  const generateSemesters = () => {
    const semesters: string[] = [];
    if (user) {
      for (let i = 1; i < user.semester; i++) {
        if (user.semester % 2 === 0) {
          if (i % 2 === 0) {
            semesters.push(i.toString());
          }
        } else {
          if (i % 2 !== 0) {
            semesters.push(i.toString());
          }
        }
      }
    }
    return semesters;
  };

  const getSelectedSubjects = () => {
    return subjectsData.filter((subject) => selectedSubjects[subject.code]);
  };

  const handlePreview = () => {
    console.log("here");
    setPreviewSelection(true);
  };

  const confirmSelection = () => {
    setPreviewSelection(false);
    setConfirmExamRegistration(true);
  };
  const router = useRouter();

  const submitDetails = async () => {
    const selectedSubjectCodes = getSelectedSubjects().map(({ code }) => code);
    const backlogSubjectCodes = selectedBacklogs.map(
      ({ subjectCode }) => subjectCode
    );
    const allSubjectCodes = [...selectedSubjectCodes, ...backlogSubjectCodes];

    try {
      const body = { rollno: user?.rollno, course_code: allSubjectCodes };
      const res = await addExamRegisterationsAdmin(body, token);
      setOpen(true);
      setMessage("Exam registration updated!");
      setRefresh(!refresh);
      setConfirmExamRegistration(false);
    } catch (error) {
      setConfirmExamRegistration(false);
      console.error("Error submitting details:", error);
      alert("Internal server error!");
    }
    setConfirmSumbission(false);
  };

  //

  // useEffect(() => {
  //
  //
  //
  // },[original, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      if (prevUser) {
        return {
          ...prevUser,
          [name]: value,
        };
      }
      return null;
    });
  };

  async function handleDeleteRegistration() {
    try {
      const response = await deleteExamRegistration(rollno, token);
      setConfirmDeletion(false);
      setMessage("Exam registration deleted successfully");
      setOpen(true);
      setRefresh(!refresh);
    } catch (error) {
      setOpen(true);
      setMessage("Something went wrong! Please try again later");
    }
  }

  async function handleUpdate() {
    try {
      if (user) {
        const response = await updateDetails(user, token);
        setRefresh(true);
        setMessage("Successfully updated");
        setOpen(true);
        setRefresh(!refresh);
        setConfirmSumbission(false);
        setRollno("");
        setOriginal(null);
        setUser(null);
      }
    } catch (error) {
      setMessage("Something went wrong! Please try again later.");
    }
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      if (prevUser) {
        return {
          ...prevUser,
          [name]: value,
        };
      }
      return null;
    });
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    setUser((prevUser) => {
      if (prevUser) {
        return {
          ...prevUser,
          [name]: isNaN(parseInt(sanitizedValue))
            ? ""
            : parseInt(sanitizedValue),
        };
      }
      return null;
    });
  };

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) {
        setToken(auth.value);
      }
    });
  }, []);

  async function searchRollNo(rollno: string) {
    if (rollno) {
      try {
        const response = await getUserByRollNo(rollno, token);

        setUser(response[0]);
        setOriginal(response[0]);
      } catch (error) {
        setUser(null);
      }
    }
  }

  const handleSearch = useDebouncedCallback((roll) => {
    searchRollNo(roll);
  }, 300);

  return (
    <div className="sm:pl-[300px] sm:mt-[100px] flex items-center flex-col mt-[140px] w-full px-2 sm:pr-10">
      <div>
        <div
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   searchRollNo(rollno);
          // }}
          className="flex space-x-2 "
        >
          <TextField
            size="medium"
            value={rollno}
            onChange={(e) => {
              setRollno(e.target.value);
              handleSearch(e.target.value);
            }}
            label="Enter Roll No"
          />
          {/* <Button type="submit" variant="contained">
            Search
          </Button> */}
        </div>
      </div>

      {user && data && user.emailid !== null && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmSumbission(true);
          }}
          className="flex  w-[70vw] flex-col items-center "
        >
          <div className=" mt-6 md:w-full">
            <div className="bg-dseublue py-2 px-6 rounded shadow w-full  my-6 flex flex-col sm:flex-row items-center justify-between  text-white">
              <img
                className="rounded-full object-cover"
                style={{ width: 50, height: 50, borderRadius: "50%" }}
                alt="user"
                src={`${process.env.NEXT_PUBLIC_PHOTO_URL}/` + user?.photo}
                key={user?.rollno}
              />

              <div>
                <h1 className="text-xl font-bold">{user?.name}</h1>
              </div>
              <div className="text-center sm:text-right">
                <p className="font-bold">Roll Number:</p>
                <p>{user?.rollno}</p>
                <p className="font-bold">Semester: </p>
                <p>{user?.semester}</p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 w-full md:w-full shadow-sm">
            <div className="bg-white md:w-full py-2 px-6 rounded shadow my-6 flex flex-col sm:flex-row items-start justify-between  text-gray-700">
              <h2 className="text-xl font-bold mb-4 w-1/2">Personal Details</h2>
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center mb-2">
                    <PersonIcon className="mr-2" />
                    <p>
                      <span className="font-bold">Name:</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="name"
                        value={user.name}
                        disabled
                        onChange={handleChange}
                      />
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <PersonIcon className="mr-2" />
                    <p>
                      <span className="font-bold">{"Father's Name:"}</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="father"
                        value={user.father}
                        onChange={handleChange}
                      />
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <PersonIcon className="mr-2" />
                    <p>
                      <span className="font-bold">{"Mother's Name:"}</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="mother"
                        value={user.mother}
                        onChange={handleChange}
                      />
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <PhoneIcon className="mr-2" />
                    <p>
                      <span className="font-bold">Mobile Number:</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="phone"
                        value={user.phone}
                        onChange={handleNumericInputChange}
                        type="text"
                        inputProps={{
                          maxLength: 10, // Set maximum length to 12
                          pattern: "\\d{10}", // Pattern for exactly 12 digits
                        }}
                      />
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <CreditCardRoundedIcon className="mr-2" />
                    <p>
                      <span className="font-bold">Aadhar Card:</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="aadhar"
                        value={user.aadhar}
                        type="text"
                        onChange={handleNumericInputChange}
                        inputProps={{
                          maxLength: 12,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                      />
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <Face6RoundedIcon className="mr-2" />
                    <p>
                      <span className="font-bold">Gender:</span>
                      <br />
                      <Select
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        value={user.gender}
                        onChange={handleSelectChange}
                        name="gender"
                        variant="filled"
                      >
                        <MenuItem value="male">male</MenuItem>
                        <MenuItem value="female">female</MenuItem>
                        <MenuItem value="other">other</MenuItem>
                      </Select>
                    </p>
                  </div>

                  <div className="flex mb-2">
                    <VpnKeyIcon className="mr-2" />
                    <p>
                      <span className="font-bold">abc_id:</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="abc_id"
                        value={user.abc_id}
                        onChange={handleNumericInputChange}
                        inputProps={{
                          maxLength: 12,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        type="text"
                      />
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <MailIcon className="mr-2" />
                    <p>
                      <span className="font-bold">Email:</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="emailid"
                        value={user.emailid}
                        onChange={handleChange}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 w-full md:w-full shadow-sm">
              <div className="bg-white md:w-full py-2 px-6 rounded shadow  my-6 flex flex-col sm:flex-row items-start justify-between text-gray-700">
                <h2 className="text-xl font-bold mb-4 w-1/2">
                  University Details
                </h2>
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex mb-2">
                      <SchoolIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Campus Name:</span>
                        <br />
                        <Select
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          value={user.campus}
                          onChange={handleSelectChange}
                          name="campus"
                          // sx={{ width: "74% !important" }}
                          sx={{ width: 150 }}
                          variant="filled"
                        >
                          {Object.keys(data).map((campus) => (
                            <MenuItem key={campus} value={campus}>
                              {campus}
                            </MenuItem>
                          ))}
                        </Select>
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <BookIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Program Type:</span>
                        <br />
                        <Select
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          value={user.program_type}
                          onChange={handleSelectChange}
                          // sx={{ width: "100% !important" }}
                          name="program_type"
                          sx={{ width: 150 }}
                          variant="filled"
                        >
                          {user.campus !== "" &&
                            Object.keys(data[user.campus])?.map(
                              (programType) => (
                                <MenuItem key={programType} value={programType}>
                                  {programType}
                                </MenuItem>
                              )
                            )}
                        </Select>
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <ClassIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Program Name:</span>
                        <br />
                        <Select
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          value={user.program}
                          onChange={handleSelectChange}
                          name="program"
                          sx={{ width: 150 }}
                          // sx={{maxWidth: "50%"}}
                          // sx={{ maxWidth: 200, }} // Adjust the value as needed
                          variant="filled"
                        >
                          {data[user.campus][user.program_type] &&
                            Object.keys(
                              data[user.campus][user.program_type]
                            )?.map((program: string) => (
                              <MenuItem key={program} value={program}>
                                {program}
                              </MenuItem>
                            ))}
                        </Select>
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <PersonIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Roll Number:</span>
                        <br />
                        <TextField
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          variant="filled"
                          name="rollno"
                          value={user.rollno}
                          onChange={handleChange}
                          disabled
                        />
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <CalendarTodayIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Semester:</span>
                        <br />
                        <Select
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          value={user?.semester.toString()}
                          onChange={(e) => {
                            setUser({
                              ...user,
                              semester: parseInt(e.target.value),
                            });
                          }}
                          name="Semester"
                          sx={{ width: 150 }}
                          variant="filled"
                        >
                          {data[user.campus][user.program_type] &&
                            data[user.campus][user.program_type][
                              user.program
                            ] &&
                            data[user.campus][user.program_type][
                              user.program
                            ]?.map((semester: string, key) => (
                              <MenuItem key={key} value={semester}>
                                {semester}
                              </MenuItem>
                            ))}
                        </Select>
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <PersonIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Role:</span>
                        <br />
                        <TextField
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          variant="filled"
                          name="role"
                          value="Student"
                          disabled
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!chosen && (
              <div className="w-full">
                <Typography
                  className="text-center text-2xl font-bold"
                  variant="body1"
                >
                  Exam Registration
                </Typography>
                <Typography className="text-center w-full my-4" variant="body1">
                  <b>Course Types: </b>CC - Compulsory Course, PE - Program
                  Elective, OE - Open Elective
                </Typography>
                <div className="py-2 px-6 rounded shadow  my-6 flex flex-col w-full sm:flex-row items-center justify-between ">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle1">
                            Course Name
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">
                            Course Code
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">
                            Course Type
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">Select</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subjectsData.map((subject, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography>{subject.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{subject.code}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{subject.type}</Typography>
                          </TableCell>
                          <TableCell>
                            {subject.type === "CC" ? (
                              <Checkbox checked disabled />
                            ) : (
                              <Checkbox
                                checked={
                                  selectedSubjects[subject.code] || false
                                }
                                onChange={() => handleSelectSubject(subject)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-center">
                  <Typography></Typography>
                </div>
                <div className="py-2 px-6 rounded shadow mx-auto my-6 flex flex-col items-center justify-between w-full">
                  {generateSemesters().length > 0 && (
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={giveBacklogExams}
                            onChange={() => {
                              setGiveBacklogExams(!giveBacklogExams);
                              if (giveBacklogExams) {
                                setSelectedBacklogs([]);
                              }
                            }}
                          />
                        }
                        label="Register for Reappear Exams?"
                      />
                    </FormGroup>
                  )}
                  {giveBacklogExams && (
                    <div className="w-full">
                      {generateSemesters().map((semester) => (
                        <Accordion key={semester}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                              Semester {semester}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ width: "50%" }}>
                                    <Typography>Course Name</Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "25%" }}>
                                    <Typography>Course Code</Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "25%" }}>
                                    <Typography>Select</Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {backlogsData
                                  .filter(
                                    (backlog) =>
                                      backlog.semester === parseInt(semester)
                                  )
                                  .map((backlog, index) => (
                                    <TableRow key={index}>
                                      <TableCell style={{ width: "50%" }}>
                                        <Typography>
                                          {backlog.subject}
                                        </Typography>
                                      </TableCell>
                                      <TableCell style={{ width: "25%" }}>
                                        <Typography>
                                          {backlog.subjectCode}
                                        </Typography>
                                      </TableCell>
                                      <TableCell style={{ width: "25%" }}>
                                        <Checkbox
                                          checked={selectedBacklogs.some(
                                            (b) =>
                                              b.subjectCode ===
                                                backlog.subjectCode &&
                                              b.semester === parseInt(semester)
                                          )}
                                          onChange={() =>
                                            handleSelectBacklog(backlog)
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-2 mb-5">
                  <Button
                    onClick={handlePreview}
                    variant="contained"
                    size="large"
                    // style={{ backgroundColor: "#0066ff", color: "#ffffff" }}
                  >
                    PREVIEW AND REGISTER
                  </Button>
                </div>
              </div>
            )}
            {chosen && (
              <>
                <Typography className=" text-xl text-center p-2 w-full">
                  {" "}
                  Selected Subjects
                </Typography>
                <Typography className="text-center" variant="body1">
                  <b>Course Types: </b>CC - Compulsory Course, PE - Program
                  Elective, OE - Open Elective
                </Typography>
                <div className="py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between ">
                  <Table sx={{ "& td, & th": { padding: "20px" } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle1">Course</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">
                            Course Code
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1">
                            Course Type
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedSub.map((subject, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography>{subject.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{subject.code}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{subject.type}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
            <Button
              onClick={() => {
                setConfirmDeletion(true);
              }}
              className="flex items-center justify-center space-x-2"
              color="error"
            >
              {" "}
              <div>
                {" "}
                <DeleteForever className="scale-75" />
              </div>
              <div> Delete Exam Registration</div>
            </Button>
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={deepEqual(original, user)}
          >
            Apply Changes
          </Button>
        </form>
      )}

      {!user && (
        <Typography variant="h6" className=" my-4" component="h2">
          Roll No not found!
        </Typography>
      )}
      {user && user.emailid === null && (
        <div className="my-8 flex justify-between shadow border p-6 rounded-md w-[550px]">
          <div className="">
            <div className="font-bold text-xl">{user.name}</div>
            <div className="text-lg">{user.rollno}</div>
          </div>
          <div className="">
            <div className="text-red-500 font-medium ">Not Registered Yet</div>
          </div>
        </div>
      )}
      <Dialog
        open={previewSelection}
        fullWidth
        maxWidth="md"
        onClose={() => setPreviewSelection(false)}
      >
        <DialogTitle>Preview Selection</DialogTitle>
        <DialogContent className="flex flex-col">
          <div>
            <Typography variant="h6">Selected Courses:</Typography>
            <ul>
              {getSelectedSubjects().map((subject, index) => (
                <li key={index}>
                  {subject.name} - {subject.code}
                </li>
              ))}
            </ul>
          </div>
          {selectedBacklogs.length > 0 && (
            <div>
              <Typography variant="h6">Selected Reappear Exams:</Typography>
              <ul>
                {selectedBacklogs.map((backlog, index) => (
                  <li key={index}>
                    {backlog.subject} - {backlog.subjectCode}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={confirmSelection}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
          <Button
            onClick={() => setPreviewSelection(false)}
            variant="outlined"
            color="primary"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmSubmission}
        onClose={() => setConfirmSumbission(false)}
      >
        <DialogTitle> Are you sure you want to submit the details?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <Typography component="span" variant="body1" fontWeight="bold">
              NOTE:
            </Typography>

            {
              " If Campus, Program or Semester is changed, then current exam registrations will be deleted."
            }
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleUpdate} color="primary">
            Submit
          </Button>
          <Button onClick={() => setConfirmSumbission(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeletion} onClose={() => setConfirmDeletion(false)}>
        <DialogTitle> Delete Exam Registration</DialogTitle>
        <DialogContent>
          Are you sure you want to delete Exam Registration?
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDeleteRegistration} color="primary">
            Submit
          </Button>
          <Button onClick={() => setConfirmDeletion(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => {
          setOpen(false);
        }}
        message={message}
      />
      <Snackbar
        open={warning}
        autoHideDuration={6000}
        onClose={() => {
          setWarning(false);
        }}
      >
        <Alert
          onClose={() => {
            setWarning(false);
          }}
          severity="error"
          variant="filled"
        >
          Please select all electives before submitting!
        </Alert>
      </Snackbar>
      <Dialog
        open={confirmExamRegistration}
        onClose={() => setConfirmExamRegistration(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to submit the details?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitDetails} color="primary">
            Submit
          </Button>
          <Button
            onClick={() => setConfirmExamRegistration(false)}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
