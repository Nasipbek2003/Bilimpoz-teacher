# Документация модального окна редактирования вопроса

## Общая структура

Модальное окно `QuestionDetailsModal` состоит из следующих секций (сверху вниз):

1. **Overlay (фон)** - затемненный фон с размытием
2. **Заголовок** (sticky) - заголовок и кнопка закрытия
3. **Контент** - все секции с данными вопроса
4. **Футер** (sticky) - кнопки действий
5. **Диалог подтверждения удаления** - опционально

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
- Ширина: `w-full` (100% до максимума)
- Максимальная высота: `max-h-[90vh]` (90% высоты экрана)
- Прокрутка: `overflow-y-auto` (вертикальная прокрутка при необходимости)

---

## 3. Заголовок (sticky)

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
- Позиционирование: `sticky top-0` (прилипает к верху при прокрутке)
- Фон: `bg-[#151515]` (темно-серый)
- Граница снизу: `border-b border-gray-800`
- Отступы: `p-6` (24px)
- Выравнивание: `flex items-center justify-between`
- Z-index: `z-10` (выше контента)

**Стили заголовка:**
- Размер: `text-xl font-bold text-white mb-1` (20px, жирный, белый, отступ снизу 4px)

**Стили подзаголовка:**
- Размер: `text-sm text-gray-400` (14px, серый)

**Стили кнопки закрытия:**
- Отступы: `p-2` (8px)
- Hover фон: `hover:bg-[#242424]`
- Скругление: `rounded-lg` (8px)
- Иконка: `h-5 w-5 text-white` (20px, белая)

---

## 4. Контент

```tsx
<div className="p-6 space-y-6">
  {/* Все секции */}
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

## 6. Секция "Основная информация"

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.Info className="h-5 w-5" />
    Основная информация
  </h3>

  <div className="grid grid-cols-2 gap-4">
    {/* 4 поля */}
  </div>
</div>
```

**Стили контейнера:**
- Фон: `bg-[#1a1a1a]` (темно-серый)
- Скругление: `rounded-xl` (12px)
- Отступы: `p-6` (24px)
- Вертикальные отступы: `space-y-4` (16px)

**Стили заголовка секции:**
- Размер: `text-lg font-semibold text-white` (18px, полужирный, белый)
- Выравнивание: `flex items-center gap-2`
- Иконка: `h-5 w-5` (20px)

**Стили сетки полей:**
- Сетка: `grid grid-cols-2 gap-4` (2 колонки, отступ 16px)

**Стили поля:**
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

**Стили значения:**
- Отступы: `px-3 py-2` (12px горизонтально, 8px вертикально)
- Фон: `bg-[#242424]` (серый)
- Скругление: `rounded-lg` (8px)
- Текст: `text-white` (белый)

**Поля:**
1. Тип вопроса
2. Источник
3. Язык
4. Дата создания

---

## 7. Секция "Текст вопроса"

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.HelpCircle className="h-5 w-5" />
    Текст вопроса
  </h3>

  {isEditing ? (
    <>
      {/* Панель инструментов */}
      <div className="mb-4">
        <QuestionTestToolbar />
      </div>
      
      {/* Редактор */}
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
  ) : (
    <div className="text-white">
      <MarkdownRenderer content={question.question} />
    </div>
  )}

  {/* Изображение (если есть) */}
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
</div>
```

**Режим редактирования:**
- Панель инструментов: `mb-4` (отступ снизу 16px)
- Редактор: `TestEditorField` с высотой 300px

**Режим просмотра:**
- Текст: `text-white` (белый)
- Markdown рендеринг через `MarkdownRenderer`

**Изображение:**
- Контейнер: `mt-4` (отступ сверху 16px)
- Label: `block text-sm text-gray-400 mb-2`
- Изображение: `max-w-md rounded-lg border border-gray-700` (максимальная ширина 448px, скругление, серая граница)

---

## 8. Секция "Варианты ответов"

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
    {editedAnswers.map((answer, index) => (
      <div key={answer.id} className="flex items-start gap-3">
        {/* Редактирование или просмотр */}
      </div>
    ))}
  </div>
</div>
```

### Режим редактирования

```tsx
<>
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
</>
```

**Стили радиокнопки:**
- Отступ сверху: `mt-3` (12px)
- Размер: `w-4 h-4` (16px)
- Цвет: `text-green-500` (зеленый)

**Стили редактора:**
- Контейнер: `flex-1` (занимает все доступное пространство)
- Высота: `80px`

### Режим просмотра

```tsx
<>
  <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
    answer.isCorrect ? 'border-green-500 bg-green-500' : 'border-gray-600'
  }`}>
    {answer.isCorrect && <Icons.Check className="h-3 w-3 text-white" />}
  </div>
  <div className={`flex-1 px-4 py-2 rounded-lg ${
    answer.isCorrect 
      ? 'bg-green-500/10 border border-green-500/20' 
      : 'bg-[#242424]'
  }`}>
    <div className={answer.isCorrect ? 'text-green-400' : 'text-white'}>
      <MarkdownRenderer content={answer.value} />
    </div>
  </div>
</>
```

**Стили индикатора правильности:**
- Отступ сверху: `mt-1` (4px)
- Размер: `w-4 h-4` (16px)
- Форма: `rounded-full` (круг)
- Граница: `border-2` (2px)
- Правильный: `border-green-500 bg-green-500`
- Неправильный: `border-gray-600`
- Иконка галочки: `h-3 w-3 text-white` (12px, белая)

**Стили блока ответа:**
- Контейнер: `flex-1 px-4 py-2 rounded-lg`
- Правильный: `bg-green-500/10 border border-green-500/20 text-green-400`
- Неправильный: `bg-[#242424] text-white`

---

## 9. Секция "Настройки"

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.Settings className="h-5 w-5" />
    Настройки
  </h3>

  <div className="grid grid-cols-2 gap-4">
    {/* Баллы */}
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

    {/* Время */}
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
  </div>
</div>
```

**Стили input:**
- Ширина: `w-full` (100%)
- Отступы: `px-4 py-2` (16px горизонтально, 8px вертикально)
- Фон: `bg-[#242424]` (серый)
- Граница: `border-0` (без границы)
- Скругление: `rounded-lg` (8px)
- Текст: `text-white` (белый)
- Focus: `focus:outline-none focus:ring-2 focus:ring-white/20` (без outline, кольцо при фокусе)

**Ограничения:**
- Баллы: `min="1" max="10"`
- Время: `min="10" max="300"` (секунды)

---

## 10. Секция "Объяснение (AI)"

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.BookOpen className="h-5 w-5" />
    Объяснение (AI)
  </h3>

  {isEditing ? (
    <>
      {/* Панель инструментов */}
      <div className="mb-4">
        <QuestionTestToolbar />
      </div>
      
      {/* Редактор */}
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
  ) : (
    <div className="text-white">
      {question.explanation_ai ? (
        <MarkdownRenderer content={question.explanation_ai} />
      ) : (
        <p className="text-gray-500">Объяснение отсутствует</p>
      )}
    </div>
  )}
</div>
```

**Режим редактирования:**
- Аналогично секции "Текст вопроса"
- Высота редактора: `300px`
- Placeholder: "Введите объяснение правильного ответа..."

**Режим просмотра:**
- Если есть: `MarkdownRenderer`
- Если нет: `text-gray-500` (серый текст "Объяснение отсутствует")

---

## 11. Секция "Статистика ответов"

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
    <Icons.BarChart className="h-5 w-5" />
    Статистика ответов
  </h3>

  {(!question.total_answers || question.total_answers === 0) ? (
    <p className="text-gray-400 text-center py-4">Нет статистики</p>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 4 карточки статистики */}
    </div>
  )}
</div>
```

**Пустое состояние:**
- Текст: `text-gray-400 text-center py-4` (серый, центрированный, отступы 16px)

**Сетка статистики:**
- Адаптивная: `grid grid-cols-2 md:grid-cols-4 gap-4` (2 колонки на мобильных, 4 на десктопе)

**Карточка статистики:**
```tsx
<div className="bg-[#242424] rounded-lg p-4">
  <p className="text-sm text-gray-400 mb-1">Всего ответов</p>
  <p className="text-2xl font-bold text-white">{question.total_answers}</p>
</div>
```

**Стили карточки:**
- Фон: `bg-[#242424]` (серый)
- Скругление: `rounded-lg` (8px)
- Отступы: `p-4` (16px)

**Стили label:**
- Размер: `text-sm text-gray-400 mb-1` (14px, серый, отступ снизу 4px)

**Стили значения:**
- Размер: `text-2xl font-bold text-white` (24px, жирный, белый)

**Карточки:**
1. Всего ответов
2. Правильных (или "—" если 0)
3. Неправильных (или "—" если 0)
4. Процент правильных (или "—" если нет данных)

---

## 12. Футер (sticky)

```tsx
<div className="sticky bottom-0 bg-[#151515] border-t border-gray-800 p-6 flex items-center justify-between">
  {/* Кнопки */}
</div>
```

**Стили:**
- Позиционирование: `sticky bottom-0` (прилипает к низу при прокрутке)
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
- Фон: `bg-[#242424] hover:bg-red-500/20`
- Текст: `text-white`
- Скругление: `rounded-xl` (12px)
- Иконка: `h-4 w-4` (16px)

**Стили кнопки "Закрыть":**
- Отступы: `px-4 py-2`
- Текст: `text-gray-400 font-semibold`
- Граница: `border border-transparent`
- Hover: `hover:bg-white hover:text-black hover:border-white`
- Скругление: `rounded-xl`

**Стили кнопки "Редактировать":**
- Отступы: `px-4 py-2`
- Фон: `bg-white text-black font-semibold`
- Hover эффект: `hover:scale-[1.02] active:scale-[0.98]`
- Тень: `shadow-lg hover:shadow-xl`
- Скругление: `rounded-xl`

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
- При загрузке: показывает спиннер и текст "Сохранение..."

---

## 13. Панель инструментов (QuestionTestToolbar)

```tsx
<div className="flex items-center gap-1 p-2 bg-[#1a1a1a] border border-gray-700/50 rounded-lg">
  {/* Кнопки форматирования */}
</div>
```

**Стили контейнера:**
- Выравнивание: `flex items-center gap-1`
- Отступы: `p-2` (8px)
- Фон: `bg-[#1a1a1a]` (темно-серый)
- Граница: `border border-gray-700/50`
- Скругление: `rounded-lg` (8px)

**Стили кнопки:**
```tsx
<button
  type="button"
  onClick={() => onFormat('bold')}
  className="p-2.5 hover:bg-gray-800 rounded-lg transition-colors group"
  data-tooltip="Жирный"
>
  <Icons.Bold className="h-4 w-4 text-gray-400 group-hover:text-gray-200 transition-colors" />
</button>
```

**Стили:**
- Отступы: `p-2.5` (10px)
- Hover фон: `hover:bg-gray-800`
- Скругление: `rounded-lg`
- Иконка: `h-4 w-4 text-gray-400 group-hover:text-gray-200` (16px, серый, светлее при hover)

**Кнопки форматирования:**
1. **Жирный** - `**текст**`
2. **Курсив** - `*текст*`
3. **Зачеркнутый** - `~~текст~~`
4. **Подчеркнутый** - `<u>текст</u>`
5. **Сумма** - `$\sum_{i=1}^{n} a_i$`
6. **Функция** - `$f(x)$`
7. **Изображение в LaTeX** - открывает модальное окно
8. **Превью** - переключает режим просмотра/редактирования

**Разделители:**
```tsx
<div className="w-px h-6 bg-gray-700 mx-1"></div>
```

**Стили:**
- Ширина: `w-px` (1px)
- Высота: `h-6` (24px)
- Фон: `bg-gray-700`
- Отступы: `mx-1` (4px горизонтально)

**Кнопка превью (активная):**
```tsx
className={`p-2.5 rounded-lg transition-colors group ${
  isPreviewMode ? 'bg-blue-500/20' : 'hover:bg-gray-800'
}`}
```

**Стили активной:**
- Фон: `bg-blue-500/20` (синий с прозрачностью 20%)
- Иконка: `text-blue-400` (синий)

---

## 14. Редактор (TestEditorField)

**Основные параметры:**
- `value` - текущее значение
- `onChange` - обработчик изменения
- `placeholder` - текст-подсказка
- `height` - начальная высота (80px для ответов, 300px для вопроса/объяснения)
- `isPreviewMode` - режим предпросмотра
- `onFocus` - обработчик фокуса
- `showResizeHandle` - показывать ли ручку изменения размера
- `hasError` - есть ли ошибка

**Функционал:**
- Markdown редактор с поддержкой LaTeX
- Режим предпросмотра
- Изменение размера (если `showResizeHandle={true}`)
- Автоматическая прокрутка страницы при неактивном поле
- Прокрутка содержимого при активном поле

---

## 15. Диалог подтверждения удаления

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
- `isOpen` - открыт ли диалог
- `onClose` - закрытие диалога
- `onConfirm` - подтверждение удаления
- `title` - заголовок
- `message` - сообщение
- `confirmText` - текст кнопки подтверждения
- `cancelText` - текст кнопки отмены
- `variant` - вариант стиля ("danger")
- `isLoading` - состояние загрузки

---

## 16. Функционал

### Обработчики событий

#### Сохранение вопроса
```tsx
const handleSave = async () => {
  // Проверка наличия правильного ответа
  // Отправка данных на сервер
  // Закрытие режима редактирования
}
```

**Валидация:**
- Проверка наличия правильного ответа
- Обработка ошибок

#### Удаление вопроса
```tsx
const handleDelete = async () => {
  // Подтверждение через диалог
  // Отправка запроса на удаление
  // Закрытие модального окна
}
```

#### Изменение ответа
```tsx
const handleAnswerChange = (index: number, value: string) => {
  // Обновление значения ответа по индексу
}
```

#### Изменение правильного ответа
```tsx
const handleCorrectAnswerChange = (index: number) => {
  // Установка только одного ответа как правильного
}
```

#### Форматирование текста
```tsx
const handleFormat = (format: string) => {
  // Применение форматирования к активному полю
  // Поддержка: bold, italic, underline, strikethrough, code, math, и др.
}
```

#### Улучшение текста (AI)
```tsx
const handleMagicWand = async () => {
  // Использование AI для улучшения текста активного поля
}
```

#### Переключение режима редактирования
```tsx
const setIsEditing = (value: boolean) => {
  // Переключение между режимами просмотра и редактирования
}
```

---

## 17. Состояния компонента

### Основные состояния
- `isEditing` - режим редактирования
- `isSaving` - сохранение данных
- `isDeleting` - удаление вопроса
- `showDeleteDialog` - показ диалога удаления
- `error` - ошибка (строка или null)

### Состояния редактора
- `isPreviewMode` - режим предпросмотра
- `activeField` - активное поле ('question' | 'explanation' | 'answer' | null)
- `activeAnswerIndex` - индекс активного ответа (number | null)

### Данные вопроса
- `editedQuestion` - текст вопроса
- `editedExplanation` - объяснение
- `editedPoints` - баллы
- `editedTimeLimit` - время (секунды)
- `editedAnswers` - варианты ответов

---

## 18. Цветовая палитра

### Основные цвета
- Фон модального окна: `#151515` (темно-серый)
- Фон секций: `#1a1a1a` (темно-серый)
- Фон элементов: `#242424` (серый)
- Hover фон: `#363636`, `#2a2a2a` (варианты серого)
- Текст основной: `#ffffff` (белый)
- Текст вторичный: `#9ca3af` (серый-400)
- Границы: `#404040`, `#808080` (серые)

### Цвета правильного ответа
- Фон: `bg-green-500/10` (#10b981 с прозрачностью 10%)
- Граница: `border-green-500/20` (#10b981 с прозрачностью 20%)
- Текст: `text-green-400` (#34d399)
- Индикатор: `bg-green-500` (#10b981)

### Цвета ошибки
- Фон: `bg-red-500/10` (#ef4444 с прозрачностью 10%)
- Граница: `border-red-500/20` (#ef4444 с прозрачностью 20%)
- Текст: `text-red-400` (#f87171)

### Цвета кнопок
- Основная (белая): `bg-white text-black`
- Вторичная (серая): `text-gray-400 hover:bg-white hover:text-black`
- Опасная (красная): `hover:bg-red-500/20`

---

## 19. Анимации и переходы

### Transition классы
- `transition-colors` - переходы цветов
- `transition-all duration-200` - все свойства, 200ms

### Hover эффекты
- Кнопки: изменение фона и цвета текста
- Иконки: изменение цвета
- Кнопка сохранения: `hover:scale-[1.02] active:scale-[0.98]`

### Анимации
- Спиннер загрузки: `animate-spin`
- Плавное появление/исчезновение модального окна

---

## 20. Адаптивность

### Breakpoints
- Мобильные: `< 640px`
- Планшеты: `640px - 1024px` (md)
- Десктоп: `> 1024px`

### Адаптивные изменения
- Статистика: 2 → 4 колонки
- Основная информация: 2 колонки (фиксировано)
- Настройки: 2 колонки (фиксировано)
- Максимальная ширина модального окна: `max-w-4xl` (896px)
- Отступы: `p-4` на мобильных, `p-6` на десктопе

---

## 21. Полный пример структуры

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

## 22. Примечания

1. **Sticky элементы**: Заголовок и футер прилипают к верху/низу при прокрутке
2. **Режимы**: Компонент работает в двух режимах - просмотра и редактирования
3. **Markdown и LaTeX**: Поддержка форматирования через Markdown и математических формул через LaTeX
4. **AI функции**: Интеграция с AI для улучшения текста и конвертации изображений в LaTeX
5. **Валидация**: Проверка наличия правильного ответа перед сохранением
6. **Обработка ошибок**: Отображение ошибок в специальном блоке
7. **Состояния загрузки**: Индикация процесса сохранения/удаления
8. **Кастомные tooltips**: Использование хука `useCustomTooltips` для подсказок
9. **Редактор**: Динамическая загрузка MDEditor для уменьшения размера бандла
10. **Изменение размера**: Редактор поддерживает изменение высоты через ручку (если `showResizeHandle={true}`)

