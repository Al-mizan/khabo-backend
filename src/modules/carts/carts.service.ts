import { calculateUnitPrice } from "../../helper/calculateUnitPrice";
import { prisma } from "../../lib/prisma";
import { CreateCartData } from "./carts.interface";


const createCart = async (user_id: string, data: CreateCartData) => {
    const { meal_id, quantity } = data;

    return await prisma.$transaction(async (ts) => {
        // 1. Get meal details
        const meal = await ts.meals.findUniqueOrThrow({
            where: { id: meal_id },
            select: {
                provider_id: true,
                discount_percentage: true,
                discount_price: true,
                price: true,
            }
        });

        const unit_price = calculateUnitPrice(meal.price, meal.discount_percentage, meal.discount_price);
        const sub_total = unit_price * quantity;

        // 2. Find or create cart for this user + provider
        let cart = await ts.carts.findFirst({
            where: {
                user_id,
                provider_id: meal.provider_id,
            },
        });

        if (!cart) {
            cart = await ts.carts.create({
                data: {
                    user_id,
                    provider_id: meal.provider_id,
                    total_price: 0,
                }
            });
        }

        // 3. Check if this meal already exists in cart
        const existingCartItem = await ts.cartItems.findFirst({
            where: {
                cart_id: cart.id,
                meal_id,
            }
        });

        if (existingCartItem) {
            // Update existing cart item quantity
            await ts.cartItems.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                    sub_total_amount: existingCartItem.sub_total_amount + sub_total,
                }
            });
        } else {
            // Create new cart item
            await ts.cartItems.create({
                data: {
                    cart_id: cart.id,
                    meal_id,
                    quantity,
                    unit_price,
                    sub_total_amount: sub_total,
                }
            });
        }

        // 4. Update cart total
        const updatedCart = await ts.carts.update({
            where: { id: cart.id },
            data: {
                total_price: { increment: sub_total },
            },
            include: {
                cartItems: {
                    include: { meal: { select: { name: true, image_url: true } } }
                }
            }
        });

        return updatedCart;
    });
};

// if cart item quantity is 0, remove the item from cart
// if all items are removed, delete the cart as well
const updateCart = async (user_id: string, data: CreateCartData) => {
    const { meal_id, quantity } = data;

    return await prisma.$transaction(async (ts) => {
        // 1. Get meal details
        const meal = await ts.meals.findUniqueOrThrow({
            where: { id: meal_id },
            select: {
                provider_id: true,
                discount_percentage: true,
                discount_price: true,
                price: true,
            }
        });

        // 2. Find cart for this user + provider
        const cart = await ts.carts.findFirst({
            where: {
                user_id,
                provider_id: meal.provider_id,
            },
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        // 3. Find the cart item
        const existingCartItem = await ts.cartItems.findFirst({
            where: {
                cart_id: cart.id,
                meal_id,
            }
        });

        if (!existingCartItem) {
            throw new Error("Cart item not found");
        }

        const unit_price = calculateUnitPrice(meal.price, meal.discount_percentage, meal.discount_price);
        const newQuantity = quantity;

        // 4. If quantity is 0 or less, remove the item
        if (newQuantity <= 0) {
            // Delete the cart item
            await ts.cartItems.delete({
                where: { id: existingCartItem.id }
            });

            // Update cart total
            const updatedCart = await ts.carts.update({
                where: { id: cart.id },
                data: {
                    total_price: { decrement: existingCartItem.sub_total_amount },
                },
            });

            // Check if cart has any remaining items
            const remainingItems = await ts.cartItems.count({
                where: { cart_id: cart.id }
            });

            // If no items left, delete the cart
            if (remainingItems === 0) {
                await ts.carts.delete({
                    where: { id: cart.id }
                });
                return null;
            }

            return await ts.carts.findUnique({
                where: { id: cart.id },
                include: {
                    cartItems: {
                        include: { meal: { select: { name: true, image_url: true } } }
                    }
                }
            });
        }

        // 5. Update cart item quantity
        const newSubTotal = unit_price * newQuantity;
        const subTotalDifference = newSubTotal - existingCartItem.sub_total_amount;

        await ts.cartItems.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: newQuantity,
                sub_total_amount: newSubTotal,
            }
        });

        // 6. Update cart total
        const updatedCart = await ts.carts.update({
            where: { id: cart.id },
            data: {
                total_price: { increment: subTotalDifference },
            },
            include: {
                cartItems: {
                    include: { meal: { select: { name: true, image_url: true } } }
                }
            }
        });

        return updatedCart;
    });
}

export const CartsService = {
    createCart,
    updateCart,

};