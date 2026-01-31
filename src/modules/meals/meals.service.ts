
import { prisma } from "../../lib/prisma";
import { MealsWhereInput } from "../../../prisma/generated/prisma/models";
import { GetMealsParams } from "./meals.interface";


const getMeals = async (query: GetMealsParams) => {
    const { name, cuisine, price, page, limit, skip, sortBy, sortOrder } = query;

    const andConditions: MealsWhereInput[] = [];

    if (name) {
        andConditions.push({
            name: {
                contains: name,
                mode: "insensitive"
            }
        });
    }
    if (cuisine) {
        if (Array.isArray(cuisine)) {
            andConditions.push({
                category: {
                    name: {
                        in: cuisine
                    }
                }
            });
        } else {
            andConditions.push({
                category: { name: cuisine }
            });
        }
    }
    if (price !== undefined) {
        andConditions.push({
            price: {
                lte: price
            }
        });
    }


    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    const [meals, total] = await Promise.all([
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
        data: meals,
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
