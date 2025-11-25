# Меню выбора типа теста (Test Type Selector Menu)

Подробное описание реализации, дизайна, стилей и логики работы меню выбора типа теста в редакторе урока.

---

## Общая информация

### Расположение в коде
**Файл**: `src/components/dashboard/LessonTestsPage.tsx`  
**Строки**: 881-1010

### Назначение
Плавающее меню справа внизу экрана для выбора типа тестового вопроса при создании нового теста в уроке.

---

## Структура компонента

### Основной контейнер
```tsx
<div className="fixed bottom-4 right-16 z-50">
  <div 
    ref={menuRef}
    className="w-16 bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-2xl"
  >
    {/* Кнопка открытия и меню */}
  </div>
</div>
```

**Позиционирование**:
- **Position**: `fixed` (фиксированное позиционирование)
- **Bottom**: `bottom-4` (16px от нижнего края)
- **Right**: `right-16` (64px от правого края)
- **Z-index**: `z-50` (поверх других элементов)

**Контейнер меню**:
- **Ширина**: `w-16` (64px)
- **Фон**: `bg-[#1a1a1a]` (темно-серый)
- **Граница**: `border border-gray-700` (серая граница)
- **Скругление**: `rounded-2xl` (16px)
- **Тень**: `shadow-2xl` (большая тень)

---

## Кнопка открытия меню

### Структура
```tsx
<button
  onClick={() => {
    if (disabled) return;
    if (maxTestsReached && totalQuestions !== undefined) {
      setMaxTestsError(t('testEditor.validation.maxTestsReached', { total: totalQuestions }));
      setTimeout(() => setMaxTestsError(null), 5000);
      return;
    }
    setShowButton(false);
    setIsTestMenuOpen(true);
  }}
  disabled={disabled}
  className={`
    flex items-center justify-center overflow-hidden
    transition-all duration-300 ease-in-out
    w-full transition-colors
    ${!isTestMenuOpen ? 'p-4 rounded-2xl' : 'p-0 h-0'}
    ${!isTestMenuOpen && showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-800'}
  `}
  data-tooltip={disabled ? t('testEditor.fillLessonFieldsTooltip') : t('common.addTest')}
>
  <div className="w-8 h-8 flex items-center justify-center">
    <Icons.Plus className="h-5 w-5 text-gray-300" />
  </div>
</button>
```

### Стили и состояния

**Базовые стили**:
- **Layout**: `flex items-center justify-center` (центрирование содержимого)
- **Overflow**: `overflow-hidden` (скрытие переполнения)
- **Transition**: `transition-all duration-300 ease-in-out` (плавные переходы 300ms)
- **Width**: `w-full` (100% ширины контейнера)

**Условные стили**:
- **Когда меню закрыто** (`!isTestMenuOpen`):
  - **Padding**: `p-4` (16px)
  - **Border Radius**: `rounded-2xl` (16px)
- **Когда меню открыто** (`isTestMenuOpen`):
  - **Padding**: `p-0` (0px)
  - **Height**: `h-0` (скрыта)

**Видимость**:
- **Показана**: `opacity-100` (когда `!isTestMenuOpen && showButton`)
- **Скрыта**: `opacity-0 pointer-events-none` (когда меню открыто или кнопка скрыта)

**Состояния**:
- **Disabled**: `cursor-not-allowed opacity-50` (когда `disabled === true`)
- **Hover**: `hover:bg-gray-800` (темно-серый фон при наведении, если не disabled)

**Иконка**:
- **Размер контейнера**: `w-8 h-8` (32px × 32px)
- **Иконка Plus**: `h-5 w-5` (20px × 20px)
- **Цвет**: `text-gray-300` (светло-серый)

---

## Меню с типами тестов

### Структура
```tsx
<div 
  className={`
    transition-all duration-300 ease-in-out overflow-hidden
    ${isTestMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
  `}
>
  <div className="p-3 space-y-2">
    {/* Кнопки типов тестов */}
  </div>
</div>
```

### Анимация открытия/закрытия

**Контейнер меню**:
- **Transition**: `transition-all duration-300 ease-in-out` (плавные переходы 300ms)
- **Overflow**: `overflow-hidden` (скрытие переполнения)

**Состояния**:
- **Открыто** (`isTestMenuOpen === true`):
  - **Max Height**: `max-h-[600px]` (максимальная высота 600px)
  - **Opacity**: `opacity-100` (полностью видимо)
- **Закрыто** (`isTestMenuOpen === false`):
  - **Max Height**: `max-h-0` (высота 0)
  - **Opacity**: `opacity-0` (невидимо)

**Внутренний контейнер**:
- **Padding**: `p-3` (12px)
- **Spacing**: `space-y-2` (8px вертикальный отступ между кнопками)

---

## Кнопки типов тестов

### Общая структура кнопки
```tsx
<button
  onClick={() => addTestBlock('type')}
  disabled={disabled}
  className={`
    w-10 h-10 rounded-lg bg-{color}-500/10 
    flex items-center justify-center 
    transition-colors group mx-auto
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-{color}-500/20'
    }
  `}
  data-tooltip={t('testTypes.{type}')}
>
  <span className="text-{color}-400 font-bold text-sm">
    {Label}
  </span>
</button>
```

### Размеры и стили

**Базовые размеры**:
- **Width**: `w-10` (40px)
- **Height**: `h-10` (40px)
- **Border Radius**: `rounded-lg` (8px)

**Layout**:
- **Display**: `flex items-center justify-center` (центрирование содержимого)
- **Margin**: `mx-auto` (горизонтальное центрирование)

**Фон**:
- **Base**: `bg-{color}-500/10` (10% прозрачности цвета)
- **Hover**: `hover:bg-{color}-500/20` (20% прозрачности при наведении)

**Transition**:
- **Transition**: `transition-colors` (плавный переход цвета)

**Текст**:
- **Color**: `text-{color}-400` (цвет текста)
- **Font Weight**: `font-bold` (жирный)
- **Font Size**: `text-sm` (14px)

**Состояния**:
- **Disabled**: `opacity-50 cursor-not-allowed` (полупрозрачность и курсор "не разрешено")
- **Hover**: `hover:bg-{color}-500/20` (более яркий фон при наведении)

---

## Типы тестов и их стили

### 1. Математика 1 (М1)
```tsx
<button
  onClick={() => addTestBlock('math1')}
  disabled={disabled}
  className={`
    w-10 h-10 rounded-lg bg-blue-500/10 
    flex items-center justify-center 
    transition-colors group mx-auto
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-blue-500/20'
    }
  `}
  data-tooltip={t('testTypes.math1')}
>
  <span className="text-blue-400 font-bold text-sm">М1</span>
</button>
```

**Цветовая схема**:
- **Фон**: `bg-blue-500/10` (синий, 10% прозрачности)
- **Hover фон**: `hover:bg-blue-500/20` (синий, 20% прозрачности)
- **Текст**: `text-blue-400` (светло-синий)
- **Метка**: "М1"

---

### 2. Математика 2 (М2)
```tsx
<button
  onClick={() => addTestBlock('math2')}
  disabled={disabled}
  className={`
    w-10 h-10 rounded-lg bg-purple-500/10 
    flex items-center justify-center 
    transition-colors group mx-auto
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-purple-500/20'
    }
  `}
  data-tooltip={t('testTypes.math2')}
>
  <span className="text-purple-400 font-bold text-sm">М2</span>
</button>
```

**Цветовая схема**:
- **Фон**: `bg-purple-500/10` (фиолетовый, 10% прозрачности)
- **Hover фон**: `hover:bg-purple-500/20` (фиолетовый, 20% прозрачности)
- **Текст**: `text-purple-400` (светло-фиолетовый)
- **Метка**: "М2"

---

### 3. Аналогии (А)
```tsx
<button
  onClick={() => addTestBlock('analogy')}
  disabled={disabled}
  className={`
    w-10 h-10 rounded-lg bg-green-500/10 
    flex items-center justify-center 
    transition-colors group mx-auto
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-green-500/20'
    }
  `}
  data-tooltip={t('testTypes.analogy')}
>
  <span className="text-green-400 font-bold text-sm">А</span>
</button>
```

**Цветовая схема**:
- **Фон**: `bg-green-500/10` (зеленый, 10% прозрачности)
- **Hover фон**: `hover:bg-green-500/20` (зеленый, 20% прозрачности)
- **Текст**: `text-green-400` (светло-зеленый)
- **Метка**: "А"

---

### 4. Чтение и понимание (Ч)
```tsx
<button
  onClick={() => addTestBlock('rac')}
  disabled={disabled}
  className={`
    w-10 h-10 rounded-lg bg-yellow-500/10 
    flex items-center justify-center 
    transition-colors group mx-auto
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-yellow-500/20'
    }
  `}
  data-tooltip={t('testTypes.rac')}
>
  <span className="text-yellow-400 font-bold text-sm">Ч</span>
</button>
```

**Цветовая схема**:
- **Фон**: `bg-yellow-500/10` (желтый, 10% прозрачности)
- **Hover фон**: `hover:bg-yellow-500/20` (желтый, 20% прозрачности)
- **Текст**: `text-yellow-400` (светло-желтый)
- **Метка**: "Ч"

---

### 5. Грамматика (Г)
```tsx
<button
  onClick={() => addTestBlock('grammar')}
  disabled={disabled}
  className={`
    w-10 h-10 rounded-lg bg-red-500/10 
    flex items-center justify-center 
    transition-colors group mx-auto
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-red-500/20'
    }
  `}
  data-tooltip={t('testTypes.grammar')}
>
  <span className="text-red-400 font-bold text-sm">Г</span>
</button>
```

**Цветовая схема**:
- **Фон**: `bg-red-500/10` (красный, 10% прозрачности)
- **Hover фон**: `hover:bg-red-500/20` (красный, 20% прозрачности)
- **Текст**: `text-red-400` (светло-красный)
- **Метка**: "Г"

---

### 6. Стандарт (С)
```tsx
<button
  onClick={() => addTestBlock('standard')}
  disabled={disabled}
  className={`
    w-10 h-10 rounded-lg bg-gray-500/10 
    flex items-center justify-center 
    transition-colors group mx-auto
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:bg-gray-500/20'
    }
  `}
  data-tooltip={t('testTypes.standard')}
>
  <span className="text-gray-400 font-bold text-sm">С</span>
</button>
```

**Цветовая схема**:
- **Фон**: `bg-gray-500/10` (серый, 10% прозрачности)
- **Hover фон**: `hover:bg-gray-500/20` (серый, 20% прозрачности)
- **Текст**: `text-gray-400` (светло-серый)
- **Метка**: "С"

---

## Логика работы

### State переменные

```tsx
const [isTestMenuOpen, setIsTestMenuOpen] = useState(false);
const [showButton, setShowButton] = useState(true);
const menuRef = useRef<HTMLDivElement | null>(null);
```

- **`isTestMenuOpen`**: Управляет открытием/закрытием меню
- **`showButton`**: Управляет видимостью кнопки "+"
- **`menuRef`**: Референс на контейнер меню для обработки кликов вне меню

---

### Функция добавления теста

```tsx
const addTestBlock = (type: string) => {
  // Проверяем лимит тестов
  if (totalQuestions !== undefined && testBlocks.length >= totalQuestions) {
    setMaxTestsError(t('testEditor.validation.maxTestsReached', { total: totalQuestions }));
    setIsTestMenuOpen(false);
    // Скрываем ошибку через 5 секунд
    setTimeout(() => setMaxTestsError(null), 5000);
    return;
  }
  
  // Очищаем ошибку при успешном добавлении
  setMaxTestsError(null);
  const newBlockId = `${type}-${Date.now()}`;
  setTestBlocks(prev => [...prev, newBlockId]);
  setIsTestMenuOpen(false);
};
```

**Логика**:
1. Проверка лимита тестов (если `totalQuestions` задан)
2. Если лимит достигнут - показываем ошибку и закрываем меню
3. Если лимит не достигнут - создаем новый блок с уникальным ID
4. Добавляем блок в массив `testBlocks`
5. Закрываем меню

**Формат ID блока**: `{type}-{timestamp}` (например: `math1-1234567890`)

---

### Управление показом кнопки

```tsx
useEffect(() => {
  if (!isTestMenuOpen) {
    // Показываем кнопку с задержкой после закрытия (после завершения анимации)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 300); // 300ms - время анимации
    return () => clearTimeout(timer);
  }
}, [isTestMenuOpen]);
```

**Логика**:
- Когда меню закрывается (`!isTestMenuOpen`), кнопка показывается с задержкой 300ms (время анимации)
- Это обеспечивает плавный переход без мерцания

---

### Обработка клика вне меню

```tsx
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsTestMenuOpen(false);
    }
  };

  if (isTestMenuOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isTestMenuOpen]);
```

**Логика**:
- При открытии меню добавляется слушатель клика на документ
- Если клик произошел вне контейнера меню (`menuRef`), меню закрывается
- При закрытии меню или размонтировании компонента слушатель удаляется

---

## Анимации

### Открытие/закрытие меню

**Кнопка "+"**:
- **Transition**: `transition-all duration-300 ease-in-out`
- **Открытие**: Кнопка исчезает (`opacity-0`, `h-0`, `p-0`)
- **Закрытие**: Кнопка появляется (`opacity-100`, `p-4`, `rounded-2xl`)

**Меню**:
- **Transition**: `transition-all duration-300 ease-in-out`
- **Открытие**: `max-h-[600px] opacity-100` (разворачивается вниз)
- **Закрытие**: `max-h-0 opacity-0` (сворачивается вверх)

**Время анимации**: 300ms (0.3 секунды)

---

### Hover эффекты

**Кнопка "+"**:
- **Hover**: `hover:bg-gray-800` (темно-серый фон)

**Кнопки типов тестов**:
- **Hover**: `hover:bg-{color}-500/20` (увеличение прозрачности фона с 10% до 20%)
- **Transition**: `transition-colors` (плавный переход цвета)

---

## Адаптивность

### Позиционирование

**Desktop**:
- **Right**: `right-16` (64px от правого края)
- **Bottom**: `bottom-4` (16px от нижнего края)

**Мобильные устройства**:
- Меню остается фиксированным справа внизу
- Ширина контейнера фиксирована: `w-16` (64px)

---

## Интеграция с другими компонентами

### Связь с TestBlocks

После выбора типа теста создается соответствующий компонент:

```tsx
{testBlocks.map((blockId) => {
  const blockType = blockId.split('-')[0];
  let TestComponent = TestMath1Block;
  
  if (blockType === 'math2') {
    TestComponent = TestMath2Block;
  } else if (blockType === 'analogy') {
    TestComponent = TestAnalogyBlock;
  } else if (blockType === 'rac') {
    TestComponent = TestRACBlock;
  } else if (blockType === 'grammar') {
    TestComponent = TestGrammarBlock;
  } else if (blockType === 'standard') {
    TestComponent = TestStandardBlock;
  }
  
  return (
    <TestComponent
      blockId={blockId}
      // ... другие пропсы
    />
  );
})}
```

---

## Полный код компонента

```tsx
{/* Плавающее окошко добавления теста справа */}
<div className="fixed bottom-4 right-16 z-50">
  <div 
    ref={menuRef}
    className="w-16 bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-2xl"
  >
    {/* Заголовок окошка - кнопка всегда видна */}
    <button
      onClick={() => {
        if (disabled) return;
        if (maxTestsReached && totalQuestions !== undefined) {
          setMaxTestsError(t('testEditor.validation.maxTestsReached', { total: totalQuestions }));
          setTimeout(() => setMaxTestsError(null), 5000);
          return;
        }
        setShowButton(false);
        setIsTestMenuOpen(true);
      }}
      disabled={disabled}
      className={`
        flex items-center justify-center overflow-hidden
        transition-all duration-300 ease-in-out
        w-full transition-colors
        ${!isTestMenuOpen ? 'p-4 rounded-2xl' : 'p-0 h-0'}
        ${!isTestMenuOpen && showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-800'}
      `}
      data-tooltip={disabled ? t('testEditor.fillLessonFieldsTooltip') : t('common.addTest')}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        <Icons.Plus className="h-5 w-5 text-gray-300" />
      </div>
    </button>

    {/* Меню с типами тестов */}
    <div 
      className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${isTestMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <div className="p-3 space-y-2">
        {/* Математика 1 */}
        <button
          onClick={() => addTestBlock('math1')}
          disabled={disabled}
          className={`w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center transition-colors group mx-auto ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-500/20'
          }`}
          data-tooltip={t('testTypes.math1')}
        >
          <span className="text-blue-400 font-bold text-sm">М1</span>
        </button>

        {/* Математика 2 */}
        <button
          onClick={() => addTestBlock('math2')}
          disabled={disabled}
          className={`w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center transition-colors group mx-auto ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-purple-500/20'
          }`}
          data-tooltip={t('testTypes.math2')}
        >
          <span className="text-purple-400 font-bold text-sm">М2</span>
        </button>

        {/* Аналогии */}
        <button
          onClick={() => addTestBlock('analogy')}
          disabled={disabled}
          className={`w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center transition-colors group mx-auto ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-green-500/20'
          }`}
          data-tooltip={t('testTypes.analogy')}
        >
          <span className="text-green-400 font-bold text-sm">А</span>
        </button>

        {/* Чтение и понимание */}
        <button
          onClick={() => addTestBlock('rac')}
          disabled={disabled}
          className={`w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center transition-colors group mx-auto ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-yellow-500/20'
          }`}
          data-tooltip={t('testTypes.rac')}
        >
          <span className="text-yellow-400 font-bold text-sm">Ч</span>
        </button>

        {/* Грамматика */}
        <button
          onClick={() => addTestBlock('grammar')}
          disabled={disabled}
          className={`w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center transition-colors group mx-auto ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-red-500/20'
          }`}
          data-tooltip={t('testTypes.grammar')}
        >
          <span className="text-red-400 font-bold text-sm">Г</span>
        </button>

        {/* Стандарт */}
        <button
          onClick={() => addTestBlock('standard')}
          disabled={disabled}
          className={`w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center transition-colors group mx-auto ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-500/20'
          }`}
          data-tooltip={t('testTypes.standard')}
        >
          <span className="text-gray-400 font-bold text-sm">С</span>
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## Цветовая палитра

### Основные цвета

| Тип теста | Фон (base) | Фон (hover) | Текст | Метка |
|-----------|------------|-------------|-------|-------|
| Математика 1 | `bg-blue-500/10` | `bg-blue-500/20` | `text-blue-400` | М1 |
| Математика 2 | `bg-purple-500/10` | `bg-purple-500/20` | `text-purple-400` | М2 |
| Аналогии | `bg-green-500/10` | `bg-green-500/20` | `text-green-400` | А |
| Чтение и понимание | `bg-yellow-500/10` | `bg-yellow-500/20` | `text-yellow-400` | Ч |
| Грамматика | `bg-red-500/10` | `bg-red-500/20` | `text-red-400` | Г |
| Стандарт | `bg-gray-500/10` | `bg-gray-500/20` | `text-gray-400` | С |

### Контейнер меню

- **Фон**: `#1a1a1a` (темно-серый)
- **Граница**: `gray-700` (серый)
- **Тень**: `shadow-2xl` (большая тень)

---

## Валидация и ограничения

### Проверка лимита тестов

```tsx
if (totalQuestions !== undefined && testBlocks.length >= totalQuestions) {
  setMaxTestsError(t('testEditor.validation.maxTestsReached', { total: totalQuestions }));
  setIsTestMenuOpen(false);
  setTimeout(() => setMaxTestsError(null), 5000);
  return;
}
```

**Логика**:
- Если задан `totalQuestions` и количество тестов достигло лимита, показывается ошибка
- Меню закрывается
- Ошибка автоматически скрывается через 5 секунд

### Блокировка при disabled

```tsx
disabled={disabled}
```

**Поведение**:
- Когда `disabled === true`, все кнопки неактивны
- Показывается подсказка: "Заполните поля урока"
- Кнопки имеют `opacity-50` и `cursor-not-allowed`

---

## Подсказки (Tooltips)

### Использование

Все кнопки имеют атрибут `data-tooltip`:
- Кнопка "+": `t('common.addTest')` или `t('testEditor.fillLessonFieldsTooltip')`
- Кнопки типов: `t('testTypes.{type}')`

**Хук для подсказок**:
```tsx
useCustomTooltips(undefined, getCurrentLanguage());
```

---

## Итоговая схема

```
┌─────────────────────────────────────────┐
│                                         │
│         Основной контент страницы      │
│                                         │
│                                         │
│                    ┌──────────────┐    │
│                    │              │    │
│                    │   Меню       │    │
│                    │   (64px)     │    │
│                    │              │    │
│                    │   [ + ]      │    │
│                    │              │    │
│                    │   [М1]       │    │
│                    │   [М2]       │    │
│                    │   [А]        │    │
│                    │   [Ч]        │    │
│                    │   [Г]        │    │
│                    │   [С]        │    │
│                    │              │    │
│                    └──────────────┘    │
│                         ↑              │
│                    fixed bottom-4      │
│                    right-16            │
└─────────────────────────────────────────┘
```

---

## Ключевые особенности реализации

1. **Плавные анимации**: Все переходы используют `transition-all duration-300 ease-in-out`
2. **Цветовая дифференциация**: Каждый тип теста имеет свой уникальный цвет
3. **Адаптивность**: Фиксированное позиционирование работает на всех устройствах
4. **Валидация**: Проверка лимита тестов перед добавлением
5. **UX**: Автоматическое закрытие при клике вне меню
6. **Доступность**: Подсказки для всех кнопок, поддержка disabled состояний

