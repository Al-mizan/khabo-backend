import { NextFunction, Request, Response } from "express";
import { CategoriesService } from "./categories.service";

const createCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        if (user.role === "CUSTOMER") {
            throw new Error("Forbidden! Only providers or admin can create categories of meals.");
        }
        const result = await CategoriesService.createCategories(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const updateCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        if (user.role === "CUSTOMER") {
            throw new Error("Forbidden! Only providers or admin can update categories of meals.");
        }
        const { categoryId } = req.params;
        if(!categoryId) throw new Error("Category ID is required for update.");
        const result = await CategoriesService.updateCategories(req.body, categoryId as string);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

export const CategoriesController = {
    createCategories,
    updateCategories,

};