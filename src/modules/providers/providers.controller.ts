import { NextFunction, Request, Response } from "express";
import { ProvidersService } from "./providers.service";

const getAllProviders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProvidersService.getAllProviders();
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const getProviderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("Provider ID is required");
        }
        const result = await ProvidersService.getProviderById(id as string);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const createProviderProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        if (user.role !== "PROVIDER") {
            throw new Error("Forbidden! Only providers can create provider profiles.");
        }
        req.body.user_id = user.id;

        const result = await ProvidersService.createProviderProfile(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const createMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        if (user.role !== "PROVIDER") {
            throw new Error("Forbidden! You don't have access to create a meal.");
        }
        const result = await ProvidersService.createMeal(req.body);
        res.status(201).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const getMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProvidersService.getMeals();
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const getMealById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mealId } = req.params;
        if (!mealId) {
            throw new Error("Meal ID is required");
        }
        const result = await ProvidersService.getMealById(mealId as string);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mealId } = req.params;
        if (!mealId) {
            throw new Error("Meal ID is required");
        }
        const result = await ProvidersService.updateMeal(mealId as string, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mealId } = req.params;
        if (!mealId) {
            throw new Error("Meal ID is required");
        }
        const result = await ProvidersService.deleteMeal(mealId as string);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");
        const { orderId } = req.params;
        if (!orderId) {
            throw new Error("Order ID is required");
        }
        const result = await ProvidersService.updateOrderStatus(orderId as string, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const ProvidersController = {
    getAllProviders,
    getProviderById,
    createProviderProfile,
    createMeal,
    getMeals,
    getMealById,
    updateMeal,
    deleteMeal,
    updateOrderStatus,
};