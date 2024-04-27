"use client";
import React, { useState } from 'react';
import { TextField } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface ChangePasswordProps {
  setnewpassword: React.Dispatch<React.SetStateAction<string>>;
  onNext: (newpassword: string) => void;
}

export default function ChangePassword({setnewpassword, onNext }: ChangePasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);
  const spaceRegex = /\s/;

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setHelperText("Passwords don't match");
      setError(true);
      return;
    }
    if (newPassword.length < 8) {
      setHelperText("Password must contain 8 characters");
      setError(true);
      return;

    }
    if (spaceRegex.test(newPassword) || spaceRegex.test(confirmPassword)) {
      setHelperText("Password cannot contain spaces");
      setError(true);
      return;
    }
    
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    setnewpassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setHelperText('');
    setError(false);
    onNext(newPassword); 
  };
  return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] "
      >
        <span className="text-4xl font-semibold">Change Password</span>
        <div className="mt-1 w-[100%]">
          <TextField
            required
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText={helperText}
            error={error}
            id="newPassword"
            label="New Password"
            variant="outlined"
            color="grey"
            fullWidth
          />
        </div>
        <div className="mt-1 w-[100%]">
          <TextField
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={helperText}
            error={error}
            id="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            color="grey"
            fullWidth
          />
        </div>
        <button className="bg-black flex justify-center items-center  transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold">
              <div> Next </div>{" "}
              <ArrowForwardIosIcon className="scale-75  " />
            </button>
      </form>
  );
}