"use client"
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { sendEmail } from "../actions/api";

export default function SendOTP({RollNo, setRollNo, setStep}:{RollNo: string, setRollNo: Function, setStep: Function}) {
  const [Password, setPass] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendDisabled) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendDisabled]);

  async function handleSendEmail() {
    setLoading(true);
    sendEmail(RollNo)
      .then((res) => {
        setLoading(false);
        setResendDisabled(true);
        setStep(2);
        setRemainingTime(300); // Reset the timer to 5 minutes
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
        setHelperText("Something went wrong! Please try again later");

      });
  }

  return (
    <>
      <div className=" ">
        <div className="flex self-center justify-center h-[100vh]  items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
            className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] "
          >
            <div className="text-[32px] font-semibold  ">Forgot Password?</div>
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

            <button
              disabled={resendDisabled}
              className="bg-black disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center  transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold"
            >
              <div> SEND OTP ON EMAIL </div>{" "}
              {resendDisabled && (
                <div className="">
                  ({Math.floor(remainingTime / 60)}:
                  {remainingTime % 60 < 10
                    ? "0" + (remainingTime % 60)
                    : remainingTime % 60})
                </div>
              )}
              <ArrowForwardIosIcon className="scale-75  " />
            </button>
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
