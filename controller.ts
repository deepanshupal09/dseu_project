import pool from './db';
import { 
    getUserByRollno as getUserByRollnoQuery,
    getPasswordByRollno as getPasswordByRollnoQuery,
    updateDetailsByRollno as updateDetailsByRollnoQuery,
 } from './queries';
import { Request, Response } from 'express';


const getUserByRollno= (req: Request, res: Response): void => {
    try{
        const rollno = req.headers.rollno;
        if (rollno) {
            pool.query(getUserByRollnoQuery,[rollno], (error, results) => {
                if (error) throw error;

                res.status(200).json(results.rows);
            });
        } else {
            res.status(400).send('RollNo Is required!');
        }
    }
    catch(error){
        res.status(400).send('There is some error encountered!');
        console.log("error: ",error);
    }
}

const getPasswordByRollno = (req: Request, res: Response): void => {
    try {
        const rollno = req.headers.rollno;
        const password = req.headers.password;

        if (rollno && password) {
            // First, check if the roll number exists
            pool.query(getPasswordByRollnoQuery, [rollno], (error, results) => {
                if (error) throw error;

                // If the roll number exists
                if (results.rows.length > 0) {
                    const dbPassword = results.rows[0].password;

                    // Check if the entered password matches the one in the database
                    if (dbPassword === password) {
                        res.status(200).send('Authentication successful!');
                    } else {
                        res.status(401).send('Incorrect password!');
                    }
                } else {
                    res.status(404).send('Roll number not found!');
                }
            });
        } else {
            res.status(400).send('Roll number and password are required!');
        }
    } catch (error) {
        res.status(400).send('There was an error processing your request.');
        console.log("error: ", error);
    }
}

const updateDetailsByRollno = (req: Request, res: Response): void => {
    try{
        const{ program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, last_modified, rollno } = req.body;
        pool.query(updateDetailsByRollnoQuery, [program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, last_modified, rollno], (error, results) => {
            if (error) throw error;
            res.status(200).send("Database successfully updated!");
        })
    }
    catch(error){
        res.status(400).send('There was an error processing your request.');
        console.log("error: ", error);
    }
}


export { getUserByRollno, getPasswordByRollno, updateDetailsByRollno};