import express, { Express, Request, Response } from "express";
import routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import * as controller from "./controller";
import { verifyToken } from "./middleware";
import bodyParser from "body-parser";
import multer, { Multer } from "multer";
import path from "path";
import axios from "axios"; // Import Axios for making HTTP requests

dotenv.config();

const app = express();
const port = 8003;

// Define Multer storage for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "../uploads")); // Define the destination folder for file uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Define the filename for the uploaded file
    },
});

// Initialize Multer upload with the defined storage
const upload: Multer = multer({ storage });

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/data/", verifyToken, routes);

// Upload endpoint
app.post(
    "/upload",
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "pwbdCertificate", maxCount: 1 },
    ]),
    async (req: Request & { files: any }, res: Response) => {
        const {
            program,
            semester,
            father,
            mother,
            campus,
            emailid,
            gender,
            phone,
            alternate_phone,
            guardian,
            rollno,
            password,
            program_type,
            dateOfBirth,
            aadharCard,
            abcId,
            yearOfAdmission,
        } = req.body;

        // Check if files were uploaded
        if (
            !req.files ||
            !req.files["photo"] ||
            !req.files["pwbdCertificate"]
        ) {
            return res.status(400).send("Files not uploaded.");
        }

        // Get the paths of the uploaded files
        const photoPath = req.files["photo"][0].path;
        const pwbdCertificatePath = req.files["pwbdCertificate"][0].path;

        // Replace the photo and pwbdCertificate fields with their paths
        const updatedBody = {
            program,
            semester,
            father,
            mother,
            campus,
            emailid,
            gender,
            phone,
            alternate_phone,
            guardian,
            rollno,
            password,
            program_type,
            dateOfBirth,
            aadharCard,
            abcId,
            yearOfAdmission,
            photo: photoPath,
            pwbdCertificate: pwbdCertificatePath,
        };

        // Log the uploaded files paths
        console.log("Uploaded photo path:", photoPath);
        console.log("Uploaded pwbdCertificate path:", pwbdCertificatePath);

        try {
            // Get the token from the request headers
            const token = req.headers.token;

            // Call the updateDetailsByRollno API with token in headers
            const updateResponse = await axios.post(
                "http://localhost:8003/api/data/updateDetailsByRollno",
                updatedBody,
                {
                    headers: {
                        token: token, // Pass token as authorization header
                    },
                }
            );

            // Log the response from the updateDetailsByRollno API
            console.log(
                "Response from updateDetailsByRollno:",
                updateResponse.data
            );

            // Respond with success message
            res.send("Files successfully uploaded and details updated.");
        } catch (error) {
            console.error("Error updating details:", error);
            res.status(500).send("Error updating details.");
        }
    }
);

// Other routes
app.get("/login", controller.login);
app.post("/signup", controller.signup);
app.post("/addUsers", controller.addUsers);
app.get("/getUserByRollno", controller.getUserByRollno);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
