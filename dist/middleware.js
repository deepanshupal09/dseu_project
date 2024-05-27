"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// export async function authenticateUser(req:Request, res: Response, next: NextFunction) {
//     try {
//         const token:string = req.headers.token as string;
//         const rollno:string = req.headers.rollno as string;
//         if(!token) {
//             return res.status(401).send("Unauthorized");
//         }
//         const tokenData = await verifyTokenByRollNo(rollno);
//         
//         if (tokenData.token !== token) {
//             return res.status(401).json("Unauthorized! Token didn't match");
//         }
//         if (new Date(tokenData.expiry) < new Date()) {
//             return res.status(401).json("Unauthorized! Token expired");
//         }
//         next();
//     } catch(error) {
//         console.error("Authentication error: ", error);
//         return res.status(500).json('Internal Server Error');
//     }
// }
const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (!token)
        return res.status(401).send('Access Denied');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'chotahathi');
        
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).send('Invalid Token');
    }
};
exports.verifyToken = verifyToken;
