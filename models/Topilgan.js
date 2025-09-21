import mongoose from "mongoose";

const topilganSchema = new mongoose.Schema({
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
  img: { 
    type: String, 
    required: true
  },
  location: { 
    type: String, 
    required: true,
    trim: true
  },
  country: { 
    type: String, 
    required: true,
    trim: true
  },
  viloyat: { 
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
  isClaimed: { 
    type: Boolean, 
    default: false 
  },
  claimedBy: { 
    type: String 
  },
  foundDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.model("Topilgan", topilganSchema);
