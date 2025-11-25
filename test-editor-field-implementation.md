# Реализация TestEditorField: изменение размера, режимы и скролл

Подробное описание реализации компонента TestEditorField: кнопка изменения размера, размеры поля в режимах превью и редактирования, управление скроллом.

---

## Общая структура компонента

TestEditorField - это обертка над `@uiw/react-md-editor` для редактирования Markdown текста с поддержкой LaTeX формул.

**Основные возможности:**
- Изменение размера поля (resize handle)
- Режим предпросмотра (preview mode)
- Режим редактирования (edit mode)
- Управление скроллом
- Скрытие scrollbar'ов

---

## Кнопка изменения размера (Resize Handle)

### Расположение и внешний вид

**Позиция:**
- Абсолютное позиционирование: `absolute bottom-1 right-1`
- Расположена в правом нижнем углу поля
- Отступы: 4px от правого и нижнего края

**Визуальный стиль:**
```tsx
<div 
  className="absolute bottom-1 right-1 cursor-se-resize hover:opacity-80 transition-opacity"
  onMouseDown={handleMouseDown}
>
  <svg 
    className="w-8 h-8 text-gray-500"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    strokeWidth={1.5}
  >
    <path d="M20 20L16 16M20 20L16 20M20 20L20 16" />
  </svg>
</div>
```

**Характеристики:**
- **Размер иконки**: 32px × 32px (`w-8 h-8`)
- **Цвет**: Серый (`text-gray-500`)
- **Курсор**: `cursor-se-resize` (курсор изменения размера по диагонали)
- **Hover эффект**: Прозрачность 80% (`hover:opacity-80`)
- **Переход**: Плавный (`transition-opacity`)

### Условие отображения

Кнопка показывается только если `showResizeHandle={true}`:

```tsx
{showResizeHandle && (
  <div className="absolute bottom-1 right-1 ...">
    {/* SVG иконка */}
  </div>
)}
```

**Где используется:**
- Поле вопроса: `showResizeHandle={true}`
- Поля ответов: `showResizeHandle={true}`
- Поле объяснения от AI: `showResizeHandle={true}`

### Механизм изменения размера

**1. Начало изменения размера:**

```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  e.preventDefault(); // Предотвращаем выделение текста
  setIsResizing(true);
  startYRef.current = e.clientY; // Сохраняем начальную Y координату мыши
  startHeightRef.current = currentHeight; // Сохраняем начальную высоту
};
```

**2. Отслеживание движения мыши:**

```typescript
useEffect(() => {
  if (!isResizing) return;

  const handleMouseMove = (e: MouseEvent) => {
    const deltaY = e.clientY - startYRef.current; // Разница в Y координате
    const newHeight = Math.max(60, Math.min(500, startHeightRef.current + deltaY));
    setCurrentHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false); // Завершаем изменение размера
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [isResizing]);
```

**Алгоритм:**
1. При нажатии на кнопку (`onMouseDown`) сохраняются начальные координаты и высота
2. При движении мыши (`mousemove`) вычисляется разница в Y координате
3. Новая высота = начальная высота + разница в Y
4. Высота ограничена диапазоном: **минимум 60px, максимум 500px**
5. При отпускании мыши (`mouseup`) изменение размера завершается

**Ограничения:**
- **Минимальная высота**: 60px
- **Максимальная высота**: 500px
- Изменение размера происходит только по вертикали (вниз)

### Сохранение размера

Размер поля сохраняется в состоянии компонента (`currentHeight`), но **не сохраняется** в localStorage или базе данных. При перезагрузке страницы размер возвращается к начальному значению (`initialHeight`).

---

## Размер поля в разных режимах

### Начальная высота (initialHeight)

Высота поля задается через prop `height`:

```tsx
<TestEditorField
  height={150}  // Для поля вопроса
  // или
  height={60}   // Для полей ответов
  // или
  height={300}  // Для поля объяснения от AI
/>
```

**Стандартные значения:**
- **Поле вопроса**: 150px
- **Поля ответов**: 60px
- **Поле объяснения от AI**: 300px

### Размер в режиме редактирования (Edit Mode)

**Когда активируется:**
- `isPreviewMode={false}`
- MDEditor получает `preview="edit"`

**Характеристики:**
- Высота: `currentHeight` (может быть изменена через resize handle)
- Отображается: Исходный Markdown код
- Редактирование: Прямое редактирование текста
- Скролл: Внутренний скролл textarea (если контент больше высоты)

**Визуальные особенности:**
- Фон: `#151515` (темно-серый)
- Цвет текста: Белый (`#ffffff`)
- Шрифт: Моноширинный (`JetBrains Mono`, `Fira Code`)
- Размер шрифта: 14px
- Межстрочный интервал: 1.7

### Размер в режиме предпросмотра (Preview Mode)

**Когда активируется:**
- `isPreviewMode={true}`
- MDEditor получает `preview="preview"`

**Характеристики:**
- Высота: `currentHeight` (та же, что и в режиме редактирования)
- Отображается: Отформатированный HTML (Markdown → HTML)
- Редактирование: Недоступно (только просмотр)
- Скролл: Внутренний скролл preview контейнера

**Визуальные особенности:**
- Фон: `#151515` (темно-серый)
- Цвет текста: Белый (`#ffffff`)
- Padding: 16px
- Markdown элементы отображаются как HTML
- LaTeX формулы рендерятся через KaTeX

### Изменение размера при переключении режимов

**Важно:** Размер поля **не меняется** при переключении между режимами редактирования и предпросмотра. Высота остается той же (`currentHeight`), меняется только содержимое:

- **Режим редактирования**: Показывается textarea с Markdown кодом
- **Режим предпросмотра**: Показывается отформатированный HTML

**Пример:**
```typescript
// Поле с высотой 200px
<TestEditorField height={200} isPreviewMode={false} /> // Редактирование, высота 200px
<TestEditorField height={200} isPreviewMode={true} />  // Превью, высота 200px (та же)
```

---

## Управление скроллом

### Логика скролла

Скролл работает по-разному в зависимости от состояния поля:

**1. Поле неактивно (`isActive={false}`):**
- Скролл колесиком мыши прокручивает **страницу**
- Поле не реагирует на скролл

**2. Поле активно (`isActive={true}`):**
- Скролл колесиком мыши прокручивает **содержимое поля**
- Если достигнут верх/низ содержимого, скролл переходит на страницу

### Реализация логики скролла

```typescript
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    if (!isActive) {
      // Поле неактивно - ничего не делаем, браузер сам прокрутит страницу
      return;
    }
    
    // Поле активно - проверяем, нужно ли прокручивать содержимое поля
    const target = e.target as HTMLElement;
    const textarea = containerRef.current?.querySelector('textarea');
    
    if (textarea && (target === textarea || textarea.contains(target))) {
      // Разрешаем прокрутку внутри textarea
      const isAtTop = textarea.scrollTop === 0;
      const isAtBottom = textarea.scrollTop + textarea.clientHeight >= textarea.scrollHeight;
      
      // Если прокручиваем вверх и уже в самом верху, или вниз и в самом низу - прокручиваем страницу
      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        // Ничего не делаем, позволяем прокрутку страницы
        return;
      }
      // Иначе прокрутка textarea происходит автоматически
    }
  };

  const container = containerRef.current;
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: true });
  }

  return () => {
    if (container) {
      container.removeEventListener('wheel', handleWheel);
    }
  };
}, [isActive]);
```

**Алгоритм:**

1. **Проверка активности поля:**
   - Если поле неактивно → скролл прокручивает страницу
   - Если поле активно → переходим к следующему шагу

2. **Проверка позиции скролла:**
   - `isAtTop`: Скролл в самом верху (`scrollTop === 0`)
   - `isAtBottom`: Скролл в самом низу (`scrollTop + clientHeight >= scrollHeight`)

3. **Принятие решения:**
   - Прокрутка вверх + в самом верху → прокручиваем страницу
   - Прокрутка вниз + в самом низу → прокручиваем страницу
   - Иначе → прокручиваем содержимое поля

### Скрытие scrollbar'ов

**Проблема:** MDEditor по умолчанию показывает scrollbar'ы, которые выглядят некрасиво.

**Решение:** Скрытие всех scrollbar'ов через CSS.

**1. Глобальные стили (добавляются в `<head>`):**

```typescript
useEffect(() => {
  const styleId = 'test-editor-field-scrollbar-styles';
  let style = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .w-md-editor,
      .w-md-editor * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .w-md-editor::-webkit-scrollbar,
      .w-md-editor *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      .w-md-editor-text-pre {
        overflow-y: auto !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .w-md-editor-text-pre::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      .w-md-editor-text-area,
      .w-md-editor-text-area * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .w-md-editor-text-area::-webkit-scrollbar,
      .w-md-editor-text-area *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }
}, []);
```

**2. Применение стилей к элементам:**

```typescript
useEffect(() => {
  const hideScrollbars = () => {
    if (containerRef.current) {
      const allElements = containerRef.current.querySelectorAll('*');
      allElements.forEach((el: any) => {
        if (el && el.style) {
          el.style.scrollbarWidth = 'none';
          el.style.msOverflowStyle = 'none';
        }
      });
      
      // Специально для textarea и элементов с overflow
      const scrollableElements = containerRef.current.querySelectorAll('textarea, [style*="overflow"]');
      scrollableElements.forEach((el: any) => {
        if (el && el.style) {
          el.style.scrollbarWidth = 'none';
          el.style.msOverflowStyle = 'none';
        }
      });
    }
  };

  const timeout = setTimeout(hideScrollbars, 50);
  return () => clearTimeout(timeout);
}, [currentHeight, value]);
```

**3. MutationObserver для динамических элементов:**

```typescript
const observer = new MutationObserver(() => {
  applyStyles(); // Применяем стили при появлении новых элементов
});

observer.observe(containerRef.current, {
  childList: true,
  subtree: true,
});
```

**Результат:**
- Все scrollbar'ы скрыты
- Скролл работает (колесико мыши, клавиатура)
- Визуально scrollbar'ов нет

### Скролл в режиме редактирования

**Элемент:** `<textarea>`

**Характеристики:**
- Скролл вертикальный (`overflow-y: auto`)
- Scrollbar скрыт
- Скролл работает колесиком мыши и клавиатурой (стрелки, Page Up/Down)

**Ограничения:**
- Минимальная высота: 60px
- Максимальная высота: 500px
- Скролл появляется автоматически, если контент больше высоты

### Скролл в режиме предпросмотра

**Элемент:** `.w-md-editor-preview`

**Характеристики:**
- Скролл вертикальный (`overflow-y: auto`)
- Scrollbar скрыт
- Скролл работает колесиком мыши

**Особенности:**
- Отформатированный HTML может быть выше, чем высота поля
- Скролл позволяет просмотреть весь контент
- LaTeX формулы могут быть длинными и требовать скролла

---

## Активация поля

### Состояние активности

Поле может быть в двух состояниях:

1. **Неактивно** (`isActive={false}`):
   - Граница: `border-gray-700` (темно-серая)
   - Взаимодействие: Отключено (`pointerEvents: 'none'`)
   - Скролл: Прокручивает страницу

2. **Активно** (`isActive={true}`):
   - Граница: `border-white` (белая)
   - Взаимодействие: Включено (`pointerEvents: 'auto'`)
   - Скролл: Прокручивает содержимое поля

### Активация при клике

```typescript
const handleClick = () => {
  if (!isActive) {
    setIsActive(true);
    onFocus(); // Уведомляем родителя об активации
    
    // Фокусируем textarea после активации
    setTimeout(() => {
      const textarea = containerRef.current?.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  }
};
```

**Процесс активации:**

1. Пользователь кликает на поле
2. Поле становится активным (`setIsActive(true)`)
3. Вызывается `onFocus()` для уведомления родителя
4. Textarea получает фокус (через `setTimeout` для корректной работы)

### Деактивация при клике вне поля

```typescript
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsActive(false);
    }
  };

  if (isActive) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isActive]);
```

**Процесс деактивации:**

1. Пользователь кликает вне поля
2. Проверяется, что клик был вне контейнера
3. Поле становится неактивным (`setIsActive(false)`)
4. Граница меняется на серую
5. Взаимодействие отключается

---

## Взаимодействие с MDEditor

### Настройки MDEditor

```tsx
<MDEditor 
  ref={ref}
  value={value}
  onChange={(val) => onChange(val || '')}
  preview={isPreviewMode ? "preview" : "edit"}
  hideToolbar={true}
  visibleDragbar={false}
  height={currentHeight}
  previewOptions={{
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  }}
  textareaProps={{
    placeholder,
  }}
  style={{
    background: '#151515',
  }}
/>
```

**Параметры:**

- **preview**: `"preview"` или `"edit"` (в зависимости от `isPreviewMode`)
- **hideToolbar**: `true` (скрывает встроенную панель инструментов)
- **visibleDragbar**: `false` (скрывает встроенную ручку изменения размера)
- **height**: `currentHeight` (текущая высота, может быть изменена через resize handle)
- **previewOptions**: Плагины для Markdown и LaTeX
- **textareaProps**: Свойства textarea (placeholder)
- **style**: Стили фона

### Управление взаимодействием

```tsx
<div style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
  <MDEditor ... />
</div>
```

**Логика:**
- **Поле активно**: `pointerEvents: 'auto'` → можно редактировать
- **Поле неактивно**: `pointerEvents: 'none'` → редактирование заблокировано

---

## Полный цикл работы

### Пример использования

```tsx
<TestEditorField
  value={question}
  onChange={setQuestion}
  placeholder="Введите вопрос"
  height={150}
  isPreviewMode={isPreviewMode}
  onFocus={() => setActiveField('question')}
  showResizeHandle={true}
  hasError={false}
/>
```

### Последовательность действий

1. **Инициализация:**
   - Высота: 150px (из prop `height`)
   - Режим: Редактирование (`isPreviewMode={false}`)
   - Состояние: Неактивно

2. **Активация:**
   - Пользователь кликает на поле
   - Поле становится активным
   - Граница меняется на белую
   - Textarea получает фокус

3. **Редактирование:**
   - Пользователь вводит текст
   - Скролл работает внутри поля
   - Изменения сохраняются через `onChange`

4. **Изменение размера:**
   - Пользователь тянет за resize handle
   - Высота изменяется от 60px до 500px
   - Контент адаптируется под новый размер

5. **Переключение в превью:**
   - Пользователь нажимает кнопку "Превью"
   - `isPreviewMode={true}`
   - Отображается отформатированный HTML
   - Высота остается той же

6. **Деактивация:**
   - Пользователь кликает вне поля
   - Поле становится неактивным
   - Граница меняется на серую

---

## Технические детали

### Используемые хуки

- **useState**: Управление состоянием (высота, активность, изменение размера)
- **useRef**: Ссылки на DOM элементы
- **useEffect**: Побочные эффекты (скролл, скрытие scrollbar'ов, изменение размера)
- **forwardRef**: Передача ref родительскому компоненту

### Производительность

- **Динамическая загрузка**: MDEditor загружается динамически (`dynamic import`)
- **Оптимизация скролла**: Использование `passive: true` для событий wheel
- **MutationObserver**: Отслеживание динамических элементов для применения стилей

### Ограничения

- **Высота**: Минимум 60px, максимум 500px
- **Сохранение размера**: Размер не сохраняется между сессиями
- **Скролл**: Только вертикальный
- **Редактирование**: Только в активном состоянии

---

## Итоговая схема работы

```
Пользователь открывает поле
         ↓
Инициализация (высота из prop)
         ↓
Пользователь кликает на поле
         ↓
Активация (граница белая, фокус)
         ↓
Редактирование текста
         ↓
Изменение размера (опционально)
         ↓
Переключение в превью (опционально)
         ↓
Скролл содержимого
         ↓
Деактивация (клик вне поля)
```

---

## Заключение

TestEditorField предоставляет полнофункциональный редактор Markdown с:

- ✅ Изменением размера (60px - 500px)
- ✅ Режимом редактирования и предпросмотра
- ✅ Умным управлением скроллом
- ✅ Скрытыми scrollbar'ами
- ✅ Активацией/деактивацией поля
- ✅ Поддержкой LaTeX формул

Все эти функции работают вместе, обеспечивая удобный и функциональный интерфейс для редактирования текста.

