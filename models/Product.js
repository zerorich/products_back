import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  img: { type: String },
  price: { type: Number, required: true },
  lenght: { type: Number, required: true },
  long: { type: Number, required: true },
  category: { type: String, required: true },
});

export default mongoose.model("Product", productSchema);
