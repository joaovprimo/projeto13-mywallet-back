import { getList, postList, deleteInfo } from "../controllers/list.js"
import express from "express";
import { middlewareValidationUser } from "../Middleware/middlewareValidationUser.js";

const router = express.Router();

router.use(middlewareValidationUser);

router.get('/list', getList);

router.post('/list', postList);

router.delete('/delete/:idInfo', deleteInfo);

export default router;