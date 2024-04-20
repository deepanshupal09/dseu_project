import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface User {
  name: string;
  rollno: string;
  program: string;
  semester: number;
  phone: string;
  campus: string;
  emailid: string;
  gender: string;
  alternate_phone: string|null;
  father: string|null;
  mother: string|null;
  guardian: string|null;
  abc_id: string;
  password: string;
  aadhar: string;
  pwbd_certificate: string | null;
  last_modified: string; 
  program_type: string;
  iat: number;
  exp: number;
}
interface AuthenticatedRequest extends Request {
  user?: User; 
}
  

// export async function authenticateUser(req:Request, res: Response, next: NextFunction) {
//     try {

//         const token:string = req.headers.token as string;
//         const rollno:string = req.headers.rollno as string;
        
        
//         if(!token) {
//             return res.status(401).send("Unauthorized");
//         }
        
//         const tokenData = await verifyTokenByRollNo(rollno);
//         console.log(tokenData)
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

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.token as string;
    if (!token) return res.status(401).send('Access Denied');
  
    try {
      const decoded: any = jwt.verify(token, 'chotahathi');
      console.log("user: ",decoded);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  };
  
