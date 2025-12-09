import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
}

interface CartStore {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => set((state) => {
                const existingItem = state.items.find(i => i.id === item.id && i.size === item.size && i.color === item.color);
                if (existingItem) {
                    return {
                        items: state.items.map(i =>
                            (i.id === item.id && i.size === item.size && i.color === item.color)
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        )
                    };
                }
                return { items: [...state.items, item] };
            }),
            removeFromCart: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id)
            })),
            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
            })),
            clearCart: () => set({ items: [] }),
            total: () => {
                const { items } = get();
                return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
