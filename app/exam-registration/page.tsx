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
} from "@mui/material";
import { getAuth } from "../actions/cookie";
import { parseJwt } from "../actions/utils";

export default function Home() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Profile", "Exam Registration", "Help"];
  const [user, setUser] = useState();
  const prof1 = {
    username: "Abhinav Mangalore",
    rollNumber: 41521001,
    semester: 5,
    campusName: "GB Pant Okhla - 1",
    programName: "B.Tech CSE",
  };
  useEffect(() => {
    getAuth().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setUser(temp.user);
      console.log(temp.user);
    });
  }, []);

  const subjectsData = [
    { name: "Universal Human Values", code: "BT-HS601", type: "Compulsory" },
    { name: "Computer Networks", code: "BT-CS-ES601", type: "Compulsory" },
    { name: "Machine Learning", code: "BT-CS-ES602", type: "Compulsory" },
    { name: "Web Engineering", code: "BT-CS-ES603", type: "Compulsory" },
    {
      name: "Introduction to scripting languages",
      code: "BT-CS-PE601",
      type: "Program Elective",
    },
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
    {
      subject: "Engg Mechanics",
      subjectCode: "BT-CS-ES103",
      examType: "Compulsory",
      semester: 1,
    },
    {
      subject: "DBMS",
      subjectCode: "BT-CS-ES601",
      examType: "Compulsory",
      semester: 3,
    },
    {
      subject: "Applied Physics",
      subjectCode: "BT-CS-ES601",
      examType: "Compulsory",
      semester: 2,
    },
    {
      subject: "Digital Circuits and Electronics",
      subjectCode: "BT-CS-ES601",
      examType: "Compulsory",
      semester: 3,
    },
    {
      subject: "Electronics Prac",
      subjectCode: "BT-CS-ES109",
      examType: "Program Elective",
      semester: 1,
    },
    {
      subject: "Web Engineering",
      subjectCode: "BT-CS-ES603",
      examType: "Compulsory",
      semester: 4,
    },
  ];

  const [selectedSubjects, setSelectedSubjects] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedBacklogs, setSelectedBacklogs] = useState<any[]>([]);
  const [giveBacklogExams, setGiveBacklogExams] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const handleSelectSubject = (subject: { code: string }) => {
    setSelectedSubjects((prevSelected) => ({
      ...prevSelected,
      [subject.code]: !prevSelected[subject.code],
    }));
  };

  const handleSelectBacklog = (backlog: any) => {
    setSelectedBacklogs((prevBacklogs) => {
      if (prevBacklogs.some((b) => b.subjectCode === backlog.subjectCode)) {
        return prevBacklogs.filter(
          (b) => b.subjectCode !== backlog.subjectCode
        );
      } else {
        return [...prevBacklogs, backlog];
      }
    });
  };

  const handleChangeSemester = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedSemester(event.target.value as string);
  };

  const generateSemesters = () => {
    const semesters: string[] = [];
    for (let i = 1; i < prof1.semester; i++) {
      if (prof1.semester % 2 === 0) {
        if (i % 2 === 0) {
          semesters.push(i.toString());
        }
      } else {
        if (i % 2 !== 0) {
          semesters.push(i.toString());
        }
      }
    }
    return semesters;
  };

  const filteredBacklogs = backlogsData.filter((backlog) => {
    if (!giveBacklogExams) return false;
    else {
      return backlog.semester.toString() === selectedSemester;
    }
  });

  const getSelectedSubjects = () => {
    return subjectsData.filter((subject) => selectedSubjects[subject.code]);
  };

  const handlePreview = () => {
    console.log("Selected Subjects:", getSelectedSubjects());
    console.log("Selected Backlogs:", selectedBacklogs);
  };

  return (
    <>
      <Header username={"Abhinav M"} />
      <Navbar />
      <div className="relative md:ml-60 mt-6 md:w-auto">
        <div className="bg-dseublue py-2 px-6 rounded shadow mx-auto mt-16 mb-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl text-white">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6} md={7} lg={8}>
              <div className="flex items-center">
                <Avatar>{prof1.username[0]}</Avatar>
                <div className="ml-4">
                  <Typography variant="h6" component="h2">
                    {prof1.username}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Roll Number: {prof1.rollNumber}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Semester: {prof1.semester}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={5} lg={4}>
              <div className="text-right">
                <Typography variant="body1" component="p">
                  Campus: {prof1.campusName}
                </Typography>
                <Typography variant="body1" component="p">
                  Program: {prof1.programName}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className="py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl">
          <Table sx={{ "& td, & th": { padding: "8px" } }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">Subject</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Subject Code</Typography>
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
                    <Checkbox
                      checked={selectedSubjects[subject.code] || false}
                      onChange={() => handleSelectSubject(subject)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center">
          <Typography><b>Backlogs</b></Typography>
        </div>
        <div className="py-2 px-6 rounded shadow mx-auto my-6 flex flex-col items-center justify-between max-w-6xl">
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={giveBacklogExams}
                  onChange={() => setGiveBacklogExams(!giveBacklogExams)}
                />
              }
              label="Register for Backlog Exams?"
            />
            {giveBacklogExams && (
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={selectedSemester}
                  onChange={handleChangeSemester}
                  disabled={!giveBacklogExams}
                >
                  {/* <MenuItem value="all">All Semesters</MenuItem> */}
                  {generateSemesters().map((semester) => (
                    <MenuItem key={semester} value={semester}>
                      Semester {semester}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </FormGroup>
          {giveBacklogExams && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Subject Code</TableCell>
                  <TableCell>Exam Type</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBacklogs.map((backlog, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography>{backlog.subject}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{backlog.subjectCode}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{backlog.examType}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{backlog.semester}</Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedBacklogs.includes(backlog)}
                        onChange={() => handleSelectBacklog(backlog)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-center">
          <Button onClick={handlePreview}>Preview Selection</Button>
        </div>
      </div>
    </>
  );
}
