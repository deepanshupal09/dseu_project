"use server";
import React from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const App: React.FC = () => {
    const apiUrl = `${process.env.BACKEND_URL}/fetchAllResultController`;

    const fetchDataAndDownloadCSV = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();

            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, "data.csv");
        } catch (error) {
            console.error("Error fetching data or converting to CSV", error);
        }
    };

    return (
        <div>
            <button onClick={fetchDataAndDownloadCSV}>Download CSV</button>
        </div>
    );
};

export default App;
