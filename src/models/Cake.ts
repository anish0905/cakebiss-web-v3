import mongoose, { Schema, model, models } from 'mongoose';

const CakeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  highlights: [{ type: String }], // Points list ke liye

  // --- Dynamic Pricing & Weight Logic ---
  // Ye main logic hai: Har weight ki apni price hogi
  priceVariants: [
    {
      weight: { type: Number, required: true }, // e.g., 0.5
      price: { type: Number, required: true },  // e.g., 500
      discountPrice: { type: Number, default: 0 } // e.g., 450
    }
  ],
  unit: { type: String, enum: ['kg', 'lb'], default: 'kg' },

  // --- Taste & Type Logic ---
  category: { type: String, required: true, index: true },
  flavor: { type: String, required: true, index: true },
  isEggless: { type: Boolean, default: false, index: true }, 

  // --- Media ---
  image: { type: String, required: true }, 
  extraImages: [{ type: String }], 
  
  // --- Status ---
  quantity: { type: Number, required: true, default: 10 }, 
  isAvailable: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },
}, { 
  timestamps: true 
});

const Cake = models.Cake || model('Cake', CakeSchema);
export default Cake;