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
        }
    });
}

export const ProvidersService = {
    getAllProviders,
    getProviderById,

};