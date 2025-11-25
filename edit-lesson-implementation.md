# Реализация страницы "Редактировать урок"

Подробное описание реализации, стилей, дизайна и расположения элементов страницы редактирования урока.

---

## Общая структура страницы

### Расположение файла
**Путь**: `src/app/dashboard/courses/[courseId]/groups/[groupId]/lessons/[lessonId]/edit/page.tsx`

### Обертка
```tsx
<DashboardLayout>
  <div className="space-y-6">
    {/* Контент страницы */}
  </div>
</DashboardLayout>
```

**Размеры контейнера**:
- **Отступы между элементами**: `space-y-6` (24px вертикальный отступ)
- **Ширина**: 100% (занимает всю доступную ширину Main Content Area)

---

## 1. Breadcrumbs (Хлебные крошки)

### Расположение
Верхняя часть страницы, сразу после DashboardLayout.

### Структура
```tsx
<Breadcrumbs 
  items={breadcrumbs} 
  onNavigate={handleBreadcrumbNavigation}
/>
```

### Размеры и стили

**Контейнер**:
- **Padding**: `p-4` (16px)
- **Фон**: `bg-[#151515]`
- **Border Radius**: `rounded-lg` (8px)
- **Margin Bottom**: `mb-6` (24px)

**Элементы**:
- **Layout**: Flexbox (`flex items-center gap-2`)
- **Иконка Home**: `h-4 w-4` (16px × 16px), цвет `text-gray-400`
- **Разделитель**: `h-4 w-4` (16px × 16px), цвет `text-gray-600`
- **Текст**: `text-sm` (14px)
- **Цвет неактивных**: `text-gray-400`
- **Цвет активных**: `text-white font-medium`
- **Hover**: `hover:text-white`

**Пример структуры**:
```
Курсы > Название курса > Название группы > Название урока > Редактировать
```

### Код компонента Breadcrumbs

```tsx
<div className="flex items-center gap-2 p-4 bg-[#151515] rounded-lg mb-6">
  <Icons.Home className="h-4 w-4 text-gray-400" />
  <button className="text-gray-400 hover:text-white transition-colors text-sm">
    Курсы
  </button>
  {items.map((item, index) => (
    <div key={index} className="flex items-center gap-2">
      <Icons.ChevronRight className="h-4 w-4 text-gray-600" />
      <div className="flex items-center gap-1">
        {getIcon(item.type)}
        <button className="text-sm transition-colors">
          {item.title}
        </button>
      </div>
    </div>
  ))}
</div>
```

---

## 2. Заголовок и переключатель табов

### Расположение
Сразу после Breadcrumbs.

### Структура

```tsx
<div className="flex items-center justify-between">
  {/* Заголовок */}
  <div>
    <h1 className="text-2xl font-bold text-white">
      {t('lessonEditor.editLesson')}
    </h1>
  </div>
  
  {/* Переключатель табов */}
  <div className="flex space-x-1 bg-[#242424] p-1 rounded-lg">
    {/* Кнопки табов */}
  </div>
</div>
```

### Размеры

**Заголовок (h1)**:
- **Размер шрифта**: `text-2xl` (24px)
- **Вес**: `font-bold`
- **Цвет**: `text-white`

**Контейнер переключателя**:
- **Layout**: Flexbox (`flex space-x-1`)
- **Фон**: `bg-[#242424]`
- **Padding**: `p-1` (4px)
- **Border Radius**: `rounded-lg` (8px)

**Кнопка таба**:
- **Padding**: `px-4 py-2` (16px горизонтально, 8px вертикально)
- **Border Radius**: `rounded-md` (6px)
- **Размер шрифта**: `text-sm` (14px)
- **Вес**: `font-medium`
- **Активное состояние**: `bg-white text-black`
- **Неактивное состояние**: `text-gray-400 hover:text-white`
- **Transition**: `transition-colors`

**Иконки в кнопках**:
- **Размер**: `h-4 w-4` (16px × 16px)
- **Gap**: `gap-2` (8px между иконкой и текстом)

**Бейдж счетчика тестов**:
- **Padding**: `px-2 py-0.5` (8px × 2px)
- **Border Radius**: `rounded-full`
- **Размер шрифта**: `text-xs` (12px)
- **Цвет успеха**: `bg-green-500/20 text-green-400`
- **Цвет ошибки**: `bg-red-500/20 text-red-400`
- **Margin Left**: `ml-1` (4px)

### Код переключателя табов

```tsx
<div className="flex space-x-1 bg-[#242424] p-1 rounded-lg">
  {/* Таб "Урок" */}
  <button
    onClick={() => setActiveTab('lesson')}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeTab === 'lesson'
        ? 'bg-white text-black'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-2">
      <Icons.BookOpen className="h-4 w-4" />
      {t('lessonEditor.tabs.lesson')}
    </div>
  </button>
  
  {/* Таб "Тест" */}
  <button
    onClick={() => setActiveTab('test')}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeTab === 'test'
        ? 'bg-white text-black'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-2">
      <Icons.HelpCircle className="h-4 w-4" />
      {t('lessonEditor.tabs.test')}
      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
        testsCount >= totalQuestions
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-red-500/20 text-red-400'
      }`}>
        {testsCount}/{formData.total_questions}
      </span>
    </div>
  </button>
</div>
```

---

## 3. Форма урока (Таб "Урок")

### Расположение
Показывается только когда `activeTab === 'lesson'`.

### Контейнер формы

```tsx
<div className="bg-[#151515] rounded-2xl">
  <form onSubmit={handleSubmit} className="p-8 space-y-8">
    {/* Секции формы */}
  </form>
</div>
```

**Размеры**:
- **Фон**: `bg-[#151515]`
- **Border Radius**: `rounded-2xl` (16px)
- **Padding формы**: `p-8` (32px)
- **Отступы между секциями**: `space-y-8` (32px)

---

### 3.1. Секция "Основная информация"

#### Заголовок секции

```tsx
<h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-4">
  {t('lessonEditor.basicInfo')}
</h2>
```

**Размеры**:
- **Размер шрифта**: `text-xl` (20px)
- **Вес**: `font-semibold`
- **Цвет**: `text-white`
- **Border**: `border-b border-gray-800` (нижняя граница)
- **Padding Bottom**: `pb-4` (16px)

#### Контейнер полей

```tsx
<div className="space-y-6">
  {/* Поля формы */}
</div>
```

**Отступы**: `space-y-6` (24px между полями)

---

### 3.2. Поле "Название урока"

```tsx
<div ref={titleRef}>
  <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
    <Icons.Type className="h-4 w-4 mr-2 text-white" />
    {t('lessonEditor.lessonTitle')} *
  </label>
  <Input
    type="text"
    value={formData.title}
    onChange={(e) => handleInputChange('title', e.target.value)}
    placeholder={t('lessonEditor.enterTitle')}
    className={errors.title ? 'border-red-500' : ''}
    disabled={isSubmitting}
  />
  {errors.title && (
    <p className="text-red-400 text-sm mt-2">{errors.title}</p>
  )}
</div>
```

**Label**:
- **Layout**: Flexbox (`flex items-center`)
- **Размер шрифта**: `text-sm` (14px)
- **Вес**: `font-medium`
- **Цвет**: `text-gray-300`
- **Margin Bottom**: `mb-3` (12px)
- **Иконка**: `h-4 w-4` (16px × 16px), `mr-2` (8px отступ справа)

**Input компонент**:
- **Ширина**: `w-full` (100%)
- **Padding**: `px-5 py-4` (20px горизонтально, 16px вертикально)
- **Border Radius**: `rounded-xl` (12px)
- **Border**: `border border-gray-600`
- **Фон**: `#0b0b0b`
- **Цвет текста**: `text-white`
- **Placeholder**: `placeholder-gray-400`
- **Focus**: `focus:border-white`
- **Hover**: `hover:border-gray-500`
- **Ошибка**: `border-red-400` или `border-red-500`
- **Transition**: `transition-all duration-300 ease-in-out`

**Сообщение об ошибке**:
- **Цвет**: `text-red-400`
- **Размер**: `text-sm` (14px)
- **Margin Top**: `mt-2` (8px)

---

### 3.3. Поле "Видео урока"

```tsx
<div ref={videoRef}>
  <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
    <Icons.Video className="h-4 w-4 mr-2 text-white" />
    {t('lessonEditor.lessonVideo')} *
  </label>
  
  {/* Превью видео */}
  {formData.video_url && (
    <div className="mb-4 flex justify-center">
      <video
        src={formData.video_url}
        className="w-full max-w-2xl rounded-lg"
        style={{ height: '300px' }}
        controls
      />
    </div>
  )}
  
  <FileUpload
    onFileSelect={(url) => handleInputChange('video_url', url)}
    fileType="lesson-video"
    accept="video/*"
    maxSize={100 * 1024 * 1024} // 100MB
    currentUrl={formData.video_url}
    disabled={isSubmitting}
    className={errors.video_url ? 'border-red-500' : ''}
  />
</div>
```

**Превью видео**:
- **Контейнер**: `mb-4 flex justify-center` (отступ снизу 16px, центрирование)
- **Видео элемент**:
  - **Ширина**: `w-full max-w-2xl` (100%, максимум 672px)
  - **Высота**: `300px` (фиксированная)
  - **Border Radius**: `rounded-lg` (8px)
  - **Controls**: Встроенные элементы управления

**FileUpload компонент**:

**Область загрузки**:
- **Border**: `border-2 border-dashed` (пунктирная граница 2px)
- **Border Radius**: `rounded-lg` (8px)
- **Padding**: `p-6` (24px)
- **Text Align**: `text-center`
- **Цвет границы**: `border-gray-600`
- **Hover**: `hover:border-gray-500`
- **Drag Active**: `border-blue-400 bg-blue-50/10`
- **Disabled**: `opacity-50 cursor-not-allowed`

**Иконка загрузки**:
- **Размер**: `h-12 w-12` (48px × 48px)
- **Цвет**: `text-gray-400`

**Текст**:
- **Основной**: `text-sm text-gray-300` (14px)
- **Вторичный**: `text-xs text-gray-500` (12px)
- **Ссылка**: `text-blue-400 underline`

**Превью загруженного видео**:
- **Контейнер**: `flex items-center justify-between p-4 bg-gray-800 rounded-lg`
- **Иконка**: `h-8 w-8 text-blue-400`
- **Текст**: `text-sm text-gray-300 font-medium` (название), `text-xs text-gray-500` (тип)

**Анимация загрузки**:
- **Spinner**: `animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500`

---

### 3.4. Поле "Материалы лекции" (LectureEditor)

```tsx
<div ref={lectureRef}>
  <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
    <Icons.FileText className="h-4 w-4 mr-2 text-white" />
    {t('lessonEditor.lectureMaterials')} *
  </label>
  <LectureEditor
    value={formData.lecture_content}
    onChange={(value) => handleInputChange('lecture_content', value)}
    placeholder={t('lessonEditor.enterLectureContent')}
    disabled={isSubmitting}
    courseLanguage={_course?.language || 'ru'}
  />
</div>
```

**LectureEditor компонент**:

**Контейнер**:
- **Border**: `border border-[#404040]`
- **Border Radius**: `rounded-lg` (8px)
- **Фон**: `bg-[#0b0b0b]`
- **Overflow**: `overflow-visible`
- **Shadow**: `shadow-lg`

**Редактор (MDEditor)**:
- **Высота**: `h-[500px]` (500px)
- **Фон**: `#0b0b0b`
- **Цвет текста**: `#ffffff`
- **Font Family**: `JetBrains Mono, Fira Code, ui-monospace, ...`
- **Font Size**: `14px`
- **Line Height**: `1.7`
- **Padding**: `20px`
- **Caret Color**: `#ffffff`

**Панель инструментов**:
- **Фон**: Темный
- **Кнопки**: Стандартные кнопки форматирования
- **AI кнопка**: С выпадающим меню

**Статистика (нижняя панель)**:
- **Padding**: `p-4` (16px)
- **Border Top**: `border-t border-[#404040]`
- **Фон**: `bg-[#151515]`
- **Размер шрифта**: `text-sm` (14px)
- **Font Family**: `font-mono`
- **Цвет**: `text-gray-400`
- **Layout**: `flex items-center justify-between`

**Содержимое статистики**:
- **Слева**: "MARKDOWN"
- **Справа**: "{charCount} символов • {wordCount} слов"

---

### 3.5. Поля "Тип урока" и "Тип доступа"

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Тип урока */}
  <div>
    <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
      <Icons.Layers className="h-4 w-4 mr-2 text-white" />
      {t('lessonEditor.lessonType')}
    </label>
    <Select
      value={formData.type}
      onChange={(value) => handleInputChange('type', value)}
      options={[
        { value: 'standard', label: t('lessonEditor.standardLesson') },
        { value: 'practice', label: t('lessonEditor.practiceLesson') }
      ]}
    />
  </div>
  
  {/* Тип доступа */}
  <div>
    <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
      <Icons.Lock className="h-4 w-4 mr-2 text-white" />
      {t('lessonEditor.accessType')}
    </label>
    <Select
      value={formData.access_type}
      onChange={(value) => handleInputChange('access_type', value)}
      options={[
        { value: 'free', label: t('lessonEditor.free') },
        { value: 'paid', label: t('lessonEditor.paid') }
      ]}
    />
  </div>
</div>
```

**Grid контейнер**:
- **Layout**: `grid grid-cols-1 md:grid-cols-2`
  - Мобильные: 1 колонка
  - Десктоп (≥768px): 2 колонки
- **Gap**: `gap-6` (24px между колонками)

**Select компонент**:

**Кнопка триггера**:
- **Ширина**: `w-full`
- **Padding**: `px-3 py-2` (12px × 8px)
- **Фон**: `bg-[#242424]`
- **Border Radius**: `rounded-lg` (8px)
- **Цвет текста**: `text-white` (выбранное) / `text-gray-400` (placeholder)
- **Размер шрифта**: `text-sm` (14px)
- **Focus**: `focus:ring-2 focus:ring-white/20`
- **Layout**: `flex items-center justify-between`

**Иконка стрелки**:
- **Размер**: `h-4 w-4` (16px × 16px)
- **Цвет**: `text-gray-400`
- **Rotation**: `rotate-180` при открытии
- **Transition**: `transition-transform duration-200`

**Выпадающее меню**:
- **Позиция**: `absolute z-50`
- **Ширина**: `w-full`
- **Фон**: `bg-[#242424]`
- **Border**: `border border-gray-700`
- **Border Radius**: `rounded-lg` (8px)
- **Shadow**: `shadow-lg`
- **Max Height**: `max-h-60` (240px)
- **Overflow**: `overflow-y-auto`
- **Отступ**: `mt-1` или `mb-1` (4px) в зависимости от направления

**Опции меню**:
- **Padding**: `px-3 py-2` (12px × 8px)
- **Hover**: `hover:bg-[#363636]`
- **Активная опция**: `bg-[#363636] text-white`
- **Неактивная**: `text-gray-300`
- **Border Radius**: `first:rounded-t-lg last:rounded-b-lg`

---

### 3.6. Секция "Настройки тестирования"

#### Заголовок секции

```tsx
<h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-4">
  {t('lessonEditor.testingSettings')}
</h2>
```

**Стили**: Аналогичны заголовку "Основная информация"

#### Поля настроек

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Общее количество вопросов */}
  <div ref={totalQuestionsRef}>
    <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
      <Icons.Hash className="h-4 w-4 mr-2 text-white" />
      {t('lessonEditor.totalQuestions')}
    </label>
    <Input
      type="number"
      min="1"
      value={formData.total_questions}
      onChange={(e) => handleInputChange('total_questions', ...)}
    />
  </div>
  
  {/* Случайные вопросы */}
  <div ref={randomQuestionsRef}>
    {/* Аналогично */}
  </div>
  
  {/* Количество ошибок */}
  <div ref={mistakeChanceRef}>
    {/* Аналогично */}
  </div>
  
  {/* Баллы за урок */}
  <div ref={lessonPointsRef}>
    {/* Аналогично */}
  </div>
</div>
```

**Grid контейнер**:
- **Layout**: `grid grid-cols-1 md:grid-cols-2` (2 колонки на десктопе)
- **Gap**: `gap-6` (24px)

**Все поля**:
- Используют компонент `Input` с `type="number"`
- Имеют иконки в label
- Поддерживают валидацию с отображением ошибок

---

### 3.7. Кнопки формы

```tsx
<div className="flex gap-4 pt-6 border-t border-gray-800">
  <Button
    type="button"
    variant="outline"
    onClick={handleCancel}
    disabled={isSubmitting}
    className="flex-1 md:flex-none"
  >
    {t('common.cancel')}
  </Button>
  <Button
    type="submit"
    isLoading={isSubmitting}
    disabled={isSubmitting || testsCount < totalQuestions}
    className="flex-1 md:flex-none"
  >
    {isSubmitting ? t('lessonEditor.saving') : t('courseEditor.saveChanges')}
  </Button>
</div>
```

**Контейнер**:
- **Layout**: Flexbox (`flex gap-4`)
- **Padding Top**: `pt-6` (24px)
- **Border Top**: `border-t border-gray-800`
- **Gap**: `gap-4` (16px между кнопками)

**Кнопка "Отмена"**:
- **Variant**: `outline`
- **Ширина**: `flex-1` (мобильные) / `md:flex-none` (десктоп)

**Кнопка "Сохранить"**:
- **Variant**: `primary` (по умолчанию)
- **Loading**: Показывает спиннер при `isLoading={true}`
- **Disabled**: При `isSubmitting` или недостаточном количестве тестов
- **Tooltip**: Показывается при недостаточном количестве тестов

**Button компонент (outline)**:
- **Фон**: `bg-transparent`
- **Цвет текста**: `text-white`
- **Border**: `border border-white`
- **Hover**: `hover:bg-white hover:text-black`
- **Padding**: `px-4 py-2` (16px × 8px)
- **Border Radius**: `rounded-lg` (8px)

**Button компонент (primary)**:
- **Фон**: `bg-white`
- **Цвет текста**: `text-black`
- **Font Weight**: `font-semibold`
- **Hover**: `hover:bg-gray-100 hover:scale-[1.02]`
- **Active**: `active:scale-[0.98]`
- **Shadow**: `shadow-lg hover:shadow-xl`
- **Border**: `border border-white`

---

## 4. Форма теста (Таб "Тест")

### Расположение
Показывается только когда `activeTab === 'test'`.

```tsx
<div style={{ display: activeTab === 'test' ? 'block' : 'none' }}>
  <LessonTestsPage 
    courseLanguage={_course?.language}
    onTestsCountChange={setTestsCount}
    testsRef={testsRef}
    lessonId={lessonId}
    totalQuestions={typeof formData.total_questions === 'number' ? formData.total_questions : undefined}
  />
</div>
```

**Компонент LessonTestsPage**:
- Полнофункциональный редактор тестов
- Поддержка различных типов тестов (Standard, Math1, Math2, Analogy, RAC, Grammar)
- Панель инструментов для форматирования
- AI функции для улучшения текста

---

## 5. Цветовая схема

### Фоны
- **Основной фон страницы**: `#0b0b0b` (через DashboardLayout)
- **Фон карточек/форм**: `#151515`
- **Фон элементов**: `#242424`
- **Фон редактора**: `#0b0b0b`
- **Фон статистики**: `#151515`

### Текст
- **Основной текст**: `#ffffff` (white)
- **Вторичный текст**: `#9ca3af` (gray-400)
- **Третичный текст**: `#6b7280` (gray-500)
- **Label текст**: `#d1d5db` (gray-300)
- **Placeholder**: `#9ca3af` (gray-400)

### Границы
- **Основные границы**: `#4b5563` (gray-600)
- **Границы разделителей**: `#1f2937` (gray-800)
- **Границы элементов**: `#404040`
- **Focus границы**: `#ffffff` (white)
- **Ошибки**: `#ef4444` (red-400/red-500)

### Акцентные цвета
- **Успех**: `#10b981` (green-500) с прозрачностью `/20`
- **Ошибка**: `#ef4444` (red-500) с прозрачностью `/20`
- **Синий (ссылки)**: `#60a5fa` (blue-400)

---

## 6. Типографика

### Заголовки
- **H1 (Заголовок страницы)**: `text-2xl` (24px), `font-bold`
- **H2 (Заголовки секций)**: `text-xl` (20px), `font-semibold`

### Текст
- **Основной текст**: Базовый (16px)
- **Label**: `text-sm` (14px), `font-medium`
- **Ошибки**: `text-sm` (14px)
- **Статистика**: `text-sm` (14px), `font-mono`

### Шрифты
- **Основной**: Системный шрифт
- **Редактор кода**: `JetBrains Mono, Fira Code, ui-monospace, ...`
- **Статистика**: `font-mono` (моноширинный)

---

## 7. Отступы и промежутки

### Вертикальные отступы
- **Между секциями страницы**: `space-y-6` (24px)
- **Между секциями формы**: `space-y-8` (32px)
- **Между полями в секции**: `space-y-6` (24px)
- **Между label и input**: `mb-3` (12px)
- **Между input и ошибкой**: `mt-2` (8px)

### Горизонтальные отступы
- **Padding формы**: `p-8` (32px)
- **Padding полей**: `px-5 py-4` (20px × 16px для Input)
- **Gap в Grid**: `gap-6` (24px)
- **Gap в Flex**: `gap-4` (16px), `gap-2` (8px)

---

## 8. Border Radius

- **Карточки/формы**: `rounded-2xl` (16px)
- **Кнопки**: `rounded-lg` (8px), `rounded-md` (6px), `rounded-xl` (12px)
- **Input поля**: `rounded-xl` (12px)
- **Select**: `rounded-lg` (8px)
- **Breadcrumbs**: `rounded-lg` (8px)
- **Переключатель табов**: `rounded-lg` (8px)

---

## 9. Адаптивность

### Breakpoints

**Мобильные (< 640px)**:
- Grid: `grid-cols-1` (1 колонка)
- Кнопки: `flex-1` (занимают всю ширину)
- Padding формы: `p-4` или `p-6` (уменьшенный)

**Планшеты (640px - 1023px)**:
- Grid: `md:grid-cols-2` (2 колонки)
- Кнопки: `md:flex-none` (автоматическая ширина)

**Десктоп (≥ 1024px)**:
- Полная ширина формы
- Все элементы в 2 колонки где применимо

---

## 10. Интерактивность

### Hover эффекты
- **Кнопки**: Изменение фона и масштаба
- **Ссылки**: Изменение цвета текста
- **Input**: Изменение цвета границы
- **Select**: Изменение фона опций

### Focus состояния
- **Input**: Белая граница (`focus:border-white`)
- **Select**: Кольцо (`focus:ring-2 focus:ring-white/20`)
- **Кнопки**: Кольцо с прозрачностью

### Disabled состояния
- **Opacity**: `opacity-50`
- **Cursor**: `cursor-not-allowed`
- **Визуальная индикация**: Приглушенные цвета

### Transition эффекты
- **Все интерактивные элементы**: `transition-all duration-200` или `duration-300`
- **Кнопки**: `ease-in-out`
- **Select**: `transition-transform duration-200` для иконки

---

## 11. Валидация и ошибки

### Визуальная индикация ошибок

**Input с ошибкой**:
- **Border**: `border-red-400` или `border-red-500`
- **Focus**: `focus:border-red-400`

**Сообщение об ошибке**:
- **Цвет**: `text-red-400`
- **Размер**: `text-sm` (14px)
- **Отступ**: `mt-2` (8px сверху)

**Прокрутка к ошибке**:
- Автоматическая прокрутка к первому полю с ошибкой
- Плавная анимация: `behavior: 'smooth'`
- Центрирование: `block: 'center'`
- Автофокус на поле после прокрутки

---

## 12. Состояния загрузки

### Skeleton (при загрузке данных)

```tsx
<DashboardLayout>
  <LessonFormSkeleton />
</DashboardLayout>
```

**Компонент**: `src/components/skeletons/LessonFormSkeleton.tsx`

### Состояние отправки

**Кнопка "Сохранить"**:
- **isLoading**: Показывает спиннер
- **Disabled**: Блокирует повторную отправку
- **Текст**: Меняется на "Сохранение..."

---

## 13. Модальные окна и диалоги

### Toast уведомления

**Успех**:
- **Тип**: `success`
- **Цвет иконки**: Зеленый
- **Длительность**: 5000ms

**Ошибка**:
- **Тип**: `error`
- **Цвет иконки**: Красный
- **Длительность**: 5000ms

### ConfirmDialog (для удаления файлов)

**Стили**:
- **Фон overlay**: `bg-black/50 backdrop-blur-sm`
- **Контейнер**: `bg-[#151515] rounded-2xl`
- **Z-index**: `z-50`

---

## 14. Пример полной структуры в пикселях

### Десктоп (1920px ширина)

```
┌─────────────────────────────────────────────────────────────┐
│ DashboardLayout                                             │
│ Padding: 24px                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Breadcrumbs (высота: ~48px)                             │ │
│ │ Padding: 16px, Margin bottom: 24px                      │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Заголовок + Табы (высота: ~60px)                       │ │
│ │ Flex justify-between                                    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Форма урока (высота: переменная)                        │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Padding: 32px                                       │ │ │
│ │ │ ┌─────────────────────────────────────────────────┐ │ │ │
│ │ │ │ Основная информация                             │ │ │ │
│ │ │ │ ┌───────────────────────────────────────────────┐│ │ │ │
│ │ │ │ │ Название урока                               ││ │ │ │
│ │ │ │ │ Label: 14px, Margin bottom: 12px            ││ │ │ │
│ │ │ │ │ Input: Padding 20px×16px, Height: ~48px      ││ │ │ │
│ │ │ │ └───────────────────────────────────────────────┘│ │ │ │
│ │ │ │ ┌───────────────────────────────────────────────┐│ │ │ │
│ │ │ │ │ Видео урока                                  ││ │ │ │
│ │ │ │ │ Превью: 300px высота, max-width: 672px      ││ │ │ │
│ │ │ │ │ FileUpload: Padding 24px                     ││ │ │ │
│ │ │ │ └───────────────────────────────────────────────┘│ │ │ │
│ │ │ │ ┌───────────────────────────────────────────────┐│ │ │ │
│ │ │ │ │ Материалы лекции                             ││ │ │ │
│ │ │ │ │ Editor: 500px высота                         ││ │ │ │
│ │ │ │ └───────────────────────────────────────────────┘│ │ │ │
│ │ │ │ ┌───────────────────────────────────────────────┐│ │ │ │
│ │ │ │ │ Тип урока | Тип доступа (Grid 2 колонки)    ││ │ │ │
│ │ │ │ │ Gap: 24px                                    ││ │ │ │
│ │ │ │ └───────────────────────────────────────────────┘│ │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │ │
│ │ │ ┌─────────────────────────────────────────────────┐ │ │ │
│ │ │ │ Настройки тестирования                         │ │ │ │
│ │ │ │ Grid 2 колонки, Gap: 24px                      │ │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │ │
│ │ │ ┌─────────────────────────────────────────────────┐ │ │ │
│ │ │ │ Кнопки (Padding top: 24px, Gap: 16px)          │ │ │ │
│ │ │ └─────────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Форма теста (при активном табе "Тест")                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ LessonTestsPage                                         │ │
│ │ (Полнофункциональный редактор тестов)                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 15. Итоговая таблица размеров

| Элемент | Ширина | Высота | Padding | Margin | Gap |
|---------|--------|--------|---------|--------|-----|
| Breadcrumbs | 100% | ~48px | 16px | mb-6 (24px) | 8px |
| Заголовок H1 | auto | auto | - | - | - |
| Переключатель табов | auto | ~40px | 4px | - | 4px |
| Кнопка таба | auto | auto | 16px×8px | - | 8px |
| Форма контейнер | 100% | auto | 32px | - | 32px |
| Заголовок секции | 100% | auto | pb-4 (16px) | - | - |
| Label | 100% | auto | - | mb-3 (12px) | 8px |
| Input | 100% | ~48px | 20px×16px | - | - |
| Select trigger | 100% | ~40px | 12px×8px | - | - |
| Select dropdown | 100% | max 240px | - | 4px | - |
| FileUpload area | 100% | auto | 24px | - | - |
| LectureEditor | 100% | 500px | - | - | - |
| Grid контейнер | 100% | auto | - | - | 24px |
| Кнопки контейнер | 100% | auto | pt-6 (24px) | - | 16px |
| Button | auto | auto | 16px×8px | - | - |

---

## 16. Специальные функции

### Автопрокрутка к ошибкам

```typescript
const scrollToError = (errors: LessonFormErrors) => {
  const errorFieldMap = {
    title: titleRef,
    video_url: videoRef,
    // ... другие поля
  };
  
  for (const field of errorFields) {
    if (errors[field]) {
      const ref = errorFieldMap[field];
      if (ref?.current) {
        ref.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        setTimeout(() => {
          const input = ref.current?.querySelector('input, textarea');
          if (input) {
            (input as HTMLElement).focus();
          }
        }, 500);
        break;
      }
    }
  }
};
```

### Валидация связанных полей

**total_questions и random_questions**:
- При изменении `total_questions` автоматически корректируется `random_questions`, если оно больше
- При вводе `random_questions` блокируется значение, превышающее `total_questions`
- Показывается предупреждение при попытке ввести недопустимое значение

### Синхронизация с URL

**Табы**:
- Состояние таба синхронизируется с URL параметром `?tab=lesson` или `?tab=test`
- При изменении таба обновляется URL без перезагрузки страницы
- При загрузке страницы активный таб определяется из URL

---

## 17. Зависимости компонентов

### Основные компоненты
- `DashboardLayout` - обертка страницы
- `Breadcrumbs` - навигация
- `Input` - текстовые поля
- `Select` - выпадающие списки
- `FileUpload` - загрузка файлов
- `LectureEditor` - редактор Markdown
- `Button` - кнопки
- `LessonTestsPage` - редактор тестов

### Хуки
- `useTranslation` - переводы
- `useToast` - уведомления
- `useAI` - AI функции (в LectureEditor)

---

## 18. API запросы

### Загрузка данных урока
- **GET** `/api/courses/${courseId}` - получение курса с группами и уроками
- **GET** `/api/lectures/content?url=...` - получение содержимого лекции из S3

### Сохранение данных
- **PUT** `/api/courses/${courseId}/groups/${groupId}/lessons/${lessonId}` - обновление урока
- **POST** `/api/lectures/upload` - загрузка содержимого лекции в S3
- **POST** `/api/courses/${courseId}/groups/${groupId}/lessons/${lessonId}/questions` - сохранение тестов

---

## 19. Локальное хранилище

### Использование localStorage
- **Тесты**: `lessonTests_blocks_${lessonId}` - список блоков тестов
- **Данные тестов**: `lessonTest_${blockId}_*` - данные каждого блока
- **История улучшений**: `improvement_history_${blockId}` - история AI улучшений

### Очистка
- Автоматическая очистка после успешного сохранения в БД
- Ручная очистка при удалении блоков

---

## 20. Обработка ошибок

### Типы ошибок
1. **Ошибки валидации** - отображаются под полями
2. **Ошибки загрузки** - показываются через Toast
3. **Ошибки сети** - обрабатываются в catch блоках
4. **Ошибки API** - логируются в консоль и показываются пользователю

### Визуальная индикация
- Красная граница у полей с ошибками
- Сообщения об ошибках под полями
- Toast уведомления для критических ошибок

---

## 21. Производительность

### Оптимизации
- **Suspense** для асинхронной загрузки
- **useCallback** для функций обработчиков
- **useRef** для хранения данных без ре-рендеров
- **Локальное кэширование** в localStorage

### Ленивая загрузка
- Компоненты загружаются только при необходимости
- Тесты загружаются только при переключении на таб "Тест"

---

## 22. Доступность (Accessibility)

### ARIA атрибуты
- **Labels** связаны с полями через `htmlFor` и `id`
- **Кнопки** имеют описательные тексты
- **Ошибки** связаны с полями через `aria-describedby`

### Клавиатурная навигация
- Tab порядок соответствует визуальному порядку
- Enter отправляет форму
- Escape закрывает модальные окна

---

## 23. Рекомендации по использованию

### Для разработчиков
1. Все поля формы должны иметь ref для прокрутки к ошибкам
2. Валидация выполняется перед отправкой
3. Состояние загрузки блокирует повторную отправку
4. URL синхронизируется с состоянием табов

### Для дизайнеров
1. Используется темная цветовая схема
2. Все элементы имеют плавные переходы
3. Ошибки визуально выделяются красным цветом
4. Успешные действия подтверждаются Toast уведомлениями

---

## 24. Технические детали

### Ограничения
- **Максимальный размер видео**: 100MB
- **Максимальная длина текста**: Зависит от API
- **Количество тестов**: Ограничено `total_questions`

### Браузерная поддержка
- Все современные браузеры
- Требуется поддержка ES6+
- Требуется поддержка CSS Grid и Flexbox

### Производительность
- Оптимизированные ре-рендеры через React.memo где необходимо
- Виртуализация для больших списков (если применимо)
- Ленивая загрузка компонентов

