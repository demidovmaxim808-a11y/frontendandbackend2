import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(initialProduct?.name ?? '');
    setCategory(initialProduct?.category ?? '');
    setDescription(initialProduct?.description ?? '');
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : '');
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : '');
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Редактирование товара' : 'Создание товара';

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!trimmedName) {
      alert('Введите название товара');
      return;
    }
    if (!trimmedCategory) {
      alert('Введите категорию');
      return;
    }
    if (!trimmedDescription) {
      alert('Введите описание');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      alert('Введите корректную цену (больше 0)');
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      alert('Введите корректное количество (0 или больше)');
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCategory,
      description: trimmedDescription,
      price: parsedPrice,
      stock: parsedStock
    });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например, Ноутбук ASUS"
              autoFocus
            />
          </label>
          <label className="label">
            Категория
            <input
              className="input"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Например, Ноутбуки"
            />
          </label>
          <label className="label">
            Описание
            <textarea
              className="input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Краткое описание товара"
              rows="3"
            />
          </label>
          <label className="label">
            Цена (₽)
            <input
              className="input"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="75000"
              min="1"
              step="1"
            />
          </label>
          <label className="label">
            Количество на складе
            <input
              className="input"
              type="number"
              value={stock}
              onChange={e => setStock(e.target.value)}
              placeholder="10"
              min="0"
              step="1"
            />
          </label>
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn btn--primary">
              {mode === 'edit' ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}