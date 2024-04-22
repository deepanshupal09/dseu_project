import React, { useState } from 'react';
import { Typography, Checkbox, FormControlLabel, FormGroup, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, FormControl } from '@mui/material';

const BacklogsTable = ({ backlogs, currentSemester, onSubjectsSelected }) => {
  const [selectedBacklogs, setSelectedBacklogs] = useState([]);
  const [giveBacklogExams, setGiveBacklogExams] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleSelectBacklog = (backlog) => {
    if (selectedBacklogs.includes(backlog)) {
      setSelectedBacklogs(selectedBacklogs.filter(b => b !== backlog));
    } else {
      setSelectedBacklogs([...selectedBacklogs, backlog]);
    }
  };

  const handleChangeSemester = (event) => {
    setSelectedSemester(event.target.value);
  };

  const generateSemesters = () => {
    const semesters = [];
    for (let i = 1; i < currentSemester; i++) {
      if (currentSemester % 2 === 0) {
        if (i % 2 === 0) {
          semesters.push(i.toString());
        }
      } else {
        if (i % 2 !== 0) {
          semesters.push(i.toString());
        }
      }
    }
    return semesters;
  };

  const filteredBacklogs = backlogs.filter(backlog => {
    if (!giveBacklogExams) return false; // If not giving backlogs, don't show any
    else {
      return backlog.semester.toString() === selectedSemester;
    }
  });

  // Function to return selected subjects
  const getSelectedSubjects = () => {
    return selectedBacklogs.map(backlog => backlog.subject);
  };

  // Call the onSubjectsSelected callback with the selected subjects array
  const handleSubjectsSelected = () => {
    const selectedSubjects = getSelectedSubjects();
    onSubjectsSelected(selectedSubjects);
  };

  return (
    <div className='py-2 px-6 rounded shadow mx-auto my-6 flex flex-col items-center justify-between max-w-6xl'>
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox checked={giveBacklogExams} onChange={() => setGiveBacklogExams(!giveBacklogExams)} />}
          label="Give Backlog Exams"
        />
        {giveBacklogExams && (
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={selectedSemester}
              onChange={handleChangeSemester}
              disabled={!giveBacklogExams}
            >
              <MenuItem value="all">All Semesters</MenuItem>
              {generateSemesters().map((semester) => (
                <MenuItem key={semester} value={semester}>
                  Semester {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </FormGroup>
      {giveBacklogExams && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Subject Code</TableCell>
              <TableCell>Exam Type</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBacklogs.map((backlog, index) => (
              <TableRow key={index}>
                <TableCell><Typography>{backlog.subject}</Typography></TableCell>
                <TableCell><Typography>{backlog.subjectCode}</Typography></TableCell>
                <TableCell><Typography>{backlog.examType}</Typography></TableCell>
                <TableCell><Typography>{backlog.semester}</Typography></TableCell>
                <TableCell>
                  <Checkbox
                    checked={selectedBacklogs.includes(backlog)}
                    onChange={() => handleSelectBacklog(backlog)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BacklogsTable;