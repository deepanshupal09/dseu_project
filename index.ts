import express, { Express, Request, Response } from "express";
import routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import * as controller from "./controller";
import { verifyAdmin, verifyToken } from "./middleware";
import bodyParser from "body-parser";
import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";
import adminRoutes from "./adminRoutes"
import sharp from 'sharp';


dotenv.config();

const app = express();
const port = 8000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload: Multer = multer({ storage });

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/data/", verifyToken, routes);
app.use("/api/admin/",verifyAdmin,adminRoutes);

app.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
    console.log("yasu", req.file);
    if (!req.file) {
        console.log("error");
        return res.status(400).send({ message: "No file uploaded." });
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).send({
            message: "Uploaded file must be an image (JPEG, PNG, or GIF).",
        });
    }

    const newFileName = req.headers.name as string;
    console.log("uploaded filename: ", newFileName);
    const newFilePath = path.resolve(
        '/home/dseu/Desktop/uploads/',
        `${newFileName}.png`
    );

    // Move uploaded image to destination folder
    fs.renameSync(req.file.path, newFilePath);

    // Compress the image
    try {
        const compressedFilePath = path.resolve(
            '/home/dseu/Desktop/uploads/',
            `${newFileName}_compressed.png`
        );

        await sharp(newFilePath)
            .png({ quality: 80 })
            .resize(400,400)
            .toFile(compressedFilePath);

        // Replace the original file with the compressed one
        fs.unlinkSync(newFilePath);
        fs.renameSync(compressedFilePath, newFilePath);
    } catch (error) {
        console.error("Error compressing image:", error);
        return res.status(500).send({ message: "Error compressing image." });
    }

    res.setHeader("New-File-Name", newFileName);
    res.send({ path: `/image/${newFileName}.png` });
});



// Other routes
app.get("/login", controller.login);
app.post("/signup", controller.signup);
app.post("/addUsers", controller.addUsers);
// app.get("/getUserByRollno", controller.getUserByRollno);
// app.get("/fetchCoursesByRollNo", controller.fetchCoursesByRollNo);
// app.get("/fetchProgramByProgramType", controller.fetchProgramByProgramType);
app.get("/fetchEmailIdByRollno", controller.fetchEmailIdByRollno);
// app.get("/fetchExamRegistrationByCourseCode", controller.fetchExamRegistrationByCourseCode);
app.get("/sendEmail", controller.sendEmail);
app.get("/verifyOtpAndPassword", controller.verifyOtpAndPassword);
app.get("/updatePasswordByOtp", controller.updatePasswordByOtp);
// app.get("/fetchExamRegistrationByProgramAndSemester", controller.fetchExamRegistrationByProgramAndSemester);
// app.get("/fetchStudentByProgramAndSemester", controller.fetchStudentByProgramAndSemester);
// app.get("/fetchStudentByCampusAndProgram", controller.fetchStudentByCampusAndProgram);
app.get("/loginByEmailId", controller.loginByEmailId);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
