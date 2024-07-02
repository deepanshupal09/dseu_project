import {
  checkDepartment,
  deleteBridgeDetails,
  fetchBridgeDetails,
  getUserByRollNo,
  insertIntoBridgeMarks,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { useData } from "@/contexts/DataContext";
import { Add, Delete, DeleteForever } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ProgramList {
  [key: string]: string[];
}

interface Course {
  course_name: string;
  course_code: string;
}

interface Student {
  name: string;
  rollno: string;
  program: string;
  semester: number;
}

interface User {
  emailid: string;
  role: string;
  campus: string;
}

interface Row {
  rollno: string;
  name: string;
  course: string;
  academicYear: string;
  marks: string;
}

type Error = {
  rollno: string;
  name: string;
  marks: string;
  course: string;
  academicYear: string;
  error: string;
};

function BridgeCoursesTable({
  academicYear,
  campus,
  course,
  marksControl,
}: {
  academicYear: string;
  campus: string;
  course: string;
  marksControl: boolean;
}) {
  const [rows, setRows] = useState<Row[]>([{ rollno: "", name: "", course: "", academicYear: "", marks: "" }]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const academic_year = ["2023-2024"];
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const course_code: { [key: string]: string } = {
    "Applied Mathematics-II": "FC-012",
    "Basic Sciences (Applied Chemistry)": "FC-1-CH051",
    "Basic Sciences (Applied Physics)": "FC-1-PH051",
  };
  const [errors, setErrors] = useState<Error[]>([]);
  const [errorDialog, setErrorDialog] = useState(false);
  const [del, setDel] = useState(false);
  const [delIndex, setDelIndex] = useState(0);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [freeze, setFreeze] = useState(false);
  const [columns, setColumns] = useState([
    { id: "name", label: "Name", minWidth: 100 },
    { id: "rollno", label: "Roll No", minWidth: 70 },
    { id: "marks", label: "Marks (Out of 100)", minWidth: 100 },
  ]);
  useEffect(() => {
    console.log("use effect");
    if (marksControl && marksControl === true && !freeze && !columns.find((column) => column.id === "actions")) {
      console.log("inside if");
      let newColumns = [
        { id: "name", label: "Name", minWidth: 100 },
        { id: "rollno", label: "Roll No", minWidth: 70 },
        { id: "marks", label: "Marks (Out of 100)", minWidth: 100 },
        { id: "actions", label: "Actions", minWidth: 100 },
      ];
      setColumns(newColumns);
    } else {
      console.log("inside else");
      if (columns.find((column) => column.id === "actions")) {
        console.log("inside else if");
        let newColumns = [
          { id: "name", label: "Name", minWidth: 100 },
          { id: "rollno", label: "Roll No", minWidth: 70 },
          { id: "marks", label: "Marks (Out of 100)", minWidth: 100 }
        ];
        setColumns(newColumns);
      }
    }
  }, [freeze]);

  useEffect(() => {
    if (user) {
      fetchBridgeDetails(token, user?.emailid, course_code[course], academicYear)
        .then((res) => {
          console.log("brige details: ", res);
          const newRows = res.map((row: { rollno: string; marks: string; name: string }) => {
            return { ...row, academicYear: academicYear, course: course };
          });
          setRows(newRows);
          setFreeze(res[0].freeze);
        })
        .catch((error) => {
          console.log("error fetching bridge details");
        });
    }
  }, [user]);

  useEffect(() => {
    getAuthAdmin().then(async (t: any) => {
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        setUser(data.user);
      }
    });
  }, []);

  const handleChangeRow = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { rollno: "", name: "", course: "", academicYear: "", marks: "" }]);
  };

  const deleteRow = async (index: number) => {
    const newRows = rows.filter((_, idx) => idx !== index);
    try {
      const res = await deleteBridgeDetails(token, rows[delIndex].rollno, course_code[rows[delIndex].course], academicYear);
      setAlert(true);
      setMessage(res.message);
      setDel(false);
    } catch (error) {
      setAlert(true);
      setDel(false);
      setMessage("Internal Server Error");
    }

    setRows(newRows);
  };

  const handleSubmit = async () => {
    const data = rows.map((row) => {
      return {
        ...row,
        academic_year: academicYear,
        course_code: course_code[course],
        freeze: false,
      };
    });

    console.log("handle Submit", data);
    const newErrors: Error[] = [];
    const rollNoTracker: { [key: string]: boolean } = {};

    data.forEach((row) => {
      if (row.name === "") {
        newErrors.push({ ...row, error: "Invalid roll no." });
      } else if (row.marks.trim() === "") {
        newErrors.push({ ...row, error: "Marks can not be empty!" });
      } else if (isNaN(parseInt(row.marks)) && row.marks.trim() !== "X" && row.marks.trim() !== "U") {
        newErrors.push({ ...row, error: `Marks can not be '${row.marks}'` });
      } else if (parseInt(row.marks) > 100) {
        newErrors.push({ ...row, error: `Marks can not be greater than 100` });
      } else if (parseInt(row.marks) < 0) {
        newErrors.push({ ...row, error: `Marks can not be negative!` });
      } else if (rollNoTracker[row.rollno]) {
        newErrors.push({ ...row, error: "Duplicate Roll No." });
      } else {
        rollNoTracker[row.rollno] = true;
      }
    });

    setErrors(newErrors);
    if (newErrors.length > 0) {
      setErrorDialog(true);
    } else {
      try {
        const res = await insertIntoBridgeMarks(token, data);
        setAlert(true);
        setMessage(res.message);
      } catch (error) {
        setAlert(true);
        setMessage("Internal Server Error");
      }
    }
  };

  const handleSearch = async (rollno: string, index: number) => {
    console.log("Searching for rollno:", rollno);
    if (user) {
      try {
        console.log(1);
        const res = await checkDepartment(token, rollno, user.emailid);
        console.log(2);
        console.log("res: ", res.name);
        const newRows = [...rows];
        // console.log("res")
        if (res.name) {
          newRows[index].name = res.name;
        } else {
          newRows[index].name = "";
        }
        setRows(newRows);
      } catch (error) {
        console.log("Error fetching details of rollno", error);
      }
    } else {
      console.log("error");
    }
  };

  const handleFreeze = async () => {
    const data = rows.map((row) => {
      return {
        ...row,
        academic_year: academicYear,
        course_code: course_code[course],
        freeze: true,
      };
    });

    console.log("handle freeze", data);
    const newErrors: Error[] = [];
    const rollNoTracker: { [key: string]: boolean } = {};

    data.forEach((row) => {
      if (row.name === "") {
        newErrors.push({ ...row, error: "Invalid roll no." });
      } else if (row.marks.trim() === "") {
        newErrors.push({ ...row, error: "Marks can not be empty!" });
      } else if (isNaN(parseInt(row.marks)) && row.marks.trim() !== "X" && row.marks.trim() !== "U") {
        newErrors.push({ ...row, error: `Marks can not be '${row.marks}'` });
      } else if (parseInt(row.marks) > 100) {
        newErrors.push({ ...row, error: `Marks can not be greater than 100` });
      } else if (parseInt(row.marks) < 0) {
        newErrors.push({ ...row, error: `Marks can not be negative!` });
      } else if (rollNoTracker[row.rollno]) {
        newErrors.push({ ...row, error: "Duplicate Roll No." });
      } else {
        rollNoTracker[row.rollno] = true;
      }
    });

    setErrors(newErrors);
    if (newErrors.length > 0) {
      setErrorDialog(true);
    } else {
      try {
        const res = await insertIntoBridgeMarks(token, data);
        setAlert(true);
        setFreeze(true);
        setMessage(res.message);
      } catch (error) {
        setAlert(true);
        setMessage("Internal Server Error");
      }
    }
  };
  const handleUnfreeze = async () => {
    const data = rows.map((row) => {
      return {
        ...row,
        academic_year: academicYear,
        course_code: course_code[course],
        freeze: false,
      };
    });

    console.log("handle unfreeze", data);
    const newErrors: Error[] = [];
    const rollNoTracker: { [key: string]: boolean } = {};

    data.forEach((row) => {
      if (row.name === "") {
        newErrors.push({ ...row, error: "Invalid roll no." });
      } else if (row.marks.trim() === "") {
        newErrors.push({ ...row, error: "Marks can not be empty!" });
      } else if (isNaN(parseInt(row.marks)) && row.marks.trim() !== "X" && row.marks.trim() !== "U") {
        newErrors.push({ ...row, error: `Marks can not be '${row.marks}'` });
      } else if (parseInt(row.marks) > 100) {
        newErrors.push({ ...row, error: `Marks can not be greater than 100` });
      } else if (parseInt(row.marks) < 0) {
        newErrors.push({ ...row, error: `Marks can not be negative!` });
      } else if (rollNoTracker[row.rollno]) {
        newErrors.push({ ...row, error: "Duplicate Roll No." });
      } else {
        rollNoTracker[row.rollno] = true;
      }
    });

    setErrors(newErrors);
    if (newErrors.length > 0) {
      setErrorDialog(true);
    } else {
      try {
        const res = await insertIntoBridgeMarks(token, data);
        setAlert(true);
        setFreeze(false);
        setMessage(res.message);
      } catch (error) {
        setAlert(true);
        setMessage("Internal Server Error");
      }
    }
  };

  const debouncedHandleSearch = useDebouncedCallback((rollno: string, index: number) => {
    handleSearch(rollno, index);
  }, 1000);

  return (
    <div>
      <div className="w-full flex space-x-3 justify-end my-4">
        {marksControl && !freeze && (
          <>
            <Button variant="contained" onClick={handleSubmit}>
              SAVE
            </Button>
            <Button variant="contained" onClick={handleFreeze}>
              FREEZE
            </Button>
          </>
        )}
        {freeze && user?.role === "super" && (
          <>
            <Button variant="contained" onClick={handleUnfreeze}>
              UNFREEZE
            </Button>
          </>
        )}
      </div>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">
                  {marksControl && !freeze ? (
                    <>
                      {" "}
                      <TextField
                        id={`rollno-${index}`}
                        size="small"
                        required
                        value={row.rollno}
                        onChange={(e) => {
                          handleChangeRow(index, "rollno", e.target.value);
                          debouncedHandleSearch(e.target.value, index);
                        }}
                      />
                    </>
                  ) : (
                    <>{row.rollno}</>
                  )}
                </TableCell>
                <TableCell align="left">
                  {marksControl && !freeze ? (
                    <>
                      <TextField
                        id={`marks-${index}`}
                        size="small"
                        required
                        value={row.marks}
                        onChange={(e) => handleChangeRow(index, "marks", e.target.value)}
                      />
                    </>
                  ) : (
                    <> {row.marks} </>
                  )}
                </TableCell>
                {marksControl && !freeze && (
                  <>
                    <TableCell align="left">
                      <Button
                        onClick={() => {
                          setDel(true);
                          setDelIndex(index);
                        }}
                        disabled={rows.length === 1}
                        variant="text"
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteForever />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {marksControl && !freeze && (
        <Button variant="contained" color="primary" className="mt-5" onClick={addRow}>
          Add Row
        </Button>
      )}

      <Dialog open={errorDialog} maxWidth="md" fullWidth onClose={() => setErrorDialog(false)}>
        <DialogTitle>Errors in Marks Entry</DialogTitle>
        <DialogContent>
          {errors.map((error, index) => (
            <Typography key={index}>
              {`[${index}]: `} Error at <span className="font-bold">Roll No {error.rollno}</span>
              {error.error !== "Invalid roll no." && (
                <>
                  {" "}
                  , Name <span className="font-bold"> {error.name}</span>
                </>
              )}
              , <span className="font-bold">{error.error}</span>
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={del} onClose={() => setDel(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete these marks for Roll No: <strong> {rows[delIndex]?.rollno}</strong>, Name:{" "}
            <strong>{rows[delIndex]?.name}</strong> ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteRow(delIndex);
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
          <Button onClick={() => setDel(false)} variant="text" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alert} autoHideDuration={6000} onClose={() => setAlert(false)} message={message} />
    </div>
  );
}

export default BridgeCoursesTable;
