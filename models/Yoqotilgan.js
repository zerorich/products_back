import mongoose from "mongoose";

const yoqotilganSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  images: [{ 
    type: String 
  }],
  lastKnownLocation: { 
    type: String, 
    required: true,
    trim: true
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
  isFound: { 
    type: Boolean, 
    default: false 
  },
  foundBy: { 
    type: String 
  },
  lostDate: { 
    type: Date, 
    default: Date.now 
  },
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'documents', 'jewelry', 'other'],
    default: 'other'
  }
}, {
  timestamps: true
});

export default mongoose.model("Yoqotilgan", yoqotilganSchema);
