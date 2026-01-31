import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { UserRole } from "../../constants/roles";


const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        if (user.role !== UserRole.ADMIN) {
            throw new Error("Forbidden Access!");
        }
        const result = await AdminService.getUser();
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are Unauthorized!");
        }
        if (user.role !== UserRole.ADMIN) {
            throw new Error("Forbidden Access!");
        }
        const { id } = req.params;
        if (!id) throw new Error("User ID is required");
        
        const result = await AdminService.updateUser(id as string, req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const AdminController = {
    getUser,
    updateUser,

};