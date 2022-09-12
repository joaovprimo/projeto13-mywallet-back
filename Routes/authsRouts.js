import express from "express";
import { SingInSechema, SingUpSchema } from "../Middleware/MiddlewareSchemaAuthValidation.js";
import { singin, singup } from "../controllers/auth.js"

const router = express.Router();

router.post('/singin', SingInSechema, singin);

router.post('/singup', SingUpSchema, singup);

export default router;