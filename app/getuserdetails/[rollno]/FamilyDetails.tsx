import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ArrowBackIosNew } from "@mui/icons-material";

interface FamilyDetailsProps {
  fathername: string;
  mothername: string;
  spg: boolean;
  parrel: string;
  spgname: string;
  setfathername: React.Dispatch<React.SetStateAction<string>>;
  setmothername: React.Dispatch<React.SetStateAction<string>>;
  setspg: React.Dispatch<React.SetStateAction<boolean>>;
  setparrel: React.Dispatch<React.SetStateAction<string>>;
  setspgname: React.Dispatch<React.SetStateAction<string>>;
  onPrevious: () => void;
  onNext: () => void;
}

export default function FamilyDetails({
  fathername,
  mothername,
  spg,
  parrel,
  spgname,
  setfathername,
  setmothername,
  setspg,
  setparrel,
  setspgname,
  onPrevious,
  onNext,
}: FamilyDetailsProps) {
  const [stateUpdated, setStateUpdated] = useState(false);

  const [fatherName, setFatherName] = useState(fathername || "");
  const [motherName, setMotherName] = useState(mothername || "");
  const [singleParentGuardian, setSingleParentGuardian] = useState(
    spg || false
  );
  const [parentRelation, setParentRelation] = useState(parrel || "");
  const [singleParentGuardianName, setSingleParentGuardianName] = useState(
    spgname || ""
  );
  // useEffect(() => {
  //   if (stateUpdated) {
  //     onNext();
  //     setStateUpdated(false); // Reset the stateUpdated flag
  //   }
  // }, [stateUpdated, onNext]);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    setfathername(fatherName);
    setmothername(motherName);
    setspgname(singleParentGuardianName);
    setspg(singleParentGuardian);
    setparrel(parentRelation);
    setStateUpdated(true);
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] my-10"
    >
      <Typography variant="h4" gutterBottom>
        Family Details
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={singleParentGuardian}
            onChange={(e) => setSingleParentGuardian(e.target.checked)}
          />
        }
        label="Tick if only one parent or legal guardian"
      />
      {!singleParentGuardian && (
        <>
          <div className="w-[100%]">
            <TextField
              label="Father's Name"
              required
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              variant="outlined"
              color="grey"
              InputProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
              sx={{ borderRadius: "10px" }}
              fullWidth
            />
          </div>
          <div className="w-[100%]">
            <TextField
              label="Mother's Name"
              required
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
              sx={{ borderRadius: "10px" }}
              color="grey"
            />
          </div>
        </>
      )}
      {singleParentGuardian && (
        <>
          <div className="w-[100%]">
            <TextField
              label="Parent/Guardian Name"
              required
              value={singleParentGuardianName}
              onChange={(e) => setSingleParentGuardianName(e.target.value)}
              variant="outlined"
              InputProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
              fullWidth
            />
          </div>
          <FormControl className="w-full" component="fieldset">
            <FormLabel color="grey" component="legend">
              Parent's Relation
            </FormLabel>
            <RadioGroup
              aria-label="parent-relation"
              name="parent-relation"
              value={parentRelation}
              color="grey"
              onChange={(e) => setParentRelation(e.target.value)}
            >
              <FormControlLabel
                color="grey"
                value="mother"
                control={<Radio />}
                label="Mother"
              />
              <FormControlLabel
                color="grey"
                value="father"
                control={<Radio />}
                label="Father"
              />
              <FormControlLabel
                color="grey"
                value="guardian"
                control={<Radio />}
                label="Guardian"
              />
            </RadioGroup>
          </FormControl>
        </>
      )}
      <div className="flex  gap-x-2 w-full">
        <button
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
          onClick={onPrevious}
        >
          <ArrowBackIosNew className="scale-75 -ml-4" />
          Previous
        </button>
        <button
          type="submit"
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
        >
          <div>Next</div>
          <ArrowForwardIosIcon className="scale-75 -mr-4" />
        </button>
      </div>
    </form>
  );
}
