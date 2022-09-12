import db from "../db/db.js";

export async function middlewareValidationUser (req, res, next){
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', "");

    if(!token){
        res.status(401).send("Token inválido");
    }

    const session = await db.collection('sessions').findOne({token});

    if(!session){
        res.status(401).send("Sessão inválida");
    }
    const user = await db.collection('users').findOne({
        _id: session.userID
    })
    if(!user){
        res.status(401).send("Usuário não encontrado")
    }

    res.locals.user = user;

    next();
}