import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import { getCustomers, addCustomer, updateCustomer } from '../../services/customerService';
import { ArrowLeft, Save } from 'lucide-react';

interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    status: string;
}

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CustomerFormData>();

    useEffect(() => {
        if (isEditMode) {
            const fetchCustomer = async () => {
                try {
                    const customers = await getCustomers();
                    const customer = customers.find((c: any) => c.id === Number(id));
                    if (customer) {
                        setValue('name', customer.name);
                        setValue('email', customer.email);
                        setValue('phone', customer.phone);
                        setValue('status', customer.status);
                    }
                } catch (error) {
                    console.error('Failed to fetch customer:', error);
                }
            };
            fetchCustomer();
        }
    }, [id, isEditMode, setValue]);

    const onSubmit = async (data: CustomerFormData) => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                await updateCustomer(Number(id), data);
            } else {
                await addCustomer({ ...data, orders: 0, totalSpent: 0 });
            }
            navigate('/admin/customers');
        } catch (error) {
            console.error('Failed to save customer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/customers')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-navy">
                    {isEditMode ? 'Edit Customer' : 'Add New Customer'}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone</label>
                            <input
                                {...register('phone', { required: 'Phone is required' })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="+91 98765 43210"
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                {...register('status', { required: 'Status is required' })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                        </div>
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
                                    {isEditMode ? 'Update Customer' : 'Save Customer'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;
