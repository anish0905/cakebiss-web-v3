import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  image: string;
  weight: number; 
  unit: string;
  isEggless: boolean;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, weight: number) => void;
  updateQuantity: (id: string, weight: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) => set((state) => {
        // Find if SAME cake with SAME weight exists
        const existingIndex = state.cart.findIndex(
          (i) => i._id === item._id && i.weight === item.weight
        );

        if (existingIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingIndex].quantity += (item.quantity || 1);
          return { cart: newCart };
        }
        return { cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
      }),

      removeFromCart: (id, weight) => set((state) => ({
        cart: state.cart.filter((i) => !(i._id === id && i.weight === weight))
      })),

      updateQuantity: (id, weight, quantity) => set((state) => ({
        cart: state.cart.map((i) => 
          (i._id === id && i.weight === weight) ? { ...i, quantity } : i
        )
      })),

      clearCart: () => set({ cart: [] })
    }),
    { name: 'premium-cake-cart' } // Resetting storage name
  )
);