import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import { getProductById, addProduct, updateProduct, uploadImage } from '../../services/productService';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

interface ProductFormData {
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description: string;
}

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormData>();

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const product = await getProductById(Number(id));
                    setValue('name', product.name);
                    setValue('category', product.category);
                    setValue('price', product.price);
                    setValue('stock', product.stock);
                    setValue('stock', product.stock);
                    setValue('image', product.image);
                    setPreviewImage(product.image);
                    setValue('description', product.description);
                } catch (error) {
                    console.error('Failed to fetch product:', error);
                    // Handle error (e.g., show toast, redirect)
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode, setValue]);

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                await updateProduct(Number(id), data);
            } else {
                await addProduct(data);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Failed to save product:', error);
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-navy">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                {...register('name', { required: 'Product name is required' })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="e.g. Royal Silk Saree"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <input
                                {...register('category', { required: 'Category is required' })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="e.g. Sarees"
                            />
                            {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                            <input
                                type="number"
                                {...register('price', { required: 'Price is required', min: 0, valueAsNumber: true })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="0.00"
                            />
                            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                {...register('stock', { required: 'Stock is required', min: 0, valueAsNumber: true })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="0"
                            />
                            {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Product Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-gold transition-colors relative bg-gray-50">
                            {previewImage ? (
                                <div className="relative w-full h-64">
                                    <img
                                        src={previewImage.startsWith('http') ? previewImage : `http://localhost:5000${previewImage}`}
                                        alt="Preview"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewImage('');
                                            setValue('image', '');
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setUploading(true);
                                                try {
                                                    const imagePath = await uploadImage(file);
                                                    setValue('image', imagePath);
                                                    setPreviewImage(imagePath);
                                                } catch (error) {
                                                    console.error('Upload failed:', error);
                                                    alert('Image upload failed');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="text-center pointer-events-none">
                                        {uploading ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-2"></div>
                                        ) : (
                                            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                                        )}
                                        <p className="text-sm text-gray-600 font-medium">
                                            {uploading ? 'Uploading...' : 'Click or drag image here'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <input type="hidden" {...register('image', { required: 'Product image is required' })} />
                        {errors.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                            placeholder="Product description..."
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            variant="primary"
                            className="flex items-center gap-2 min-w-[120px] justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {isEditMode ? 'Update Product' : 'Save Product'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
