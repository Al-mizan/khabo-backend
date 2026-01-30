import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        const result = await UserService.getMe(user.id);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) throw new Error("You are unauthorized!");

        req.body.id = user.id;

        const result = await UserService.updateMe(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (err) {
        next(err);
    }
};

export const UserController = {
    getMe,
    updateMe,

};