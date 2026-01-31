import { Router } from "express";
import logger from "../../middleware/logger";
import { MealsController } from "./meals.controller";

const router = Router();

router.get("/", logger, MealsController.getMeals);
router.get("/:mealId", logger, MealsController.getMealById);

export const mealsRoutes: Router = router;
