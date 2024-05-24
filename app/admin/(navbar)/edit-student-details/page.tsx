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
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { getUserByRollNo, updateDetails } from "@/app/actions/api";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  campusList,
  programListByType,
  programTypeList,
} from "@/app/getuserdetails/[rollno]/page";

export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || typeof obj1 !== "object" || obj2 == null || typeof obj2 !== "object") {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function Home() {
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [rollno, setRollno] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [original, setOriginal] = useState<StudentDetails | null>(null);
  const [confirmSubmission, setConfirmSumbission] = useState(false);

  // useEffect(() => {
  //   console.log("original: ",original)
  //   console.log("user: ",user)  
  //   console.log(deepEqual(original, user));  // Should log: true
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

  async function handleUpdate() {
    try {
      if (user) {
        const response = await updateDetails(user, token);
        console.log("response: ", response);
        setMessage("Successfully updated");
        setOpen(true);
        setConfirmSumbission(false);
        setRollno("");
        setOriginal(null);
        setUser(null);
      }
    } catch (error) {
      setMessage("Something went wrong! Please try again later.");
      console.log("error: ", error);
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
          [name]: isNaN(parseInt(sanitizedValue))?"":parseInt(sanitizedValue),
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
        console.log("response: ", response);
        setUser(response[0]);
        setOriginal(response[0])
      } catch (error) {
        console.log("error: ", error);
        setUser(null);
      }
    }
  }

  return (
    <div className="sm:pl-[300px] sm:mt-[100px] flex items-center flex-col mt-[140px] w-full px-2 sm:pr-10">
      <div>
        <form
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
              searchRollNo(e.target.value);
            }}
            label="Enter Roll No"
          />
          {/* <Button type="submit" variant="contained">
            Search
          </Button> */}
        </form>
      </div>
      {user && (
        <div className="flex  w-[70vw] flex-col items-center ">
          <div className=" mt-6 md:w-full">
            <div className="bg-dseublue py-2 px-6 rounded shadow w-full  my-6 flex flex-col sm:flex-row items-center justify-between  text-white">
              <img
                className="rounded-full object-cover"
                style={{ width: 50, height: 50, borderRadius: "50%" }}
                alt="user"
                src={"https://exam.dseu.ac.in/" + user?.photo}
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
                          pattern: "\\d{12}", // Pattern for exactly 12 digits
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
                          {campusList.map((campus) => (
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
                          {programTypeList.map((programType) => (
                            <MenuItem key={programType} value={programType}>
                              {programType}
                            </MenuItem>
                          ))}
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
                          {programListByType[user.program_type].map(
                            (program: string) => (
                              <MenuItem key={program} value={program}>
                                {program}
                              </MenuItem>
                            )
                          )}
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
                        <TextField
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          variant="filled"
                          name="semester"
                          value={user.semester}
                          onChange={handleNumericInputChange}
                          type="text"
                          inputProps={{
                            maxLength: 1,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          }}
                        />
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
          </div>
          <Button
            onClick={() => {
              setConfirmSumbission(true);
            }}
            variant="contained"
            disabled={deepEqual(original,user)}
          >
            Apply Changes
          </Button>
        </div>
      )}

      {/* {!user && (
        <Typography variant="h6" className=" my-4" component="h2">
          Roll No not found!
        </Typography>
      )} */}
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
            
            {" If Campus, Program or Semester is changed, then current exam registrations will be deleted."}
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

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => {
          setOpen(false);
        }}
        message={message}
      />
    </div>
  );
}

export default Home;
