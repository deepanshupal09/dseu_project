"use client";
import React, { useEffect, useRef, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Button, { ButtonProps } from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  Snackbar,
} from "@mui/material";
import {
  ArrowDropDown,
  Cancel,
  ClearAll,
  CloudUpload,
  Download,
  Save,
} from "@mui/icons-material";
import { saveAs } from "file-saver";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { fetchInternalMarks, updateAggregateMarks, updateExternalMarks, updateInternalMarks } from "@/app/actions/api";

interface FileData {
  fileName: string;
  content: string;
}

type StudentType = {
  sno: number;
  rollno: string;
  name: string;
  marks: string;
};

type Error = {
  sno: number;
  rollno: string;
  name: string;
  marks: string;
  error: string;
};

export default function MarksTable({
  students,
  maxMarks,
  subjectType,
  campus,
  program_type,
  program,
  semester,
  course_code,
  academic_year,
  token
}: {
  students: StudentType[];
  maxMarks: number;
  subjectType: string;
  campus: string;
  program: string;
  program_type: string;
  semester: string;
  course_code: string;
  academic_year: string;
  token: string
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [errorDialog, setErrorDialog] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [studentList, setStudentList] = useState<StudentType[]>(students);
  const [errors, setErrors] = useState<Error[]>([]);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    setStudentList(students);
  }, [students]);



  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  function handleClear() {
    let temp: StudentType[] = [];
    studentList.map((student) => {
      temp.push({ ...student, marks: "" });
    });
    setStudentList(temp);
  }

  const downloadTemplate = () => {
    const headers = ["S. No", "Roll No", "Name", "Marks"];
    const rows = studentList.map((student) => [
      student.sno,
      student.rollno,
      student.name,
      "",
    ]);

    let csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    console.log(csvContent);

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, "template.csv");
  };

  const handleFiles = (file: File) => {
    if (file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target && typeof event.target.result === "string") {
          // Parse the CSV content
          setFileData({
            fileName: file.name,
            content: event.target.result,
          });
          const csvContent = event.target.result;
          const rows = csvContent.split("\n");

          // Skip the header row
          const studentData = rows.slice(1);
          const newData = studentList;

          console.log(studentData);

          if (studentData.length !== newData.length) {
            setAlert(true);
            setMessage(
              "Invalid CSV format(Missing rows)! Please download the CSV template from actions menu"
            );
            setFileData(null);
          } else {
            console.log("students : ", newData);
            let missing = 0;
            studentData.map((row) => {
              const rollno = row.split(",")[1];
              let exists = studentList.some(
                (student) => student.rollno === rollno
              );
              if (!exists) {
                missing++;
              }
            });

            if (missing > 0) {
              setAlert(true);
              setMessage(
                "Invalid CSV format(Missing Roll No)! Please download the CSV template from actions menu"
              );
              setFileData(null);
            } else {
              const updatedStudentList = studentData.map((row, index) => {
                const columns = row.split(",");
                return {
                  name:
                    studentList.find((student) => student.rollno === columns[1])
                      ?.name || "Unknown",
                  rollno: columns[1],
                  marks: columns[3],
                  sno: -1,
                };
              });
              updatedStudentList.sort((a, b) =>
                a.rollno.localeCompare(b.rollno)
              );
              updatedStudentList.map((student, index) => {
                student.sno = index + 1;
              });

              setStudentList(updatedStudentList);
            }
            // const;
          }
        }
      };
      reader.readAsText(file);
    } else {
      setAlert(true);
      setFileData(null);
      setMessage(
        "Invalid CSV format! Please download the CSV template from actions menu"
      );
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  interface Column {
    id: "sno" | "name" | "rollno" | "marks";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
  }

  const columns: readonly Column[] = [
    { id: "sno", label: "S.No ", minWidth: 50 },
    { id: "rollno", label: "Roll No", minWidth: 75 },
    { id: "name", label: "Name", minWidth: 75 },
    { id: "marks", label: `Marks (out of ${maxMarks})`, minWidth: 75 },
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  async function handleApplyChanges() {
    let errors: Error[] = [];
    studentList.map((student) => {
      if (isNaN(parseInt(student.marks)) && student.marks.trim() !== "A") {
        if (student.marks?.trim() === "") {
          errors.push({ ...student, error: `Marks can not be empty` });
        } else {
          errors.push({
            ...student,
            error: `Marks can not be '${student.marks}'`,
          });
        }
      } else if (parseInt(student.marks) > maxMarks) {
        errors.push({
          ...student,
          error: `Marks can not be larger than ${maxMarks}!`,
        });
      } else if (parseInt(student.marks) < 0) {
        errors.push({ ...student, error: "Marks can not be negative!" });
      }
    });
    setErrors(errors);
    if (errors.length > 0) {
      setErrorDialog(true);
    } else {
      if (maxMarks === 25) {
        const details = {
          campus: campus,
          program_type: program_type,
          program: program,
          semester: semester,
          course_code: course_code,
          academic_year: academic_year,
          rollno: studentList.map(student => student.rollno),
          marks: studentList.map(student => student.marks),
          freeze_marks: true,
        }
        const res = await updateInternalMarks(token, details);
        console.log("res: ", res)
      }
      if (maxMarks === 75) {
        const details = {
          campus: campus,
          program_type: program_type,
          program: program,
          semester: semester,
          course_code: course_code,
          academic_year: academic_year,
          rollno: studentList.map(student => student.rollno),
          marks: studentList.map(student => student.marks),
          freeze_marks: true,
        }
        const res = await updateExternalMarks(token, details);
        console.log("res: ", res)
      }
  
      if (maxMarks === 100) {
        const details = {
          campus: campus,
          program_type: program_type,
          program: program,
          semester: semester,
          course_code: course_code,
          academic_year: academic_year,
          rollno: studentList.map(student => student.rollno),
          marks: studentList.map(student => student.marks),
          freeze_marks: true,
        }
        const res = await updateAggregateMarks(token, details);
        console.log("res: ", res)
      }
    }
    // console.log("error: ", errors)
  }

  async function handleSaveChanges() {
    if (maxMarks === 25) {
      const details = {
        campus: campus,
        program_type: program_type,
        program: program,
        semester: semester,
        course_code: course_code,
        academic_year: academic_year,
        rollno: studentList.map(student => student.rollno),
        marks: studentList.map(student => student.marks),
        freeze_marks: false,
      }
      const res = await updateInternalMarks(token, details);
      console.log("res: ", res)
    }
    if (maxMarks === 75) {
      const details = {
        campus: campus,
        program_type: program_type,
        program: program,
        semester: semester,
        course_code: course_code,
        academic_year: academic_year,
        rollno: studentList.map(student => student.rollno),
        marks: studentList.map(student => student.marks),
        freeze_marks: false,
      }
      const res = await updateExternalMarks(token, details);
      console.log("res: ", res)
    }

    if (maxMarks === 100) {
      const details = {
        campus: campus,
        program_type: program_type,
        program: program,
        semester: semester,
        course_code: course_code,
        academic_year: academic_year,
        rollno: studentList.map(student => student.rollno),
        marks: studentList.map(student => student.marks),
        freeze_marks: false,
      }
      const res = await updateAggregateMarks(token, details);
      console.log("res: ", res)
    }
  }


  const handleMarksChange = (event: any, index: number) => {
    const newStudentList = [...studentList];
    newStudentList[index].marks = event.target.value;
    setStudentList(newStudentList);
  };

  return (
    <div className="space-y-5">
      <div className="flex">
        {anchorEl && (
          <Menu
            id="actions-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            container={anchorEl && (anchorEl?.parentNode as HTMLElement)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleClear}>
              <ListItemIcon>
                <ClearAll fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Clear" />
            </MenuItem>
            <MenuItem onClick={downloadTemplate}>
              <ListItemIcon>
                <Download fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Download template" />
            </MenuItem>
            <MenuItem onClick={handleSaveChanges}>
              <ListItemIcon>
                <Save fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Save Changes" />
            </MenuItem>
            <MenuItem onClick={handleApplyChanges}>
              <ListItemIcon>
                <CloudUpload fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Freeze Changes" />
            </MenuItem>
          </Menu>
        )}
      </div>
      <div
        className={`w-full h-[25vh] bordered rounded-3xl space-y-3 text-sm font-normal flex flex-col justify-center items-center ${dragActive ? "bg-slate-100" : ""
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!fileData && (
          <>
            <div className="text-lg text-gray-700 font-medium">
              Drag and drop your CSV here...
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => fileInput.current?.click()}
              >
                Browse files
              </Button>
              <input
                ref={fileInput}
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
            </div>
          </>
        )}
        {fileData && (
          <div className=" text-lg p-4 border relative rounded-2xl ">
            <div
              onClick={() => {
                setFileData(null);
              }}
            >
              <Cancel className="scale-75 absolute cursor-pointer  -right-[5px] -top-[7px] text-gray-400" />{" "}
            </div>
            {fileData.fileName}
          </div>
        )}
      </div>
      <div className="w-full flex justify-end">
        <Button
          endIcon={<ArrowDropDown className="scale-125" />}
          onClick={handleMenuOpen}
        >
          Actions
        </Button>
      </div>
      <div>
        <div>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.sno}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "marks" ? (
                                <TextField
                                  value={value}
                                  onChange={(e) =>
                                    handleMarksChange(e, rowIndex)
                                  }
                                  size="small"
                                />
                              ) : column.format && typeof value === "number" ? (
                                column.format(value)
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={studentList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
      <Dialog
        open={errorDialog}
        maxWidth="md"
        fullWidth
        onClose={() => setErrorDialog(false)}
      >
        <DialogTitle>Errors in Marks Entry</DialogTitle>
        <DialogContent>
          {/* <Typography variant="body1">Errors:</Typography> */}
          {errors.map((error, index) => (
            <Typography key={index}>
              {`[${index}]: `} Error at{" "}
              <span className="font-bold">S.No {error.sno}</span> ,Name{" "}
              <span className="font-bold"> {error.name}</span>,{" "}
              <span className="font-bold">{error.error}</span>
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(false)} color="primary">
            Close
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
    </div>
  );
}
