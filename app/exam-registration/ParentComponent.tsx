import React, { useState } from 'react';
import BacklogsTable from './Backlogs';
import CourseSubjectsTable from './SubjectsTable';

export default function ParentComponent({ subjectsData, backlogsData,currentSemester }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedBacklogs, setSelectedBacklogs] = useState([]);

  const handleSubjectsSelected = (selectedSubjects) => {
    setSelectedSubjects(selectedSubjects);
  };

  const handleBacklogsSelected = (selectedBacklogs) => {
    setSelectedBacklogs(selectedBacklogs);
  };

  const handleSubmit = () => {
    // Logic to submit selected subjects and backlogs
    console.log("Selected Subjects:", selectedSubjects);
    console.log("Selected Backlogs:", selectedBacklogs);
  };

  return (
    <div>
      <CourseSubjectsTable subjectsData = {subjectsData} onSubjectsSelected={handleSubjectsSelected} />
      <BacklogsTable backlogs={backlogsData} onSubjectsSelected={handleBacklogsSelected} currentSemester={currentSemester}/>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}