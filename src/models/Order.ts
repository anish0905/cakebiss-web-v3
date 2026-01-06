import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      // --- Naye Fields Weight ke liye ---
      weight: { type: Number }, // Example: 0.5, 1, 2
      unit: { type: String, default: 'kg' }, // Example: kg or lb
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  
  // --- Customization Fields ---
  deliveryDate: { type: String, required: true }, 
  occasion: { 
    type: String, 
    enum: ['Birthday', 'Anniversary', 'Wedding', 'Other'], 
    default: 'Birthday' 
  },
  cakeMessage: { type: String }, 
  instructions: { type: String }, 

  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] 
  },
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);