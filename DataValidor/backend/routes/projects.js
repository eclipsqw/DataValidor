const express = require('express');
const router = express.Router();

// Просто заглушка для маршрутов проектов
router.get('/', (req, res) => {
  res.json({ message: 'API для проектов работает' });
});

module.exports = router;