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
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered'] },
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);