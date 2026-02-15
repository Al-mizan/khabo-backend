import { NextFunction, Request, Response } from "express";
import { CartsService } from "./carts.service";

const createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const result = await CartsService.createCart(user.id, req.body);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const result = await CartsService.updateCart(user.id, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getCartCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const result = await CartsService.getCartCount(user.id);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const result = await CartsService.getCart(user.id);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const CartsController = {
    createCart,
    updateCart,
    getCartCount,
    getCart,
};