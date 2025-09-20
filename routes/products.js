import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Управление продуктами
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список продуктов
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список продуктов
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Добавить продукт
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Продукт создан
 */
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post("/", async (req, res) => {
  const { title, description, img, price } = req.body;

  if (!price) {
    return res.status(400).json({ success: false, message: "Цена обязательна" });
  }

  const product = new Product({ title, description, img, price });
  await product.save();
  res.json(product);
});

export default router;
