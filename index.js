import express from "express";
import cors from 'cors';
import listsRouter from "./Routes/listsRouts.js"
import authsRouter from "./Routes/authsRouts.js";


const app = express();
app.use(express.json());
app.use(cors());

app.use(authsRouter);
app.use(listsRouter);

app.listen(5000, ()=>{
    console.log('listening 5000');
})