import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, User, Mail, Phone } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import Button from '../../components/Button';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orders = await getOrders();
                const foundOrder = orders.find((o: any) => o.id === id);
                setOrder(foundOrder);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            }
        };
        fetchOrder();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateOrderStatus(id!, newStatus);
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-navy">Order {order.id}</h1>
                    <p className="text-sm text-gray-500">{order.date}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                            <Package size={20} /> Order Items
                        </h2>
                        <div className="space-y-4">
                            {/* Mock items since backend doesn't store items detail yet */}
                            <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-navy">Product Name Placeholder</h3>
                                    <p className="text-sm text-gray-500">Qty: 1</p>
                                </div>
                                <div className="font-medium text-navy">₹{order.total.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-navy">Total</span>
                            <span className="text-xl font-bold text-navy">₹{order.total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Timeline/Status */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                            <Truck size={20} /> Order Status
                        </h2>
                        <div className="flex gap-2">
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${order.status === status
                                            ? 'bg-navy text-white'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                            <User size={20} /> Customer
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-navy">{order.customer}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{order.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-600">+91 98765 43210</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                            <MapPin size={20} /> Shipping Address
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            123, Fashion Street,<br />
                            Koramangala 5th Block,<br />
                            Bangalore, Karnataka - 560095
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
