import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";

const router = Router();

router.post("/", logger, auth(UserRole.PROVIDER), );


export const ordersRoutes: Router = router;