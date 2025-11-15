# Документация модального окна "Детали вопроса"

## Общая структура

Модальное окно `QuestionDetailsModal` состоит из следующих секций (сверху вниз):

1. **Overlay (фон)** - затемненный фон с размытием
2. **Заголовок** (sticky) - заголовок и кнопка закрытия
3. **Контент** (scrollable):
   - Блок ошибки (опционально)
   - Основная информация
   - Текст вопроса
   - Варианты ответов
   - Настройки
   - Объяснение (AI)
   - Статистика ответов
4. **Футер** (sticky) - кнопки действий
5. **Диалог подтверждения удаления** (опционально)

---

## 1. Overlay (фон модального окна)

```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  {/* Модальное окно */}
</div>
```

**Стили:**
- Позиционирование: `fixed inset-0` (фиксированное, на весь экран)
- Фон: `bg-black/50` (черный с прозрачностью 50%)
- Размытие: `backdrop-blur-sm` (легкое размытие фона)
- Z-index: `z-50` (высокий приоритет)
- Выравнивание: `flex items-center justify-center` (центрирование)
- Отступы: `p-4` (16px со всех сторон)

---

## 2. Контейнер модального окна

```tsx
<div className="bg-[#151515] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
  {/* Содержимое */}
</div>
```

**Стили:**
- Фон: `bg-[#151515]` (темно-серый)
- Скругление: `rounded-2xl` (16px)
- Максимальная ширина: `max-w-4xl` (896px)
- Ширина: `w-full` (100% на мобильных)
- Максимальная высота: `max-h-[90vh]` (90% высоты экрана)
- Скролл: `overflow-y-auto` (вертикальный скролл при переполнении)

---

## 3. Заголовок (Sticky)

```tsx
<div className="sticky top-0 bg-[#151515] border-b border-gray-800 p-6 flex items-center justify-between z-10">
  <div>
    <h2 className="text-xl font-bold text-white mb-1">
      {isEditing ? 'Редактирование вопроса' : 'Детали вопроса'}
    </h2>
    <p className="text-sm text-gray-400">ID: {question.id}</p>
  </div>
  <button
    onClick={onClose}
    className="p-2 hover:bg-[#242424] rounded-lg transition-colors"
  >
    <Icons.X className="h-5 w-5 text-white" />
  </button>
</div>
```

**Стили контейнера:**
- Позиционирование: `sticky top-0` (прилипает к верху при скролле)
- Фон: `bg-[#151515]` (темно-серый)
- Граница снизу: `border-b border-gray-800`
- Отступы: `p-6` (24px)
- Выравнивание: `flex items-center justify-between`
- Z-index: `z-10` (выше контента)

**Стили заголовка:**
- Размер: `text-xl font-bold text-white mb-1` (20px, жирный, белый, отступ снизу 4px)

**Стили ID:**
- Размер: `text-sm text-gray-400` (14px, серый)

**Стили кнопки закрытия:**
- Отступы: `p-2` (8px)
- Hover фон: `hover:bg-[#242424]`
- Скругление: `rounded-lg` (8px)
- Иконка: `h-5 w-5 text-white` (20px, белая)

---

## 4. Контент (Scrollable)

```tsx
<div className="p-6 space-y-6">
  {/* Секции */}
</div>
```

**Стили:**
- Отступы: `p-6` (24px)
- Вертикальные отступы: `space-y-6` (24px между секциями)

---

## 5. Блок ошибки (опционально)

```tsx
{error && (
  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <Icons.AlertCircle className="h-5 w-5 text-red-400" />
      <p className="text-red-400">{error}</p>
    </div>
  </div>
)}
```

**Стили:**
- Фон: `bg-red-500/10` (красный с прозрачностью 10%)
- Граница: `border border-red-500/20` (красная с прозрачностью 20%)
- Скругление: `rounded-xl` (12px)
- Отступы: `p-4` (16px)
- Иконка: `h-5 w-5 text-red-400` (20px, красная)
- Текст: `text-red-400` (красный)

---

## 6. Основная информация

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.Info className="h-5 w-5" />
    Основная информация
  </h3>

  <div className="grid grid-cols-2 gap-4">
    {/* Поля информации */}
  </div>
</div>
```

**Стили контейнера:**
- Фон: `bg-[#1a1a1a]` (темно-серый)
- Скругление: `rounded-xl` (12px)
- Отступы: `p-6` (24px)
- Вертикальные отступы: `space-y-4` (16px)

**Стили заголовка:**
- Размер: `text-lg font-semibold text-white` (18px, полужирный, белый)
- Выравнивание: `flex items-center gap-2`
- Иконка: `h-5 w-5` (20px)

**Стили сетки:**
- Колонки: `grid grid-cols-2` (2 колонки)
- Отступы: `gap-4` (16px)

### Поле информации

```tsx
<div>
  <label className="block text-sm text-gray-400 mb-1">Тип вопроса</label>
  <div className="px-3 py-2 bg-[#242424] rounded-lg text-white">
    {getTypeQuestionLabel(question.type_question)}
  </div>
</div>
```

**Стили label:**
- Размер: `text-sm text-gray-400 mb-1` (14px, серый, отступ снизу 4px)
- Блочный элемент: `block`

**Стили значения:**
- Отступы: `px-3 py-2` (12px горизонтально, 8px вертикально)
- Фон: `bg-[#242424]` (серый)
- Скругление: `rounded-lg` (8px)
- Текст: `text-white` (белый)

**Поля:**
1. **Тип вопроса** - полное название типа
2. **Источник** - откуда создан вопрос
3. **Язык** - Русский/Кыргызский
4. **Дата создания** - форматированная дата и время

---

## 7. Текст вопроса

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.HelpCircle className="h-5 w-5" />
    Текст вопроса
  </h3>

  {/* Режим редактирования или просмотра */}
</div>
```

**Стили:** Аналогично секции "Основная информация"

### Режим просмотра

```tsx
<div className="text-white">
  <MarkdownRenderer content={question.question} />
</div>
```

**Стили:**
- Текст: `text-white` (белый)
- Markdown рендеринг через компонент `MarkdownRenderer`

### Режим редактирования

```tsx
<>
  <div className="mb-4">
    <QuestionTestToolbar 
      onFormat={handleFormat} 
      isPreviewMode={getIsPreviewMode()} 
      onImageToLatex={handleOpenImageLatex}
      onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
    />
  </div>
  
  <TestEditorField
    value={editedQuestion}
    onChange={setEditedQuestion}
    placeholder="Введите текст вопроса (поддерживается Markdown и LaTeX)..."
    height={300}
    isPreviewMode={isPreviewMode}
    onFocus={() => handleActiveFieldChange('question')}
    showResizeHandle={true}
    hasError={false}
  />
</>
```

**Стили панели инструментов:**
- Отступ снизу: `mb-4` (16px)

**Параметры редактора:**
- Высота: `300px`
- Placeholder: "Введите текст вопроса (поддерживается Markdown и LaTeX)..."
- Режим предпросмотра: переключается через toolbar
- Изменение размера: `showResizeHandle={true}`

### Изображение вопроса (опционально)

```tsx
{question.photo_url && (
  <div className="mt-4">
    <label className="block text-sm text-gray-400 mb-2">Изображение</label>
    <img 
      src={question.photo_url} 
      alt="Question" 
      className="max-w-md rounded-lg border border-gray-700"
    />
  </div>
)}
```

**Стили:**
- Отступ сверху: `mt-4` (16px)
- Label: `text-sm text-gray-400 mb-2` (14px, серый, отступ снизу 8px)
- Изображение: `max-w-md rounded-lg border border-gray-700` (макс. ширина 448px, скругление, серая граница)

---

## 8. Варианты ответов

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.List className="h-5 w-5" />
    Варианты ответов
  </h3>

  {/* Панель инструментов (только в режиме редактирования) */}
  {isEditing && (
    <div className="mb-4">
      <QuestionTestToolbar />
    </div>
  )}

  <div className="space-y-3">
    {/* Варианты ответов */}
  </div>
</div>
```

**Стили:** Аналогично предыдущим секциям

**Отступы между вариантами:** `space-y-3` (12px)

### Вариант ответа (режим просмотра)

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
  
  {/* Блок с текстом */}
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

**Стили контейнера:**
- Выравнивание: `flex items-start gap-3` (flex, выравнивание по верху, отступ 12px)

**Индикатор правильности (правильный ответ):**
- Отступ сверху: `mt-1` (4px)
- Размер: `w-4 h-4` (16px × 16px)
- Форма: `rounded-full` (круг)
- Граница: `border-2 border-green-500` (2px, зеленая)
- Фон: `bg-green-500` (зеленый)
- Иконка: `h-3 w-3 text-white` (12px, белая галочка)

**Индикатор правильности (неправильный ответ):**
- Граница: `border-gray-600` (серая)
- Без фона и иконки

**Блок текста (правильный ответ):**
- Фон: `bg-green-500/10` (зеленый с прозрачностью 10%)
- Граница: `border border-green-500/20` (зеленая с прозрачностью 20%)
- Текст: `text-green-400` (зеленый)

**Блок текста (неправильный ответ):**
- Фон: `bg-[#242424]` (серый)
- Текст: `text-white` (белый)

### Вариант ответа (режим редактирования)

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

**Стили радиокнопки:**
- Отступ сверху: `mt-3` (12px)
- Размер: `w-4 h-4` (16px)
- Цвет: `text-green-500` (зеленый)

**Параметры редактора:**
- Высота: `80px`
- Placeholder: "Вариант {index + 1} (поддерживается LaTeX)"
- Изменение размера: `showResizeHandle={false}`

---

## 9. Настройки

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.Settings className="h-5 w-5" />
    Настройки
  </h3>

  <div className="grid grid-cols-2 gap-4">
    {/* Баллы и время */}
  </div>
</div>
```

**Стили:** Аналогично предыдущим секциям

### Поле "Баллы"

```tsx
<div>
  <label className="block text-sm text-gray-400 mb-2">Баллы</label>
  {isEditing ? (
    <input
      type="number"
      value={editedPoints}
      onChange={(e) => setEditedPoints(parseInt(e.target.value) || 1)}
      min="1"
      max="10"
      className="w-full px-4 py-2 bg-[#242424] border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
    />
  ) : (
    <div className="px-4 py-2 bg-[#242424] rounded-lg text-white">
      {question.points}
    </div>
  )}
</div>
```

**Стили input (редактирование):**
- Ширина: `w-full` (100%)
- Отступы: `px-4 py-2` (16px горизонтально, 8px вертикально)
- Фон: `bg-[#242424]` (серый)
- Граница: `border-0` (без границы)
- Скругление: `rounded-lg` (8px)
- Текст: `text-white` (белый)
- Focus: `focus:outline-none focus:ring-2 focus:ring-white/20` (белое кольцо при фокусе)
- Ограничения: `min="1" max="10"`

**Стили div (просмотр):**
- Аналогично input, но без focus стилей

### Поле "Время (сек)"

```tsx
<div>
  <label className="block text-sm text-gray-400 mb-2">Время (сек)</label>
  {isEditing ? (
    <input
      type="number"
      value={editedTimeLimit}
      onChange={(e) => setEditedTimeLimit(parseInt(e.target.value) || 60)}
      min="10"
      max="300"
      className="w-full px-4 py-2 bg-[#242424] border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
    />
  ) : (
    <div className="px-4 py-2 bg-[#242424] rounded-lg text-white">
      {question.time_limit}
    </div>
  )}
</div>
```

**Ограничения:** `min="10" max="300"` (10-300 секунд)

---

## 10. Объяснение (AI)

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.BookOpen className="h-5 w-5" />
    Объяснение (AI)
  </h3>

  {/* Режим редактирования или просмотра */}
</div>
```

**Стили:** Аналогично секции "Текст вопроса"

### Режим просмотра

```tsx
<div className="text-white">
  {question.explanation_ai ? (
    <MarkdownRenderer content={question.explanation_ai} />
  ) : (
    <p className="text-gray-500">Объяснение отсутствует</p>
  )}
</div>
```

**Стили пустого состояния:**
- Текст: `text-gray-500` (серый)

### Режим редактирования

```tsx
<>
  <div className="mb-4">
    <QuestionTestToolbar />
  </div>
  
  <TestEditorField
    value={editedExplanation}
    onChange={setEditedExplanation}
    placeholder="Введите объяснение правильного ответа (поддерживается Markdown и LaTeX)..."
    height={300}
    isPreviewMode={isPreviewMode}
    onFocus={() => handleActiveFieldChange('explanation')}
    showResizeHandle={true}
    hasError={false}
  />
</>
```

**Параметры редактора:**
- Высота: `300px`
- Placeholder: "Введите объяснение правильного ответа (поддерживается Markdown и LaTeX)..."
- Изменение размера: `showResizeHandle={true}`

---

## 11. Статистика ответов

```tsx
{(!question.total_answers || question.total_answers === 0) ? (
  <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
      <Icons.BarChart className="h-5 w-5" />
      Статистика ответов
    </h3>
    <p className="text-gray-400 text-center py-4">Нет статистики</p>
  </div>
) : (
  <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
      <Icons.BarChart className="h-5 w-5" />
      Статистика ответов
    </h3>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Карточки статистики */}
    </div>
  </div>
)}
```

**Стили:** Аналогично предыдущим секциям

**Сетка статистики:**
- Колонки: `grid grid-cols-2 md:grid-cols-4` (2 на мобильных, 4 на десктопе)
- Отступы: `gap-4` (16px)

### Карточка статистики

```tsx
<div className="bg-[#242424] rounded-lg p-4">
  <p className="text-sm text-gray-400 mb-1">Всего ответов</p>
  <p className="text-2xl font-bold text-white">{question.total_answers}</p>
</div>
```

**Стили:**
- Фон: `bg-[#242424]` (серый)
- Скругление: `rounded-lg` (8px)
- Отступы: `p-4` (16px)

**Стили label:**
- Размер: `text-sm text-gray-400 mb-1` (14px, серый, отступ снизу 4px)

**Стили значения:**
- Размер: `text-2xl font-bold text-white` (24px, жирный, белый)

**Карточки:**
1. **Всего ответов** - `question.total_answers`
2. **Правильных** - `question.correct_answers` (или "—" если 0)
3. **Неправильных** - `question.wrong_answers` (или "—" если 0)
4. **Процент правильных** - `question.correct_rate.toFixed(1)%` (или "—" если нет)

**Стили пустого значения:**
- Размер: `text-lg font-medium text-gray-500` (18px, средний вес, серый)
- Символ: "—"

---

## 12. Футер (Sticky)

```tsx
<div className="sticky bottom-0 bg-[#151515] border-t border-gray-800 p-6 flex items-center justify-between">
  {/* Кнопки */}
</div>
```

**Стили контейнера:**
- Позиционирование: `sticky bottom-0` (прилипает к низу при скролле)
- Фон: `bg-[#151515]` (темно-серый)
- Граница сверху: `border-t border-gray-800`
- Отступы: `p-6` (24px)
- Выравнивание: `flex items-center justify-between`

### Режим просмотра

```tsx
<div>
  <button
    onClick={() => setShowDeleteDialog(true)}
    className="px-4 py-2 bg-[#242424] hover:bg-red-500/20 text-white rounded-xl transition-colors flex items-center gap-2"
  >
    <Icons.Trash className="h-4 w-4" />
    Удалить
  </button>
</div>
<div className="flex items-center gap-3">
  <button
    onClick={onClose}
    className="px-4 py-2 text-gray-400 font-semibold border border-transparent rounded-xl hover:bg-white hover:text-black hover:border-white transition-all duration-200"
  >
    Закрыть
  </button>
  <button
    onClick={() => setIsEditing(true)}
    className="px-4 py-2 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-white transition-all duration-200 flex items-center gap-2"
  >
    <Icons.Edit className="h-4 w-4" />
    Редактировать
  </button>
</div>
```

**Стили кнопки "Удалить":**
- Отступы: `px-4 py-2` (16px горизонтально, 8px вертикально)
- Фон: `bg-[#242424] hover:bg-red-500/20` (серый, красный при hover)
- Текст: `text-white` (белый)
- Скругление: `rounded-xl` (12px)
- Иконка: `h-4 w-4` (16px)

**Стили кнопки "Закрыть":**
- Отступы: `px-4 py-2` (16px × 8px)
- Текст: `text-gray-400 font-semibold` (серый, полужирный)
- Граница: `border border-transparent` (прозрачная)
- Hover: `hover:bg-white hover:text-black hover:border-white` (белый фон, черный текст)
- Скругление: `rounded-xl` (12px)
- Переходы: `transition-all duration-200` (200ms)

**Стили кнопки "Редактировать":**
- Отступы: `px-4 py-2` (16px × 8px)
- Фон: `bg-white text-black` (белый фон, черный текст)
- Скругление: `rounded-xl` (12px)
- Hover: `hover:scale-[1.02]` (увеличение на 2%)
- Active: `active:scale-[0.98]` (уменьшение на 2%)
- Тень: `shadow-lg hover:shadow-xl` (тень, больше при hover)
- Граница: `border border-white`
- Иконка: `h-4 w-4` (16px)

### Режим редактирования

```tsx
<div className="flex items-center gap-3">
  <button
    onClick={() => setIsEditing(false)}
    className="px-4 py-2 text-gray-400 font-semibold border border-transparent rounded-xl hover:bg-white hover:text-black hover:border-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={isSaving}
  >
    Отмена
  </button>
  <button
    onClick={handleSave}
    disabled={isSaving}
    className="px-4 py-2 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl border border-white transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
  >
    {isSaving ? (
      <>
        <Icons.Loader className="h-4 w-4 animate-spin" />
        Сохранение...
      </>
    ) : (
      <>
        <Icons.Save className="h-4 w-4" />
        Сохранить
      </>
    )}
  </button>
</div>
```

**Стили кнопки "Отмена":**
- Аналогично кнопке "Закрыть"
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

**Стили кнопки "Сохранить":**
- Аналогично кнопке "Редактировать"
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`
- Иконка загрузки: `animate-spin` (вращение)

---

## 13. Диалог подтверждения удаления

```tsx
<ConfirmDialog
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  onConfirm={handleDelete}
  title="Удалить вопрос?"
  message="Вы уверены, что хотите удалить этот вопрос? Это действие нельзя отменить."
  confirmText="Удалить"
  cancelText="Отмена"
  variant="danger"
  isLoading={isDeleting}
/>
```

**Параметры:**
- `isOpen` - состояние открытия
- `onClose` - закрытие диалога
- `onConfirm` - подтверждение удаления
- `title` - заголовок
- `message` - сообщение
- `confirmText` - текст кнопки подтверждения
- `cancelText` - текст кнопки отмены
- `variant="danger"` - вариант опасного действия
- `isLoading` - состояние загрузки

---

## 14. Функционал

### Состояния компонента

```typescript
const [isEditing, setIsEditing] = useState(false);        // Режим редактирования
const [isSaving, setIsSaving] = useState(false);           // Сохранение
const [isDeleting, setIsDeleting] = useState(false);      // Удаление
const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Диалог удаления
const [error, setError] = useState<string | null>(null);  // Ошибка

const [editedQuestion, setEditedQuestion] = useState<string>('');      // Текст вопроса
const [editedExplanation, setEditedExplanation] = useState<string>(''); // Объяснение
const [editedPoints, setEditedPoints] = useState<number>(1);           // Баллы
const [editedTimeLimit, setEditedTimeLimit] = useState<number>(60);     // Время
const [editedAnswers, setEditedAnswers] = useState<Array<{...}>>([]);   // Варианты ответов

const [isPreviewMode, setIsPreviewMode] = useState(false);             // Режим предпросмотра
const [activeField, setActiveField] = useState<...>(null);             // Активное поле
const [activeAnswerIndex, setActiveAnswerIndex] = useState<number | null>(null); // Индекс ответа
```

### Обработчики событий

#### Сохранение вопроса

```typescript
const handleSave = async () => {
  if (!onQuestionUpdate) return;
  
  setIsSaving(true);
  setError(null);
  
  try {
    const correctAnswer = editedAnswers.find(a => a.isCorrect);
    if (!correctAnswer) {
      throw new Error('Необходимо выбрать правильный ответ');
    }

    await onQuestionUpdate(question.id, {
      question: editedQuestion,
      explanation_ai: editedExplanation || null,
      points: editedPoints,
      time_limit: editedTimeLimit,
      correct_variants_id: correctAnswer.id,
      answer_variants: editedAnswers.map(a => ({ id: a.id, value: a.value }))
    });
    
    setIsEditing(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Ошибка сохранения');
  } finally {
    setIsSaving(false);
  }
};
```

**Логика:**
1. Проверка наличия правильного ответа
2. Формирование данных для обновления
3. Вызов `onQuestionUpdate`
4. Выход из режима редактирования
5. Обработка ошибок

#### Удаление вопроса

```typescript
const handleDelete = async () => {
  if (!onQuestionDelete) return;
  
  setIsDeleting(true);
  try {
    await onQuestionDelete(question.id);
    setShowDeleteDialog(false);
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Ошибка удаления');
  } finally {
    setIsDeleting(false);
  }
};
```

**Логика:**
1. Вызов `onQuestionDelete`
2. Закрытие диалога
3. Закрытие модального окна
4. Обработка ошибок

#### Изменение варианта ответа

```typescript
const handleAnswerChange = (index: number, value: string) => {
  const newAnswers = [...editedAnswers];
  newAnswers[index].value = value;
  setEditedAnswers(newAnswers);
};
```

#### Изменение правильного ответа

```typescript
const handleCorrectAnswerChange = (index: number) => {
  const newAnswers = editedAnswers.map((answer, i) => ({
    ...answer,
    isCorrect: i === index
  }));
  setEditedAnswers(newAnswers);
};
```

**Логика:** Только один ответ может быть правильным

### Форматирование текста

```typescript
const handleFormat = (format: string) => {
  // Применение форматирования к активному полю
  // Поддерживаемые форматы:
  // - bold, italic, underline, strikethrough, code
  // - math, mathBlock
  // - subscript, superscript
  // - fraction, sqrt, integral, sum, function, limit, derivative
};
```

**Поддерживаемые форматы:**
- **Markdown**: `**bold**`, `*italic*`, `<u>underline</u>`, `~~strikethrough~~`, `` `code` ``
- **LaTeX**: `$...$` (inline), `$$...$$` (block)
- **Специальные**: индексы, степени, дроби, корни, интегралы, суммы, функции, пределы, производные

### Улучшение текста (AI)

```typescript
const handleMagicWand = async () => {
  // Улучшение текста через AI для активного поля
  const improvedText = await improveText(currentValue, 'ru');
  if (improvedText) {
    setValue(improvedText);
  }
};
```

### Преобразование изображения в LaTeX

```typescript
const handleOpenImageLatex = () => {
  setShowImageLatexModal(true);
};
```

---

## 15. Цветовая палитра

### Основные цвета
- Фон модального окна: `#151515` (темно-серый)
- Фон секций: `#1a1a1a` (темно-серый)
- Фон полей: `#242424` (серый)
- Текст основной: `#ffffff` (белый)
- Текст вторичный: `#9ca3af` (серый-400)
- Границы: `#404040`, `#808080` (серые)

### Цвета правильного ответа
- Фон: `bg-green-500/10` (#10b981 с прозрачностью 10%)
- Граница: `border-green-500/20` (#10b981 с прозрачностью 20%)
- Текст: `text-green-400` (#34d399)
- Индикатор: `border-green-500 bg-green-500` (#10b981)

### Цвета ошибки
- Фон: `bg-red-500/10` (#ef4444 с прозрачностью 10%)
- Граница: `border-red-500/20` (#ef4444 с прозрачностью 20%)
- Текст: `text-red-400` (#f87171)

---

## 16. Адаптивность

### Breakpoints
- Мобильные: `< 640px`
- Планшеты: `640px - 1024px` (md)
- Десктоп: `> 1024px`

### Адаптивные изменения
- Модальное окно: `max-w-4xl w-full` (полная ширина на мобильных)
- Статистика: `grid-cols-2 md:grid-cols-4` (2 колонки на мобильных, 4 на десктопе)
- Основная информация: `grid-cols-2` (2 колонки)
- Настройки: `grid-cols-2` (2 колонки)

---

## 17. Анимации и переходы

### Transition классы
- `transition-colors` - переходы цветов
- `transition-all duration-200` - все свойства, 200ms

### Hover эффекты
- Кнопки: изменение фона и цвета текста
- Кнопка "Редактировать"/"Сохранить": `hover:scale-[1.02]` (увеличение на 2%)
- Кнопка при нажатии: `active:scale-[0.98]` (уменьшение на 2%)

### Анимации
- Загрузка: `animate-spin` (вращение иконки)
- Тени: `shadow-lg hover:shadow-xl` (увеличение тени при hover)

---

## 18. Полный пример структуры

```tsx
<>
  {/* Overlay */}
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    {/* Модальное окно */}
    <div className="bg-[#151515] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Заголовок */}
      <div className="sticky top-0 bg-[#151515] border-b border-gray-800 p-6 flex items-center justify-between z-10">
        {/* ... */}
      </div>

      {/* Контент */}
      <div className="p-6 space-y-6">
        {/* Ошибка */}
        {error && <div>...</div>}

        {/* Основная информация */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">...</div>

        {/* Текст вопроса */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">...</div>

        {/* Варианты ответов */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">...</div>

        {/* Настройки */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">...</div>

        {/* Объяснение */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">...</div>

        {/* Статистика */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">...</div>
      </div>

      {/* Футер */}
      <div className="sticky bottom-0 bg-[#151515] border-t border-gray-800 p-6 flex items-center justify-between">
        {/* ... */}
      </div>
    </div>
  </div>

  {/* Диалог удаления */}
  <ConfirmDialog />
</>
```

---

## 19. Примечания

1. **Sticky элементы**: Заголовок и футер прилипают к верху/низу при скролле
2. **Режимы**: Компонент работает в двух режимах - просмотра и редактирования
3. **Markdown и LaTeX**: Поддерживается форматирование через `MarkdownRenderer` и `TestEditorField`
4. **Валидация**: При сохранении проверяется наличие правильного ответа
5. **AI функции**: Доступны улучшение текста и преобразование изображения в LaTeX
6. **Панель инструментов**: Показывается только в режиме редактирования для активных полей
7. **Режим предпросмотра**: Переключается через toolbar для просмотра Markdown/LaTeX
8. **Изменение размера**: Редакторы для вопроса и объяснения поддерживают изменение размера (`showResizeHandle={true}`)
9. **Статистика**: Показывается только если есть ответы (`total_answers > 0`)
10. **Форматирование даты**: Дата создания отображается в формате `DD.MM.YYYY, HH:MM`

