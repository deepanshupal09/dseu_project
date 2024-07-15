'use client'
import { fetchAllMarks } from "@/app/actions/api";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const App: React.FC = () => {
    const fetchDataAndDownloadCSV = async () => {
        try {
            const data: any = await fetchAllMarks();
            console.log(data);
            const csv = Papa.unparse(data);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            
            saveAs(blob, "data.csv");
        } catch (error) {
            console.error("Error fetching data or converting to CSV", error);
        }
    };

    return (
        <div>
            <button className="h-[300px] w-[300px] bg-blue-300" onClick={fetchDataAndDownloadCSV}>Download CSV</button>
        </div>
    );
};

export default App;
