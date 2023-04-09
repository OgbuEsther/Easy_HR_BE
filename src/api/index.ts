import { Router } from "express";
import homeRouter from "../routes/homeRoutes";
import userRoutes from "../routes/authroutes";
const router = Router();

router.use("/", homeRouter);
router.use("/auth", userRoutes);

export default router;
