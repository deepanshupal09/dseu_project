import express, { Express, Request, Response } from "express";
import routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import * as controller from "./controller";
import { verifyToken } from "./middleware";
import bodyParser from "body-parser";
import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";
import axios from "axios"; // Import Axios for making HTTP requests

dotenv.config();

const app = express();
const port = 8000;

// Define Multer storage for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "../../uploads")); // Define the destination folder for file uploads
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

app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
    if (!req.file) {
        console.log("error");
        return res.status(400).send({ message: "No file uploaded." });
    }

    // Validate the MIME type of the uploaded file to ensure it's an image
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path); // Delete the uploaded file
        return res.status(400).send({
            message: "Uploaded file must be an image (JPEG, PNG, or GIF).",
        });
    }

    // Get the new filename from the request headers (assuming it's sent as 'New-File-Name')
    const newFileName = req.headers.name as string;

    // Construct the new path with the new filename and the .jpg extension (or any other desired image extension)
    const newFilePath = path.resolve(
        __dirname,
        `../../uploads/${newFileName}.jpg`
    );

    // Rename the uploaded file with the new filename and the .jpg extension
    fs.renameSync(req.file.path, newFilePath);

    // Send the new filename as a custom header in the response
    res.setHeader("New-File-Name", newFileName);

    // Send the path of the uploaded file as the response body
    res.send(newFilePath);
});

// Other routes
app.get("/login", controller.login);
app.post("/signup", controller.signup);
app.post("/addUsers", controller.addUsers);
app.get("/getUserByRollno", controller.getUserByRollno);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
