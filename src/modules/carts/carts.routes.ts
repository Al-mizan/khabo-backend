import { Router } from "express";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";
import { CartsController } from "./carts.controller";

const router = Router();

router.get("/count", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), CartsController.getCartCount);
router.get("/", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), CartsController.getCart);
router.post("/", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), CartsController.createCart);
router.patch("/", logger, auth(UserRole.PROVIDER, UserRole.CUSTOMER), CartsController.updateCart);


export const cartsRoutes: Router = router;