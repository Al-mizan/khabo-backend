
import { prisma } from "../../lib/prisma";
import { MealsWhereInput } from "../../../prisma/generated/prisma/models";
import { GetMealsParams } from "./meals.interface";

/**
 * Get all meals with pagination, filtering & sorting
 */
const getMeals = async (query: GetMealsParams) => {
    const { page, limit, skip, sortBy, sortOrder, name, cuisine, price } = query;

    const andConditions: MealsWhereInput[] = [];

    // Search by meal name
    if (name) {
        andConditions.push({
            name: { contains: name, mode: "insensitive" },
        });
    }

    // Filter by cuisine / category
    if (cuisine) {
        if (Array.isArray(cuisine)) {
            andConditions.push({ category: { name: { in: cuisine } } });
        } else {
            andConditions.push({ category: { name: cuisine } });
        }
    }

    // Filter by max price
    if (price !== undefined) {
        andConditions.push({ price: { lte: price } });
    }

    const where: MealsWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const [data, total] = await Promise.all([
        prisma.meals.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: { category: true },
        }),
        prisma.meals.count({ where }),
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getMealById = async (mealId: string) => {
    return await prisma.meals.findFirstOrThrow({
        where: { id: mealId },
        include: { category: true },
    });
};

export const MealsService = {
    getMeals,
    getMealById,
};
