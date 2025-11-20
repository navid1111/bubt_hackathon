import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const getAllResources = async () => {
    return prisma.resource.findMany({
        orderBy: [
            { createdAt: 'desc' }
        ]
    });
};

const getResourceById = async (id: string) => {
    return prisma.resource.findUnique({
        where: { id }
    });
};

export const resourcesRepository = {
    getAllResources,
    getResourceById,
};