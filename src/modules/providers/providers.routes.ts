import { Router } from "express";
import logger from "../../middleware/logger";
import { ProvidersController } from "./providers.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";

const router = Router();

router.get("/", logger, ProvidersController.getAllProviders);

router.get("/:providerId/meals", logger, ProvidersController.getMeals);
router.post("/:providerId/meals", logger, auth(UserRole.PROVIDER), ProvidersController.createMeal);
router.get("/:providerId/meals/:mealId", logger, ProvidersController.getMealById);
router.patch("/:providerId/meals/:mealId", logger, auth(UserRole.PROVIDER), ProvidersController.updateMeal);
router.delete("/:providerId/meals/:mealId", logger, auth(UserRole.PROVIDER), ProvidersController.deleteMeal);

router.post("/provider-profile", logger, auth(UserRole.PROVIDER), ProvidersController.createProviderProfile);
router.get("/:id", logger, ProvidersController.getProviderById);
router.patch("/orders/:orderId", logger, auth(UserRole.PROVIDER), ProvidersController.updateOrderStatus);

export const providersRoutes: Router = router;