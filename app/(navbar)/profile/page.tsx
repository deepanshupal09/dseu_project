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
import { getAuth } from "../../actions/cookie";
import { parseJwt } from "../../actions/utils";
import {
  fetchExamControl,
  fetchUserByRollno,
  updateDetails,
} from "@/app/actions/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  campusList,
  programListByType,
  programTypeList,
} from "@/app/getuserdetails/[rollno]/page";
import { deepEqual } from "@/app/admin/(navbar)/edit-student-details/page";

export interface StudentDetails {
  name: string;
  rollno: string;
  program: string;
  semester: number;
  phone: string;
  aadhar?: string; // Optional field
  abc_id?: string; // Optional field
  alternate_phone?: string | null; // Optional field which can be null
  campus: string;
  emailid: string;
  father: string;
  gender: string;
  guardian: string | null; // Optional field which can be null
  last_modified: string;
  mother: string;
  password: string;
  photo: string;
  program_type: string;
  pwbd_certificate: string;
  year_of_admission: string;
  date_of_birth: string;
}

export default function Home() {
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [photoPath, setPhotoPath] = useState(""); // Default photo path in state
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [original, setOriginal] = useState<StudentDetails | null>(null);
  const [confirmSubmission, setConfirmSumbission] = useState(false);
  const [token, setToken] = useState<string>("");
  const [examControl, setExamControl] = useState<boolean>(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (token !== "") {
      if (user?.campus !== undefined) {
        fetchExamControl(
          token,
          user?.campus,
          user?.program,
          user?.semester.toString()
        )
          .then((res) => {
            // console.log("exam: ")
            setExamControl(res.exam_control);
          })
          .catch((error) => {
            console.log("error: ", error);
          });
      }
    }
  }, [token]);

  useEffect(() => {
    console.log("exam_control: ", examControl);
    setEdit(examControl);
  }, [examControl]);

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
          [name]: isNaN(parseInt(sanitizedValue))
            ? ""
            : parseInt(sanitizedValue),
        };
      }
      return null;
    });
  };

  useEffect(() => {
    getAuth().then((auth) => {
      if (auth) {
        setToken(auth.value);
        const temp = parseJwt(auth?.value as string);
        fetchUserByRollno(temp.user.rollno, auth.value)
          .then((res) => {
            console.log("user: ", res[0]);
            setUser(res[0]);
            setOriginal(res[0]);
            // setPhotoPath(res.)
          })
          .catch((error: any) => {
            console.log("error: ", error);
          });
        // console.log("user: ", temp.user)
        // setUser(temp.user);
        // setPhotoPath(temp.user.photo);
      }
    });
  }, []);

  return (
    <div className="max-sm:mt-[120px] mt-[120px]">
      <div className="sm:pl-[300px] sm:mt-[100px] flex flex-col  items-center mt-[140px] w-full px-2 sm:pr-10">
        {/* {!edit && (
          <>
            <div className="relative md:ml-60 mt-6 md:w-auto">
              <div className="bg-dseublue py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl text-white">
                <img
                  className="rounded-full object-cover"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                  alt="user"
                  src={user?.photo}
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

            <div className="relative md:ml-60 mt-8 w-full md:w-auto shadow-sm">
              <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
                <h2 className="text-xl font-bold mb-4 w-1/2">
                  Personal Details
                </h2>
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center mb-2">
                      <PersonIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Name:</span>
                        <br /> {user?.name}
                      </p>
                    </div>
                    <div className="flex items-center mb-2">
                      <PersonIcon className="mr-2" />
                      <p>
                        <span className="font-bold">{"Father's Name:"}</span>
                        <br /> {user?.father}
                      </p>
                    </div>
                    <div className="flex items-center mb-2">
                      <PersonIcon className="mr-2" />
                      <p>
                        <span className="font-bold">{"Mother's Name:"}</span>
                        <br /> {user?.mother}
                      </p>
                    </div>
                    <div className="flex items-center mb-2">
                      <PhoneIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Mobile Number:</span>
                        <br /> {user?.phone}
                      </p>
                    </div>
                    <div className="flex items-center mb-2">
                      <CreditCardRoundedIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Aadhar Card:</span>
                        <br /> {user?.aadhar}
                      </p>
                    </div>

                    <div className="flex items-center mb-2">
                      <Face6RoundedIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Gender:</span>
                        <br /> {user?.gender}
                      </p>
                    </div>
                    <div className="flex  mb-2">
                      <VpnKeyIcon className="mr-2" />
                      <p>
                        <span className="font-bold">abc_id:</span>
                        <br /> {user?.abc_id}
                      </p>
                    </div>

                    <div className="flex items-center mb-2">
                      <MailIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Email:</span>
                        <br /> {user?.emailid}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative md:ml-60 mt-8 w-full md:w-auto shadow-sm">
              <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
                <h2 className="text-xl font-bold mb-4 w-1/2">
                  University Details
                </h2>
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex  mb-2">
                      <SchoolIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Campus Name:</span>
                        <br /> {user?.campus}
                      </p>
                    </div>
                    <div className="flex  mb-2">
                      <BookIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Program Type:</span>
                        <br /> {user?.program_type}
                      </p>
                    </div>
                    <div className="flex  mb-2">
                      <ClassIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Program Name:</span>
                        <br /> {user?.program}
                      </p>
                    </div>
                    <div className="flex  mb-2">
                      <PersonIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Roll Number:</span>
                        <br /> {user?.rollno}
                      </p>
                    </div>
                    <div className="flex  mb-2">
                      <CalendarTodayIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Semester:</span>
                        <br /> {user?.semester}
                      </p>
                    </div>

                    <div className="flex  mb-2">
                      <PersonIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Role:</span>
                        <br /> Student
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )} */}
        {user && (
          <div>
            <div className="flex w-[70vw] max-sm:w-screen flex-col items-center ">
              <div className="mt-6 w-full">
                <div className="bg-dseublue py-2 px-6 rounded shadow w-full my-6 flex flex-col sm:flex-row items-center justify-between text-white">
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
                    <p className="h-[24px]">{user?.semester}</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-8 w-full sm:w-full shadow-sm">
                <div className="bg-white md:w-full py-2 px-6 rounded shadow my-6 flex flex-col sm:flex-row items-start justify-between text-gray-700">
                  <h2 className="text-xl font-bold mb-4 w-1/2">
                    Personal Details
                  </h2>
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center mb-2">
                        <PersonIcon className="mr-2" />
                        <p>
                          <span className="font-bold">Name:</span>
                          <br />
                          {edit ? (
                            <TextField
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              variant="filled"
                              name="name"
                              value={user?.name}
                              disabled
                              onChange={handleChange}
                            />
                          ) : (
                            <span>{user?.name}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        <PersonIcon className="mr-2" />
                        <p>
                          <span className="font-bold">{"Father's Name:"}</span>
                          <br />
                          {edit ? (
                            <TextField
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              variant="filled"
                              name="father"
                              value={user?.father}
                              onChange={handleChange}
                            />
                          ) : (
                            <span>{user?.father}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        <PersonIcon className="mr-2" />
                        <p>
                          <span className="font-bold">{"Mother's Name:"}</span>
                          <br />
                          {edit ? (
                            <TextField
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              variant="filled"
                              name="mother"
                              value={user?.mother}
                              onChange={handleChange}
                            />
                          ) : (
                            <span>{user?.mother}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        <PhoneIcon className="mr-2" />
                        <p>
                          <span className="font-bold">Mobile Number:</span>
                          <br />
                          {edit ? (
                            <TextField
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              variant="filled"
                              name="phone"
                              value={user?.phone}
                              onChange={handleNumericInputChange}
                              type="text"
                              inputProps={{
                                maxLength: 10,
                                pattern: "\\d{12}",
                              }}
                            />
                          ) : (
                            <span>{user?.phone}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        <CreditCardRoundedIcon className="mr-2" />
                        <p>
                          <span className="font-bold">Aadhar Card:</span>
                          <br />
                          {edit ? (
                            <TextField
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              variant="filled"
                              name="aadhar"
                              value={user?.aadhar}
                              type="text"
                              onChange={handleNumericInputChange}
                              inputProps={{
                                maxLength: 12,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                            />
                          ) : (
                            <span>{user?.aadhar}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        <Face6RoundedIcon className="mr-2" />
                        <p>
                          <span className="font-bold">Gender:</span>
                          <br />
                          {edit ? (
                            <Select
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              value={user?.gender}
                              onChange={handleSelectChange}
                              name="gender"
                              variant="filled"
                            >
                              <MenuItem value="male">male</MenuItem>
                              <MenuItem value="female">female</MenuItem>
                              <MenuItem value="other">other</MenuItem>
                            </Select>
                          ) : (
                            <span>{user?.gender}</span>
                          )}
                        </p>
                      </div>

                      <div className="flex mb-2">
                        <VpnKeyIcon className="mr-2" />
                        <p>
                          <span className="font-bold">abc_id:</span>
                          <br />
                          {edit ? (
                            <TextField
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              variant="filled"
                              name="abc_id"
                              value={user?.abc_id}
                              onChange={handleNumericInputChange}
                              inputProps={{
                                maxLength: 12,
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                              type="text"
                            />
                          ) : (
                            <span>{user?.abc_id}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center mb-2">
                        <MailIcon className="mr-2" />
                        <p>
                          <span className="font-bold">Email:</span>
                          <br />
                          {edit ? (
                            <TextField
                              hiddenLabel
                              className="mt-2"
                              size="small"
                              variant="filled"
                              name="emailid"
                              value={user?.emailid}
                              onChange={handleChange}
                            />
                          ) : (
                            <span>{user?.emailid}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-8 w-full md:w-full shadow-sm">
                  <div className="bg-white md:w-full py-2 px-6 rounded shadow my-6 flex flex-col sm:flex-row items-start justify-between text-gray-700">
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
                            {edit ? (
                              <Select
                                hiddenLabel
                                className="mt-2"
                                size="small"
                                value={user?.campus}
                                onChange={handleSelectChange}
                                name="campus"
                                sx={{ width: 150 }}
                                variant="filled"
                              >
                                {campusList.map((campus) => (
                                  <MenuItem key={campus} value={campus}>
                                    {campus}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              <span>{user?.campus}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex mb-2">
                          <BookIcon className="mr-2" />
                          <p>
                            <span className="font-bold">Program Type:</span>
                            <br />
                            {edit ? (
                              <Select
                                hiddenLabel
                                className="mt-2"
                                size="small"
                                value={user?.program_type}
                                onChange={handleSelectChange}
                                name="program_type"
                                sx={{ width: 150 }}
                                variant="filled"
                              >
                                {programTypeList.map((programType) => (
                                  <MenuItem
                                    key={programType}
                                    value={programType}
                                  >
                                    {programType}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              <span>{user?.program_type}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex mb-2">
                          <ClassIcon className="mr-2" />
                          <p>
                            <span className="font-bold">Program Name:</span>
                            <br />
                            {edit ? (
                              <Select
                                hiddenLabel
                                className="mt-2"
                                size="small"
                                value={user?.program}
                                onChange={handleSelectChange}
                                name="program"
                                sx={{ width: 150 }}
                                variant="filled"
                              >
                                {programListByType[
                                  user?.program_type as string
                                ]?.map((program: string) => (
                                  <MenuItem key={program} value={program}>
                                    {program}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              <span>{user?.program}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex mb-2">
                          <PersonIcon className="mr-2" />
                          <p>
                            <span className="font-bold">Roll Number:</span>
                            <br />
                            {edit ? (
                              <TextField
                                hiddenLabel
                                className="mt-2"
                                size="small"
                                variant="filled"
                                name="rollno"
                                value={user?.rollno}
                                onChange={handleChange}
                                disabled
                              />
                            ) : (
                              <span>{user?.rollno}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex mb-2">
                          <CalendarTodayIcon className="mr-2" />
                          <p>
                            <span className="font-bold">Semester:</span>
                            <br />
                            {edit ? (
                              <TextField
                                hiddenLabel
                                className="mt-2"
                                size="small"
                                variant="filled"
                                name="semester"
                                value={user?.semester}
                                onChange={handleNumericInputChange}
                                type="text"
                                inputProps={{
                                  maxLength: 1,
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                              />
                            ) : (
                              <span>{user?.semester}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex mb-2">
                          <PersonIcon className="mr-2" />
                          <p>
                            <span className="font-bold">Role:</span>
                            <br />
                            {edit ? (
                              <TextField
                                hiddenLabel
                                className="mt-2"
                                size="small"
                                variant="filled"
                                name="role"
                                value="Student"
                                disabled
                              />
                            ) : (
                              <span>Student</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {examControl && (
                <>
                  {edit && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setConfirmSumbission(true);
                        }}
                        variant="contained"
                        disabled={deepEqual(original, user)}
                      >
                        Apply Changes
                      </Button>{" "}
                      <Button
                        onClick={() => {
                          setEdit(false);
                        }}
                        variant="contained"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {!edit && (
                    <Button
                      onClick={() => {
                        setEdit(true);
                      }}
                      variant="contained"
                    >
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
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