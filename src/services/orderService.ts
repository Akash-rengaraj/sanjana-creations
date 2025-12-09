import api from '../api/axios';

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
};

export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};
