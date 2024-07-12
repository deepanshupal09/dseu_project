"use client"
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { sendEmail, verifyOtpAndPassword } from "../actions/api";
import { useRouter } from "next/navigation";

export default function VerifyOTP({rollno,setStep}:{ rollno: string, setStep: Function}) {
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [tries,setTries]=useState<number>(5);
  const router = useRouter();


  async function handleVerifyOtp() {
    setTries(tries-1);
    if(tries===0){
      router.push("/")
    }
    setLoading(true);
    verifyOtpAndPassword(rollno, otp).then((res) => {
        setStep(3)
        setLoading(false)
    }).catch((error)=>{
        setLoading(false)
        setError(true);
        setHelperText("Invalid OTP!")      
    })
  }

  return (
    <>
      <div className=" ">
        <div className="flex self-center justify-center h-[100vh]  items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyOtp();
            }}
            className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] "
          >
            <div className="text-[32px] font-semibold  ">Enter OTP</div>
            <div className="mt-1 w-[100%]">
              <TextField
                required
                onChange={(e) => {
                  setOtp(e.target.value);
                  setHelperText("");
                  setError(false);
                }}
                inputProps={{
                    maxLength: 6,
                    pattern: "\\d{6}", 
                }}
                value={otp}
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
                label="Enter OTP"
                variant="outlined"
                color="grey"
                fullWidth
              />
            </div>

            <button
              className="bg-black disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center  transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold"
            >
              <div> VERIFY OTP </div>{" "}
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
