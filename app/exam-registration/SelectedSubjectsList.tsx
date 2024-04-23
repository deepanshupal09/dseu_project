import React from "react";

const SelectedSubjectsList = ({ selectedBacklogs, selectedSemester }) => {
  return (
    <div>
      <h2>Selected Subjects for Semester {selectedSemester}</h2>
      <ul>
        {selectedBacklogs.map((backlog, index) => (
          <li key={index}>
            <strong>Subject:</strong> {backlog.subject},{" "}
            <strong>Subject Code:</strong> {backlog.subjectCode}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedSubjectsList;