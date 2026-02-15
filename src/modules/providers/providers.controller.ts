import { NextFunction, Request, Response } from "express";
import { ProvidersService } from "./providers.service";
import paginationSortingHelper from "../../helper/paginationSortingHelper";

/**
 * GET /providers
 * Get all providers
 */
const getAllProviders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const searchTerm = req.query.searchTerm as string | undefined;
        const isOpen = req.query.isOpen === "true" ? true
            : req.query.isOpen === "false" ? false
                : undefined;

        const result = await ProvidersService.getAllProviders({
            page, limit, skip, sortBy, sortOrder,
            searchTerm, isOpen,
        });

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /providers/:id
 * Get provider by ID
 */
const getProviderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) throw new Error("Provider ID is required");

        const result = await ProvidersService.getProviderById(id as string);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /providers/provider-profile
 * Create provider profile (Auth: PROVIDER)
 */
const createProviderProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");
        if (user.role !== "PROVIDER") {
            throw new Error("Forbidden! Only providers can create provider profiles.");
        }

        req.body.user_id = user.id;
        const result = await ProvidersService.createProviderProfile(req.body);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   MEAL CONTROLLERS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * GET /providers/:providerId/meals
 * Get all meals for a provider
 */
const getMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { providerId } = req.params;
        if (!providerId) throw new Error("Provider ID is required");

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const name = req.query.name as string | undefined;
        const price = typeof req.query.price === "string" ? Number(req.query.price) : undefined;

        let cuisine: string | string[] | undefined;
        if (typeof req.query.cuisine === "string") {
            cuisine = req.query.cuisine.includes(",")
                ? req.query.cuisine.split(",").map((c) => c.trim())
                : req.query.cuisine;
        } else if (Array.isArray(req.query.cuisine)) {
            cuisine = req.query.cuisine as string[];
        }

        const result = await ProvidersService.getMealsByProviderId(providerId as string, {
            page, limit, skip, sortBy, sortOrder,
            name, cuisine, price,
        });

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /providers/:providerId/meals
 * Create a meal for a provider (Auth: PROVIDER)
 */
const createMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");
        if (user.role !== "PROVIDER") {
            throw new Error("Forbidden! You don't have access to create a meal.");
        }

        const { providerId } = req.params;
        if (!providerId) throw new Error("Provider ID is required");

        req.body.provider_id = providerId;
        const result = await ProvidersService.createMeal(req.body);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /providers/:providerId/meals/:mealId
 * Get a specific meal by ID
 */
const getMealById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { providerId, mealId } = req.params;
        if (!providerId) throw new Error("Provider ID is required");
        if (!mealId) throw new Error("Meal ID is required");

        const result = await ProvidersService.getMealById(providerId as string, mealId as string);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /providers/:providerId/meals/:mealId
 * Update a meal (Auth: PROVIDER)
 */
const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { providerId, mealId } = req.params;
        if (!providerId) throw new Error("Provider ID is required");
        if (!mealId) throw new Error("Meal ID is required");

        const result = await ProvidersService.updateMeal(providerId as string, mealId as string, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /providers/:providerId/meals/:mealId
 * Delete a meal (Auth: PROVIDER)
 */
const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { providerId, mealId } = req.params;
        if (!providerId) throw new Error("Provider ID is required");
        if (!mealId) throw new Error("Meal ID is required");

        const result = await ProvidersService.deleteMeal(providerId as string, mealId as string);
        res.status(200).json({
            success: true,
            message: "Meal deleted successfully",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   ORDER CONTROLLERS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * PATCH /providers/orders/:orderId
 * Update order status (Auth: PROVIDER)
 */
const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        const { orderId } = req.params;
        if (!orderId) throw new Error("Order ID is required");

        const result = await ProvidersService.updateOrderStatus(orderId as string, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════════════════════════ */

export const ProvidersController = {
    // Provider
    getAllProviders,
    getProviderById,
    createProviderProfile,
    // Meals
    getMeals,
    createMeal,
    getMealById,
    updateMeal,
    deleteMeal,
    // Orders
    updateOrderStatus,
};