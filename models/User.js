import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  foundProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

export default mongoose.model("User", userSchema);
