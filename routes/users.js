import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями и корзиной
 */

/**
 * @swagger
 * /users/{id}/bucket:
 *   get:
 *     summary: Получить корзину пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Корзина пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/:id/bucket", async (req, res) => {
  const user = await User.findById(req.params.id).populate("bucket");
  res.json(user.bucket);
});

/**
 * @swagger
 * /users/{id}/bucket:
 *   post:
 *     summary: Добавить продукт в корзину
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Продукт добавлен в корзину
 */
router.post("/:id/bucket", async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.params.id);
  user.bucket.push(productId);
  await user.save();
  res.json({ success: true, bucket: user.bucket });
});

/**
 * @swagger
 * /users/{id}/bucket/{productId}:
 *   delete:
 *     summary: Удалить продукт из корзины
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт удалён из корзины
 */
router.delete("/:id/bucket/:productId", async (req, res) => {
  const { id, productId } = req.params;
  const user = await User.findById(id);
  user.bucket = user.bucket.filter(p => p.toString() !== productId);
  await user.save();
  res.json({ success: true, bucket: user.bucket });
});

export default router;
