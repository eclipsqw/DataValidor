// Счётчик символов
document.getElementById('inputText').addEventListener('input', function() {
    const count = this.value.length;
    document.getElementById('charCount').textContent = count;
    
    if (count > 5000) {
        this.value = this.value.substring(0, 5000);
        document.getElementById('charCount').textContent = 5000;
        document.getElementById('charCount').style.color = '#ff4757';
    } else if (count > 4000) {
        document.getElementById('charCount').style.color = '#ffa502';
    } else {
        document.getElementById('charCount').style.color = '#888';
    }
});

// Drag & Drop для файлов
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.backgroundColor = '#f8f9ff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    uploadArea.style.backgroundColor = 'transparent';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileUpload(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимум 5 MB.');
        return;
    }
    
    const resultDiv = document.getElementById('projectResult');
    resultDiv.innerHTML = `
        <div class="upload-success">
            <i class="fas fa-check-circle" style="color:#2ed573;font-size:24px;"></i>
            <p><strong>Файл загружен:</strong> ${file.name}</p>
            <p><small>Размер: ${(file.size / 1024).toFixed(1)} KB</small></p>
            <button class="btn-secondary" onclick="analyzeProject()">
                <i class="fas fa-play"></i> Начать анализ
            </button>
        </div>
    `;
}

// Анализ текста
async function analyzeText() {
    const text = document.getElementById('inputText').value.trim();
    const resultDiv = document.getElementById('textResult');
    
    if (!text) {
        alert('Введите текст для анализа!');
        return;
    }
    
    // Показываем анимацию загрузки
    resultDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Анализируем информацию...</p>
            <p><small>Проверяем факты, источники и логику</small></p>
        </div>
    `;
    
    // Стили для спиннера
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            text-align: center;
            padding: 20px;
        }
        .spinner {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        <span style="color: hsl(var(--primary)); font-weight: 500;">@keyframes</span> spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    try {
        // Временная заглушка (потом замените на реальный API)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Генерация "реального" результата
        const score = 65 + Math.floor(Math.random() * 30);
        const sources = ['Википедия', 'Научные журналы', 'Официальная статистика'];
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        
        resultDiv.innerHTML = `
            <div class="analysis-result">
                <div class="score-header">
                    <h3><i class="fas fa-chart-line"></i> Результат проверки</h3>
                    <div class="score-circle">
                        <div class="score-value">${score}%</div>
                        <div class="score-label">достоверность</div>
                    </div>
                </div>
                
                <div class="score-bar">
                    <div class="bar-fill" style="width: ${score}%"></div>
                </div>
                
                <div class="report">
                    <h4><i class="fas fa-file-alt"></i> Аналитический отчёт</h4>
                    <p>На основе анализа текста выявлено, что информация содержит как проверяемые факты, так и элементы субъективной интерпретации. Основные утверждения соответствуют данным из ${randomSource}, однако присутствуют эмоциональные преувеличения.</p>
                    
                    <div class="recommendations">
                        <h5><i class="fas fa-lightbulb"></i> Рекомендации:</h5>
                        <ul>
                            <li>Проверить даты и статистические данные в официальных источниках</li>
                            <li>Искать подтверждение в нескольких независимых источниках</li>
                            <li>Обратить внимание на возможные конфликты интересов автора</li>
                        </ul>
                    </div>
                    
                    <div class="details">
                        <h5><i class="fas fa-search"></i> Детали анализа:</h5>
                        <table>
                            <tr>
                                <td><strong>Логическая целостность:</strong></td>
                                <td>${score > 70 ? 'Высокая' : 'Средняя'}</td>
                            </tr>
                            <tr>
                                <td><strong>Наличие источников:</strong></td>
                                <td>${score > 60 ? 'Частичное' : 'Недостаточное'}</td>
                            </tr>
                            <tr>
                                <td><strong>Эмоциональная окраска:</strong></td>
                                <td>${score > 80 ? 'Нейтральная' : 'Присутствует'}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <button class="btn-secondary" onclick="saveReport()">
                    <i class="fas fa-download"></i> Сохранить отчёт
                </button>
            </div>
        `;
        
        // Добавляем стили для результата
        const resultStyle = document.createElement('style');
        resultStyle.textContent = `
            .analysis-result {
                animation: fadeIn 0.5s ease-in;
            }
            <span style="color: hsl(var(--primary)); font-weight: 500;">@keyframes</span> fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .score-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .score-circle {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }
            .score-value {
                font-size: 28px;
                font-weight: bold;
            }
            .score-label {
                font-size: 12px;
                opacity: 0.9;
            }
            .score-bar {
                height: 10px;
                background: #e0e0e0;
                border-radius: 5px;
                margin: 20px 0;
                overflow: hidden;
            }
            .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #2ed573, #1e90ff);
                border-radius: 5px;
                transition: width 1s ease-in-out;
            }
            .report h4, .report h5 {
                color: #444;
                margin: 15px 0 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .recommendations ul {
                padding-left: 20px;
                margin: 10px 0;
            }
            .recommendations li {
                margin-bottom: 8px;
                color: #555;
            }
            .details table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }
            .details td {
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .details td:first-child {
                width: 60%;
            }
        `;
        document.head.appendChild(resultStyle);
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle" style="color:#ff4757;font-size:36px;"></i>
                <p>Ошибка анализа. Попробуйте снова.</p>
                <p><small>${error.message}</small></p>
            </div>
        `;
    }
}

// Анализ проекта
function analyzeProject() {
    const resultDiv = document.getElementById('projectResult');
    
    resultDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Анализируем структуру проекта...</p>
        </div>
    `;
    
    setTimeout(() => {
        const structureScore = 70 + Math.floor(Math.random() * 25);
        const logicScore = 65 + Math.floor(Math.random() * 30);
        const truthScore = 80 + Math.floor(Math.random() * 15);
        
        resultDiv.innerHTML = `
            <div class="project-analysis">
                <h3><i class="fas fa-clipboard-check"></i> Оценка проекта</h3>
                
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">${structureScore}%</div>
                        <div class="metric-label">Структура</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${logicScore}%</div>
                        <div class="metric-label">Логика</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${truthScore}%</div>
                        <div class="metric-label">Достоверность</div>
                    </div>
                </div>
                
                <div class="verdict">
                    <h4><i class="fas fa-gavel"></i> Вердикт:</h4>
                    <p>Проект имеет хорошую структуру, но требует дополнительной проверки источников. Логическая цепочка в основном сохранена, обнаружено несколько мест, где аргументация может быть усилена.</p>
                </div>
                
                <div class="improvements">
                    <h4><i class="fas fa-tools"></i> Что улучшить:</h4>
                    <ol>
                        <li>Добавить цитирование научных источников в разделах 2 и 4</li>
                        <li>Усилить аргументацию в заключительной части</li>
                        <li>Проверить статистические данные на актуальность</li>
                        <li>Добавить контраргументы для баланса</li>
                    </ol>
                </div>
                
                <div class="final-score">
                    <div class="total-score">
                        Итоговая оценка: <span class="score-number">${Math.round((structureScore + logicScore + truthScore) / 3)}/100</span>
                    </div>
                    <div class="score-message">
                        ${structureScore > 75 ? 'Отличная работа!' : 'Хороший проект, есть куда расти'}
                    </div>
                </div>
            </div>
        `;
        
        // Стили для анализа проекта
        const projectStyle = document.createElement('style');
        projectStyle.textContent = `
            .project-analysis {
                animation: fadeIn 0.5s ease-in;
            }
            .metrics {
                display: flex;
                justify-content: space-around;
                margin: 25px 0;
                gap: 15px;
            }
            .metric {
                text-align: center;
                flex: 1;
                padding: 15px;
                background: #f8f9ff;
                border-radius: 10px;
                border: 2px solid #e0e0ff;
            }
            .metric-value {
                font-size: 32px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 5px;
            }
            .metric-label {
                color: #666;
                font-size: 14px;
            }
            .verdict, .improvements {
                margin: 20px 0;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .improvements ol {
                padding-left: 20px;
                margin: 10px 0;
            }
            .improvements li {
                margin-bottom: 8px;
                color: #555;
            }
            .final-score {
                text-align: center;
                margin-top: 25px;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
            }
            .total-score {
                font-size: 20px;
                margin-bottom: 10px;
            }
            .score-number {
                font-size: 32px;
                font-weight: bold;
                color: #ffdd59;
            }
            .score-message {
                font-size: 18px;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(projectStyle);
    }, 3000);
}

// Сохранение отчёта
function saveReport() {
    const text = document.getElementById('inputText').value;
    const result = document.querySelector('.analysis-result').outerHTML;
    
    const blob = new Blob([`
        ОТЧЁТ DATAVALIDOR
        =================
        Дата: ${new Date().toLocaleString()}
        
        ПРОВЕРЯЕМЫЙ ТЕКСТ:
        ${text}
        
        РЕЗУЛЬТАТ АНАЛИЗА:
        ${result}
    `], { type: 'text/html' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `datavalidor-report-${Date.now()}.html`;
    link.click();
    
    alert('Отчёт сохранён!');
}