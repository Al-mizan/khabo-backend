
/**
 * Calculate the final unit price after applying discounts
 */
export const calculateUnitPrice = (price: number, discountPercentage?: number | null, discountPrice?: number | null): number => {
    if (discountPercentage && discountPercentage > 0) {
        return Math.floor(price - (price * discountPercentage / 100));
    }
    if (discountPrice && discountPrice > 0) {
        return price - discountPrice;
    }
    return Math.floor(price);
};