export const getTotalProductPrice = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
}
export const getCartPrice = (...productPrice: number[]): number => {
    const allProducts: number = productPrice.reduce((total, num) => total + num, 0);

    return allProducts
}

export const getRetailValue = (totalProductPrice: number): number => {
    return Math.round(totalProductPrice * 0.085 * 100) / 100;
}

export const getTotalOrderPrice = (...productPrice: number[]): number => {
    const allProducts: number = productPrice.reduce((total, num) => total + num, 0);
    const shippingRate: number = 2;

    return allProducts + shippingRate 
}
