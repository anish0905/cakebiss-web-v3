import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: [
    {
      fullAddress: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }, // Address-specific contact
      label: { type: String, default: "Home" } 
    }
  ],
  availablePhone: { type: String } // Main profile contact
}, { timestamps: true });

export default models.User || model('User', UserSchema);