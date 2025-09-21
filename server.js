import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import topilganlarRoutes from "./routes/topilganlar.js";
import yoqotilganlarRoutes from "./routes/yoqotilganlar.js";

import { swaggerUi, swaggerSpec } from "./config/swagger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/topilganlar", topilganlarRoutes);
app.use("/api/yoqotilganlar", yoqotilganlarRoutes);

mongoose.connect(
  "mongodb+srv://zerorich207:asdasdasd@cluster0.7kuzqbh.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

  .then(() => app.listen(5000, () => console.log("Server started on port 5000")))
  .catch(err => console.error(err));
