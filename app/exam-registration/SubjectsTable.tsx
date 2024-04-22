import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Typography } from '@mui/material';

export default function CourseSubjectsTable ({ subjectsData, onSubjectsSelected }) {
  const [selectedSubjects, setSelectedSubjects] = useState({});

  const handleSelectSubject = (subject) => {
    setSelectedSubjects(prevSelected => ({
      ...prevSelected,
      [subject.code]: !prevSelected[subject.code] 
    }));
  };

  // Function to return selected subjects
  const getSelectedSubjects = () => {
    const selectedSubjectsArray = [];
    for (const code in selectedSubjects) {
      if (selectedSubjects[code]) {
        const selectedSubject = subjectsData.find(subject => subject.code === code);
        if (selectedSubject) {
          selectedSubjectsArray.push(selectedSubject);
        }
      }
    }
    return selectedSubjectsArray;
  };

  // Call the onSubjectsSelected callback with the selected subjects array
  const handleSubjectsSelected = () => {
    const selectedSubjectsArray = getSelectedSubjects();
    onSubjectsSelected(selectedSubjectsArray);
  };

  return (
    <div className='py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl'>
      <Table sx={{ '& td, & th': { padding: '8px' } }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">Subject</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Subject Code</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Select</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjectsData.map((subject, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography>{subject.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{subject.code}</Typography>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={selectedSubjects[subject.code] || false}
                  onChange={() => handleSelectSubject(subject)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};