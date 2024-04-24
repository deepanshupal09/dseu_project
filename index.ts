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
const port = 8000;

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

app.post(
    "/upload",
    upload.single("image"),
    (req: Request, res: Response) => {
        if (!req.file) {
            console.log("error")
            return res.status(400).send({message: "No file uploaded."});
        }
        
        const uploadedImagePath = path.resolve(req.file.path);
        console.log("Uploaded image path:", uploadedImagePath);
        res.send(uploadedImagePath);
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
