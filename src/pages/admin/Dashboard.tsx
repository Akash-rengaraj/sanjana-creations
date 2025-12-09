import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, Users, TrendingUp } from 'lucide-react';
import { getDashboardStats } from '../../services/dashboardService';
import { getOrders } from '../../services/orderService';
import EmptyState from '../../components/admin/EmptyState';

const Dashboard = () => {
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, ordersData] = await Promise.all([
                    getDashboardStats(),
                    getOrders()
                ]);
                setStats(statsData);
                // Get last 5 orders
                setRecentOrders(ordersData.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { title: 'Total Sales', value: `₹${stats.totalSales.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'bg-green-100 text-green-600', trend: '+12.5%' },
        { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, color: 'bg-blue-100 text-blue-600', trend: '+8.2%' },
        { title: 'Total Products', value: stats.totalProducts, icon: <Package size={24} />, color: 'bg-orange-100 text-orange-600', trend: '+2.4%' },
        { title: 'Total Customers', value: stats.totalCustomers, icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600', trend: '+5.1%' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
                <div className="text-sm text-gray-500">Last updated: Today, 12:00 PM</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp size={12} className="mr-1" />
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-navy mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-navy">Recent Orders</h2>
                    <button className="text-sm text-gold font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <div className="overflow-x-auto">
                        {recentOrders.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Order ID</th>
                                        <th className="px-6 py-4 font-medium">Customer</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Amount</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-navy">{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-navy">₹{order.total?.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                                'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <EmptyState
                                icon={ShoppingBag}
                                title="No recent orders"
                                description="When you receive orders, they will appear here."
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
