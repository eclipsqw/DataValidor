const { OpenAI } = require('openai');
const db = require('../config/database');
const crypto = require('crypto');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Генерация хэша для кэширования
function generateHash(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

exports.analyzeText = async (req, res) => {
  try {
    const { text, context } = req.body;
    
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Текст должен содержать минимум 10 символов' });
    }

    // Проверяем кэш
    const inputHash = generateHash(text + (context || ''));
    const cachedResult = await db.query(
      'SELECT analysis_result FROM analysis_cache WHERE input_hash = $1',
      [inputHash]
    );

    if (cachedResult.rows.length > 0) {
      return res.json(cachedResult.rows[0].analysis_result);
    }

    // AI анализ
    const prompt = `
      Проанализируй следующую информацию на достоверность:
      
      Текст: "${text}"
      ${context ? `Контекст: ${context}` : ''}
      
      Ответь в формате JSON:
      {
        "analysis": "детальный анализ утверждения",
        "confidence": число от 0 до 1 (уверенность в анализе),
        "isLikelyTrue": true/false,
        "evidencePoints": ["пункт1", "пункт2", "пункт3"],
        "recommendations": ["рекомендация1", "рекомендация2"],
        "sourcesToCheck": ["источник1", "источник2"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ты эксперт по проверке фактов. Анализируй информацию объективно и предоставляй доказательства." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    // Сохраняем в базу
    await db.query(
      'INSERT INTO analyses (user_input, ai_analysis, confidence_score, is_fake, recommendations) VALUES ($1, $2, $3, $4, $5)',
      [text, analysis, analysis.confidence, !analysis.isLikelyTrue, analysis.recommendations]
    );

    // Сохраняем в кэш
    await db.query(
      'INSERT INTO analysis_cache (input_hash, analysis_result) VALUES ($1, $2)',
      [inputHash, analysis]
    );

    res.json(analysis);
    
  } catch (error) {
    console.error('Ошибка анализа:', error);
    res.status(500).json({ error: 'Ошибка при анализе текста' });
  }
};

exports.analyzeProject = async (req, res) => {
  try {
    const { projectUrl } = req.body;
    
    // Здесь можно добавить парсинг GitHub проекта
    // Для простоты используем AI для анализа описания
    
    const prompt = `
      Проанализируй проект по ссылке: ${projectUrl}
      
      Оцени:
      1. Правдоподобность заявлений
      2. Качество кода/документации
      3. Потенциальные риски
      4. Рекомендации по улучшению
      
      Ответь в формате JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ты эксперт по анализу IT проектов." },
        { role: "user", content: prompt }
      ]
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    // Сохраняем анализ проекта
    await db.query(
      'INSERT INTO user_projects (project_url, analysis_results, score) VALUES ($1, $2, $3)',
      [projectUrl, analysis, analysis.overallScore || 0.7]
    );

    res.json(analysis);
    
  } catch (error) {
    console.error('Ошибка анализа проекта:', error);
    res.status(500).json({ error: 'Ошибка при анализе проекта' });
  }
};