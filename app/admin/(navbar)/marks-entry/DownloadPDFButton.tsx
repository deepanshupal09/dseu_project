// components/DownloadPDFButton.tsx
'use client';

import { Button } from '@mui/material';
import { FC } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DownloadPDFButtonProps {
    logo : string ;
    campusName: string;
    programName: string;
    courseName : string ;
    semester: string;
    course_code: string;
    academicYear : string ; 
    sheet_type: number;
    maximumMarks : string
}

const DownloadPDFButton: FC<DownloadPDFButtonProps> = (props) => {
  const fetchData = async () => {
    let apiUrl = '';

    switch (props.sheet_type) {
      case 75:
        apiUrl = '/api/api1';
        break;
      case 100:
        apiUrl = '/api/api2';
        break;
      case 25:
        apiUrl = '/api/api3';
        break;
      default:
        throw new Error('Invalid sheet_type');
    }

    // const response = await fetch(apiUrl);
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    // const data = await response.json();
    const data = [
        { roll_no: '001', name: 'Jiya', marks: 85 , status : 'Regular' },
        { roll_no: '001', name: 'Jiya', marks: 85 , status : 'Regular' },
    ];
    return data;
  };

  const downloadPDF = async () => {
    const data = await fetchData();

    // Import jsPDF and autoTable
    // const { jsPDF } = await import('jspdf');
    // const autoTable = (await import('jspdf-autotable')).default;
    console.log("here ")
    const doc = new jsPDF();
    doc.addImage(props.logo, 'PNG', 0, 15, 40, 40);
    doc.setFont("Cambria" )
    doc.setFontSize(16);
    doc.text("DELHI SKILL AND ENTEPRENEURSHIP UNIVERSITY" , 45 , 20)
    doc.setFontSize(14);
    doc.text(props.campusName, 100, 30);
    doc.text(props.programName, 100, 38);
    doc.setFontSize(11);
    doc.text(`Course Name: ${props.courseName}`, 45, 55);
    doc.text(`Semester: ${props.semester}`, 45, 50);
    doc.text(`Maximum Marks: ${props.maximumMarks}`, 100, 50);
    doc.text(`Academic year: ${props.academicYear}`, 150, 50);
    doc.text(`Course Code: ${props.course_code}`, 150, 55);
    doc.setFontSize(11);
    const tableColumn = ['S.No', 'Roll No', 'Name', 'Marks', 'Regular/Reappear'];
    const tableRows: any[] = [];

    data.forEach((item: { roll_no: string; name: string; marks: number; status: string }, index: number) => {
      const rowData = [index + 1, item.roll_no, item.name, item.marks, item.status];
      tableRows.push(rowData);
    });
    autoTable(doc, {
        startY: 60, 
        head: [tableColumn],
        body: tableRows,
        margin: { bottom: 40 },
        styles: { fillColor: false, textColor: 0 , lineWidth: 0.1 }, // Remove background color and set text color to black
        headStyles: { fillColor: false, textColor: 0 , lineWidth: 0.1 , halign:'center' }, // Remove background color and set text color to black
        bodyStyles: { fillColor: false, textColor: 0 , lineWidth: 0.1 },
        alternateRowStyles: { fillColor: false, textColor: 0, lineWidth: 0.1 },
        didDrawPage: (dataArg) => {
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(12);
            // Drawing lines for signatures
            doc.line(10, pageHeight - 30, 60, pageHeight - 30);
            doc.line(80, pageHeight - 30, 130, pageHeight - 30);
            doc.line(150, pageHeight - 30, 200, pageHeight - 30);
            
            // Adding the signature lines at the bottom
            doc.text('Signature of Departmental', 12, pageHeight - 25);
            doc.text('Faculty Incharge', 20, pageHeight - 20);
            doc.text('Signature of Faculty', 86, pageHeight - 25);
            doc.text('Signature of Campus Director', 150, pageHeight - 25);
           
        }
    });

    doc.save('sheet.pdf');
  };

  return <Button variant='contained' onClick={downloadPDF}>Download PDF</Button>;
};

export default DownloadPDFButton;
