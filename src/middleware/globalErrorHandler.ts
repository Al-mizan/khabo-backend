import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../prisma/generated/prisma/client";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;

    // PrismaClientValidationError
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provided incorrect fields type or missing required fields!";
    }
    // PrismaClientKnownRequestError
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                statusCode = 409;
                errorMessage = "Unique constraint failed!";
                break;
            case 'P2025':
                statusCode = 404;
                errorMessage = "Record not found!";
                break;
            case 'P2003':
                statusCode = 400;
                errorMessage = "Foreign key constraint failed!";
                break;
            default:
                statusCode = 400;
                errorMessage = "Database request error!";
        }
    }
    // PrismaClientUnknownRequestError
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Unknown database error occurred!";
    }
    // PrismaClientRustPanicError
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        errorMessage = "A panic occurred in the query engine!";
    }
    // PrismaClientInitializationError
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        switch (err.errorCode) {
            case 'P1012':
                statusCode = 503;
                errorMessage = "Database connection failed!";
                break;
            case 'P1013':
                statusCode = 503;
                errorMessage = "Environment variable not found!";
                break;
            default:
                statusCode = 503;
                errorMessage = "Prisma client initialization error!";
        }
    }

    res.status(statusCode)
    res.json({
        success: false,
        error: errorMessage,
        details: errorDetails,
    })
}


export default errorHandler;