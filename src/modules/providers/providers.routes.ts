import { Router } from "express";
import logger from "../../middleware/logger";
import { ProvidersController } from "./providers.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../constants/roles";

const router = Router();

router.get("/", logger, ProvidersController.getAllProviders);

router.get("/meals", logger, ProvidersController.getMeals);
router.post("/meals", logger, auth(UserRole.PROVIDER), ProvidersController.createMeal);
router.get("/meals/:mealId", logger, ProvidersController.getMealById);
router.patch("/meals/:mealId", logger, auth(UserRole.PROVIDER), ProvidersController.updateMeal);
router.delete("/meals/:mealId", logger, auth(UserRole.PROVIDER), ProvidersController.deleteMeal);

router.post("/provider-profile", logger, auth(UserRole.PROVIDER), ProvidersController.createProviderProfile);
router.get("/:id", logger, ProvidersController.getProviderById);
// router.patch("orders/:id", logger, auth(UserRole.PROVIDER),);

export const providersRoutes: Router = router;