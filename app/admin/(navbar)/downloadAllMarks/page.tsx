import { fetchAllMarks } from "@/app/actions/api";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const App: React.FC = () => {
    const fetchDataAndDownloadCSV = async () => {
        try {
            const data: any = await fetchAllMarks();
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
