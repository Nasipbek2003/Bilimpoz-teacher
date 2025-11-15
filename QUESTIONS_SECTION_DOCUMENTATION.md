# Документация раздела "Вопросы"

## Общая структура страницы

Страница вопросов (`/dashboard/questions`) состоит из следующих секций (сверху вниз):

1. **Заголовок страницы**
2. **Статистика вопросов** (4 карточки)
3. **Фильтры** (опционально - блок ошибки)
4. **Таблица вопросов**
5. **Пагинация** (если страниц больше 1)
6. **Модальное окно деталей вопроса** (открывается по клику)

---

## 1. Заголовок страницы

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold text-white mb-2">{t('questions.title')}</h1>
    <p className="text-gray-400">{t('questions.subtitle')}</p>
  </div>
</div>
```

**Стили:**
- Заголовок: `text-2xl font-bold text-white mb-2` (24px, жирный, белый, отступ снизу 8px)
- Подзаголовок: `text-gray-400` (серый цвет)

---

## 2. Статистика вопросов

### Контейнер статистики

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 4 карточки статистики */}
</div>
```

**Стили:**
- Адаптивная сетка: 1 колонка на мобильных, 2 на планшетах, 4 на десктопе
- Отступ между карточками: `gap-6` (24px)

### Карточка статистики

```tsx
<button 
  onClick={() => handleFiltersChange({ type_from: '' })}
  className="bg-[#151515] hover:bg-[#1a1a1a] rounded-2xl p-6 transition-all text-left group"
>
  <div className="flex items-center gap-3 mb-3">
    <div className="p-2 bg-[#242424] group-hover:bg-[#2a2a2a] rounded-lg transition-colors">
      <Icons.HelpCircle className="h-5 w-5 text-white" />
    </div>
    <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
      {t('questions.stats.total')}
    </h3>
  </div>
  <p className="text-2xl font-bold text-white">
    {(stats?.total || 0).toLocaleString()}
  </p>
</button>
```

**Стили карточки:**
- Фон: `bg-[#151515]` (темно-серый)
- Hover фон: `hover:bg-[#1a1a1a]` (светлее на 5%)
- Скругление: `rounded-2xl` (16px)
- Отступы: `p-6` (24px)
- Переходы: `transition-all`
- Выравнивание текста: `text-left`
- Группа для hover эффектов: `group`

**Стили иконки:**
- Контейнер: `p-2 bg-[#242424] group-hover:bg-[#2a2a2a] rounded-lg transition-colors`
- Иконка: `h-5 w-5 text-white` (20px × 20px, белый)

**Стили заголовка:**
- Размер: `text-sm font-medium` (14px, средний вес)
- Цвет: `text-gray-400 group-hover:text-gray-300` (серый, светлее при hover)

**Стили значения:**
- Размер: `text-2xl font-bold text-white` (24px, жирный, белый)
- Форматирование: `.toLocaleString()` (разделители тысяч)

**Типы карточек:**
1. **Всего вопросов** - `Icons.HelpCircle`
2. **Активные** - `Icons.CheckCircle`
3. **Помеченные** - `Icons.Flag`
4. **Средний процент правильных** - `Icons.TrendingUp`

---

## 3. Блок ошибки (опционально)

```tsx
{error && (
  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
    <div className="flex items-center gap-3">
      <Icons.AlertCircle className="h-5 w-5 text-red-400" />
      <div>
        <h3 className="text-red-400 font-medium">Ошибка загрузки</h3>
        <p className="text-red-300 text-sm mt-1">{error}</p>
        <button 
          onClick={fetchQuestions}
          className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  </div>
)}
```

**Стили:**
- Фон: `bg-red-500/10` (красный с прозрачностью 10%)
- Граница: `border border-red-500/20` (красная с прозрачностью 20%)
- Скругление: `rounded-2xl` (16px)
- Отступы: `p-4` (16px)
- Иконка: `h-5 w-5 text-red-400` (20px, красная)
- Заголовок: `text-red-400 font-medium` (красный, средний вес)
- Текст: `text-red-300 text-sm mt-1` (светло-красный, 14px)
- Кнопка: `px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm`

---

## 4. Фильтры

### Контейнер фильтров

```tsx
<div className="bg-[#151515] rounded-2xl p-6 space-y-4">
  {/* Фильтры */}
</div>
```

**Стили:**
- Фон: `bg-[#151515]` (темно-серый)
- Скругление: `rounded-2xl` (16px)
- Отступы: `p-6` (24px)
- Вертикальные отступы: `space-y-4` (16px между элементами)

### Основные фильтры (первая строка)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 4 селекта */}
</div>
```

**Стили:**
- Адаптивная сетка: 1/2/4 колонки
- Отступы: `gap-4` (16px)

**Элементы:**
1. **Тип вопроса** - Select с опциями: Все, Математика 1, Математика 2, Аналогия, РАЦ, Грамматика, Стандартный
2. **Источник** - Select с опциями: Все, Из урока, От учителя, Пробный тест, От студента, От ментора
3. **Язык** - Select с опциями: Все, Русский, Кыргызский
4. **Сортировка** - Select + кнопка направления

### Кнопка направления сортировки

```tsx
<button
  onClick={() => onFiltersChange({ 
    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
  })}
  className="relative px-3 py-3 bg-[#242424] hover:bg-[#363636] text-white rounded-lg transition-all border-0 flex items-center justify-center min-w-[48px]"
  data-tooltip={filters.sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
>
  {filters.sortOrder === 'asc' ? (
    <Icons.ArrowUp className="h-4 w-4 text-gray-400" />
  ) : (
    <Icons.ArrowDown className="h-4 w-4 text-gray-400" />
  )}
</button>
```

**Стили:**
- Фон: `bg-[#242424] hover:bg-[#363636]`
- Размер: `min-w-[48px]` (минимальная ширина 48px)
- Иконка: `h-4 w-4 text-gray-400` (16px, серый)

### Поиск и кнопка очистки

```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <div className="flex-1 relative">
    <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Поиск по тексту вопроса..."
      value={filters.search}
      onChange={(e) => onFiltersChange({ search: e.target.value })}
      className="w-full pl-12 pr-4 py-3 bg-[#242424] border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
    />
  </div>
  
  {hasActiveFilters && (
    <button
      onClick={() => onFiltersChange({ /* очистка всех фильтров */ })}
      className="relative px-4 py-3 bg-[#242424] hover:bg-white border border-gray-700/50 text-white hover:text-black rounded-2xl transition-all flex items-center gap-2 font-medium group"
      data-tooltip="Очистить все фильтры"
    >
      <Icons.X className="h-4 w-4 group-hover:text-black" />
      <span className="hidden sm:inline">Очистить</span>
    </button>
  )}
</div>
```

**Стили поиска:**
- Контейнер: `flex-1 relative`
- Иконка: `absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`
- Input: `w-full pl-12 pr-4 py-3 bg-[#242424] border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20`

**Стили кнопки очистки:**
- Фон: `bg-[#242424] hover:bg-white`
- Граница: `border border-gray-700/50`
- Текст: `text-white hover:text-black`
- Иконка: `h-4 w-4 group-hover:text-black`
- Текст скрыт на мобильных: `hidden sm:inline`

### Фильтр по дате

Используется компонент `DateFilter` с передачей фильтров даты.

---

## 5. Таблица вопросов

### Контейнер таблицы

```tsx
<div className="bg-[#151515] rounded-2xl overflow-hidden">
  {/* Заголовок и таблица */}
</div>
```

**Стили:**
- Фон: `bg-[#151515]` (темно-серый)
- Скругление: `rounded-2xl` (16px)
- Переполнение: `overflow-hidden` (скрывает переполнение)

### Заголовок таблицы

```tsx
<div className="p-6 border-b border-gray-800">
  <h2 className="text-lg font-semibold text-white">
    Найдено вопросов: {questions.length}
  </h2>
</div>
```

**Стили:**
- Отступы: `p-6` (24px)
- Граница снизу: `border-b border-gray-800`
- Текст: `text-lg font-semibold text-white` (18px, полужирный, белый)

### Заголовки колонок

```tsx
<thead className="bg-[#242424]">
  <tr>
    <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">
      Вопрос
    </th>
    {/* ... другие колонки ... */}
  </tr>
</thead>
```

**Стили:**
- Фон: `bg-[#242424]` (серый)
- Отступы: `py-3 px-6` (12px вертикально, 24px горизонтально)
- Текст: `text-sm font-medium text-gray-400` (14px, средний вес, серый)
- Выравнивание: `text-left`

**Колонки:**
1. Вопрос
2. Тип вопроса
3. Источник
4. Язык
5. Дата создания
6. Действия

### Строка таблицы

```tsx
<tr 
  key={question.id} 
  className="border-b border-gray-800/50 hover:bg-[#242424] cursor-pointer transition-colors"
  onClick={() => onQuestionClick?.(question)}
>
  {/* Ячейки */}
</tr>
```

**Стили:**
- Граница снизу: `border-b border-gray-800/50` (серая с прозрачностью 50%)
- Hover фон: `hover:bg-[#242424]`
- Курсор: `cursor-pointer`
- Переходы: `transition-colors`

### Ячейка "Вопрос"

```tsx
<td className="py-4 px-6 max-w-md">
  <div className="flex flex-col gap-1 w-full">
    <div className="text-white font-medium w-full overflow-hidden break-words">
      <div className="overflow-hidden w-full max-w-full">
        <MarkdownRenderer content={truncateText(question.question)} />
      </div>
    </div>
    {question.photo_url && (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <Icons.Image className="h-3 w-3" />
        <span>С изображением</span>
      </div>
    )}
  </div>
</td>
```

**Стили:**
- Отступы: `py-4 px-6` (16px вертикально, 24px горизонтально)
- Максимальная ширина: `max-w-md` (448px)
- Текст вопроса: `text-white font-medium`
- Индикатор изображения: `text-xs text-gray-400` (12px, серый)
- Иконка: `h-3 w-3` (12px)

### Ячейка "Тип вопроса"

```tsx
<td className="py-4 px-6">
  <span className="inline-block px-8 py-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-full text-xs font-medium transition-colors cursor-default min-w-[120px] text-center whitespace-nowrap">
    {getTypeQuestionLabel(question.type_question)}
  </span>
</td>
```

**Стили:**
- Фон: `bg-[#242424] hover:bg-[#2a2a2a]`
- Отступы: `px-8 py-1.5` (32px горизонтально, 6px вертикально)
- Скругление: `rounded-full` (полностью скругленный)
- Размер текста: `text-xs font-medium` (12px, средний вес)
- Минимальная ширина: `min-w-[120px]`
- Выравнивание: `text-center`
- Без переноса: `whitespace-nowrap`

**Типы вопросов и их сокращения:**
- `math1` → "М1" (Математика 1)
- `math2` → "М2" (Математика 2)
- `analogy` → "А" (Аналогия)
- `rac` → "Р" (РАЦ)
- `grammar` → "Г" (Грамматика)
- `standard` → "С" (Стандартный)

### Ячейка "Источник"

```tsx
<td className="py-4 px-6">
  <span className="inline-block px-8 py-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-full text-xs font-medium transition-colors cursor-default min-w-[120px] text-center whitespace-nowrap">
    {getTypeFromLabel(question.type_from)}
  </span>
</td>
```

**Стили:** Аналогично типу вопроса

**Источники:**
- `from_lesson` → "Урок"
- `from_teacher` → "Учитель"
- `from_trial` → "Пробный тест"
- `from_student` → "Студент"
- `from_mentor` → "Ментор"

### Ячейка "Язык"

```tsx
<td className="py-4 px-6">
  <span className="px-3 py-1.5 bg-[#242424] text-white rounded-xl text-xs font-medium border border-gray-700/50">
    {getLanguageLabel(question.language)}
  </span>
</td>
```

**Стили:**
- Отступы: `px-3 py-1.5` (12px горизонтально, 6px вертикально)
- Скругление: `rounded-xl` (12px, не полностью скругленный)
- Граница: `border border-gray-700/50`

**Языки:**
- `ru` → "RU"
- `kg` → "KG"

### Ячейка "Дата создания"

```tsx
<td className="py-4 px-6 text-gray-400">
  {formatDate(question.created_at)}
</td>
```

**Стили:**
- Текст: `text-gray-400` (серый)
- Формат: `DD.MM.YYYY` (русская локаль)

### Ячейка "Действия"

```tsx
<td className="py-4 px-6">
  <div className="flex items-center gap-2">
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onQuestionClick?.(question);
      }}
      className="relative p-2 hover:bg-[#242424] rounded-lg transition-colors"
      data-tooltip="Просмотр"
    >
      <Icons.Eye className="h-4 w-4 text-white" />
    </button>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onQuestionEdit ? onQuestionEdit(question) : onQuestionClick?.(question);
      }}
      className="relative p-2 hover:bg-[#242424] rounded-lg transition-colors"
      data-tooltip="Редактировать"
    >
      <Icons.Edit className="h-4 w-4 text-white" />
    </button>
  </div>
</td>
```

**Стили кнопок:**
- Отступы: `p-2` (8px)
- Hover фон: `hover:bg-[#242424]`
- Скругление: `rounded-lg` (8px)
- Иконки: `h-4 w-4 text-white` (16px, белые)
- Отступ между кнопками: `gap-2` (8px)

### Состояние загрузки

```tsx
<div className="bg-[#151515] rounded-2xl overflow-hidden">
  <div className="p-6 border-b border-gray-800">
    <div className="h-6 bg-gray-700 rounded w-1/4 animate-pulse"></div>
  </div>
  <div className="p-6">
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-700 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
</div>
```

**Стили:**
- Skeleton элементы: `bg-gray-700 rounded animate-pulse`
- Высота строк: `h-12` (48px)
- Отступы между строками: `space-y-3` (12px)

### Пустое состояние

```tsx
<tr>
  <td colSpan={6} className="p-8 text-center text-gray-400">
    Вопросы не найдены
  </td>
</tr>
```

**Стили:**
- Отступы: `p-8` (32px)
- Выравнивание: `text-center`
- Цвет: `text-gray-400`

---

## 6. Пагинация

### Контейнер пагинации

```tsx
<div className="flex items-center justify-center gap-2 mt-6">
  {/* Кнопки пагинации */}
</div>
```

**Стили:**
- Выравнивание: `flex items-center justify-center`
- Отступы: `gap-2 mt-6` (8px между элементами, 24px сверху)

### Кнопка навигации

```tsx
<button
  onClick={() => onPageChange(currentPage - 1)}
  disabled={currentPage === 1}
  className="p-2 rounded-lg bg-[#242424] text-gray-400 hover:bg-[#2a2a2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
>
  <Icons.ChevronLeft className="h-4 w-4" />
</button>
```

**Стили:**
- Отступы: `p-2` (8px)
- Фон: `bg-[#242424] hover:bg-[#2a2a2a]`
- Текст: `text-gray-400 hover:text-white`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- Иконка: `h-4 w-4` (16px)

### Кнопка номера страницы

```tsx
<button
  onClick={() => onPageChange(page as number)}
  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
    currentPage === page
      ? 'bg-white text-black font-semibold shadow-lg'
      : 'bg-[#242424] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
  }`}
>
  {page}
</button>
```

**Стили активной страницы:**
- Фон: `bg-white` (белый)
- Текст: `text-black font-semibold` (черный, полужирный)
- Тень: `shadow-lg`

**Стили неактивной страницы:**
- Фон: `bg-[#242424] hover:bg-[#2a2a2a]`
- Текст: `text-gray-400 hover:text-white`

### Многоточие

```tsx
<span className="px-3 py-2 text-gray-400">...</span>
```

**Стили:**
- Отступы: `px-3 py-2`
- Цвет: `text-gray-400`

**Логика отображения:**
- Показывает страницы: `[1] ... [current-2] [current-1] [current] [current+1] [current+2] ... [last]`
- Если страниц мало, показывает все
- Многоточие появляется, если пропущено более 2 страниц

---

## 7. Функционал

### Обработчики событий

#### Клик по вопросу
```tsx
onClick={() => onQuestionClick?.(question)}
```
- Открывает модальное окно с деталями вопроса
- Устанавливает `shouldOpenInEditMode = false`

#### Редактирование вопроса
```tsx
onClick={(e) => {
  e.stopPropagation();
  onQuestionEdit ? onQuestionEdit(question) : onQuestionClick?.(question);
}}
```
- Останавливает всплытие события
- Открывает модальное окно в режиме редактирования
- Устанавливает `shouldOpenInEditMode = true`

#### Фильтрация
- При изменении фильтров сбрасывается страница на 1
- Фильтры применяются через API запрос с параметрами URL

#### Поиск
- Реализован через input с debounce (через `useCallback` и `useEffect`)
- Ищет по тексту вопроса

#### Сортировка
- По полю: `created_at`, `updated_at`, `points`, `time_limit`, `correct_rate`
- По направлению: `asc` (возрастание) или `desc` (убывание)
- Переключается кнопкой с иконкой стрелки

#### Пагинация
- По умолчанию: 20 вопросов на страницу
- Номера страниц вычисляются динамически
- Кнопки "Назад" и "Вперед" отключаются на первой/последней странице

### API запросы

**Эндпоинт:** `/api/questions`

**Параметры:**
- `type_question` - тип вопроса
- `type_from` - источник вопроса
- `language` - язык
- `search` - поисковый запрос
- `sortBy` - поле сортировки
- `sortOrder` - направление сортировки
- `dateFilter` - фильтр по дате
- `dateFrom` - дата начала
- `dateTo` - дата окончания
- `page` - номер страницы
- `limit` - количество на странице

**Ответ:**
```typescript
{
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    active: number;
    flagged: number;
    rejected: number;
    avgCorrectRate: number;
    newThisWeek: number;
  };
}
```

---

## 8. Цветовая палитра

### Основные цвета
- Фон страницы: `#0b0b0b` (глобальный)
- Фон карточек: `#151515` (темно-серый)
- Фон элементов: `#242424` (серый)
- Hover фон: `#1a1a1a`, `#2a2a2a`, `#363636` (варианты серого)
- Текст основной: `#ffffff` (белый)
- Текст вторичный: `#9ca3af` (серый-400)
- Границы: `#404040`, `#808080` (серые)

### Цвета типов вопросов
- Математика 1: `bg-blue-500/10 text-blue-400` (#3b82f6)
- Математика 2: `bg-cyan-500/10 text-cyan-400` (#06b6d4)
- Аналогия: `bg-purple-500/10 text-purple-400` (#a855f7)
- РАЦ: `bg-orange-500/10 text-orange-400` (#f97316)
- Грамматика: `bg-green-500/10 text-green-400` (#10b981)
- Стандартный: `bg-gray-500/10 text-gray-400` (#6b7280)

### Цвета источников
- Из урока: `bg-blue-500/10 text-blue-400`
- От учителя: `bg-orange-500/10 text-orange-400`
- Пробный тест: `bg-purple-500/10 text-purple-400`
- От студента: `bg-green-500/10 text-green-400`
- От ментора: `bg-yellow-500/10 text-yellow-400`

---

## 9. Адаптивность

### Breakpoints
- Мобильные: `< 640px` (sm)
- Планшеты: `640px - 1024px` (md)
- Десктоп: `> 1024px` (lg)

### Адаптивные изменения
- Статистика: 1 → 2 → 4 колонки
- Фильтры: 1 → 2 → 4 колонки
- Поиск: вертикальная → горизонтальная компоновка
- Кнопка очистки: скрыт текст на мобильных

---

## 10. Анимации и переходы

### Transition классы
- `transition-all` - все свойства
- `transition-colors` - только цвета
- `duration-200` - длительность 200ms

### Hover эффекты
- Карточки статистики: изменение фона
- Строки таблицы: изменение фона
- Кнопки: изменение фона и цвета текста
- Иконки: изменение цвета

### Skeleton загрузка
- `animate-pulse` - пульсирующая анимация
- Используется при загрузке данных

---

## 11. Полный пример структуры

```tsx
<DashboardLayout>
  <div className="space-y-6">
    {/* 1. Заголовок */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Вопросы</h1>
        <p className="text-gray-400">Управление вопросами</p>
      </div>
    </div>

    {/* 2. Статистика */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 4 карточки */}
    </div>

    {/* 3. Ошибка (опционально) */}
    {error && <div>...</div>}

    {/* 4. Фильтры */}
    <QuestionsFilter />

    {/* 5. Таблица */}
    <QuestionsTable />

    {/* 6. Пагинация */}
    {pagination.pages > 1 && <Pagination />}

    {/* 7. Модальное окно */}
    <QuestionDetailsModal />
  </div>
</DashboardLayout>
```

---

## 12. Примечания

1. **Обрезка текста**: Текст вопроса обрезается до 80 символов с помощью `truncateText()`
2. **Markdown**: Вопросы отображаются через `MarkdownRenderer` для поддержки форматирования
3. **Индикатор изображения**: Показывается только если у вопроса есть `photo_url`
4. **Остановка всплытия**: В кнопках действий используется `e.stopPropagation()` чтобы не открывать модальное окно при клике на кнопку
5. **Форматирование чисел**: Статистика форматируется через `.toLocaleString()` для разделителей тысяч
6. **Условное отображение**: Пагинация показывается только если страниц больше 1
7. **Кастомные tooltips**: Используется хук `useCustomTooltips` для подсказок

