# Реализация TestAIExplainButton

Подробное описание компонента TestAIExplainButton: что он делает, где расположен и как реализован.

---

## Что делает компонент

TestAIExplainButton - это кнопка для генерации и отображения AI-объяснения к тестовому вопросу. Компонент выполняет следующие функции:

1. **Генерация объяснения**: При первом клике генерирует объяснение вопроса с помощью AI
2. **Отображение объяснения**: Показывает ранее сгенерированное объяснение
3. **Скрытие объяснения**: Возвращает к обычному виду блока вопроса
4. **Сохранение**: Автоматически сохраняет объяснение в localStorage
5. **Визуальная индикация**: Показывает разные иконки в зависимости от состояния

---

## Расположение на странице

### Позиция в структуре блока теста

Кнопка TestAIExplainButton расположена в **заголовке блока теста**, в правой части, рядом с кнопкой удаления.

**Структура расположения:**

```
TestRACBlock (или другой блок теста)
└── Заголовок блока
    └── Правая часть (flex items-center gap-2)
        ├── TestAIExplainButton  ← Здесь
        └── Кнопка удаления
```

### Точное расположение в коде

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-6">
  {/* Заголовок блока */}
  <div className="flex items-center justify-between">
    {/* Левая часть: Иконка типа теста и название */}
    <div className="flex items-center gap-3">
      {/* ... */}
    </div>
    
    {/* Правая часть: Кнопки действий */}
    <div className="flex items-center gap-2">
      {/* TestAIExplainButton здесь */}
      <TestAIExplainButton
        blockId={blockId}
        question={question}
        answers={answers}
        courseLanguage={courseLanguage}
        isShowingExplanation={showAIExplanation}
        onToggleExplanation={handleToggleExplanation}
        onRegenerateSuccess={handleExplanationUpdate}
        storageKeyPrefix={storageKeyPrefix}
        testType="rac"
      />
      
      {/* Кнопка удаления */}
      <button onClick={onRemove}>
        <Icons.Trash />
      </button>
    </div>
  </div>
  
  {/* Остальной контент блока */}
</div>
```

### Стили контейнера

**Контейнер правой части:**
- **Display**: `flex items-center` (flexbox с вертикальным центрированием)
- **Gap**: `gap-2` (8px между кнопками)

**Позиция относительно блока:**
- Находится в правом верхнем углу блока теста
- Выровнена по правому краю заголовка
- Расположена слева от кнопки удаления

---

## Стили кнопки

### Базовые стили

```tsx
className="p-2 hover:bg-gray-800 rounded-lg transition-colors group relative disabled:opacity-50 disabled:cursor-not-allowed"
```

**Стили:**
- **Padding**: `p-2` (8px со всех сторон)
- **Hover Background**: `hover:bg-gray-800` (#1F2937 - темно-серый при наведении)
- **Border Radius**: `rounded-lg` (8px - округленные углы)
- **Transition**: `transition-colors` (плавный переход цвета)
- **Group**: `group` (для hover эффектов на дочерних элементах)
- **Position**: `relative` (для позиционирования выпадающих меню)
- **Disabled Opacity**: `disabled:opacity-50` (50% прозрачности при отключении)
- **Disabled Cursor**: `disabled:cursor-not-allowed` (курсор "запрещено" при отключении)

### Дополнительные стили при загрузке

```tsx
className={`... ${isLoading ? 'flex items-center justify-center' : ''}`}
```

При загрузке добавляются:
- **Display**: `flex items-center justify-center` (центрирование анимации загрузки)

---

## Состояния кнопки

### 1. Состояние: Объяснения нет (первый клик)

**Иконка:**
- SVG звездочки/искры (контур, не залита)
- **Size**: 22px × 22px
- **Color**: `text-gray-400` (#9CA3AF - серый)
- **Hover Color**: `group-hover:text-purple-400` (#A78BFA - фиолетовый)

**Tooltip:**
- "Получить объяснение от AI" (или перевод)

**Действие при клике:**
- Генерирует объяснение через AI
- Показывает анимацию загрузки
- Сохраняет объяснение в localStorage
- Переключает на состояние "Объяснение есть"

---

### 2. Состояние: Объяснение есть (не показано)

**Иконка:**
- SVG звездочки/искры (залита)
- **Size**: 22px × 22px
- **Color**: `text-purple-500` (#A78BFA - фиолетовый)

**Tooltip:**
- "Показать объяснение" (или перевод)

**Действие при клике:**
- Показывает объяснение
- Переключает на состояние "Объяснение показано"

---

### 3. Состояние: Объяснение показано

**Иконка:**
- `Icons.ArrowLeft` (стрелка влево)
- **Size**: 20px × 20px
- **Color**: `text-gray-400` (#9CA3AF - серый)
- **Hover Color**: `group-hover:text-purple-400` (#A78BFA - фиолетовый)

**Tooltip:**
- "Вернуться к вопросу" (или перевод)

**Действие при клике:**
- Скрывает объяснение
- Возвращает к обычному виду блока
- Переключает на состояние "Объяснение есть (не показано)"

---

### 4. Состояние: Загрузка

**Анимация:**
- Круглая анимация загрузки
- **Size**: 28px × 28px
- **Animation**: `loader-combined 2.3s linear infinite`
- **Colors**: Фиолетовые оттенки (#a78bfa, #8b5cf6, #7c3aed)

**Tooltip:**
- "Генерация объяснения..." (или перевод)

**Кнопка:**
- Отключена (`disabled={isLoading}`)
- Нельзя кликнуть во время загрузки

---

## Логика работы

### Функция handleClick

```typescript
const handleClick = async () => {
  // 1. Если показывается объяснение, скрываем его
  if (isShowingExplanation) {
    onToggleExplanation();
    return;
  }

  // 2. Если объяснение уже есть, показываем его
  if (hasExplanation) {
    onToggleExplanation();
    return;
  }

  // 3. Если объяснения нет, генерируем его
  await generateExplanation();
};
```

**Алгоритм работы:**

1. **Проверка состояния показа объяснения**
   - Если объяснение показано → скрыть его

2. **Проверка наличия объяснения**
   - Если объяснение есть в localStorage → показать его

3. **Генерация нового объяснения**
   - Если объяснения нет → сгенерировать через AI

---

### Функция generateExplanation

```typescript
const generateExplanation = async () => {
  // 1. Валидация данных
  if (!question || !answers || answers.length === 0) {
    alert(t('testEditor.validation.fillQuestionAndAnswers'));
    return null;
  }

  // 2. Подготовка данных
  const questionData = {
    question,
    answers: answers.map(a => ({ value: a.value, isCorrect: a.isCorrect })),
    imageUrl: imageUrl || undefined
  };

  // 3. Генерация через AI
  const aiExplanation = await explainQuestion(questionData, courseLanguage, testType);

  // 4. Сохранение в localStorage
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem(`${storageKeyPrefix}_${blockId}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      data.explanation_ai = aiExplanation;
      localStorage.setItem(`${storageKeyPrefix}_${blockId}`, JSON.stringify(data));
      setHasExplanation(true);
    }
  }

  // 5. Уведомление родителя
  if (onRegenerateSuccess) {
    onRegenerateSuccess(aiExplanation);
  }

  return aiExplanation;
};
```

**Процесс генерации:**

1. **Валидация**: Проверяет, что вопрос и ответы заполнены
2. **Подготовка данных**: Формирует объект с вопросом, ответами и изображением (если есть)
3. **API запрос**: Вызывает `explainQuestion` из хука `useAI`
4. **Сохранение**: Сохраняет объяснение в localStorage под ключом `${storageKeyPrefix}_${blockId}`
5. **Обновление состояния**: Устанавливает `hasExplanation = true`
6. **Callback**: Вызывает `onRegenerateSuccess` для уведомления родителя

---

## Интеграция с AI

### API Endpoint

**Путь:** `/api/ai/explain-question`

**Метод:** `POST`

**Тело запроса:**
```json
{
  "questionData": {
    "question": "текст вопроса",
    "answers": [
      { "value": "вариант 1", "isCorrect": true },
      { "value": "вариант 2", "isCorrect": false }
    ],
    "imageUrl": "url изображения (опционально)"
  },
  "courseLanguage": "kg" | "ru",
  "testType": "math1" | "math2" | "analogy" | "rac" | "grammar" | "standard"
}
```

**Ответ:**
```json
{
  "explanation": "текст объяснения от AI"
}
```

### Хук useAI

```typescript
const { explainQuestion, isLoading } = useAI();
```

**Функция explainQuestion:**
- Принимает данные вопроса, язык курса и тип теста
- Отправляет POST запрос на `/api/ai/explain-question`
- Возвращает Promise с текстом объяснения
- Управляет состоянием загрузки (`isLoading`)

---

## Сохранение в localStorage

### Структура данных

**Ключ:** `${storageKeyPrefix}_${blockId}`

**Пример:** `lessonTest_rac-1764076584395`

**Структура:**
```json
{
  "question": "текст вопроса",
  "answers": [
    { "id": "1", "value": "вариант 1", "isCorrect": true },
    { "id": "2", "value": "вариант 2", "isCorrect": false }
  ],
  "points": 1,
  "timeLimit": 60,
  "explanation_ai": "текст объяснения от AI"
}
```

### Проверка наличия объяснения

```typescript
useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem(`${storageKeyPrefix}_${blockId}`);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const hasExp = !!data.explanation_ai;
        setHasExplanation(hasExp);
      } catch (e) {
        console.error('Error loading explanation:', e);
      }
    }
  }
}, [blockId, storageKeyPrefix]);
```

При монтировании компонента проверяется наличие объяснения в localStorage и устанавливается состояние `hasExplanation`.

---

## Взаимодействие с родительским компонентом

### Props

| Prop | Тип | Описание |
|------|-----|----------|
| `blockId` | `string` | Уникальный идентификатор блока теста |
| `question` | `string` | Текст вопроса |
| `answers` | `AnswerVariant[]` | Массив вариантов ответов |
| `courseLanguage` | `'kg' \| 'ru'` | Язык курса |
| `isShowingExplanation` | `boolean` | Флаг показа объяснения |
| `onToggleExplanation` | `() => void` | Callback для переключения показа |
| `onRegenerateSuccess` | `(explanation: string) => void` | Callback при успешной генерации |
| `storageKeyPrefix` | `string` | Префикс для ключа localStorage (по умолчанию 'lessonTest') |
| `testType` | `string` | Тип теста (math1, math2, analogy, rac, grammar, standard) |
| `imageUrl` | `string?` | URL изображения (опционально) |

### Callbacks

**onToggleExplanation:**
- Вызывается при переключении показа/скрытия объяснения
- Родительский компонент управляет состоянием `showAIExplanation`

**onRegenerateSuccess:**
- Вызывается после успешной генерации объяснения
- Передает текст объяснения родительскому компоненту
- Родительский компонент обновляет состояние `aiExplanation`

---

## Визуальные состояния

### Иконка звездочки (объяснения нет)

```tsx
<svg 
  width="22" 
  height="22" 
  viewBox="-10 -10 562 562"
  className="text-gray-400 group-hover:text-purple-400 transition-colors"
>
  <path 
    fill="none"
    stroke="currentColor"
    strokeWidth="20"
    d="M 327.5 85.2 ..."
  />
</svg>
```

- **Fill**: `none` (контур)
- **Stroke**: `currentColor` (текущий цвет)
- **Stroke Width**: `20`

### Иконка звездочки (объяснение есть)

```tsx
<svg 
  width="22" 
  height="22"
  className="text-purple-500"
>
  <path 
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    d="M 327.5 85.2 ..."
  />
</svg>
```

- **Fill**: `currentColor` (залита)
- **Stroke Width**: `0` (без контура)
- **Color**: Фиолетовый (#A78BFA)

### Иконка стрелки влево (объяснение показано)

```tsx
<Icons.ArrowLeft 
  className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" 
/>
```

- **Size**: 20px × 20px
- **Color**: Серый, при hover фиолетовый

---

## Анимация загрузки

### CSS анимация

```css
.loader-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: transparent;
  animation: loader-combined 2.3s linear infinite;
}

@keyframes loader-combined {
  0% {
    transform: rotate(90deg);
    box-shadow: /* фиолетовые тени */;
  }
  25% {
    transform: rotate(180deg);
    box-shadow: /* более яркие тени */;
  }
  50% {
    transform: rotate(270deg);
    box-shadow: /* средние тени */;
  }
  75% {
    transform: rotate(360deg);
    box-shadow: /* более яркие тени */;
  }
  100% {
    transform: rotate(450deg);
    box-shadow: /* фиолетовые тени */;
  }
}
```

**Характеристики:**
- **Duration**: 2.3 секунды
- **Timing Function**: `linear` (равномерная)
- **Iteration**: `infinite` (бесконечная)
- **Effect**: Вращение с изменяющимися тенями фиолетовых оттенков

---

## Полный пример использования

```tsx
// В компоненте TestRACBlock
const [showAIExplanation, setShowAIExplanation] = useState(false);
const [aiExplanation, setAiExplanation] = useState<string>('');

const handleToggleExplanation = useCallback(() => {
  setShowAIExplanation(prev => !prev);
}, []);

const handleExplanationUpdate = useCallback((explanation: string) => {
  setAiExplanation(explanation);
}, []);

// В JSX
<div className="flex items-center gap-2">
  <TestAIExplainButton
    blockId={blockId}
    question={question}
    answers={answers}
    courseLanguage={courseLanguage}
    isShowingExplanation={showAIExplanation}
    onToggleExplanation={handleToggleExplanation}
    onRegenerateSuccess={handleExplanationUpdate}
    storageKeyPrefix={storageKeyPrefix}
    testType="rac"
  />
  <button onClick={onRemove}>
    <Icons.Trash />
  </button>
</div>

{/* Условный рендеринг объяснения */}
{showAIExplanation ? (
  <div>
    <TestEditorField
      value={aiExplanation}
      onChange={handleAIExplanationChange}
      placeholder="Объяснение от AI"
      height={300}
    />
  </div>
) : (
  <div>
    {/* Обычные поля вопроса и ответов */}
  </div>
)}
```

---

## Особенности реализации

1. **Автоматическое сохранение**: Объяснение сохраняется в localStorage сразу после генерации

2. **Проверка наличия**: При монтировании проверяется наличие объяснения в localStorage

3. **Валидация**: Перед генерацией проверяется заполнение вопроса и ответов

4. **Типы тестов**: Поддерживает разные типы тестов с разными промптами для AI

5. **Многоязычность**: Поддерживает киргизский и русский языки

6. **Визуальная обратная связь**: Разные иконки для разных состояний

7. **Анимация загрузки**: Показывает анимацию во время генерации

8. **Обработка ошибок**: Обрабатывает ошибки генерации и сохраняет их в консоль

---

## Итоговая схема работы

```
Пользователь кликает на кнопку
         ↓
Проверка состояния
         ↓
    ┌────┴────┐
    │         │
Объяснение  Объяснения
показано?   нет?
    │         │
    ↓         ↓
Скрыть    Генерировать
         ↓
    Валидация данных
         ↓
    API запрос к AI
         ↓
    Получение объяснения
         ↓
    Сохранение в localStorage
         ↓
    Показ объяснения
```

---

## Размеры и отступы

| Элемент | Значение |
|---------|----------|
| **Padding кнопки** | 8px (p-2) |
| **Border Radius** | 8px (rounded-lg) |
| **Gap между кнопками** | 8px (gap-2) |
| **Размер иконки звездочки** | 22px × 22px |
| **Размер иконки стрелки** | 20px × 20px |
| **Размер анимации загрузки** | 28px × 28px |

---

## Цветовая схема

| Состояние | Цвет иконки | Hover цвет |
|-----------|-------------|------------|
| **Объяснения нет** | Серый (#9CA3AF) | Фиолетовый (#A78BFA) |
| **Объяснение есть** | Фиолетовый (#A78BFA) | - |
| **Объяснение показано** | Серый (#9CA3AF) | Фиолетовый (#A78BFA) |
| **Загрузка** | Фиолетовые оттенки (анимация) | - |
| **Hover фон кнопки** | Темно-серый (#1F2937) | - |


