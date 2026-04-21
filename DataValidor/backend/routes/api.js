const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// Анализ текста
router.post('/analyze', analysisController.analyzeText);

// Анализ проекта
router.post('/projects/analyze', analysisController.analyzeProject);

// Статистика
router.get('/stats', async (req, res) => {
  res.json({ message: 'Статистика будет здесь' });
});

module.exports = router;