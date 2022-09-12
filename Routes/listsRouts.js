import { getList, postList } from "../controllers/list.js"
import express, { application } from "express";
import { middlewareValidationUser } from "../Middleware/middlewareValidationUser.js";

const router = express.Router();

router.use(middlewareValidationUser);

router.get('/list', getList);

router.post('/list', postList);

export default router;