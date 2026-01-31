import { OrdersUncheckedCreateInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";

// order and orderItems conflicts, how can i implement?
const createOrder = async (data: OrdersUncheckedCreateInput)=> {
    return await prisma.orders.create({
        data,
    });
}

export const OrdersService = {
    createOrder,
    
};