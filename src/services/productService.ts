import api from '../api/axios';

export const getProducts = async () => {
    const response = await api.get(`/products?_t=${Date.now()}`);
    return response.data;
};

export const getProductById = async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const addProduct = async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id: number, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.image;
};
