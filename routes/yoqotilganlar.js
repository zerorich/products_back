import express from "express";
import Yoqotilgan from "../models/Yoqotilgan.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Yoqotilganlar
 *   description: Управление потерянными вещами
 */

/**
 * @swagger
 * /yoqotilganlar:
 *   get:
 *     summary: Получить список потерянных вещей
 *     tags: [Yoqotilganlar]
 *     parameters:
 *       - in: query
 *         name: isFound
 *         schema:
 *           type: boolean
 *         description: Фильтр по статусу (найдено/не найдено)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [electronics, clothing, documents, jewelry, other]
 *         description: Фильтр по категории
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
 *         description: Список потерянных вещей
 */
router.get("/", async (req, res) => {
  try {
    const { isFound, category, country, viloyat, limit = 10, page = 1 } = req.query;
    const filter = {};
    
    if (isFound !== undefined) {
      filter.isFound = isFound === 'true';
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (country) {
      filter.country = new RegExp(country, 'i');
    }
    
    if (viloyat) {
      filter.viloyat = new RegExp(viloyat, 'i');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const yoqotilganlar = await Yoqotilgan.find(filter)
      .sort({ lostDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Yoqotilgan.countDocuments(filter);
    
    res.json({
      success: true,
      data: yoqotilganlar,
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
 * /yoqotilganlar:
 *   post:
 *     summary: Добавить потерянную вещь
 *     tags: [Yoqotilganlar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - lastKnownLocation
 *               - country
 *               - viloyat
 *               - coordinates
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 4
 *               lastKnownLocation:
 *                 type: string
 *               country:
 *                 type: string
 *               viloyat:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата потери (ISO 8601)
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
 *               category:
 *                 type: string
 *                 enum: [electronics, clothing, documents, jewelry, other]
 *     responses:
 *       201:
 *         description: Потерянная вещь создана
 *       400:
 *         description: Ошибка валидации
 */
router.post("/", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      images = [], 
      lastKnownLocation, 
      country,
      viloyat,
      coordinates, 
      contactInfo,
      category = 'other',
      date
    } = req.body;

    if (!title || !description || !lastKnownLocation || !country || !viloyat || !coordinates) {
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

    if (images.length > 4) {
      return res.status(400).json({ 
        success: false, 
        message: "Максимум 4 изображения" 
      });
    }

    const yoqotilgan = new Yoqotilgan({ 
      title, 
      description, 
      images, 
      lastKnownLocation, 
      country,
      viloyat,
      coordinates,
      contactInfo: contactInfo || {},
      category,
      date: date ? new Date(date) : new Date()
    });
    
    await yoqotilgan.save();
    res.status(201).json({ success: true, data: yoqotilgan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /yoqotilganlar/{id}:
 *   get:
 *     summary: Получить потерянную вещь по ID
 *     tags: [Yoqotilganlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Потерянная вещь
 *       404:
 *         description: Не найдено
 */
router.get("/:id", async (req, res) => {
  try {
    const yoqotilgan = await Yoqotilgan.findById(req.params.id);
    
    if (!yoqotilgan) {
      return res.status(404).json({ 
        success: false, 
        message: "Потерянная вещь не найдена" 
      });
    }
    
    res.json({ success: true, data: yoqotilgan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /yoqotilganlar/{id}:
 *   put:
 *     summary: Обновить потерянную вещь
 *     tags: [Yoqotilganlar]
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 4
 *               lastKnownLocation:
 *                 type: string
 *               country:
 *                 type: string
 *               viloyat:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата потери (ISO 8601)
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
 *               isFound:
 *                 type: boolean
 *               foundBy:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [electronics, clothing, documents, jewelry, other]
 *     responses:
 *       200:
 *         description: Потерянная вещь обновлена
 *       404:
 *         description: Не найдено
 */
router.put("/:id", async (req, res) => {
  try {
    const { images } = req.body;
    
    if (images && images.length > 4) {
      return res.status(400).json({ 
        success: false, 
        message: "Максимум 4 изображения" 
      });
    }

    const yoqotilgan = await Yoqotilgan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!yoqotilgan) {
      return res.status(404).json({ 
        success: false, 
        message: "Потерянная вещь не найдена" 
      });
    }
    
    res.json({ success: true, data: yoqotilgan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /yoqotilganlar/{id}:
 *   delete:
 *     summary: Удалить потерянную вещь
 *     tags: [Yoqotilganlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Потерянная вещь удалена
 *       404:
 *         description: Не найдено
 */
router.delete("/:id", async (req, res) => {
  try {
    const yoqotilgan = await Yoqotilgan.findByIdAndDelete(req.params.id);
    
    if (!yoqotilgan) {
      return res.status(404).json({ 
        success: false, 
        message: "Потерянная вещь не найдена" 
      });
    }
    
    res.json({ success: true, message: "Потерянная вещь удалена" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
