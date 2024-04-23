import React, { useState } from "react";
import { Typography, Checkbox, Button } from "@mui/material";
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
      }
    }
  };

  const handleNext = () => {
    if (isPwbd && !pwbdCertificate) {
      alert("Please upload your PwBD certificate.");
      return;
    }
    onNext();
  };

  return (
    <form className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] my-10">
      <Typography variant="h4" gutterBottom>
        Upload Details
      </Typography>
      <div>
        <label htmlFor="photo">Upload Photo (Max 30kb)</label>
        <input
          type="file"
          accept="image/*"
          id="photo"
          onChange={handlePhotoChange}
        />
      </div>
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
        <div>
          <label htmlFor="pwbd-certificate">
            Upload PWBD Certificate (Max 30kb)
          </label>
          <input
            type="file"
            accept="image/*"
            id="pwbd-certificate"
            onChange={handlePwbdCertificateChange}
          />
        </div>
      )}
      <div className="flex justify-between w-full">
      <Button onClick={onPrevious} variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
        <ArrowBackIosNew />
        Previous
      </Button>
      <Button onClick={handleNext} variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
        Next
     </Button>
      </div>
    </form>
  );
};

export default UploadDetails;
