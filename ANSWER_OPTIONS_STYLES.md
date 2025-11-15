# Стили секции "Варианты ответов" в QuestionDetailsModal

## Полная структура и стили

### Основной контейнер

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  {/* Заголовок и содержимое */}
</div>
```

**Стили:**
- `bg-[#1a1a1a]` - темно-серый фон
- `rounded-xl` - скругление углов
- `p-6` - внутренние отступы (24px)
- `space-y-4` - вертикальные отступы между дочерними элементами (16px)

---

### Заголовок секции

```tsx
<h3 className="text-lg font-semibold text-white flex items-center gap-2">
  <Icons.List className="h-5 w-5" />
  Варианты ответов
</h3>
```

**Стили:**
- `text-lg` - размер текста (18px)
- `font-semibold` - полужирный шрифт
- `text-white` - белый цвет текста
- `flex items-center gap-2` - flex-контейнер с выравниванием по центру и отступом между элементами (8px)
- Иконка: `h-5 w-5` (20px × 20px)

---

### Контейнер списка ответов

```tsx
<div className="space-y-3">
  {/* Варианты ответов */}
</div>
```

**Стили:**
- `space-y-3` - вертикальные отступы между вариантами ответов (12px)

---

### Отдельный вариант ответа (режим просмотра)

```tsx
<div className="flex items-start gap-3">
  {/* Индикатор правильности */}
  <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
    answer.isCorrect 
      ? 'border-green-500 bg-green-500' 
      : 'border-gray-600'
  }`}>
    {answer.isCorrect && <Icons.Check className="h-3 w-3 text-white" />}
  </div>
  
  {/* Блок с текстом ответа */}
  <div className={`flex-1 px-4 py-2 rounded-lg ${
    answer.isCorrect 
      ? 'bg-green-500/10 border border-green-500/20' 
      : 'bg-[#242424]'
  }`}>
    <div className={answer.isCorrect ? 'text-green-400' : 'text-white'}>
      <MarkdownRenderer content={answer.value} />
    </div>
  </div>
</div>
```

#### Индикатор правильности (круг)

**Для правильного ответа:**
- `mt-1` - отступ сверху (4px)
- `w-4 h-4` - размер (16px × 16px)
- `rounded-full` - круглая форма
- `border-2` - толщина границы (2px)
- `flex items-center justify-center` - центрирование содержимого
- `flex-shrink-0` - запрет на сжатие
- `border-green-500` - зеленая граница
- `bg-green-500` - зеленый фон
- Иконка галочки: `h-3 w-3 text-white` (12px × 12px, белый цвет)

**Для неправильного ответа:**
- `border-gray-600` - серая граница
- Без фона (прозрачный)
- Без иконки

#### Блок с текстом ответа

**Для правильного ответа:**
- `flex-1` - занимает все доступное пространство
- `px-4 py-2` - внутренние отступы (16px горизонтально, 8px вертикально)
- `rounded-lg` - скругление углов
- `bg-green-500/10` - светло-зеленый фон с прозрачностью 10%
- `border border-green-500/20` - зеленая граница с прозрачностью 20%
- `text-green-400` - зеленый цвет текста

**Для неправильного ответа:**
- `flex-1` - занимает все доступное пространство
- `px-4 py-2` - внутренние отступы
- `rounded-lg` - скругление углов
- `bg-[#242424]` - темно-серый фон
- `text-white` - белый цвет текста

---

### Отдельный вариант ответа (режим редактирования)

```tsx
<div className="flex items-start gap-3">
  <input
    type="radio"
    name="correct_answer"
    checked={answer.isCorrect}
    onChange={() => handleCorrectAnswerChange(index)}
    className="mt-3 w-4 h-4 text-green-500"
  />
  <div className="flex-1">
    <TestEditorField
      value={answer.value}
      onChange={(val) => handleAnswerChange(index, val)}
      placeholder={`Вариант ${index + 1} (поддерживается LaTeX)`}
      height={80}
      isPreviewMode={isPreviewMode}
      onFocus={() => handleActiveFieldChange('answer', index)}
      showResizeHandle={false}
      hasError={false}
    />
  </div>
</div>
```

**Стили:**
- Радиокнопка: `mt-3 w-4 h-4 text-green-500` (отступ сверху 12px, размер 16px, зеленый цвет)
- Редактор: `flex-1` (занимает все доступное пространство)

---

## Полный пример кода

```tsx
{/* Варианты ответов */}
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.List className="h-5 w-5" />
    Варианты ответов
  </h3>

  <div className="space-y-3">
    {answers.map((answer, index) => (
      <div key={answer.id} className="flex items-start gap-3">
        {/* Индикатор правильности */}
        <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          answer.isCorrect 
            ? 'border-green-500 bg-green-500' 
            : 'border-gray-600'
        }`}>
          {answer.isCorrect && <Icons.Check className="h-3 w-3 text-white" />}
        </div>
        
        {/* Блок с текстом ответа */}
        <div className={`flex-1 px-4 py-2 rounded-lg ${
          answer.isCorrect 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-[#242424]'
        }`}>
          <div className={answer.isCorrect ? 'text-green-400' : 'text-white'}>
            <MarkdownRenderer content={answer.value} />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Цветовая палитра

### Правильный ответ:
- Фон блока: `bg-green-500/10` (#10b981 с прозрачностью 10%)
- Граница блока: `border-green-500/20` (#10b981 с прозрачностью 20%)
- Текст: `text-green-400` (#34d399)
- Индикатор граница: `border-green-500` (#10b981)
- Индикатор фон: `bg-green-500` (#10b981)

### Неправильный ответ:
- Фон блока: `bg-[#242424]` (#242424)
- Текст: `text-white` (#ffffff)
- Индикатор граница: `border-gray-600` (#4b5563)

---

## Размеры и отступы

- Контейнер: `p-6` (24px)
- Отступ между секциями: `space-y-4` (16px)
- Отступ между ответами: `space-y-3` (12px)
- Отступ между элементами в строке: `gap-3` (12px)
- Отступ в блоке ответа: `px-4 py-2` (16px × 8px)
- Размер индикатора: `w-4 h-4` (16px × 16px)
- Размер иконки в индикаторе: `h-3 w-3` (12px × 12px)
- Размер иконки в заголовке: `h-5 w-5` (20px × 20px)

---

## Скругления

- Контейнер: `rounded-xl` (12px)
- Блок ответа: `rounded-lg` (8px)
- Индикатор: `rounded-full` (круг)

---

## Иконки

- Заголовок: `Icons.List` (20px × 20px, белый)
- Правильный ответ: `Icons.Check` (12px × 12px, белый)

---

## Примечания

1. Для отображения Markdown используется компонент `MarkdownRenderer`
2. В режиме редактирования используется компонент `TestEditorField`
3. Все цвета соответствуют темной теме приложения
4. Используется система прозрачности Tailwind (`/10`, `/20`) для создания полупрозрачных эффектов

