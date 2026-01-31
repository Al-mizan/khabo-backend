import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { AdminController } from "./admin.controller";

const router = Router();

router.get('/users', logger, auth(UserRole.ADMIN), AdminController.getUser);
router.patch('/users/:id', logger, auth(UserRole.ADMIN), AdminController.updateUser);


export const adminRoutes: Router = router;