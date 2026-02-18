const express = require('express');
const app = express();
const port = 3000;

// Начальные данные (для демонстрации)
let products = [
  { id: 1, name: 'Ноутбук', price: 75000 },
  { id: 2, name: 'Мышь', price: 1500 },
  { id: 3, name: 'Клавиатура', price: 3500 }
];

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов (собственное, опционально)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ----- Маршруты для товаров -----

// Получить все товары
app.get('/products', (req, res) => {
  res.json(products);
});

// Получить товар по id
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }
  res.json(product);
});

// Добавить новый товар
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  // Простейшая валидация
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Не указаны name или price' });
  }

  const newProduct = {
    id: Date.now(), // уникальный идентификатор на основе времени
    name,
    price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Обновить товар (частичное обновление)
app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  const { name, price } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;

  res.json(product);
});

// Удалить товар
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.sendStatus(204); // No Content (успешное удаление)
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});