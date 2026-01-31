import { UserUncheckedUpdateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getUser = async () => {
    return await prisma.user.findMany({
        where: {
            role: {
                not: 'ADMIN',
            }
        },
    });
}

const updateUser = async (id: string, data: Partial<UserUncheckedUpdateInput>) => {
    return await prisma.user.update({
        where: { id },
        data,
    });
}

export const AdminService = {
    getUser,
    updateUser,
};