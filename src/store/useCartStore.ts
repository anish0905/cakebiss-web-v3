import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice: number; // Added
  image: string;
  category: string;      // Added
  weight: number;        // Added
  unit: string;          // Added
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void; // Added
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      // Add to Cart Logic
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i._id === item._id);
        if (existing) {
          return {
            cart: state.cart.map((i) => 
              i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),

      // Remove Item Logic
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((i) => i._id !== id)
      })),

      // --- YE FUNCTION ERROR FIX KAREGA ---
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((i) => 
          i._id === id ? { ...i, quantity: quantity } : i
        )
      })),

      // Clear Whole Cart
      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'cake-cart-storage', // Browser ke localStorage mein save hoga
    }
  )
);