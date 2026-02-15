
import { prisma } from "../../lib/prisma";
import { MealsWhereInput } from "../../../prisma/generated/prisma/models";
import { GetMealsParams } from "./meals.interface";

/**
 * Get all meals with pagination, filtering & sorting
 */
const getMeals = async (query: GetMealsParams) => {
    const { page, limit, skip, sortBy, sortOrder, name, cuisine, maxPrice, minPrice } = query;
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
    if (maxPrice !== undefined) {
        andConditions.push({ price: { lte: maxPrice } });
    }

    // Filter by min price
    if (minPrice !== undefined) {
        andConditions.push({ price: { gte: minPrice } });
    }

    const where: MealsWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const [meals, total] = await Promise.all([
        prisma.meals.findMany({
            where,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                user: {
                    include: {
                        providerProfile: {
                            select: {
                                restaurant_name: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.meals.count({ where }),
    ]);

    const data = meals.map((meal) => ({
        ...meal,
        restaurant_name: meal.user.providerProfile?.restaurant_name ?? null,
    }));

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
    const meal = await prisma.meals.findFirstOrThrow({
        where: { id: mealId },
        include: {
            user: {
                include: {
                    providerProfile: {
                        select: {
                            restaurant_name: true,
                        },
                    },
                },
            },
        },
    });
    const data = {
        ...meal,
        restaurant_name: meal.user.providerProfile?.restaurant_name ?? null,
    };
    return data;
};

export const MealsService = {
    getMeals,
    getMealById,
};
