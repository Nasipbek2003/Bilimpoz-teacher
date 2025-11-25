# Иерархия контейнеров LessonTestsPage

Подробное описание иерархии, расположения, размеров, иконок и текста всех контейнеров внутри компонента LessonTestsPage.

---

## Общая структура

```
LessonTestsPage
└── form (p-8 space-y-8)
    ├── [Состояние загрузки / Пустое состояние / Блоки тестов]
    └── [Плавающие элементы]
```

---

## 1. Корневой контейнер LessonTestsPage

### Структура
```tsx
<>
  <div className="bg-[#151515] rounded-2xl">
    <form className="p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Контент */}
    </form>
  </div>
  
  {/* Плавающие элементы */}
</>
```

### Стили корневого div
- **Background**: `bg-[#151515]` (#151515 - темно-серый)
- **Border Radius**: `rounded-2xl` (16px)
- **Padding**: Нет (padding только у form)

### Стили form
- **Padding**: `p-8` (32px со всех сторон)
- **Spacing**: `space-y-8` (32px вертикальный отступ между дочерними элементами)
- **Background**: Прозрачный (наследует от родителя)

---

## 2. Контейнер form - внутренняя структура

### 2.1. Состояние загрузки

```tsx
{isLoading ? (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <Icons.Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
    <p className="text-gray-400 text-sm">Загрузка вопросов...</p>
  </div>
) : ...}
```

**Контейнер**:
- **Display**: `flex flex-col` (вертикальный flexbox)
- **Align Items**: `items-center` (горизонтальное центрирование)
- **Justify Content**: `justify-center` (вертикальное центрирование)
- **Gap**: `gap-4` (16px между элементами)
- **Padding**: `py-12` (48px сверху и снизу)

**Иконка загрузки**:
- **Component**: `Icons.Loader2`
- **Size**: `h-8 w-8` (32px × 32px)
- **Color**: `text-blue-400` (#60A5FA - голубой)
- **Animation**: `animate-spin` (вращение)

**Текст**:
- **Content**: "Загрузка вопросов..."
- **Color**: `text-gray-400` (#9CA3AF - серый)
- **Size**: `text-sm` (14px)

---

### 2.2. Пустое состояние (нет тестов)

```tsx
{testBlocks.length === 0 ? (
  <div className="space-y-6">
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
        <Icons.HelpCircle className="h-8 w-8 text-gray-400" />
      </div>
      <div className="text-center">
        <h3 className="text-white font-medium mb-2">
          {t('testEditor.noTestsYet')}
        </h3>
        {disabled ? (
          <p className="text-yellow-400 text-sm">
            {t('testEditor.fillLessonFields')}
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            {t('testEditor.clickPlusButton')}
          </p>
        )}
      </div>
    </div>
  </div>
) : ...}
```

**Внешний контейнер**:
- **Spacing**: `space-y-6` (24px вертикальный отступ)

**Внутренний контейнер**:
- **Display**: `flex flex-col` (вертикальный flexbox)
- **Align Items**: `items-center` (горизонтальное центрирование)
- **Justify Content**: `justify-center` (вертикальное центрирование)
- **Gap**: `gap-4` (16px между элементами)
- **Padding**: `py-12` (48px сверху и снизу)

**Иконка**:
- **Container**: `w-16 h-16` (64px × 64px)
- **Border Radius**: `rounded-full` (круглая)
- **Background**: `bg-gray-800` (#1F2937 - темно-серый)
- **Display**: `flex items-center justify-center` (центрирование)
- **Flex**: `flex-shrink-0` (не сжимается)
- **Icon**: `Icons.HelpCircle`
- **Icon Size**: `h-8 w-8` (32px × 32px)
- **Icon Color**: `text-gray-400` (#9CA3AF - серый)

**Текстовый контейнер**:
- **Text Align**: `text-center` (центрирование текста)

**Заголовок**:
- **Content**: "Пока нет тестов" (или перевод)
- **Color**: `text-white` (#FFFFFF - белый)
- **Font Weight**: `font-medium` (500)
- **Margin Bottom**: `mb-2` (8px)

**Описание**:
- **Color (disabled)**: `text-yellow-400` (#FBBF24 - желтый)
- **Color (enabled)**: `text-gray-400` (#9CA3AF - серый)
- **Size**: `text-sm` (14px)

---

### 2.3. Блоки тестов (основной контент)

```tsx
{testBlocks.length > 0 && (
  <>
    {/* Предупреждение о лимите */}
    {maxTestsError && (
      <div className="mb-4 flex items-center gap-2">
        <Icons.AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
        <p className="text-red-400 text-sm">
          {maxTestsError}
        </p>
      </div>
    )}
    
    {/* Контейнер блоков */}
    <div className="space-y-6 pb-24">
      {testBlocks.map((blockId) => (
        <div key={blockId} onFocus={() => { activeBlockId.current = blockId; }}>
          <TestComponent ... />
        </div>
      ))}
    </div>
  </>
)}
```

**Предупреждение о лимите**:
- **Margin Bottom**: `mb-4` (16px)
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-2` (8px между иконкой и текстом)
- **Icon**: `Icons.AlertTriangle`
- **Icon Size**: `h-5 w-5` (20px × 20px)
- **Icon Color**: `text-red-400` (#F87171 - красный)
- **Icon Flex**: `flex-shrink-0` (не сжимается)
- **Text Color**: `text-red-400` (#F87171 - красный)
- **Text Size**: `text-sm` (14px)

**Контейнер блоков**:
- **Spacing**: `space-y-6` (24px вертикальный отступ между блоками)
- **Padding Bottom**: `pb-24` (96px снизу - для плавающих элементов)

**Обертка блока**:
- **Key**: `blockId` (уникальный идентификатор)
- **onFocus**: Устанавливает активный блок

---

## 3. Структура TestRACBlock (Чтение и понимание)

### 3.1. Корневой контейнер блока

```tsx
<div className="bg-[#1a1a1a] rounded-xl p-6 space-y-6">
  {/* Содержимое */}
</div>
```

**Стили**:
- **Background**: `bg-[#1a1a1a]` (#1a1a1a - темно-серый)
- **Border Radius**: `rounded-xl` (12px)
- **Padding**: `p-6` (24px со всех сторон)
- **Spacing**: `space-y-6` (24px вертикальный отступ между секциями)

---

### 3.2. Заголовок блока

```tsx
<div className="flex items-center justify-between">
  {/* Левая часть */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
      <span className="text-yellow-400 font-bold">Ч</span>
    </div>
    <div>
      <h3 className="text-white font-medium">{t('testTypes.rac')}</h3>
      <p className="text-gray-400 text-sm">{t('testEditor.questionBlock')}</p>
    </div>
  </div>
  
  {/* Правая часть */}
  <div className="flex items-center gap-2">
    {/* AI кнопка или loader */}
    <button onClick={onRemove} className="p-2 hover:bg-gray-800 rounded-lg transition-colors group">
      <Icons.Trash className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
    </button>
  </div>
</div>
```

**Контейнер заголовка**:
- **Display**: `flex items-center justify-between` (flexbox с пространством между)
- **Align Items**: `items-center` (вертикальное центрирование)

**Левая часть**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-3` (12px между элементами)

**Иконка типа теста**:
- **Container**: `w-10 h-10` (40px × 40px)
- **Border Radius**: `rounded-lg` (8px)
- **Background**: `bg-yellow-500/10` (желтый с прозрачностью 10%)
- **Display**: `flex items-center justify-center` (центрирование)
- **Text**: "Ч" (кириллическая буква)
- **Text Color**: `text-yellow-400` (#FBBF24 - желтый)
- **Font Weight**: `font-bold` (700)

**Текстовый блок**:
- **Заголовок**: `h3`
  - **Content**: "Чтение и понимание" (или перевод)
  - **Color**: `text-white` (#FFFFFF - белый)
  - **Font Weight**: `font-medium` (500)
- **Подзаголовок**: `p`
  - **Content**: "Блок вопроса" (или перевод)
  - **Color**: `text-gray-400` (#9CA3AF - серый)
  - **Size**: `text-sm` (14px)

**Правая часть**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-2` (8px между элементами)

**Кнопка удаления**:
- **Padding**: `p-2` (8px)
- **Hover Background**: `hover:bg-gray-800` (#1F2937 - темно-серый)
- **Border Radius**: `rounded-lg` (8px)
- **Transition**: `transition-colors` (плавный переход цвета)
- **Group**: `group` (для hover эффектов на дочерних элементах)
- **Icon**: `Icons.Trash`
- **Icon Size**: `h-5 w-5` (20px × 20px)
- **Icon Color**: `text-gray-400` (#9CA3AF - серый)
- **Icon Hover Color**: `group-hover:text-red-400` (#F87171 - красный)

---

### 3.3. Секция "Вопрос"

```tsx
<div>
  {/* Заголовок секции */}
  <div className="flex items-center justify-between mb-3">
    <label className="flex items-center text-sm font-medium text-gray-300">
      <Icons.HelpCircle className="h-4 w-4 mr-2 text-white" />
      {t('testEditor.question')} *
    </label>
    
    {/* Кнопка переключения версий (если есть) */}
  </div>
  
  {/* Поле ввода */}
  <TestEditorField ... />
  
  {/* Сообщение об ошибке */}
  {validationErrors.question && (
    <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
      <Icons.AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{t('testEditor.validation.fillQuestionField')}</span>
    </div>
  )}
</div>
```

**Контейнер секции**:
- Без дополнительных классов (блок)

**Заголовок секции**:
- **Display**: `flex items-center justify-between` (flexbox с пространством между)
- **Margin Bottom**: `mb-3` (12px)

**Label**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Size**: `text-sm` (14px)
- **Font Weight**: `font-medium` (500)
- **Color**: `text-gray-300` (#D1D5DB - светло-серый)

**Иконка вопроса**:
- **Component**: `Icons.HelpCircle`
- **Size**: `h-4 w-4` (16px × 16px)
- **Margin Right**: `mr-2` (8px)
- **Color**: `text-white` (#FFFFFF - белый)

**Текст**:
- **Content**: "Вопрос *" (или перевод)
- **Asterisk**: `*` (обозначает обязательное поле)

**Поле ввода (TestEditorField)**:
- **Height**: `150px` (начальная высота)
- **Placeholder**: "Введите вопрос" (или перевод)
- **Show Resize Handle**: `true` (иконка изменения размера)
- **Has Error**: `validationErrors.question` (красная граница при ошибке)

**Сообщение об ошибке**:
- **Margin Top**: `mt-2` (8px)
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-2` (8px между иконкой и текстом)
- **Color**: `text-red-400` (#F87171 - красный)
- **Size**: `text-sm` (14px)
- **Icon**: `Icons.AlertCircle`
- **Icon Size**: `h-4 w-4` (16px × 16px)
- **Icon Flex**: `flex-shrink-0` (не сжимается)

---

### 3.4. Секция "Варианты ответов"

```tsx
<div>
  {/* Заголовок секции */}
  <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
    <Icons.List className="h-4 w-4 mr-2 text-white" />
    {t('testEditor.answers')} *
  </label>
  
  {/* Сообщение об ошибке выбора правильного ответа */}
  {validationErrors.correctAnswer && (
    <div className="mb-3 flex items-center gap-2 text-red-400 text-sm">
      <Icons.AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{t('testEditor.validation.selectCorrectAnswer')}</span>
    </div>
  )}
  
  {/* Контейнер вариантов */}
  <div className="space-y-4">
    {answers.map((answer, index) => (
      <div key={answer.id}>
        {/* Кнопка переключения версий (если есть) */}
        
        {/* Вариант ответа */}
        <div className="flex items-center gap-3">
          {/* RadioButton */}
          <div className="flex-shrink-0">
            <RadioButton
              id={`answer-${answer.id}`}
              name={`correct-answer-${blockId}`}
              checked={answer.isCorrect}
              onChange={() => handleCorrectToggle(answer.id)}
              label={getAnswerLabel(index)}
            />
          </div>
          
          {/* Поле ввода */}
          <div className="flex-1">
            <TestEditorField
              value={answer.value}
              onChange={(val) => handleAnswerChange(answer.id, val)}
              placeholder={`${t('testEditor.enterAnswer')} ${index + 1}`}
              height={60}
              showResizeHandle={true}
            />
          </div>
        </div>
        
        {/* Сообщение об ошибке варианта */}
        {validationErrors.answers?.[index] && (
          <div className="mt-2 ml-11 flex items-center gap-2 text-red-400 text-xs">
            <Icons.AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{t('testEditor.validation.fillVariant', { label: getAnswerLabel(index) })}</span>
          </div>
        )}
      </div>
    ))}
  </div>
</div>
```

**Контейнер секции**:
- Без дополнительных классов (блок)

**Заголовок секции**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Size**: `text-sm` (14px)
- **Font Weight**: `font-medium` (500)
- **Color**: `text-gray-300` (#D1D5DB - светло-серый)
- **Margin Bottom**: `mb-3` (12px)

**Иконка списка**:
- **Component**: `Icons.List`
- **Size**: `h-4 w-4` (16px × 16px)
- **Margin Right**: `mr-2` (8px)
- **Color**: `text-white` (#FFFFFF - белый)

**Текст**:
- **Content**: "Варианты ответов *" (или перевод)
- **Asterisk**: `*` (обозначает обязательное поле)

**Сообщение об ошибке выбора**:
- **Margin Bottom**: `mb-3` (12px)
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-2` (8px между иконкой и текстом)
- **Color**: `text-red-400` (#F87171 - красный)
- **Size**: `text-sm` (14px)
- **Icon**: `Icons.AlertCircle`
- **Icon Size**: `h-4 w-4` (16px × 16px)
- **Icon Flex**: `flex-shrink-0` (не сжимается)

**Контейнер вариантов**:
- **Spacing**: `space-y-4` (16px вертикальный отступ между вариантами)

**Контейнер одного варианта**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-3` (12px между RadioButton и полем)

**RadioButton контейнер**:
- **Flex**: `flex-shrink-0` (не сжимается)

**RadioButton**:
- **Label**: "А", "Б", "В", "Г" (в зависимости от индекса)
- **Size**: 24px × 24px (кнопка)
- **Checked State**: Белая граница и середина
- **Unchecked State**: Серая граница, прозрачная середина

**Поле ввода контейнер**:
- **Flex**: `flex-1` (занимает оставшееся пространство)

**TestEditorField**:
- **Height**: `60px` (начальная высота)
- **Placeholder**: "Введите ответ 1", "Введите ответ 2", и т.д.
- **Show Resize Handle**: `true` (иконка изменения размера в правом нижнем углу)
- **Has Error**: `validationErrors.answers?.[index]` (красная граница при ошибке)

**Сообщение об ошибке варианта**:
- **Margin Top**: `mt-2` (8px)
- **Margin Left**: `ml-11` (44px - выравнивание с текстом)
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-2` (8px между иконкой и текстом)
- **Color**: `text-red-400` (#F87171 - красный)
- **Size**: `text-xs` (12px)
- **Icon**: `Icons.AlertCircle`
- **Icon Size**: `h-3 w-3` (12px × 12px)
- **Icon Flex**: `flex-shrink-0` (не сжимается)
- **Text**: "Заполните вариант {label}" (например, "Заполните вариант А")

---

### 3.5. Секция "Настройки вопроса"

```tsx
<div className="flex items-center gap-6 pt-4 border-t border-gray-800 flex-wrap">
  {/* Очки за правильный ответ */}
  <div className="flex items-center gap-3">
    <label className="flex items-center text-sm font-medium text-gray-300 whitespace-nowrap">
      <Icons.CircleDot className="h-4 w-4 mr-2 text-white" />
      {t('testEditor.settings.pointsForCorrectAnswer')}
    </label>
    <div className="w-16 [&>div]:!w-16">
      <Input
        type="number"
        min="1"
        value={points}
        onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
        className="!w-16 !h-8 text-sm !px-1"
      />
    </div>
  </div>

  {/* Время на вопрос */}
  <div className="flex items-center gap-3">
    <label className="flex items-center text-sm font-medium text-gray-300 whitespace-nowrap">
      <Icons.Clock className="h-4 w-4 mr-2 text-white" />
      {t('testEditor.settings.timeForQuestion')}
    </label>
    <div className="w-16 [&>div]:!w-16">
      <Input
        type="number"
        min="10"
        value={timeLimit}
        onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
        className="!w-16 !h-8 text-sm !px-1"
      />
    </div>
  </div>
</div>
```

**Контейнер настроек**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-6` (24px между элементами)
- **Padding Top**: `pt-4` (16px сверху)
- **Border Top**: `border-t border-gray-800` (1px серая граница сверху)
- **Flex Wrap**: `flex-wrap` (перенос на новую строку при необходимости)

**Контейнер "Очки"**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-3` (12px между label и input)

**Label "Очки"**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Size**: `text-sm` (14px)
- **Font Weight**: `font-medium` (500)
- **Color**: `text-gray-300` (#D1D5DB - светло-серый)
- **Whitespace**: `whitespace-nowrap` (без переноса текста)

**Иконка очков**:
- **Component**: `Icons.CircleDot`
- **Size**: `h-4 w-4` (16px × 16px)
- **Margin Right**: `mr-2` (8px)
- **Color**: `text-white` (#FFFFFF - белый)

**Текст**:
- **Content**: "Очки за правильный ответ:" (или перевод)

**Input контейнер**:
- **Width**: `w-16` (64px)

**Input**:
- **Type**: `number`
- **Min**: `1`
- **Width**: `!w-16` (64px, !important)
- **Height**: `!h-8` (32px, !important)
- **Size**: `text-sm` (14px)
- **Padding**: `!px-1` (4px слева и справа, !important)

**Контейнер "Время"**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Gap**: `gap-3` (12px между label и input)

**Label "Время"**:
- **Display**: `flex items-center` (flexbox с центрированием)
- **Size**: `text-sm` (14px)
- **Font Weight**: `font-medium` (500)
- **Color**: `text-gray-300` (#D1D5DB - светло-серый)
- **Whitespace**: `whitespace-nowrap` (без переноса текста)

**Иконка времени**:
- **Component**: `Icons.Clock`
- **Size**: `h-4 w-4` (16px × 16px)
- **Margin Right**: `mr-2` (8px)
- **Color**: `text-white` (#FFFFFF - белый)

**Текст**:
- **Content**: "Время на вопрос (сек):" (или перевод)

**Input контейнер**:
- **Width**: `w-16` (64px)

**Input**:
- **Type**: `number`
- **Min**: `10`
- **Width**: `!w-16` (64px, !important)
- **Height**: `!h-8` (32px, !important)
- **Size**: `text-sm` (14px)
- **Padding**: `!px-1` (4px слева и справа, !important)

---

## 4. Плавающие элементы

### 4.1. Плавающая панель инструментов (TestToolbar)

```tsx
<div className="hidden lg:block fixed bottom-4 left-[50%] lg:left-[calc(50%+80px)] -translate-x-1/2 z-50">
  <TestToolbar 
    onFormat={handleFormat} 
    isPreviewMode={getIsPreviewMode()} 
    onImageToLatex={handleOpenImageLatex}
    onMagicWand={handleMagicWand}
  />
</div>
```

**Позиционирование**:
- **Display**: `hidden lg:block` (скрыт на маленьких экранах, виден на больших)
- **Position**: `fixed` (фиксированное позиционирование)
- **Bottom**: `bottom-4` (16px от низа)
- **Left**: `left-[50%]` (50% от левого края на маленьких экранах)
- **Left (lg)**: `lg:left-[calc(50%+80px)]` (50% + 80px на больших экранах)
- **Transform**: `-translate-x-1/2` (центрирование по горизонтали)
- **Z-index**: `z-50` (50 - поверх других элементов)

---

### 4.2. Плавающее меню добавления теста

```tsx
<div className="fixed bottom-4 right-16 z-50">
  <div className="w-16 bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-2xl">
    {/* Кнопка плюс */}
    <button className="flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out w-full transition-colors p-4 rounded-2xl">
      <div className="w-8 h-8 flex items-center justify-center">
        <Icons.Plus className="h-5 w-5 text-gray-300" />
      </div>
    </button>
    
    {/* Меню с типами тестов */}
    <div className="transition-all duration-300 ease-in-out overflow-hidden">
      <div className="p-3 space-y-2">
        {/* Кнопки типов тестов */}
      </div>
    </div>
  </div>
</div>
```

**Позиционирование**:
- **Position**: `fixed` (фиксированное позиционирование)
- **Bottom**: `bottom-4` (16px от низа)
- **Right**: `right-16` (64px от правого края)
- **Z-index**: `z-50` (50 - поверх других элементов)

**Контейнер меню**:
- **Width**: `w-16` (64px)
- **Background**: `bg-[#1a1a1a]` (#1a1a1a - темно-серый)
- **Border**: `border border-gray-700` (1px серая граница)
- **Border Radius**: `rounded-2xl` (16px)
- **Shadow**: `shadow-2xl` (большая тень)

**Кнопка плюс**:
- **Display**: `flex items-center justify-center` (flexbox с центрированием)
- **Overflow**: `overflow-hidden` (скрытие переполнения)
- **Transition**: `transition-all duration-300 ease-in-out` (плавные переходы)
- **Width**: `w-full` (100% ширины)
- **Padding**: `p-4` (16px)
- **Border Radius**: `rounded-2xl` (16px)

**Иконка плюс**:
- **Container**: `w-8 h-8` (32px × 32px)
- **Display**: `flex items-center justify-center` (центрирование)
- **Icon**: `Icons.Plus`
- **Icon Size**: `h-5 w-5` (20px × 20px)
- **Icon Color**: `text-gray-300` (#D1D5DB - светло-серый)

**Меню типов тестов**:
- **Transition**: `transition-all duration-300 ease-in-out` (плавные переходы)
- **Overflow**: `overflow-hidden` (скрытие переполнения)
- **Padding**: `p-3` (12px)
- **Spacing**: `space-y-2` (8px вертикальный отступ между кнопками)

**Кнопки типов тестов**:
- **Width**: `w-10` (40px)
- **Height**: `h-10` (40px)
- **Border Radius**: `rounded-lg` (8px)
- **Display**: `flex items-center justify-center` (центрирование)
- **Margin**: `mx-auto` (горизонтальное центрирование)
- **Transition**: `transition-colors` (плавный переход цвета)
- **Hover**: `hover:bg-{color}-500/20` (фон при наведении)

**Типы тестов**:
1. **М1** (Математика 1)
   - Background: `bg-blue-500/10`
   - Text Color: `text-blue-400`
   - Hover: `hover:bg-blue-500/20`

2. **М2** (Математика 2)
   - Background: `bg-purple-500/10`
   - Text Color: `text-purple-400`
   - Hover: `hover:bg-purple-500/20`

3. **А** (Аналогии)
   - Background: `bg-green-500/10`
   - Text Color: `text-green-400`
   - Hover: `hover:bg-green-500/20`

4. **Ч** (Чтение и понимание)
   - Background: `bg-yellow-500/10`
   - Text Color: `text-yellow-400`
   - Hover: `hover:bg-yellow-500/20`

5. **Г** (Грамматика)
   - Background: `bg-red-500/10`
   - Text Color: `text-red-400`
   - Hover: `hover:bg-red-500/20`

6. **С** (Стандарт)
   - Background: `bg-gray-500/10`
   - Text Color: `text-gray-400`
   - Hover: `hover:bg-gray-500/20`

---

## Итоговая визуальная схема иерархии

```
LessonTestsPage
│
├── div.bg-[#151515].rounded-2xl
│   │
│   └── form.p-8.space-y-8
│       │
│       ├── [Состояние загрузки]
│       │   └── div.flex.flex-col.items-center.justify-center.gap-4.py-12
│       │       ├── Icons.Loader2 (32px, голубой, вращение)
│       │       └── p.text-gray-400.text-sm "Загрузка вопросов..."
│       │
│       ├── [Пустое состояние]
│       │   └── div.space-y-6
│       │       └── div.flex.flex-col.items-center.justify-center.gap-4.py-12
│       │           ├── div.w-16.h-16.rounded-full.bg-gray-800
│       │           │   └── Icons.HelpCircle (32px, серый)
│       │           └── div.text-center
│       │               ├── h3.text-white.font-medium "Пока нет тестов"
│       │               └── p.text-gray-400.text-sm "Нажмите кнопку плюс"
│       │
│       └── [Блоки тестов]
│           ├── [Предупреждение о лимите] (если есть)
│           │   └── div.mb-4.flex.items-center.gap-2
│           │       ├── Icons.AlertTriangle (20px, красный)
│           │       └── p.text-red-400.text-sm
│           │
│           └── div.space-y-6.pb-24
│               └── [TestRACBlock / другие блоки]
│                   │
│                   └── div.bg-[#1a1a1a].rounded-xl.p-6.space-y-6
│                       │
│                       ├── [Заголовок блока]
│                       │   └── div.flex.items-center.justify-between
│                       │       ├── [Левая часть]
│                       │       │   ├── div.w-10.h-10.rounded-lg.bg-yellow-500/10
│                       │       │   │   └── span.text-yellow-400.font-bold "Ч"
│                       │       │   └── div
│                       │       │       ├── h3.text-white.font-medium "Чтение и понимание"
│                       │       │       └── p.text-gray-400.text-sm "Блок вопроса"
│                       │       └── [Правая часть]
│                       │           ├── [AI кнопка / loader]
│                       │           └── button.p-2.hover:bg-gray-800.rounded-lg
│                       │               └── Icons.Trash (20px, серый → красный при hover)
│                       │
│                       ├── [Секция "Вопрос"]
│                       │   └── div
│                       │       ├── div.flex.items-center.justify-between.mb-3
│                       │       │   ├── label.flex.items-center.text-sm.font-medium.text-gray-300
│                       │       │   │   ├── Icons.HelpCircle (16px, белый)
│                       │       │   │   └── "Вопрос *"
│                       │       │   └── [Кнопка переключения версий] (если есть)
│                       │       ├── TestEditorField (height: 150px)
│                       │       └── [Сообщение об ошибке] (если есть)
│                       │           └── div.mt-2.flex.items-center.gap-2.text-red-400.text-sm
│                       │               ├── Icons.AlertCircle (16px, красный)
│                       │               └── "Заполните поле вопроса"
│                       │
│                       ├── [Секция "Варианты ответов"]
│                       │   └── div
│                       │       ├── label.flex.items-center.text-sm.font-medium.text-gray-300.mb-3
│                       │       │   ├── Icons.List (16px, белый)
│                       │       │   └── "Варианты ответов *"
│                       │       ├── [Сообщение об ошибке выбора] (если есть)
│                       │       │   └── div.mb-3.flex.items-center.gap-2.text-red-400.text-sm
│                       │       │       ├── Icons.AlertCircle (16px, красный)
│                       │       │       └── "Выберите правильный ответ"
│                       │       └── div.space-y-4
│                       │           └── [4 варианта ответа]
│                       │               └── div
│                       │                   ├── [Кнопка переключения версий] (если есть)
│                       │                   └── div.flex.items-center.gap-3
│                       │                       ├── div.flex-shrink-0
│                       │                       │   └── RadioButton
│                       │                       │       ├── Круг (24px × 24px)
│                       │                       │       └── Label "А" / "Б" / "В" / "Г"
│                       │                       └── div.flex-1
│                       │                           └── TestEditorField (height: 60px)
│                       │                               └── [Resize handle] (иконка ↘)
│                       │
│                       └── [Секция "Настройки вопроса"]
│                           └── div.flex.items-center.gap-6.pt-4.border-t.border-gray-800.flex-wrap
│                               ├── [Очки]
│                               │   └── div.flex.items-center.gap-3
│                               │       ├── label.flex.items-center.text-sm.font-medium.text-gray-300.whitespace-nowrap
│                               │       │   ├── Icons.CircleDot (16px, белый)
│                               │       │   └── "Очки за правильный ответ:"
│                               │       └── div.w-16
│                               │           └── Input (64px × 32px, number, min: 1)
│                               └── [Время]
│                                   └── div.flex.items-center.gap-3
│                                       ├── label.flex.items-center.text-sm.font-medium.text-gray-300.whitespace-nowrap
│                                       │   ├── Icons.Clock (16px, белый)
│                                       │   └── "Время на вопрос (сек):"
│                                       └── div.w-16
│                                           └── Input (64px × 32px, number, min: 10)
│
├── [Плавающая панель инструментов]
│   └── div.fixed.bottom-4.left-[50%].lg:left-[calc(50%+80px)].-translate-x-1/2.z-50
│       └── TestToolbar
│
└── [Плавающее меню добавления теста]
    └── div.fixed.bottom-4.right-16.z-50
        └── div.w-16.bg-[#1a1a1a].border.border-gray-700.rounded-2xl.shadow-2xl
            ├── button.p-4.rounded-2xl
            │   └── Icons.Plus (20px, серый)
            └── div.p-3.space-y-2
                └── [6 кнопок типов тестов]
                    ├── М1 (синий)
                    ├── М2 (фиолетовый)
                    ├── А (зеленый)
                    ├── Ч (желтый)
                    ├── Г (красный)
                    └── С (серый)
```

---

## Размеры и отступы (сводная таблица)

| Элемент | Размер / Отступ | Значение |
|---------|-----------------|----------|
| **form padding** | `p-8` | 32px |
| **form spacing** | `space-y-8` | 32px |
| **Блок теста padding** | `p-6` | 24px |
| **Блок теста spacing** | `space-y-6` | 24px |
| **Блок теста border radius** | `rounded-xl` | 12px |
| **Иконка типа теста** | `w-10 h-10` | 40px × 40px |
| **Иконка вопроса** | `h-4 w-4` | 16px × 16px |
| **Иконка списка** | `h-4 w-4` | 16px × 16px |
| **Иконка удаления** | `h-5 w-5` | 20px × 20px |
| **Иконка очков/времени** | `h-4 w-4` | 16px × 16px |
| **RadioButton** | `24px × 24px` | 24px × 24px |
| **Поле вопроса height** | `150px` | 150px |
| **Поле ответа height** | `60px` | 60px |
| **Input очков/времени** | `w-16 h-8` | 64px × 32px |
| **Отступ между вариантами** | `space-y-4` | 16px |
| **Отступ между RadioButton и полем** | `gap-3` | 12px |
| **Отступ заголовка секции** | `mb-3` | 12px |
| **Отступ ошибки** | `mt-2` | 8px |
| **Отступ ошибки слева** | `ml-11` | 44px |
| **Отступ настроек сверху** | `pt-4` | 16px |
| **Отступ между настройками** | `gap-6` | 24px |
| **Отступ между label и input** | `gap-3` | 12px |
| **Padding bottom контейнера блоков** | `pb-24` | 96px |

---

## Цветовая схема (сводная таблица)

| Элемент | Цвет | Hex |
|---------|------|-----|
| **Фон корневого контейнера** | `bg-[#151515]` | #151515 |
| **Фон блока теста** | `bg-[#1a1a1a]` | #1a1a1a |
| **Фон меню добавления** | `bg-[#1a1a1a]` | #1a1a1a |
| **Текст заголовка** | `text-white` | #FFFFFF |
| **Текст подзаголовка** | `text-gray-400` | #9CA3AF |
| **Текст label** | `text-gray-300` | #D1D5DB |
| **Текст ошибки** | `text-red-400` | #F87171 |
| **Иконка типа теста (Ч)** | `text-yellow-400` | #FBBF24 |
| **Фон иконки типа теста (Ч)** | `bg-yellow-500/10` | rgba(234, 179, 8, 0.1) |
| **Иконка удаления** | `text-gray-400` → `text-red-400` (hover) | #9CA3AF → #F87171 |
| **Граница настроек** | `border-gray-800` | #1F2937 |
| **Граница меню** | `border-gray-700` | #374151 |

---

## Иконки (сводная таблица)

| Иконка | Компонент | Размер | Цвет | Расположение |
|--------|-----------|--------|------|--------------|
| **Загрузка** | `Icons.Loader2` | 32px × 32px | Голубой (#60A5FA) | Центр (состояние загрузки) |
| **Помощь (пустое)** | `Icons.HelpCircle` | 32px × 32px | Серый (#9CA3AF) | Центр (пустое состояние) |
| **Тип теста** | Буква "Ч" | - | Желтый (#FBBF24) | Заголовок блока |
| **AI объяснение** | `PiSparkle` | 16px × 16px | Фиолетовый | Заголовок блока |
| **Удаление** | `Icons.Trash` | 20px × 20px | Серый → Красный (hover) | Заголовок блока |
| **Вопрос** | `Icons.HelpCircle` | 16px × 16px | Белый (#FFFFFF) | Секция "Вопрос" |
| **Список** | `Icons.List` | 16px × 16px | Белый (#FFFFFF) | Секция "Варианты ответов" |
| **Ошибка** | `Icons.AlertCircle` | 16px × 16px / 12px × 12px | Красный (#F87171) | Под полями с ошибками |
| **Предупреждение** | `Icons.AlertTriangle` | 20px × 20px | Красный (#F87171) | Предупреждение о лимите |
| **Очки** | `Icons.CircleDot` | 16px × 16px | Белый (#FFFFFF) | Секция "Настройки" |
| **Время** | `Icons.Clock` | 16px × 16px | Белый (#FFFFFF) | Секция "Настройки" |
| **Плюс** | `Icons.Plus` | 20px × 20px | Серый (#D1D5DB) | Меню добавления теста |
| **Resize handle** | SVG (↘) | 32px × 32px | Серый (#6B7280) | Правый нижний угол полей ввода |

---

## Тексты (сводная таблица)

| Элемент | Ключ перевода | Текст (ru) |
|---------|---------------|------------|
| **Загрузка** | - | "Загрузка вопросов..." |
| **Пустое состояние заголовок** | `testEditor.noTestsYet` | "Пока нет тестов" |
| **Пустое состояние описание (disabled)** | `testEditor.fillLessonFields` | "Заполните поля урока" |
| **Пустое состояние описание (enabled)** | `testEditor.clickPlusButton` | "Нажмите кнопку плюс" |
| **Тип теста** | `testTypes.rac` | "Чтение и понимание" |
| **Подзаголовок блока** | `testEditor.questionBlock` | "Блок вопроса" |
| **Секция вопроса** | `testEditor.question` | "Вопрос *" |
| **Placeholder вопроса** | `testEditor.enterQuestion` | "Введите вопрос" |
| **Ошибка вопроса** | `testEditor.validation.fillQuestionField` | "Заполните поле вопроса" |
| **Секция ответов** | `testEditor.answers` | "Варианты ответов *" |
| **Placeholder ответа** | `testEditor.enterAnswer` | "Введите ответ {index + 1}" |
| **Ошибка выбора ответа** | `testEditor.validation.selectCorrectAnswer` | "Выберите правильный ответ" |
| **Ошибка варианта** | `testEditor.validation.fillVariant` | "Заполните вариант {label}" |
| **Очки** | `testEditor.settings.pointsForCorrectAnswer` | "Очки за правильный ответ:" |
| **Время** | `testEditor.settings.timeForQuestion` | "Время на вопрос (сек):" |
| **Удаление** | `common.delete` | "Удалить" |
| **Добавление теста** | `common.addTest` | "Добавить тест" |
| **Типы тестов** | `testTypes.math1` / `testTypes.math2` / и т.д. | "Математика 1" / "Математика 2" / и т.д. |

---

## Особенности реализации

1. **Адаптивность**: Плавающая панель инструментов скрыта на маленьких экранах (`hidden lg:block`)
2. **Z-index**: Плавающие элементы имеют `z-50` для отображения поверх контента
3. **Spacing**: Используется система отступов Tailwind (`space-y-*`, `gap-*`)
4. **Цветовая схема**: Темная тема с контрастными акцентами
5. **Иконки**: Используются компоненты из `Icons` и `react-icons`
6. **Типографика**: Размеры шрифтов от `text-xs` (12px) до `text-sm` (14px)
7. **Интерактивность**: Hover эффекты на кнопках и иконках
8. **Валидация**: Визуальная индикация ошибок красным цветом
9. **Анимации**: Плавные переходы для меню и состояний
10. **Доступность**: Правильная структура label/input для screen readers

