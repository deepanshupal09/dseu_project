"use client"
import { Backdrop, CircularProgress, Step, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { sendEmail } from "../actions/api";
import SendOTP from "./SendOTP";
import VerifyOTP from "./VerifyOTP";
import ChangePassword from "./ChangePassword";
import FinalPage from "./FinalPage";

export default function Home() {

  const [loading, setLoading] = useState<boolean>(false);
  const [rollno, setRollno] = useState<string>("")
  const [step, setStep] = useState<Number>(1)


  return (
    <>

      {step===1 && <SendOTP RollNo={rollno} setStep={setStep} setRollNo={setRollno} />} \
      {step===2 && <VerifyOTP rollno={rollno} setStep={setStep} /> }
      {step===3 && <ChangePassword rollno={rollno} setStep={setStep} /> }
      {step===4 && <FinalPage />}

      
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
