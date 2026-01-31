import { NextFunction, Request, Response } from "express";
import { OrdersService } from "./orders.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const { provider_id, delivery_address } = req.body;
        if (!provider_id) {
            throw new Error("Provider ID is required to place an order.");
        }
        const result = await OrdersService.createOrder(user.id, provider_id, delivery_address as string | undefined);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const result = await OrdersService.getOrder(user.id);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getOrderNyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        const { order_id } = req.params;
        const result = await OrdersService.getOrderById(order_id as string);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const OrdersController = {
    createOrder,
    getOrder,
    getOrderNyId,
};