import express, {Express, Request, Response} from "express";
import routes from './routes';
import cors from 'cors';
import dotenv from 'dotenv';
// import { authenticateUser } from "./middleware";
import * as controller from './controller';
import { verifyToken } from "./middleware";
import bodyParser from 'body-parser'; // Import body-parser



dotenv.config();

const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true }));


app.use('/api/data/',verifyToken, routes);
app.get("/", (req: Request, res: Response) => {
})

app.get("/login", controller.login);
app.post("/signup", controller.signup);

app.post("/addUsers",controller.addUsers);

app.listen(port, ()=> {
    console.log(`listening to port ${port}`)
}); 