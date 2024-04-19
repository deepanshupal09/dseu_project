import React, { useState } from 'react';
import { TextField, Button, Typography, Checkbox, FormControlLabel, FormControl, RadioGroup, Radio, FormLabel } from '@mui/material';

export default function FamilyDetails({ fathername, mothername, spg, parrel, spgname, onPrevious }) {
  const [fatherName, setFatherName] = useState(fathername|| '');
  const [motherName, setMotherName] = useState(mothername|| '');
  const [singleParentGuardian, setSingleParentGuardian] = useState(spg || false);
  const [parentRelation, setParentRelation] = useState(parrel|| '');
  const [singleParentGuardianName, setSingleParentGuardianName] = useState(spgname|| '');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Father's Name:", fatherName);
    console.log("Mother's Name:", motherName);
    console.log("Single Parent/Guardian:", singleParentGuardian);
    if (singleParentGuardian) {
      console.log("Single Parent/Guardian Name:", singleParentGuardianName);
      console.log("Parent's Relation:", parentRelation);
    }
    // No onNext function as this is the last page
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
        control={<Checkbox checked={singleParentGuardian} onChange={(e) => setSingleParentGuardian(e.target.checked)} />}
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
              fullWidth
            />
          </div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Parent's Relation</FormLabel>
            <RadioGroup
              aria-label="parent-relation"
              name="parent-relation"
              value={parentRelation}
              onChange={(e) => setParentRelation(e.target.value)}
            >
              <FormControlLabel value="mother" control={<Radio />} label="Mother" />
              <FormControlLabel value="father" control={<Radio />} label="Father" />
              <FormControlLabel value="guardian" control={<Radio />} label="Guardian" />
            </RadioGroup>
          </FormControl>
        </>
      )}
      <Button
        type="submit"
        className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
      >
        Submit
      </Button>
      <Button onClick={onPrevious}>Previous</Button>
    </form>
  );
}