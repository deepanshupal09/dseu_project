"use client";
import React, { useEffect, useState } from "react";
import Header from "../dashboard/Header";
import Navbar from "../dashboard/Navbar";
import {
  Typography,
  Grid,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { Deselect, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { getAuth } from "../../actions/cookie";
import { parseJwt } from "../../actions/utils";
import {
  addExamRegisterations,
  fetchCoursesByRollNo,
  fetchExamControl,
  fetchExamRegisterations,
  fetchUserByRollno,
} from "../../actions/api";
import { useRouter } from "next/navigation";
import { StudentDetails } from "../profile/page";

interface ProfDetails {
  username: string;
  rollNumber: string;
  semester: number;
  campusName: string;
  programName: string;
}

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

export default function Home() {
  const [previewSelection, setPreviewSelection] = useState(false);
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [warning, setWarning] = useState<boolean>(false);
  const [token, setToken] = useState("");
  useEffect(() => {
    getAuth().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setToken(auth?.value);
      setUser(temp.user);
    });
  }, []);

  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);
  const [backlogsData, setBacklogsData] = useState<Backlog[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjects>(
    {}
  );
  const [examControl, setExamControl] = useState<Boolean>(true);

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

  useEffect(() => {
    if (token !== "") {
      if (user?.campus !== undefined) {
        fetchExamControl(
          token,
          user?.campus,
          user?.program,
          user?.semester.toString(),
          user?.program_type
        )
          .then((res) => {
            //
            setExamControl(res.exam_control);
          })
          .catch((error) => {});
      }
    }
  }, [token]);

  useEffect(() => {
    function validateSelectedSubjects() {
        const selectedSubjects = getSelectedSubjects();
        const selectedTypes = new Set(selectedSubjects.map((subject) => subject.type));
        const availableTypes = new Set(subjectsData
            .filter((subject) => subject.type !== "CC")
            .map((subject) => subject.type)
        );

        // Convert Sets to Arrays for iteration
        const selectedTypesArray = Array.from(selectedTypes);
        const availableTypesArray = Array.from(availableTypes);

        // Check if every type in availableTypes is present in selectedTypes
        const missingTypes = availableTypesArray.some((type) => !selectedTypesArray.includes(type));

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

  const [selectedBacklogs, setSelectedBacklogs] = useState<Backlog[]>([]);
  const [giveBacklogExams, setGiveBacklogExams] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [chosen, setChosen] = useState(true);
  const [selectedSub, setSelectedSub] = useState<Subject[]>([]);

  useEffect(() => {
    if (user) {
      const rollno = user.rollno;
      fetchExamRegisterations(rollno, token)
        .then((res: any) => {
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
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const rollno = user.rollno;
        try {
          const courses = await fetchCoursesByRollNo(rollno, token);
          
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
  }, [user]);

  const handleSelectSubject = (subject: Subject) => {
    if (subject.type === "CC") {
      // CC subjects cannot be deselected
      return;
    }

    // Check if the subject is already selected
    const alreadySelected = selectedSubjects[subject.code];

    // Deselect any previously selected elective of the same type
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

    // If the subject is already selected, deselect it
    if (alreadySelected) {
      setSelectedSubjects((prevSelected) => ({
        ...prevSelected,
        [subject.code]: false,
      }));
    } else {
      // Deselect any previously selected elective of the same type
      // if (subject.type === "PE") {
      //   deselectPreviousElective("PE");
      // } else if (subject.type === "OE") {
      //   deselectPreviousElective("OE");
      // }

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
    setPreviewSelection(true);
  };

  const confirmSelection = () => {
    setPreviewSelection(false);
    setConfirmSubmission(true);
  };
  const router = useRouter();

  const [confirmSubmission, setConfirmSubmission] = useState(false);

  const submitDetails = async () => {
    const selectedSubjectCodes = getSelectedSubjects().map(({ code }) => code);
    const backlogSubjectCodes = selectedBacklogs.map(
      ({ subjectCode }) => subjectCode
    );
    const allSubjectCodes = [...selectedSubjectCodes, ...backlogSubjectCodes];

    try {
      const body = { rollno: user?.rollno, course_code: allSubjectCodes };
      const res = await addExamRegisterations(body, token);
      router.push("/dashboard");
      if (typeof res !== "number") {
        console.error("Unexpected response from server:", res);
      } else if (res === 500) {
        alert("Internal server error!");
      }
    } catch (error) {
      console.error("Error submitting details:", error);
      alert("Internal server error!");
    }
    setConfirmSubmission(false);
  };

  return (
    <>
      <div className="relative md:ml-60 mt-28 md:w-auto">
        <div className="bg-dseublue py-2 px-6 rounded shadow mx-auto mt-16 mb-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl text-white">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6} md={7} lg={8}>
              <div className="flex items-center">
                {/* <Avatar>{prof1.photo}</Avatar> */}
                <img
                  className="rounded-full object-cover"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                  alt="user"
                  src={`${process.env.NEXT_PUBLIC_PHOTO_URL}/${
                    user?.photo
                  }?${Date.now()}`}
                />
                <div className="ml-4">
                  <Typography variant="h6" component="h2">
                    {user?.name}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Roll Number: {user?.rollno}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Semester: {user?.semester}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={5} lg={4}>
              <div className="text-right">
                <Typography variant="body1" component="p">
                  Campus: {user?.campus}
                </Typography>
                <Typography variant="body1" component="p">
                  Program: {user?.program}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className="text-center"></div>
        {/* Exam registration open */}
        {examControl && (
          <>
            {" "}
            {!chosen && (
              <>
                <Typography className="text-center" variant="body1">
                  <b>Course Types: </b>CC - Compulsory Course, PE - Program
                  Elective, OE - Open Elective
                </Typography>
                <div className="py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl">
                  <Table sx={{ "& td, & th": { padding: "8px" } }}>
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
                <div className="py-2 px-6 rounded shadow mx-auto my-6 flex flex-col items-center justify-between max-w-6xl">
                  {generateSemesters().length > 0 && (
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={giveBacklogExams}
                            onChange={() => {
                              setGiveBacklogExams(!giveBacklogExams);
                              if(giveBacklogExams) {
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
              </>
            )}
          </>
        )}
        {!examControl && (
          <>
            {!chosen && (
              <Typography className=" text-center text-xl p-2 ">
                {" "}
                Exam Registrations are closed now!
              </Typography>
            )}
          </>
        )}
        {/* Exam registration closed */}

        {chosen && (
          <>
            <Typography className=" text-xl text-center p-2 ">
              {" "}
              Selected Subjects
            </Typography>
            <Typography className="text-center" variant="body1">
              <b>Course Types: </b>CC - Compulsory Course, PE - Program
              Elective, OE - Open Elective
            </Typography>
            <div className="py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl">
              <Table sx={{ "& td, & th": { padding: "20px" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">Course</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">Course Code</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">Course Type</Typography>
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
      </div>

      <Dialog
        open={previewSelection}
        onClose={() => setPreviewSelection(false)}
        fullWidth
        maxWidth="md"
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
        open={confirmSubmission}
        onClose={() => setConfirmSubmission(false)}
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
          <Button onClick={() => setConfirmSubmission(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
