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
import { Button, TextField, Typography } from "@mui/material";
import { getUserByRollNo } from "@/app/actions/api";

function Home() {
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [rollno, setRollno] = useState<string>("");
  const [token, setToken] = useState<string>("");
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

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) {
        setToken(auth.value);
      }
    });
  }, []);

  async function searchRollNo() {
    if (rollno) {
      try {
        const response = await getUserByRollNo(rollno, token);
        console.log("response: ", response);
        setUser(response[0]);
      } catch (error) {
        console.log("error: ", error);
        setUser(null);
      }
    }
  }

  return (
    <div className="sm:pl-[300px] sm:mt-[100px]   mt-[140px] w-full px-2 sm:pr-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchRollNo();
        }}
        className="flex space-x-2 "
      >
        <TextField
          size="small"
          value={rollno}
          onChange={(e) => {
            setRollno(e.target.value);
          }}
          label="Roll No"
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
      </form>

      {user && (
        <>
          <div className="relative mt-6 md:w-auto">
            <div className="bg-dseublue py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl text-white">
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

          <div className="relative mt-8 w-full md:w-auto shadow-sm">
            <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
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
                        onChange={handleChange}
                        // typex`="number"
                        InputProps={{
                          inputProps: {
                            maxlength: 10,
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
  
                          }}
                        }
  
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
                        type="number"
                        onChange={handleChange}
                        inputProps={{
                          maxLength: 12,
                          inputMode: 'numeric',
                          pattern: '[0-9]*'
                        }}
                    
                      />
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <Face6RoundedIcon className="mr-2" />
                    <p>
                      <span className="font-bold">Gender:</span>
                      <br />
                      <TextField
                        hiddenLabel
                        className="mt-2"
                        size="small"
                        variant="filled"
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                      />
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
                        onChange={handleChange}
                        inputProps={{
                          maxLength: 12,
                          inputMode: 'numeric',
                          pattern: '[0-9]*'
                        }}
                        type="number"

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

            <div className="relative mt-8 w-full md:w-auto shadow-sm">
              <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
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
                        <TextField
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          variant="filled"
                          name="campus"
                          value={user.campus}
                          onChange={handleChange}
                          
                        />
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <BookIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Program Type:</span>
                        <br />
                        <TextField
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          variant="filled"
                          name="program_type"
                          value={user.program_type}
                          onChange={handleChange}
                        />
                      </p>
                    </div>
                    <div className="flex mb-2">
                      <ClassIcon className="mr-2" />
                      <p>
                        <span className="font-bold">Program Name:</span>
                        <br />
                        <TextField
                          hiddenLabel
                          className="mt-2"
                          size="small"
                          variant="filled"
                          name="program"
                          value={user.program}
                          onChange={handleChange}
                        />
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
                          onChange={handleChange}
                          type="number"
                          InputProps={{
                            inputProps: { 
                                max: 10, min: 1
                            }}}
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
          <Button variant="contained" >Apply Changes</Button>
        </>
      )}

      {!user && (
        <Typography variant="h6" className=" my-4" component="h2">
          Roll No not found!
        </Typography>
      )}
    </div>
  );
}

export default Home;
