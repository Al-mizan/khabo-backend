import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { OrdersController } from "./orders.controller";

const router = Router();

router.post("/", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), OrdersController.createOrder);


export const ordersRoutes: Router = router;