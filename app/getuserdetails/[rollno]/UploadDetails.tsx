import React, { useState } from "react";
import { Typography, Checkbox, Button, TextField, InputAdornment } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";

interface UploadDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const UploadDetails: React.FC<UploadDetailsProps> = ({ onNext, onPrevious }) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [pwbdCertificate, setPwbdCertificate] = useState<File | null>(null);
  const [isPwbd, setIsPwbd] = useState<boolean>(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 30000) {
        setPhoto(file);
      } else {
        alert("Please upload a photo under 30kb.");
        // Reset the input field value to clear the selected file
        e.target.value = "";
      }
    }
  };

  const handlePwbdCertificateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 30000) {
        setPwbdCertificate(file);
      } else {
        alert("Please upload a PwBD certificate under 30kb.");
        // Reset the input field value to clear the selected file
        e.target.value = "";
      }
    }
  };

  const handleNext = () => {
    if (!photo) {
      alert("Please upload your photograph.");
      return;
    }
    if (isPwbd && !pwbdCertificate) {
      alert("Please upload your PwBD certificate.");
      return;
    }
    onNext();
  };

  return (
    <form className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px] p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 w-[460px] my-10">
      <Typography variant="h4" gutterBottom>
        Upload Details
      </Typography>
      <TextField
        id="photo"
        type="file"
        label="Upload Photo (Max 30kb)"
        inputProps={{ accept: "image/*" }}
        onChange={handlePhotoChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ArrowBackIosNew />
            </InputAdornment>
          ),
        }}
        className="w-full"
      />
      <div>
        <label>
          Are you a person with PwBD?{" "}
          <Checkbox
            checked={isPwbd}
            onChange={(e) => setIsPwbd(e.target.checked)}
          />
        </label>
      </div>
      {isPwbd && (
        <TextField
          id="pwbd-certificate"
          type="file"
          label="Upload PWBD Certificate (Max 30kb)"
          inputProps={{ accept: "image/*" }}
          onChange={handlePwbdCertificateChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ArrowBackIosNew />
              </InputAdornment>
            ),
          }}
          className="w-full"
        />
      )}
      <div className="flex justify-between w-full">
        <Button onClick={onPrevious} className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800" style={{ marginRight: "8px" }}>
          <ArrowBackIosNew />
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default UploadDetails;
