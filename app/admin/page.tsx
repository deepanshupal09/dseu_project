"use client";

import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import logo from "../images/logo.png";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../actions/api";
import { parseJwt } from "../actions/utils";
import { setAuthAdmin } from "../actions/cookie";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await loginAdmin(email, password);
      await setAuthAdmin(response.token);
      router.push("/admin/dashboard");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(true);
      const message = JSON.parse(error.message);
      setHelperText(message.message)
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
            <div className="text-[32px] font-semibold  ">Admin Login</div>
            {/* <div className="text-2xl w-full font-semibold ">Login</div> */}
            <div className="mt-1 w-[100%]">
              <TextField
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHelperText("");
                  setError(false);
                }}
                value={email}
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
                label="Email ID"
                variant="outlined"
                color="grey"
                fullWidth
              />
            </div>
            <div className="mt-1 w-[100%]">
              <TextField
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHelperText("");
                  setError(false);
                }}
                type="password"
                value={password}
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
            <button className="bg-black flex justify-center items-center  transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold">
              <div> Sign In </div>{" "}
              <ArrowForwardIosIcon className="scale-75  " />
            </button>
            <div className="flex w-full justify-between">
            <div onClick={()=>{router.push("/")}} className="w-full  cursor-pointer hover:underline">Are you a student?</div>

            </div>
          </form>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
