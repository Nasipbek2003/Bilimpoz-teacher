# Логика работы TestRACBlock

Подробное описание логики работы компонента TestRACBlock: форматирование текста (Markdown и LaTeX), режим превью, объяснение от AI и другие аспекты.

---

## Общая структура компонента

TestRACBlock - это компонент для создания и редактирования тестовых вопросов типа "Чтение и понимание" (RAC - Reading and Comprehension).

**Основные функции:**
- Редактирование вопроса и вариантов ответов
- Форматирование текста (Markdown + LaTeX)
- Режим предпросмотра (Preview Mode)
- Генерация объяснения от AI
- Улучшение текста с помощью AI
- Сохранение данных в localStorage
- Валидация полей

---

## Форматирование текста

### Поддержка Markdown

Компонент использует библиотеку `@uiw/react-md-editor` для редактирования Markdown текста.

**Поддерживаемые форматы:**

1. **Жирный текст** (`**текст**`)
   ```markdown
   **Важный текст**
   ```

2. **Курсив** (`_текст_`)
   ```markdown
   _Курсивный текст_
   ```

3. **Зачеркнутый текст** (`~~текст~~`)
   ```markdown
   ~~Удаленный текст~~
   ```

4. **Подчеркнутый текст** (`<u>текст</u>`)
   ```html
   <u>Подчеркнутый текст</u>
   ```

5. **Списки** (маркированные и нумерованные)
   ```markdown
   - Элемент 1
   - Элемент 2
   ```

6. **Заголовки** (`# Заголовок`)
   ```markdown
   # Заголовок 1
   ## Заголовок 2
   ```

### Поддержка LaTeX

Компонент поддерживает математические формулы через LaTeX с использованием библиотек:
- `remark-math` - для парсинга LaTeX в Markdown
- `rehype-katex` - для рендеринга LaTeX формул
- `katex` - для отображения формул

**Типы формул:**

1. **Инлайн формула** (в строке)
   ```markdown
   $x^2 + y^2 = z^2$
   ```
   Отображается как: x² + y² = z²

2. **Блочная формула** (отдельный блок)
   ```markdown
   $$
   x^2 + y^2 = z^2
   $$
   ```
   Отображается как отдельный блок с центрированием

**Примеры LaTeX:**
- `$x^2$` - степень
- `$\frac{a}{b}$` - дробь
- `$\sqrt{x}$` - корень
- `$\sum_{i=1}^{n}$` - сумма
- `$\int_{a}^{b}$` - интеграл

### Применение форматирования

Форматирование применяется через функцию `applyFormat`:

```typescript
const applyFormat = useCallback((format: string) => {
  const editor = getActiveEditor();
  if (!editor?.textarea) return;
  
  const textarea = editor.textarea;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = currentValue.substring(start, end);
  
  switch (format) {
    case 'bold':
      newText = `${beforeText}**${selectedText || 'текст'}**${afterText}`;
      break;
    case 'italic':
      newText = `${beforeText}_${selectedText || 'текст'}_${afterText}`;
      break;
    case 'inline-formula':
      newText = `${beforeText}$${selectedText || 'x^2'}$${afterText}`;
      break;
    case 'block-formula':
      newText = `${beforeText}$$\n${selectedText || 'x^2 + y^2 = z^2'}\n$$${afterText}`;
      break;
    // ...
  }
}, [activeField, question, answers]);
```

**Алгоритм применения форматирования:**

1. Получает активный редактор (поле вопроса или ответа)
2. Определяет выделенный текст (или позицию курсора)
3. Вставляет Markdown синтаксис вокруг выделенного текста
4. Обновляет значение поля
5. Восстанавливает позицию курсора

---

## Режим превью (Preview Mode)

### Что такое режим превью?

Режим превью (`isPreviewMode`) - это режим отображения, при котором текст показывается в отформатированном виде (как он будет выглядеть для пользователя), а не в виде исходного Markdown кода.

### Как работает режим превью

**В TestEditorField:**

```typescript
<MDEditor 
  value={value}
  onChange={(val) => onChange(val || '')}
  preview={isPreviewMode ? "preview" : "edit"}
  hideToolbar={true}
  visibleDragbar={false}
  previewOptions={{
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  }}
/>
```

**Режимы:**

1. **Режим редактирования** (`preview="edit"`)
   - Показывает исходный Markdown код
   - Можно редактировать текст напрямую
   - Видны все символы форматирования (`**`, `_`, `$` и т.д.)

2. **Режим превью** (`preview="preview"`)
   - Показывает отформатированный текст
   - Markdown преобразуется в HTML
   - LaTeX формулы рендерятся как математические выражения
   - Нельзя редактировать напрямую (только через кнопки форматирования)

### Управление режимом превью

**Глобальное управление:**

Режим превью управляется на уровне `LessonTestsPage`:

```typescript
const [isPreviewMode, setIsPreviewMode] = useState(false);

const getIsPreviewMode = () => isPreviewMode;

// Передача в блоки тестов
<TestComponent
  isPreviewMode={isPreviewMode}
  // ...
/>
```

**Переключение режима:**

Через кнопку в `TestToolbar`:

```typescript
<button
  onClick={() => setIsPreviewMode(!isPreviewMode)}
  className={isPreviewMode ? 'bg-blue-500/20' : 'hover:bg-gray-800'}
>
  {isPreviewMode ? (
    // Иконка "скрыть превью" (глаз с перечеркиванием)
  ) : (
    // Иконка "показать превью" (глаз)
  )}
</button>
```

### Зачем нужен режим превью?

1. **Предварительный просмотр**: Видеть, как текст будет выглядеть для пользователя
2. **Проверка форматирования**: Убедиться, что Markdown и LaTeX отображаются правильно
3. **Визуальная проверка**: Проверить читаемость и структуру текста
4. **Отладка**: Найти ошибки в форматировании перед сохранением

---

## Объяснение от AI

### Что такое объяснение от AI?

Объяснение от AI - это автоматически сгенерированное объяснение к тестовому вопросу, которое помогает понять:
- Что именно спрашивается в вопросе
- Почему правильный ответ является правильным
- Как решить подобные вопросы

### Как работает объяснение от AI

**1. Генерация объяснения:**

```typescript
const generateExplanation = async () => {
  const questionData = {
    question,
    answers: answers.map(a => ({ value: a.value, isCorrect: a.isCorrect })),
  };
  
  const aiExplanation = await explainQuestion(questionData, courseLanguage, 'rac');
  
  // Сохранение в localStorage
  const data = JSON.parse(localStorage.getItem(`${storageKeyPrefix}_${blockId}`));
  data.explanation_ai = aiExplanation;
  localStorage.setItem(`${storageKeyPrefix}_${blockId}`, JSON.stringify(data));
};
```

**2. API запрос:**

```typescript
// POST /api/ai/explain-question
{
  "questionData": {
    "question": "текст вопроса",
    "answers": [
      { "value": "вариант 1", "isCorrect": true },
      { "value": "вариант 2", "isCorrect": false }
    ]
  },
  "courseLanguage": "kg",
  "testType": "rac"
}
```

**3. Отображение объяснения:**

```typescript
{showAIExplanation ? (
  <div>
    <label>Объяснение от AI</label>
    <TestEditorField
      value={aiExplanation}
      onChange={handleAIExplanationChange}
      placeholder="Объяснение от AI"
      height={300}
      isPreviewMode={isPreviewMode}
    />
    <RegenerateAIButton
      onRegenerate={handleRegenerateExplanation}
      isLoading={isAILoading}
    />
  </div>
) : (
  // Обычные поля вопроса и ответов
)}
```

### Переключение между объяснением и вопросом

**Кнопка TestAIExplainButton:**

- **Первый клик**: Генерирует объяснение (если его нет)
- **Второй клик**: Показывает объяснение
- **Третий клик**: Скрывает объяснение, возвращает к вопросу

**Состояния:**

1. **Объяснения нет** → Генерация
2. **Объяснение есть (скрыто)** → Показать
3. **Объяснение показано** → Скрыть

### Сохранение объяснения

Объяснение сохраняется в localStorage вместе с данными теста:

```typescript
{
  "question": "...",
  "answers": [...],
  "points": 1,
  "timeLimit": 60,
  "explanation_ai": "Текст объяснения от AI"
}
```

---

## Улучшение текста с помощью AI

### Что такое улучшение текста?

Улучшение текста - это функция, которая позволяет улучшить выделенный текст с помощью AI, делая его более понятным, грамматически правильным или стилистически улучшенным.

### Как работает улучшение текста

**1. Выделение текста:**

Пользователь выделяет текст в поле вопроса или ответа.

**2. Нажатие кнопки "Улучшить текст":**

```typescript
const improveText = async (selectedText: string, currentValue: string, language: 'kg' | 'ru') => {
  setIsImprovingText(true);
  
  try {
    // Генерация улучшенного текста
    const improvedText = await improveTextAI(selectedText, language);
    
    // Замена выделенного текста на улучшенный
    const newValue = currentValue.replace(selectedText, improvedText);
    setActiveFieldValue(newValue);
    
    // Сохранение версий (оригинал и улучшенный)
    setTextVersions(prev => ({
      ...prev,
      [versionKey]: {
        original: currentValue,
        improved: newValue,
        isShowingImproved: true,
      }
    }));
    
    // Сохранение в историю
    addToImprovementHistory({
      blockId,
      fieldType: 'question' | 'answer',
      fieldId,
      originalText: selectedText,
      improvedText,
      language,
    });
  } finally {
    setIsImprovingText(false);
  }
};
```

**3. API запрос:**

```typescript
// POST /api/ai/improve-text
{
  "text": "выделенный текст",
  "courseLanguage": "kg"
}
```

### Переключение между версиями текста

После улучшения текста сохраняются две версии:
- **Оригинальная версия** - исходный текст
- **Улучшенная версия** - текст после улучшения AI

**Кнопка переключения:**

```typescript
{hasVersions('question', 'question') && (
  <button
    onClick={() => toggleTextVersion('question', 'question')}
    className="bg-purple-600/20 hover:bg-purple-600/30"
  >
    {isShowingImproved('question', 'question') 
      ? 'Показать оригинал' 
      : 'Показать улучшенный'}
  </button>
)}
```

**Функция переключения:**

```typescript
const toggleTextVersion = (fieldType: 'question' | 'answer', fieldId: string) => {
  const version = textVersions[`${fieldType}_${fieldId}`];
  const newIsShowingImproved = !version.isShowingImproved;
  const valueToSet = newIsShowingImproved ? version.improved : version.original;
  
  // Обновление значения поля
  if (fieldType === 'question') {
    setQuestion(valueToSet);
  } else {
    setAnswers(prev => prev.map(a => 
      a.id === fieldId ? { ...a, value: valueToSet } : a
    ));
  }
};
```

### История улучшений

История улучшений сохраняется в localStorage:

```typescript
interface ImprovementHistoryItem {
  blockId: string;
  fieldType: 'question' | 'answer';
  fieldId: string;
  originalText: string;
  improvedText: string;
  language: 'kg' | 'ru';
  timestamp: number;
}
```

**Восстановление истории:**

При монтировании компонента история загружается из localStorage и восстанавливаются версии текста:

```typescript
useEffect(() => {
  if (!blockId) return;
  
  const history = getBlockHistory(blockId);
  // Восстановление textVersions из истории
  // ...
}, [blockId]);
```

---

## Сохранение данных

### Автоматическое сохранение

Данные теста автоматически сохраняются в localStorage при каждом изменении:

```typescript
useEffect(() => {
  // Пропускаем первый рендер (инициализацию)
  if (isInitialRender.current) {
    isInitialRender.current = false;
    return;
  }
  
  if (typeof window !== 'undefined' && blockId) {
    const dataToSave = {
      question,
      answers,
      points,
      timeLimit,
      explanation_ai, // Сохраняем объяснение, если есть
    };
    localStorage.setItem(`${storageKeyPrefix}_${blockId}`, JSON.stringify(dataToSave));
  }
}, [blockId, question, answers, points, timeLimit]);
```

### Структура сохраненных данных

```typescript
{
  "question": "Текст вопроса",
  "answers": [
    { "id": "1", "value": "Вариант А", "isCorrect": true },
    { "id": "2", "value": "Вариант Б", "isCorrect": false },
    { "id": "3", "value": "Вариант В", "isCorrect": false },
    { "id": "4", "value": "Вариант Г", "isCorrect": false }
  ],
  "points": 1,
  "timeLimit": 60,
  "explanation_ai": "Объяснение от AI (если есть)"
}
```

### Приоритет загрузки данных

1. **localStorage** (приоритет) - данные, сохраненные пользователем
2. **initialData** (из БД) - данные из базы данных, если нет в localStorage

```typescript
const getInitialData = () => {
  // Сначала проверяем localStorage
  if (typeof window !== 'undefined' && blockId) {
    const saved = localStorage.getItem(`${storageKeyPrefix}_${blockId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  }
  // Если нет в localStorage, используем initialData
  if (initialData) {
    return initialData;
  }
  return null;
};
```

---

## Валидация

### Проверка полей

Валидация выполняется перед сохранением теста:

```typescript
const validateBlock = (blockId: string) => {
  const errors: TestValidationErrors = {};
  
  // Проверка вопроса
  if (!question || question.trim() === '') {
    errors.question = true;
  }
  
  // Проверка ответов
  const emptyAnswers = answers.filter(a => !a.value || a.value.trim() === '');
  if (emptyAnswers.length > 0) {
    errors.answers = {};
    answers.forEach((answer, index) => {
      if (!answer.value || answer.value.trim() === '') {
        errors.answers![index] = true;
      }
    });
  }
  
  // Проверка правильного ответа
  const hasCorrectAnswer = answers.some(a => a.isCorrect);
  if (!hasCorrectAnswer) {
    errors.correctAnswer = true;
  }
  
  setValidationErrors(prev => {
    const newErrors = new Map(prev);
    newErrors.set(blockId, errors);
    return newErrors;
  });
};
```

### Отображение ошибок

**Ошибка вопроса:**

```typescript
{validationErrors.question && (
  <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
    <Icons.AlertCircle className="h-4 w-4" />
    <span>Заполните поле вопроса</span>
  </div>
)}
```

**Ошибка ответа:**

```typescript
{validationErrors.answers?.[index] && (
  <div className="mt-2 ml-11 flex items-center gap-2 text-red-400 text-xs">
    <Icons.AlertCircle className="h-3 w-3" />
    <span>Заполните вариант {getAnswerLabel(index)}</span>
  </div>
)}
```

**Ошибка правильного ответа:**

```typescript
{validationErrors.correctAnswer && (
  <div className="mb-3 flex items-center gap-2 text-red-400 text-sm">
    <Icons.AlertCircle className="h-4 w-4" />
    <span>Выберите правильный ответ</span>
  </div>
)}
```

---

## Активное поле

### Отслеживание активного поля

Компонент отслеживает, какое поле активно (в фокусе):

```typescript
const [activeField, setActiveField] = useState<'question' | string | null>(null);

// При фокусе на поле
<TestEditorField
  onFocus={() => setActiveField('question')}
  // ...
/>

// При фокусе на ответ
<TestEditorField
  onFocus={() => setActiveField(answer.id)}
  // ...
/>
```

### Использование активного поля

**1. Применение форматирования:**

Форматирование применяется к активному полю:

```typescript
const applyFormat = (format: string) => {
  const editor = getActiveEditor(); // Получает редактор активного поля
  // Применяет форматирование
};
```

**2. Улучшение текста:**

Улучшение применяется к выделенному тексту в активном поле:

```typescript
const improveText = async (selectedText: string) => {
  const fieldType = activeField === 'question' ? 'question' : 'answer';
  const fieldId = activeField || '';
  // Улучшает текст в активном поле
};
```

**3. Уведомление родителя:**

```typescript
useEffect(() => {
  if (onActiveFieldChange) {
    onActiveFieldChange(activeField === 'question');
  }
}, [activeField, onActiveFieldChange]);
```

---

## Структура компонента

### Основные секции

1. **Заголовок блока**
   - Иконка типа теста (Ч)
   - Название типа теста
   - Кнопки действий (AI объяснение, удаление)

2. **AI Объяснение или поля вопроса**
   - Условный рендеринг: либо объяснение, либо поля вопроса

3. **Поле вопроса**
   - TestEditorField для редактирования вопроса
   - Кнопка переключения версий (если есть улучшенная версия)
   - Ошибки валидации

4. **Варианты ответов**
   - 4 фиксированных варианта (А, Б, В, Г)
   - RadioButton для выбора правильного ответа
   - TestEditorField для каждого варианта
   - Кнопки переключения версий (если есть улучшенные версии)
   - Ошибки валидации

5. **Настройки вопроса**
   - Очки за правильный ответ
   - Время на вопрос (в секундах)

### Условный рендеринг

```typescript
{showAIExplanation ? (
  // Показываем объяснение от AI
  <div>
    <TestEditorField value={aiExplanation} />
    <RegenerateAIButton />
  </div>
) : (
  // Показываем обычные поля
  <>
    <TestEditorField value={question} />
    <div>Варианты ответов</div>
  </>
)}
```

---

## Интеграция с родительским компонентом

### Форматтеры (FormattersRef)

Компонент предоставляет методы форматирования родительскому компоненту:

```typescript
export interface FormattersRef {
  applyFormat: (format: string) => void;
  getPreviewMode: () => boolean;
  getActiveEditor: () => any;
  insertText: (text: string) => void;
  isQuestionFieldActive: () => boolean;
  getActiveFieldValue?: () => string;
  setActiveFieldValue?: (value: string) => void;
  improveText?: (selectedText: string, currentValue: string, courseLanguage: 'kg' | 'ru') => Promise<void>;
  isImprovingText?: () => boolean;
}
```

**Регистрация форматтеров:**

```typescript
useEffect(() => {
  if (onRegisterFormatters) {
    onRegisterFormatters({
      applyFormat,
      getPreviewMode,
      getActiveEditor,
      insertText,
      isQuestionFieldActive,
      getActiveFieldValue,
      setActiveFieldValue,
      improveText,
      isImprovingText: checkIsImprovingText,
    });
  }
}, [onRegisterFormatters, ...]);
```

### Использование в TestToolbar

Родительский компонент (`LessonTestsPage`) использует форматтеры для применения форматирования:

```typescript
const handleFormat = (format: string) => {
  if (formattersRef.current) {
    formattersRef.current.applyFormat(format);
  }
};

<TestToolbar 
  onFormat={handleFormat}
  isPreviewMode={isPreviewMode}
  onMagicWand={handleMagicWand}
/>
```

---

## Примеры использования

### Пример 1: Создание вопроса с формулой

1. Вводим текст вопроса: "Решите уравнение:"
2. Выделяем место для формулы
3. Нажимаем кнопку "Формула" → вставляется `$x^2$`
4. Редактируем формулу: `$x^2 + 5x + 6 = 0$`
5. В режиме превью видим: x² + 5x + 6 = 0

### Пример 2: Улучшение текста

1. Выделяем текст в поле вопроса: "этот текст нужно улучшить"
2. Нажимаем кнопку "Улучшить текст с AI"
3. Текст заменяется на улучшенную версию
4. Можем переключаться между оригиналом и улучшенной версией

### Пример 3: Генерация объяснения

1. Заполняем вопрос и варианты ответов
2. Нажимаем кнопку "Получить объяснение от AI"
3. Объяснение генерируется и сохраняется
4. Нажимаем еще раз → показывается объяснение
5. Можем редактировать объяснение в TestEditorField

### Пример 4: Режим превью

1. Вводим текст с форматированием:
   ```markdown
   **Важный вопрос:**
   
   Решите уравнение: $x^2 = 4$
   ```

2. Нажимаем кнопку "Превью"
3. Видим отформатированный текст:
   - **Важный вопрос:** (жирный)
   - Решите уравнение: x² = 4 (формула)

---

## Технические детали

### Используемые библиотеки

- **@uiw/react-md-editor** - редактор Markdown
- **remark-math** - парсинг LaTeX в Markdown
- **rehype-katex** - рендеринг LaTeX формул
- **katex** - отображение математических формул

### Стили

- **Фон блока**: `bg-[#1a1a1a]` (темно-серый)
- **Фон редактора**: `bg-[#151515]` (еще темнее)
- **Границы**: `border-gray-700` (неактивно), `border-white` (активно)
- **Ошибки**: `text-red-400` (красный)

### Производительность

- **Динамическая загрузка**: MDEditor загружается динамически (`dynamic import`)
- **Мемоизация**: Callbacks мемоизированы с помощью `useCallback`
- **Локальное сохранение**: Данные сохраняются в localStorage для быстрого доступа

---

## Итоговая схема работы

```
Пользователь открывает блок теста
         ↓
Загрузка данных (localStorage → initialData)
         ↓
Отображение полей вопроса и ответов
         ↓
Пользователь редактирует текст
         ↓
Автоматическое сохранение в localStorage
         ↓
Применение форматирования (Markdown/LaTeX)
         ↓
Переключение режима превью (просмотр/редактирование)
         ↓
Генерация объяснения от AI (опционально)
         ↓
Улучшение текста с помощью AI (опционально)
         ↓
Валидация перед сохранением
         ↓
Сохранение в базу данных
```

---

## Заключение

TestRACBlock - это мощный компонент для создания и редактирования тестовых вопросов с поддержкой:

- ✅ Markdown форматирования
- ✅ LaTeX формул
- ✅ Режима превью
- ✅ AI объяснений
- ✅ Улучшения текста с помощью AI
- ✅ Автоматического сохранения
- ✅ Валидации полей
- ✅ Переключения между версиями текста

Все эти функции работают вместе, обеспечивая удобный и функциональный интерфейс для создания качественных тестовых вопросов.

