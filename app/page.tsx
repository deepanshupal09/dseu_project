"use client";

import { TextField } from "@mui/material";
import Input from "@mui/joy/Input";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function Home() {
  const [RollNo, setRollNo] = useState<string>("");
  const [Password, setPass] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div  className=" ">
        <div className="flex justify-center h-[100vh]  items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(RollNo);
            }}
            className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] "
          >
            <span className="text-4xl font-semibold ">Login</span>
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
                  "& .MuiInputBase-root": {
                    //   color: "#ece9e9",
                  },
                  "& .MuiFormLabel-root": {
                    //   color: "#ece9e9",
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
                    //   color: "#ece9e9",
                  },
                  ".MuiInputBase-input": {
                    //   background: "#130f22",
                    borderRadius: "10px",
                    "&:-webkit-autofill": {
                      // WebkitBoxShadow: "0 0 0px 1000px #130f22 inset",
                      // WebkitTextFillColor: "#ece9e9",
                    },
                  },
                  ".MuiTextField-root": {
                    //   background: "#130f22",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    // borderColor: "#fff",
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
                color="grey"
                id="myfilled-name"
                label="Roll No"
                variant="outlined"
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
                  "& .MuiInputBase-root": {
                    //   color: "#ece9e9",
                  },
                  "& .MuiFormLabel-root": {
                    //   color: "#ece9e9",
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
                    //   color: "#ece9e9",
                  },
                  ".MuiInputBase-input": {
                    //   background: "#130f22",
                    borderRadius: "10px",
                    "&:-webkit-autofill": {
                      // WebkitBoxShadow: "0 0 0px 1000px #130f22 inset",
                      // WebkitTextFillColor: "#ece9e9",
                    },
                  },
                  ".MuiTextField-root": {
                    //   background: "#130f22",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    // borderColor: "#fff",
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
                label="Password"
                variant="outlined"
                color="grey"
                fullWidth
              />
            </div>
            <button className="bg-black flex justify-center items-center  transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold">
              <div> Sign In </div>{" "}
              <ArrowForwardIosIcon className="scale-75  " />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
