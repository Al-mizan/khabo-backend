import { Request, Response, NextFunction } from "express";
import { MealsService } from "./meals.service";
import paginationSortingHelper from "../../helper/paginationSortingHelper";


const getMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let cuisine: string | string[] | undefined;   // chinese, italian, etc.
        if (typeof req.query.cuisine === 'string') {
            if (req.query.cuisine.includes(',')) {
                cuisine = req.query.cuisine.split(',').map((c) => c.trim());
            } else {
                cuisine = req.query.cuisine;
            }
        } else if (Array.isArray(req.query.cuisine)) {
            cuisine = req.query.cuisine as string[];
        } else {
            cuisine = undefined;
        }
        const name = req.query.name as string | undefined;
        const price = typeof req.query.price === 'string' ? Number(req.query.price) : undefined;
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const result = await MealsService.getMeals({
            name, cuisine, price, page, limit, skip, sortBy, sortOrder,
        });

        res.status(200).json({
            success: true,
            ...result,
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
        const result = await MealsService.getMealById(mealId as string);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const MealsController = {
    getMeals,
    getMealById,
}