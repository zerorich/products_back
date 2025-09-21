import express from "express";
import Topilgan from "../models/Topilgan.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Topilganlar
 *   description: Управление найденными вещами
 */

/**
 * @swagger
 * /topilganlar:
 *   get:
 *     summary: Получить список найденных вещей
 *     tags: [Topilganlar]
 *     parameters:
 *       - in: query
 *         name: isClaimed
 *         schema:
 *           type: boolean
 *         description: Фильтр по статусу (забрано/не забрано)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество записей на странице
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Фильтр по стране
 *       - in: query
 *         name: viloyat
 *         schema:
 *           type: string
 *         description: Фильтр по области
 *     responses:
 *       200:
 *         description: Список найденных вещей
 */
router.get("/", async (req, res) => {
  try {
    const { isClaimed, country, viloyat, limit = 10, page = 1 } = req.query;
    const filter = {};
    
    if (isClaimed !== undefined) {
      filter.isClaimed = isClaimed === 'true';
    }
    
    if (country) {
      filter.country = new RegExp(country, 'i');
    }
    
    if (viloyat) {
      filter.viloyat = new RegExp(viloyat, 'i');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const topilganlar = await Topilgan.find(filter)
      .sort({ foundDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Topilgan.countDocuments(filter);
    
    res.json({
      success: true,
      data: topilganlar,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /topilganlar:
 *   post:
 *     summary: Добавить найденную вещь
 *     tags: [Topilganlar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - img
 *               - location
 *               - country
 *               - viloyat
 *               - coordinates
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *               location:
 *                 type: string
 *               country:
 *                 type: string
 *               viloyat:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата находки (ISO 8601)
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *     responses:
 *       201:
 *         description: Найденная вещь создана
 *       400:
 *         description: Ошибка валидации
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, img, location, country, viloyat, coordinates, contactInfo, date } = req.body;

    if (!title || !description || !img || !location || !country || !viloyat || !coordinates) {
      return res.status(400).json({ 
        success: false, 
        message: "Все обязательные поля должны быть заполнены" 
      });
    }

    if (!coordinates.lat || !coordinates.lng) {
      return res.status(400).json({ 
        success: false, 
        message: "Координаты обязательны" 
      });
    }

    const topilgan = new Topilgan({ 
      title, 
      description, 
      img, 
      location, 
      country,
      viloyat,
      coordinates,
      contactInfo: contactInfo || {},
      date: date ? new Date(date) : new Date()
    });
    
    await topilgan.save();
    res.status(201).json({ success: true, data: topilgan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /topilganlar/{id}:
 *   get:
 *     summary: Получить найденную вещь по ID
 *     tags: [Topilganlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Найденная вещь
 *       404:
 *         description: Не найдено
 */
router.get("/:id", async (req, res) => {
  try {
    const topilgan = await Topilgan.findById(req.params.id);
    
    if (!topilgan) {
      return res.status(404).json({ 
        success: false, 
        message: "Найденная вещь не найдена" 
      });
    }
    
    res.json({ success: true, data: topilgan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /topilganlar/{id}:
 *   put:
 *     summary: Обновить найденную вещь
 *     tags: [Topilganlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 *               location:
 *                 type: string
 *               country:
 *                 type: string
 *               viloyat:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата находки (ISO 8601)
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               isClaimed:
 *                 type: boolean
 *               claimedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Найденная вещь обновлена
 *       404:
 *         description: Не найдено
 */
router.put("/:id", async (req, res) => {
  try {
    const topilgan = await Topilgan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!topilgan) {
      return res.status(404).json({ 
        success: false, 
        message: "Найденная вещь не найдена" 
      });
    }
    
    res.json({ success: true, data: topilgan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /topilganlar/{id}:
 *   delete:
 *     summary: Удалить найденную вещь
 *     tags: [Topilganlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Найденная вещь удалена
 *       404:
 *         description: Не найдено
 */
router.delete("/:id", async (req, res) => {
  try {
    const topilgan = await Topilgan.findByIdAndDelete(req.params.id);
    
    if (!topilgan) {
      return res.status(404).json({ 
        success: false, 
        message: "Найденная вещь не найдена" 
      });
    }
    
    res.json({ success: true, message: "Найденная вещь удалена" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
