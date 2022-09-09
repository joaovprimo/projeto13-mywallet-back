import express from "express";
import cors from 'cors';
import joi from 'joi';
import dayjs from  'dayjs';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import {MongoClient} from 'mongodb';

dotenv.config();
const token = uuid();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(()=>{
    db = mongoClient.db('wallet');
});

const singInSchema = joi.object({
    email: joi.string().required(),
    senha: joi.string().required()
})

const singUpSchema = joi.object({
    email: joi.string().required(),
    nome: joi.string().required(),
    senha:joi.string().required()
})



app.post('/singup', async(req,res)=>{
    const {email, senha, nome} = req.body;
    const validation = singUpSchema.validate({email, senha, nome}, {abortEarly: false});

    if(validation.error){
        return res.status(422).send('algo de errado no validation 1');
    }
     const hashPassword = bcrypt.hashSync(senha,13);

     try{
        const user = await db.collection('users').findOne({email});
        if(!user){
            db.collection('users').insertOne({
                nome,
                email,
                senha: hashPassword
        })
        }
        else{
            res.status(409).send("Email já cadastrado em outra conta")
        }
    }
     catch(error){
        console.log(error);
      return res.sendStatus(500);
     }

     return res.sendStatus(201);     
});

app.post('/singin', async(req, res)=>{
    const {email, senha} = req.body;
    

})



app.listen(5000, ()=>{
    console.log('listening 5000');
})