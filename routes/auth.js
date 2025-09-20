import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Авторизация и регистрация
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная регистрация
 */
router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    const candidate = await User.findOne({ email });
    if (candidate) {
      return res
        .status(400)
        .json({ success: false, message: "Email уже используется" });
    }

    const hashPassword = await bcrypt.hash(password, 8);

    const user = new User({ name, surname, email, password: hashPassword });
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Логин пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid)
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
