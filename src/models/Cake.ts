import mongoose, { Schema, model, models } from 'mongoose';

const CakeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Image ka URL
  category: { type: String, required: true }, // e.g., Chocolate, Vanilla, Wedding
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Cake = models.Cake || model('Cake', CakeSchema);
export default Cake;