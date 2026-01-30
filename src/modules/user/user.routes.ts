import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { UserController } from "./user.controller";

const router = Router();

router.get("/me", logger, auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), UserController.getMe);
router.patch("/me", logger, auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), UserController.updateMe);


export const userRoutes: Router = router;