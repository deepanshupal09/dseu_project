import React, { useEffect, useState } from "react";
import {
  Typography,
  Checkbox,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { uploadFile } from "@/app/actions/uploadapi";

interface UploadDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
  photo: string;
  pwbdCertificate: string;
  isPwbd: boolean;
  setPhoto: React.Dispatch<React.SetStateAction<string>>;
  setPwbdCertificate: React.Dispatch<React.SetStateAction<string>>;
  setIsPwbd: React.Dispatch<React.SetStateAction<boolean>>;
  photoObject: File | null;
  setPhotoObject: React.Dispatch<React.SetStateAction<File|null>>;
  certificateObject: File | null;
  setCertificateObject: React.Dispatch<React.SetStateAction<File|null>>;
  rollno: string;
}

const UploadDetails: React.FC<UploadDetailsProps> = ({
  onNext,
  onPrevious,
  photo,
  pwbdCertificate,
  isPwbd,
  setPhoto,
  setPwbdCertificate,
  setIsPwbd,
  photoObject,
  setPhotoObject,
  certificateObject,
  setCertificateObject,
  rollno,
}) => {

    useEffect(() => {
        setPhoto("");
    },[photoObject])

    useEffect(() => {
        setPwbdCertificate("");
    },[certificateObject])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 30000) {
        setPhotoObject(file);
      } else {
        alert("Please upload a photo under 30kb.");
        setPhotoObject(null);
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
        setCertificateObject(file);
      } else {
        alert("Please upload a PwBD certificate under 30kb.");
        setCertificateObject(null);
        // Reset the input field value to clear the selected file
        e.target.value = "";
      }
    }
  };

  const handleNext = () => {
    if (photo === "") {
      alert("Please upload your photograph.");
      return;
    }
    if (isPwbd && pwbdCertificate === "") {
      alert("Please upload your PwBD certificate.");
      return;
    }
    onNext();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px] p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 w-[460px] my-10"
    >
      <Typography variant="h4" gutterBottom>
        Upload Details
      </Typography>
      <div className=" w-full space-y-5 ">
        {" "}
        <Typography className="w-full text-lg  ">
          Upload Passport size image(max 30KB)
        </Typography>
        <div className="flex justify-between">
          <input
            id="photo"
            type="file"
            // label="Upload Photo (Max 30kb)"
            accept="image/jpeg, image/png"
            onChange={handlePhotoChange}
            required
            className="w-full"
          />
          <button
            type="button"
            onClick={async () => {
              if (photoObject) {
                try {
                  const res = await uploadFile(photoObject, rollno + "_photo");
                  setPhoto(res.path);
                  alert("File uploaded successfully");
                } catch (error:any) {
                  alert("Photo not uploaded, ERROR: "+ error);
                }
              } else {
                alert("Please select a photo to upload!");
              }
            }}
            className="bg-black  flex justify-center items-center transition-all duration-150 text-white px-4 py-1 rounded-lg font-semibold hover:bg-gray-800 focus:bg-gray-800"
          >
            Upload
          </button>
        </div>
      </div>
      <div>
        <label>
          Select, if you are a Persons with Benchmark Disabilities (PwBD){" "}
          <Checkbox
            checked={isPwbd}
            onChange={(e) => setIsPwbd(e.target.checked)}
          />
        </label>
      </div>
      {isPwbd && (
        <div className="w-full space-y-5 ">
          <Typography className="text-lg ">
            Upload PwBD Certificate(max 30KB)
          </Typography>
          <div className="flex justify-between">
            <input
              id="pwbd-certificate"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handlePwbdCertificateChange}
              className="w-full"
            />
            <button
              type="button"
              onClick={async () => {
                if (certificateObject) {
                  try {
                    const res = await uploadFile(
                      certificateObject,
                      rollno + "_certificate"
                    );
                    setPwbdCertificate(res.path);
                    alert("File uploaded successfully");
                  } catch (error:any) {
                    alert("Photo not uploaded, ERROR: "+ error);
                  }
                } else {
                  alert("Please select a photo to upload!");
                }
              }}
              className="bg-black flex justify-center items-center transition-all duration-150 text-white px-4 py-1 rounded-lg font-semibold hover:bg-gray-800 focus:bg-gray-800"
            >
              Upload
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between w-full">
        <Button
          onClick={onPrevious}
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
          style={{ marginRight: "8px" }}
        >
          <ArrowBackIosNew />
          Previous
        </Button>
        <Button
          type="submit"
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default UploadDetails;
