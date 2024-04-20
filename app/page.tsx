"use client";

import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import logo from "./images/logo.png";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [RollNo, setRollNo] = useState<string>("");
  const [Password, setPass] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  async function handleLogin() {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          rollno: RollNo,
          password: Password,
        },
        cache: "no-store",
      });
      setLoading(false)

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response Data:", responseData);
        if (responseData.defaultPass) {
          router.push(`/getuserdetails/${RollNo}`)
        } else {
          // store cookie here using next/header
          router.push('/dashboard')
        }
      } else {
        // console.log('Request failed with status code:', response.status);
        const errorData = await response.text(); // Get error message as text
        setHelperText(errorData);
        console.log(errorData);
        // You can handle different status codes here
      }
    } catch (error) {
      console.error('Error:', error);
      setHelperText("Internal Server Error!");
      
    }
  }

  return (
    <>
      <div className=" ">
        <div className="flex self-center justify-center h-[100vh]  items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] "
          >
            <Image height={130} className="-mb-4" src={logo} alt="logo" />
            <div className="text-[32px] font-semibold  ">Student Portal</div>
            <div className="text-2xl w-full font-semibold ">Login</div>
            <div className="mt-1 w-[100%]">
              <TextField
                required
                onChange={(e) => {
                  setRollNo(e.target.value);
                  setHelperText("");
                  setError(false);
                }}
                value={RollNo}
                helperText={helperText}
                error={error}
                className=""
                sx={{
                  ".MuiInputBase-input": {
                    borderRadius: "10px",
                  },
                  "&:before, &:after": {
                    borderRadius: "10px",
                  },
                }}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                }}
                id="myfilled-name"
                label="Roll No"
                variant="outlined"
                color="grey"
                fullWidth
              />
            </div>
            <div className="mt-1 w-[100%]">
              <TextField
                required
                onChange={(e) => {
                  setPass(e.target.value);
                  setHelperText("");
                  setError(false);
                }}
                type="password"
                value={Password}
                helperText={helperText}
                error={error}
                sx={{
                  "&:before, &:after": {
                    borderRadius: "10px",
                  },
                }}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                  },
                }}
                id="myfilled-name"
                label="Password"
                variant="outlined"
                color="grey"
                fullWidth
              />
            </div>
            <button
              className="bg-black flex justify-center items-center  transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold"
            >
              <div> Sign In </div>{" "}
              <ArrowForwardIosIcon className="scale-75  " />
            </button>
          </form>
        </div>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
