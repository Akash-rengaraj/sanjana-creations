import { getProducts } from './productService';
import { getOrders } from './orderService';
import { getCustomers } from './customerService';

export const getDashboardStats = async () => {
    const [products, orders, customers] = await Promise.all([
        getProducts(),
        getOrders(),
        getCustomers()
    ]);

    const totalSales = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

    return {
        totalSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customers.length
    };
};
