import { NextFunction, Request, Response } from "express";
import { OrdersService } from "./orders.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const result = await OrdersService.createOrder(req.body);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const OrdersController = {
    createOrder,

};