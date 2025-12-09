import api from '../api/axios';

export const getCustomers = async () => {
    const response = await api.get('/customers');
    return response.data;
};

export const addCustomer = async (customerData: any) => {
    const response = await api.post('/customers', customerData);
    return response.data;
};

export const updateCustomer = async (id: number, customerData: any) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
};

export const deleteCustomer = async (id: number) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};
