const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Статические файлы
app.use(express.static('../frontend'));

// Простой анализ без базы данных
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Введите текст' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "Ты помощник для проверки фактов. Отвечай кратко и по делу." 
        },
        { 
          role: "user", 
          content: `Проверь это утверждение: "${text}"` 
        }
      ],
      max_tokens: 500
    });

    const analysis = completion.choices[0].message.content;
    
    res.json({
      analysis: analysis,
      confidence: 0.8,
      isLikelyTrue: true,
      recommendations: ["Проверьте дополнительные источники"]
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка AI' });
  }
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../frontend' });
});

app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});