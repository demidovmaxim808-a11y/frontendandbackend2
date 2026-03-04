const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Начальные данные — 10 товаров
let products = [
  { id: nanoid(6), name: 'Ноутбук ASUS', category: 'Ноутбуки', description: '15.6", Intel Core i5, 8GB RAM, 512GB SSD', price: 75000, stock: 5 },
  { id: nanoid(6), name: 'Мышь Logitech', category: 'Аксессуары', description: 'Беспроводная, тихая', price: 2500, stock: 15 },
  { id: nanoid(6), name: 'Клавиатура Mechanical', category: 'Аксессуары', description: 'Механическая, RGB', price: 4500, stock: 8 },
  { id: nanoid(6), name: 'Монитор Samsung', category: 'Мониторы', description: '27", 4K, IPS', price: 32000, stock: 4 },
  { id: nanoid(6), name: 'SSD 1TB', category: 'Комплектующие', description: 'Samsung EVO, чтение 3500MB/s', price: 12000, stock: 12 },
  { id: nanoid(6), name: 'Видеокарта RTX 3060', category: 'Комплектующие', description: '12GB, GDDR6', price: 45000, stock: 2 },
  { id: nanoid(6), name: 'Наушники Sony', category: 'Аудио', description: 'Беспроводные, шумоподавление', price: 15000, stock: 7 },
  { id: nanoid(6), name: 'Планшет iPad', category: 'Планшеты', description: '10.2", 64GB', price: 35000, stock: 3 },
  { id: nanoid(6), name: 'Принтер HP', category: 'Оргтехника', description: 'Лазерный, ч/б', price: 18000, stock: 6 },
  { id: nanoid(6), name: 'Роутер TP-Link', category: 'Сетевое оборудование', description: 'Wi-Fi 6, Mesh', price: 7000, stock: 10 }
];

// Middleware
app.use(express.json());
app.use(cors());

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========== НАСТРОЙКА SWAGGER ==========
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API интернет-магазина ТехноМаркет',
      version: '1.0.0',
      description: 'API для управления товарами в интернет-магазине электроники',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер',
      },
    ],
  },
  apis: ['./app.js'], // указываем, где искать JSDoc-комментарии
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ========================================

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный ID товара
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "Ноутбук ASUS"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Ноутбуки"
 *         description:
 *           type: string
 *           description: Описание товара
 *           example: "15.6\", Intel Core i5, 8GB RAM"
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *           example: 75000
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *           example: 5
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Управление товарами
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Новый товар"
 *               category:
 *                 type: string
 *                 example: "Аксессуары"
 *               description:
 *                 type: string
 *                 example: "Описание нового товара"
 *               price:
 *                 type: number
 *                 example: 5000
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в данных запроса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 */
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock } = req.body;

  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет существующий товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *         example: "abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Обновленное название"
 *               category:
 *                 type: string
 *                 example: "Новая категория"
 *               description:
 *                 type: string
 *                 example: "Обновленное описание"
 *               price:
 *                 type: number
 *                 example: 6000
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nothing to update"
 *       404:
 *         description: Товар не найден
 */
app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  const { name, category, description, price, stock } = req.body;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *         example: "abc123"
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

// Корневой маршрут
app.get('/', (req, res) => {
  res.send('Сервер ТехноМаркет работает! Документация: <a href="/api-docs">/api-docs</a>');
});

// 404 для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Документация Swagger: http://localhost:${port}/api-docs`);
});