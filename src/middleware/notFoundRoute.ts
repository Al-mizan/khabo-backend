import { Request, Response } from "express";

export const notFoundRoute = async (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route is not found",
        path: req.originalUrl,
        date: new Date(),
    });
}
