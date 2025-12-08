# Реализация секции "Чтение и понимание" (RAC)

## Обзор

Секция "Чтение и понимание" (RAC - Reading and Comprehension) отличается от других секций тем, что требует сначала создать тексты для чтения, а затем к каждому тексту добавить вопросы. Это двухэтапный процесс: **Тексты** → **Тесты**.

## Архитектура компонентов

### 1. Основная страница - `TrialGroupQuestionsPage.tsx`

**Расположение:** `src/components/teacher/TrialGroupQuestionsPage.tsx`

**Основные функции:**
- Переключение между табами "Тексты" и "Тесты" для RAC групп
- Управление состоянием и синхронизация данных
- Интеграция с API для загрузки/сохранения

**Ключевые состояния:**
```typescript
// Табы для RAC групп (Тексты / Тесты)
const [activeRACTab, setActiveRACTab] = useState<'texts' | 'tests'>('texts');

// Подтабы для текстов (Текст 1, Текст 2, Текст 3)
const [activeRACTextTab, setActiveRACTextTab] = useState<'text-1' | 'text-2' | 'text-3'>('text-1');
```

### 2. Переключатель табов

**Стили и размеры:**
```css
/* Основной переключатель Тексты/Тесты */
.tab-switcher {
  background: #242424;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  gap: 4px;
}

/* Активная кнопка */
.tab-active {
  background: white;
  color: black;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

/* Неактивная кнопка */
.tab-inactive {
  color: #9ca3af; /* text-gray-400 */
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.tab-inactive:hover {
  color: white;
}
```

**Иконки:**
- Тексты: `BookOpen` (h-4 w-4)
- Тесты: `FileText` (h-4 w-4)

## Таб "Тексты" - RACTextsManager

### Компонент: `RACTextsManager.tsx`

**Расположение:** `src/components/teacher/RACTextsManager.tsx`

**Основной контейнер:**
```css
.rac-texts-container {
  background: #151515;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

### Заголовок секции

**Структура:**
```jsx
<div className="flex items-start gap-3">
  <div className="p-2 bg-yellow-500/10 rounded-lg">
    <Icons.FileText className="h-5 w-5 text-yellow-400" />
  </div>
  <div className="flex-1">
    <h3 className="text-lg font-semibold text-white mb-1">
      {getTitle()}
    </h3>
    <p className="text-sm text-gray-400">
      {getDescription()}
    </p>
  </div>
</div>
```

**Цветовая схема:**
- Иконка: желтый акцент (`bg-yellow-500/10`, `text-yellow-400`)
- Заголовок: белый (`text-white`)
- Описание: серый (`text-gray-400`)

### Поля для текстов (3 текста)

**Структура каждого текста:**

1. **Заголовок текста:**
```jsx
<div className="flex items-center gap-2">
  <div className={`
    w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
    transition-colors duration-200
    ${activeTextId === text.id 
      ? 'bg-yellow-500 text-black'  // Активный
      : 'bg-gray-700 text-gray-300' // Неактивный
    }
  `}>
    {index + 1}
  </div>
  <span className="text-sm font-medium text-gray-300">
    Текст {index + 1}
  </span>
  <span className="ml-auto text-xs text-gray-500">
    {text.content.length} символов
  </span>
</div>
```

2. **Редактор текста:**
Использует компонент `ReadingTextEditor` с нумерацией строк

## Редактор текста - ReadingTextEditor

### Компонент: `ReadingTextEditor.tsx`

**Расположение:** `src/components/teacher/ReadingTextEditor.tsx`

### Структура интерфейса

**Основной контейнер:**
```css
.reading-text-editor {
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #374151; /* border-gray-700 */
  transition: border-color 0.2s;
}

.reading-text-editor.active {
  border-color: white;
}
```

### Заголовок с инструкцией

```jsx
<div className="px-4 py-3 border-b border-gray-700/50">
  <p className="text-xs text-gray-500">
    {language === 'kg' 
      ? 'Текстти жазыңыз. Жаңы абзац үчүн эки жолу Enter басыңыз. Ар бир 5-сапта номер коюлат.'
      : 'Введите текст. Для нового абзаца нажмите Enter дважды. Каждая 5-я строка нумеруется.'
    }
  </p>
</div>
```

### Двухпанельный интерфейс

**Размеры:**
- Общая высота: `minHeight: 350px`
- Левая панель (редактор): `flex-1`
- Правая панель (превью): `flex-1`
- Разделитель: `border-r border-gray-700/50`

**Левая панель - MDEditor:**
```jsx
<div className="flex-1 p-4 border-r border-gray-700/50">
  <div className="text-xs text-gray-500 mb-2">
    Введите текст:
  </div>
  <div className="bg-[#0d0d0d] rounded-lg border border-gray-700/50">
    <MDEditor
      value={value}
      onChange={onChange}
      preview="edit"
      hideToolbar={true}
      height={300}
      previewOptions={{
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      }}
    />
  </div>
</div>
```

**Правая панель - Превью с нумерацией:**
```jsx
<div className="flex-1 p-4">
  <div className="text-xs text-gray-500 mb-2">
    Предпросмотр (как будет сохранено):
  </div>
  <div className="bg-[#0d0d0d] rounded-lg p-4 border border-gray-700/50" 
       style={{ height: '300px' }}>
    <div className="flex">
      {/* Колонка с номерами строк */}
      <div className="flex flex-col items-end pr-3 select-none flex-shrink-0" 
           style={{ width: '40px' }}>
        {displayLines.map((_, index) => (
          <div key={index} className="h-6 flex items-center justify-end">
            {renderLineNumber(index)}
          </div>
        ))}
      </div>
      
      {/* Колонка с текстом */}
      <div className="text-gray-200 leading-6 text-sm font-mono">
        {displayLines.map((line, index) => (
          <div key={index} className="h-6 whitespace-pre">
            {line || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

### Нумерация строк

**Логика нумерации:**
- Показывается только каждая 5-я строка (5, 10, 15, 20...)
- Ширина колонки: `40px`
- Шрифт: `tabular-nums` для выравнивания цифр
- Цвет: `text-gray-500`

```typescript
const renderLineNumber = (lineIndex: number) => {
  const lineNumber = lineIndex + 1;
  if (lineNumber % 5 === 0) {
    return (
      <span className="text-gray-500 text-xs font-normal select-none tabular-nums">
        {lineNumber}
      </span>
    );
  }
  return null;
};
```

### Футер со статистикой

```jsx
<div className="px-4 py-2 border-t border-gray-700/50 flex justify-between text-xs text-gray-500">
  <span>{displayLines.length} строк</span>
  <span>{value.length} символов</span>
</div>
```

## Таб "Тесты" - RACTestsManager

### Компонент: `RACTestsManager.tsx`

**Расположение:** `src/components/teacher/RACTestsManager.tsx`

### Переключатель текстов (подтабы)

**Структура:**
```jsx
<div className="flex space-x-1 bg-[#1a1a1a] p-1 rounded-lg border border-gray-800">
  {(['text-1', 'text-2', 'text-3'] as TextTab[]).map((textId) => (
    <button
      key={textId}
      className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all ${
        activeTextTab === textId
          ? 'bg-yellow-500 text-black shadow-lg'      // Активный
          : 'text-gray-400 hover:text-white hover:bg-gray-800' // Неактивный
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <Icons.FileText className="h-4 w-4" />
        <span>Текст {textId.split('-')[1]}</span>
        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
          activeTextTab === textId
            ? 'bg-black/20 text-black'        // Счетчик активного
            : 'bg-gray-700 text-gray-300'     // Счетчик неактивного
        }`}>
          {testBlocks[textId].length}
        </span>
      </div>
    </button>
  ))}
</div>
```

**Цветовая схема подтабов:**
- Активный таб: `bg-yellow-500 text-black` (желтый фон, черный текст)
- Неактивный таб: `text-gray-400` с hover эффектом
- Счетчик вопросов: круглый бейдж с количеством

### Индикатор прогресса

```jsx
<div className="p-4 bg-[#1a1a1a] rounded-xl border border-gray-700">
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <Icons.FileText className="h-5 w-5 text-blue-400" />
      <span className="text-sm text-gray-300">
        Вопросов: <span className={totalBlocksCount === group.total_questions 
          ? 'text-green-400 font-semibold'    // Лимит достигнут
          : 'text-yellow-400 font-semibold'   // В процессе
        }>
          {totalBlocksCount}
        </span> / {group.total_questions}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Icons.Clock className="h-5 w-5 text-purple-400" />
      <span className="text-sm text-gray-300">
        Время: <span className="text-purple-400 font-semibold">
          {formatTime(totalTime)} / {formatTime(groupTime)}
        </span>
      </span>
    </div>
  </div>
</div>
```

### Блоки вопросов (TestRACBlock)

**Пустое состояние:**
```jsx
<div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
  <svg className="h-16 w-16 text-gray-600 mx-auto mb-4">
    {/* SVG иконка документа */}
  </svg>
  <p className="text-gray-400 text-lg mb-2">
    Нет вопросов для этого текста
  </p>
  <p className="text-gray-500 text-sm">
    Добавьте первый вопрос
  </p>
</div>
```

## Блок вопроса RAC - TestRACBlock

### Компонент: `TestRACBlock.tsx`

**Расположение:** `src/components/teacher/TestRACBlock.tsx`

### Заголовок блока

```jsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-6">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
        <span className="text-yellow-400 font-bold">Ч</span>
      </div>
      <div>
        <h3 className="text-white font-medium">Чтение и понимание</h3>
        <p className="text-gray-400 text-sm">Блок вопроса</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {/* AI кнопки и удаление */}
    </div>
  </div>
</div>
```

**Иконка блока:**
- Размер: `w-10 h-10` (40x40px)
- Фон: `bg-yellow-500/10` (полупрозрачный желтый)
- Символ: "Ч" (`text-yellow-400 font-bold`)
- Скругление: `rounded-lg`

## Функциональность

### 1. Сохранение данных

**LocalStorage структура:**
```typescript
// Тексты RAC
`racTexts_${groupId}` = [
  { id: 'text-1', content: string, question_ids: string[] },
  { id: 'text-2', content: string, question_ids: string[] },
  { id: 'text-3', content: string, question_ids: string[] }
]

// Вопросы
`trialGroupTest_${blockId}` = {
  question: string,
  answers: AnswerVariant[],
  points: number,
  timeLimit: number,
  imageUrl?: string
}
```

### 2. Синхронизация

**События для синхронизации:**
- `racTextsUpdated` - обновление текстов
- `racBlocksUpdated` - обновление блоков вопросов
- `storage` - межоконная синхронизация

### 3. API интеграция

**Endpoints:**
- `GET /api/trial-tests/${testId}` - загрузка данных теста
- `GET /api/trial-tests/${testId}/groups/${groupId}` - загрузка данных группы
- `GET /api/trial-tests/${testId}/groups/${groupId}/questions` - загрузка текстов и вопросов RAC
- `POST /api/trial-tests/${testId}/groups/${groupId}/questions` - сохранение вопросов и текстов RAC
- `PUT /api/trial-tests/${testId}/groups/${groupId}` - обновление настроек группы

**Загрузка в S3:**
```typescript
// Тексты сохраняются в S3 как .md файлы
const s3Path = `trial-tests/rac-texts/rac-text-${textNumber}-${groupId}-${timestamp}.md`
```

### 4. Валидация

**Требования:**
- Все 3 текста должны быть заполнены
- Каждый текст должен содержать контент
- Количество вопросов не должно превышать лимит группы
- Общее время вопросов не должно превышать лимит группы

## Особенности реализации

### 1. Двухэтапный процесс
1. **Этап "Тексты":** создание и редактирование текстов для чтения
2. **Этап "Тесты":** создание вопросов к каждому тексту

### 2. Связь текстов и вопросов
- Каждый вопрос привязан к конкретному тексту через `question_ids`
- При создании вопроса он автоматически добавляется в активный текст
- Удаление вопроса удаляет его из соответствующего текста

### 3. Нумерация строк
- Автоматическая нумерация каждой 5-й строки
- Помогает при создании вопросов с указанием строк
- Сохраняется в предпросмотре и финальном виде

### 4. Markdown и LaTeX поддержка
- Полная поддержка Markdown разметки в текстах
- Математические формулы через KaTeX
- Предпросмотр в реальном времени

### 5. Адаптивность
- Двухпанельный интерфейс для удобного редактирования
- Автоматическое переключение в режим предпросмотра
- Сохранение состояния при переключении между табами

## Цветовая схема

### Основные цвета
- **Фон контейнеров:** `#151515` (темно-серый)
- **Фон блоков:** `#1a1a1a` (светлее темно-серый)
- **Фон редактора:** `#0d0d0d` (очень темный)
- **Акцентный цвет:** желтый (`#eab308` / `yellow-500`)

### Состояния
- **Активный элемент:** `bg-yellow-500 text-black`
- **Неактивный элемент:** `text-gray-400`
- **Hover состояние:** `hover:text-white hover:bg-gray-800`
- **Границы:** `border-gray-700` / `border-gray-800`

### Текст
- **Основной текст:** `text-white`
- **Вторичный текст:** `text-gray-300`
- **Подсказки:** `text-gray-400` / `text-gray-500`
- **Акцентный текст:** `text-yellow-400`

## Маршруты и страницы

### Основная страница группы вопросов
**Маршрут:** `/trial-tests/[testId]/groups/[groupId]`
**Файл:** `src/app/trial-tests/[testId]/groups/[groupId]/page.tsx`

Эта страница использует компонент `TrialGroupQuestionsPage` для отображения интерфейса редактирования RAC групп.

## Заключение

Эта реализация обеспечивает интуитивный и функциональный интерфейс для создания секций чтения и понимания с четким разделением на этапы создания текстов и вопросов к ним.

### Созданные компоненты:
1. **TrialGroupQuestionsPage** - основная страница управления группами вопросов
2. **RACTextsManager** - управление текстами для чтения
3. **ReadingTextEditor** - редактор текстов с нумерацией строк
4. **RACTestsManager** - управление тестами и вопросами
5. **TestRACBlock** - блок отдельного вопроса RAC

### Созданные API роуты:
1. **GET /api/trial-tests/[testId]** - получение данных теста
2. **GET /api/trial-tests/[testId]/groups/[groupId]** - получение данных группы
3. **GET /api/trial-tests/[testId]/groups/[groupId]/questions** - получение RAC данных
4. **POST /api/trial-tests/[testId]/groups/[groupId]/questions** - сохранение RAC данных
5. **PUT /api/trial-tests/[testId]/groups/[groupId]** - обновление группы

### Интеграция с AWS S3:
- Тексты RAC сохраняются в S3 как Markdown файлы
- Путь: `trial-tests/rac-texts/rac-text-{номер}-{groupId}.md`
- Поддержка метаданных для отслеживания изменений
