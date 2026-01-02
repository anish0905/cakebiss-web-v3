import { create } from 'zustand';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((i) => i._id === item._id);
    if (existing) {
      return {
        cart: state.cart.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((i) => i._id !== id)
  })),
  clearCart: () => set({ cart: [] })
}));