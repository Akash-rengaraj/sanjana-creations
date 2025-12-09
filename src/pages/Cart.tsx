import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { useCartStore } from '../store/cartStore';

const Cart = () => {
    const { items: cartItems, updateQuantity, removeFromCart: removeItem, total } = useCartStore();

    const subtotal = total();
    const shipping = subtotal > 500 ? 0 : 50;
    const finalTotal = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream">
                <h2 className="text-2xl font-bold text-navy mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
                <Button to="/shop" variant="primary">Start Shopping</Button>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen py-10">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-3xl font-heading font-bold text-navy mb-8">Your Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-grow space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-center animate-fade-in">
                                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow">
                                    <Link to={`/product/${item.id}`} className="font-bold text-navy hover:text-gold transition-colors">
                                        {item.name}
                                    </Link>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Size: {item.size} | Color: {item.color}
                                    </div>
                                    <div className="font-bold text-navy mt-2">₹{item.price.toLocaleString()}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold text-navy mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? <span className="text-green-600 font-bold">Free</span> : `₹${shipping}`}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-navy">
                                    <span>Total</span>
                                    <span>₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button to="/checkout" variant="primary" fullWidth className="flex items-center justify-center gap-2">
                                Proceed to Checkout <ArrowRight size={18} />
                            </Button>

                            <div className="mt-4 text-center">
                                <Link to="/shop" className="text-sm text-gray-500 hover:text-navy underline">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
