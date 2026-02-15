import { CategoriesUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createCategories = (data: CategoriesUncheckedCreateInput) => {
    return prisma.categories.create({
        data,
    });
}

const getCategories = () => {
    return prisma.categories.findMany();
}

const updateCategories = (data: CategoriesUncheckedCreateInput, id: string) => {
    return prisma.categories.update({
        where: { id },
        data,
    });
};

export const CategoriesService = {
    createCategories,
    updateCategories,
    getCategories,

};