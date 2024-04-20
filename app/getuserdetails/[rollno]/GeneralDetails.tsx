import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ArrowBackIosNew } from "@mui/icons-material";

interface UserDetailsProps {
  emailid: string;
  gen: string;
  phoneno: string;
  altphone: string;
  setemailid: React.Dispatch<React.SetStateAction<string>>;
  setgender: React.Dispatch<React.SetStateAction<string>>;
  setphone: React.Dispatch<React.SetStateAction<string>>;
  setaltphone: React.Dispatch<React.SetStateAction<string>>;
  onPrevious: () => void;
  onNext: () => void;
}


export default function UserDetailsPage({
  emailid,
  gen,
  phoneno,
  altphone,
  onNext,
  setemailid,
  setgender,
  setphone,
  setaltphone,
  onPrevious,
}:UserDetailsProps) {
  const [email, setEmail] = useState(emailid || "");
  const [gender, setGender] = useState(gen || "");
  const [phone, setPhone] = useState(phoneno || "");
  const [alternatePhone, setAlternatePhone] = useState(altphone || "");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Gender:", gender);
    console.log("Phone:", phone);
    console.log("Alternate Phone:", alternatePhone);
    setaltphone(alternatePhone);
    setgender(gender);
    setemailid(email);
    setphone(phone);
    onNext(); // Call the onNext function passed from parent component
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] my-10"
    >
      <Typography variant="h4" gutterBottom>
        User General Details
      </Typography>
      <div className="w-[100%]">
        <TextField
          label="Email address"
          required
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setHelperText("");
            setError(false);
          }}
          helperText={helperText}
          error={error}
          id="email"
          variant="outlined"
          color="primary"
          fullWidth
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
          color="grey"
        />
      </div>
      <div className="w-[100%]">
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Gender"
            fullWidth
            color="grey"
            sx={{borderRadius: "10px",}}
            
          >
            <MenuItem color="grey" value="male">Male</MenuItem>
            <MenuItem color="grey" value="female">Female</MenuItem>
            <MenuItem color="grey" value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="w-[100%]">
        <TextField
          label="Phone"
          required
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setHelperText("");
            setError(false);
          }}
          id="phone"
          variant="outlined"
          color="primary"
          helperText={helperText}
          error={error}
          fullWidth
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
        />
      </div>
      <div className="w-[100%]">
        <TextField
          label="Alternate Phone"
          type="tel"
          value={alternatePhone}
          onChange={(e) => {
            setAlternatePhone(e.target.value);
            setHelperText("");
            setError(false);
          }}
          id="alternatePhone"
          variant="outlined"
          color="primary"
          helperText={helperText}
          error={error}
          fullWidth
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
        />
      </div>
      <div className="flex  gap-x-2 w-full">
        <Button
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
          onClick={onPrevious}
        ><ArrowBackIosNew className="scale-75 -ml-4" />Previous
        </Button>
        <Button
          type="submit"
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
        >
          <div>Next</div>
          <ArrowForwardIosIcon className="scale-75 -mr-4" />
        </Button>
      </div>
    </form>
  );
}
