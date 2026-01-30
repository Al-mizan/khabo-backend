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
        const {id} = req.params;
        if(!id) {
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

export const ProvidersController = {
    getAllProviders,
    getProviderById,
    
};