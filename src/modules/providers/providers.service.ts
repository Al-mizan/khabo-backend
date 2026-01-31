import { MealsUncheckedCreateInput, ProviderProfilesUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { OrderStatus, PaymentStatus } from "../../../prisma/generated/prisma/enums";
import parseTimeString from "../../helper/parseTimeString";
import { prisma } from "../../lib/prisma";

// pagination, filtering, etc. can be added later
const getAllProviders = async () => {
    return await prisma.user.findMany({
        where: {
            role: 'PROVIDER',
        }
    });
}

const getProviderById = async (providerId: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: {
            id: providerId,
        },
        include: {
            providerProfile: true,
        }
    });
}

const createProviderProfile = async (data: ProviderProfilesUncheckedCreateInput) => {
    if (!data.user_id) throw new Error("User ID is required to create provider profile.");

    const opening_time = typeof data.opening_time === 'string'
        ? parseTimeString(data.opening_time)
        : data.opening_time;
    const closing_time = typeof data.closing_time === 'string'
        ? parseTimeString(data.closing_time)
        : data.closing_time;

    return await prisma.providerProfiles.create({
        data: {
            ...data,
            opening_time,
            closing_time,
        },
    });
};

const createMeal = async (data: MealsUncheckedCreateInput) => {
    return await prisma.meals.create({
        data,
    })
}

// have to perform pagination and filters later
const getMeals = async () => {
    return await prisma.meals.findMany();
}

const getMealById = async (mealId: string) => {
    return await prisma.meals.findFirstOrThrow({
        where: { id: mealId },
    });
}

const updateMeal = async (id: string, data: Partial<MealsUncheckedCreateInput>) => {
    return await prisma.meals.update({
        where: { id },
        data,
    });
};

const deleteMeal = async (id: string) => {
    return await prisma.meals.delete({
        where: { id },
    });
};

const updateOrderStatus = async (orderId: string, data: { status?: OrderStatus, payment_status?: PaymentStatus }) => {
    const updateData: { status?: OrderStatus; payment_status?: PaymentStatus } = {};
    if (data.status) updateData.status = data.status;
    if (data.payment_status) updateData.payment_status = data.payment_status;

    return await prisma.orders.update({
        where: { id: orderId },
        data: updateData,
    });
};

export const ProvidersService = {
    getAllProviders,
    getProviderById,
    createProviderProfile,
    createMeal,
    getMeals,
    getMealById,
    updateMeal,
    deleteMeal,
    updateOrderStatus,
};