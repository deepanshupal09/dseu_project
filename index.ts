import express, {Express, Request, Response} from "express";
import routes from './routes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use('/api/data/', routes);


app.get("/", (req: Request, res: Response) => {
})


app.listen(port, ()=> {
    console.log(`listening to port ${port}`)
});