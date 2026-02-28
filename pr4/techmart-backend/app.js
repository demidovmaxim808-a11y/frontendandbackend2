const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

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
app.use(cors()); // Разрешаем все источники

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ----- МАРШРУТЫ С ПРЕФИКСОМ /api -----
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

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

app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, category, description, price, stock } = req.body;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

// Корневой маршрут для проверки
app.get('/', (req, res) => {
  res.send('Сервер работает! Доступные маршруты: /api/products');
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
  console.log(`Проверь: http://localhost:${port}/api/products`);
});