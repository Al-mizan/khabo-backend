import { Router } from "express";
import logger from "../../middleware/logger";
import { ProvidersController } from "./providers.controller";

const router = Router();

router.get("/", logger, ProvidersController.getAllProviders);
router.get("/:id", logger, ProvidersController.getProviderById);


export const providersRoutes: Router = router;