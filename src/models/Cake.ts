import mongoose, { Schema, model, models } from 'mongoose';

const CakeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  
  // Pricing & Weight Logic
  price: { type: Number, required: true }, // Base price (e.g., for 0.5kg or 1kg)
  discountPrice: { type: Number, default: 0 },
  
  // Weight Details (Naya addition)
  weight: { type: Number, default: 0.5 }, // Default weight (e.g., 0.5, 1, 1.5, 2)
  unit: { type: String, enum: ['kg', 'lb'], default: 'kg' }, // Unit select karne ke liye
  
  // Multiple Weight Options (Optional: Agar aap user ko choice dena chahte hain)
  availableWeights: [{ type: Number }], // Example: [0.5, 1, 2, 5]

 // CakeSchema mein ye update karein
image: { type: String, required: true }, // Main Image
extraImages: [{ type: String }], // 3 Additional Images ka array
  category: { type: String, required: true }, 
  
  // Inventory & Availability
  quantity: { type: Number, required: true, default: 10 }, 
  isAvailable: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

const Cake = models.Cake || model('Cake', CakeSchema);
export default Cake;