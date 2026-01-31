import { prisma } from "../../lib/prisma";


const createOrder = async (user_id: string, provider_id: string, delivery_address?: string) => {
    return await prisma.$transaction(async (ts) => {
        // 1. Find the cart for this user and provider
        const cart = await ts.carts.findFirst({
            where: {
                user_id,
                provider_id,
                status: "ACTIVE",
            },
            include: {
                cartItems: true,
            }
        });

        if (!cart || cart.cartItems.length === 0) {
            throw new Error("Cart not found or empty");
        }

        // 2. Get user's delivery address
        const user = await ts.user.findUnique({
            where: { id: user_id },
            select: { address: true }
        });

        if (!user?.address && !delivery_address) {
            throw new Error("Delivery address not found. Please update your address or provide a delivery address.");
        }

        // Use provided delivery_address first, fallback to user's address
        const finalDeliveryAddress = delivery_address || user?.address as string;

        // 3. Create order with orderItems in one query using nested create
        const order = await ts.orders.create({
            data: {
                user_id,
                provider_id,
                total_amount: cart.total_price,
                delivery_address: finalDeliveryAddress,
                orderItems: {
                    createMany: {
                        data: cart.cartItems.map((item) => ({
                            meal_id: item.meal_id,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            sub_total_amount: item.sub_total_amount,
                        }))
                    }
                }
            },
            include: {
                orderItems: {
                    include: {
                        meal: {
                            select: { name: true, image_url: true }
                        }
                    }
                }
            }
        });

        // 4. Update cart status to ORDERED
        await ts.carts.update({
            where: { id: cart.id },
            data: { status: "ORDERED" }
        });

        return order;
    });
}

const getOrder = async (user_id: string) => {
    return await prisma.orders.findMany({
        where: { user_id },
        include: {
            orderItems: {
                include: {
                    meal: {
                        select: { name: true, image_url: true }
                    }
                }
            }
        },
        orderBy: { created_at: "desc" }
    });
}

const getOrderById = async (order_id: string) => {
    return await prisma.orders.findFirst({
        where: { id: order_id },
        include: {
            orderItems: {
                include: {
                    meal: {
                        select: { name: true, image_url: true }
                    }
                }
            }
        }
    });
}

export const OrdersService = {
    createOrder,
    getOrder,
    getOrderById,

};