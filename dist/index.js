"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const controller = __importStar(require("./controller"));
const middleware_1 = require("./middleware");
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8000;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.resolve(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/data/", middleware_1.verifyToken, routes_1.default);
app.post("/upload", upload.single("image"), (req, res) => {
    
    if (!req.file) {
        
        return res.status(400).send({ message: "No file uploaded." });
    }
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        fs_1.default.unlinkSync(req.file.path);
        return res.status(400).send({
            message: "Uploaded file must be an image (JPEG, PNG, or GIF).",
        });
    }
    const newFileName = req.headers.name;
    const newFilePath = path_1.default.resolve(__dirname, `../../../dseu_project/public/uploads/${newFileName}.jpg`);
    fs_1.default.renameSync(req.file.path, newFilePath);
    res.setHeader("New-File-Name", newFileName);
    res.send({ path: `/uploads/${newFileName}.jpg` });
});
// Other routes
app.get("/login", controller.login);
app.post("/signup", controller.signup);
app.post("/addUsers", controller.addUsers);
// app.get("/getUserByRollno", controller.getUserByRollno);
app.get("/fetchCoursesByRollNo", controller.fetchCoursesByRollNo);
app.get("/fetchProgramByProgramType", controller.fetchProgramByProgramType);
app.get("/fetchEmailIdByRollno", controller.fetchEmailIdByRollno);
app.get("/sendEmail", controller.sendEmail);
app.get("/verifyOtpAndPassword", controller.verifyOtpAndPassword);
app.get("/updatePasswordByOtp", controller.updatePasswordByOtp);
app.get("/fetchExamRegistrationByProgramAndSemester", controller.fetchExamRegistrationByProgramAndSemester);
app.get("/fetchStudentByProgramAndSemester", controller.fetchStudentByProgramAndSemester);
app.get("/fetchStudentByCampusAndProgram", controller.fetchStudentByCampusAndProgram);
app.get("/loginByEmailId", controller.loginByEmailId);
// Start the server
app.listen(port, () => {
    
});
