import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String },
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  
  // --- New Customization Fields ---
  deliveryDate: { type: String, required: true }, // Delivery kab chahiye
  occasion: { 
    type: String, 
    enum: ['Birthday', 'Anniversary', 'Wedding', 'Other'], 
    default: 'Birthday' 
  },
  cakeMessage: { type: String }, // Cake par kya likhna hai (e.g. Happy Birthday Rahul)
  instructions: { type: String }, // Extra note (e.g. Make it eggless)
  // -------------------------------

  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] 
  },
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);