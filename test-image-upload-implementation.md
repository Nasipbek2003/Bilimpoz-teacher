# Загрузка изображения в вопросах тестов

## Обзор

Функция загрузки изображения позволяет добавлять изображения к вопросам тестов. Изображения загружаются в S3 хранилище и отображаются в блоке вопроса. Для тестовых изображений действуют строгие требования к размерам: **340x280 пикселей**.

## Расположение в коде

### Основные файлы

1. **Компонент блока теста:** `src/components/dashboard/TestStandardBlock.tsx` (и другие блоки: `TestMath1Block.tsx`, `TestMath2Block.tsx`, `TestRACBlock.tsx`, `TestAnalogyBlock.tsx`, `TestGrammarBlock.tsx`)
2. **Компонент загрузки файлов:** `src/components/ui/FileUpload.tsx`
3. **API endpoint:** `src/app/api/upload/route.ts`
4. **S3 утилиты:** `src/lib/s3.ts`
5. **Локализация:** `src/locales/ru.json`, `src/locales/ky.json`

## Техническая реализация

### 1. Кнопка загрузки изображения

**Расположение:** В заголовке блока теста, справа, перед кнопкой удаления

**Файл:** `src/components/dashboard/TestStandardBlock.tsx` (строки 758-764)

```tsx
<button
  onClick={() => setIsImageModalOpen(true)}
  className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
  data-tooltip={t('testEditor.formatting.addImage')}
>
  <Icons.Image className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
</button>
```

**Стили кнопки:**
- Размер: `p-2` (8px padding)
- Фон при наведении: `hover:bg-gray-800`
- Скругление: `rounded-lg` (8px)
- Переход: `transition-colors` (150ms)
- Иконка: `h-5 w-5` (20px × 20px)
- Цвет иконки: `text-gray-400` → `group-hover:text-blue-400`

### 2. Модальное окно загрузки

**Файл:** `src/components/dashboard/TestStandardBlock.tsx` (строки 1000-1026)

```tsx
{isImageModalOpen && (
  <div 
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
    onClick={() => setIsImageModalOpen(false)}
  >
    <div 
      className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full mx-4" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">
          {t('testEditor.imageModal.imageForTest')}
        </h3>
        <button
          onClick={() => setIsImageModalOpen(false)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Icons.X className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      <FileUpload
        onFileSelect={(url) => {
          setImageUrl(url);
          setIsImageModalOpen(false);
        }}
        fileType={storageKeyPrefix === 'trialGroupTest' ? 'trial-test-image' : 'test-image'}
        accept="image/*"
        maxSize={5 * 1024 * 1024} // 5MB
        currentUrl={imageUrl}
      />
    </div>
  </div>
)}
```

**Стили модального окна:**
- Фон overlay: `bg-black/50` (полупрозрачный черный)
- Позиционирование: `fixed inset-0` (на весь экран)
- Z-index: `z-50` (поверх контента)
- Контейнер: `bg-[#1a1a1a]` (темно-серый фон)
- Скругление: `rounded-xl` (12px)
- Отступы: `p-6` (24px)
- Максимальная ширина: `max-w-md` (448px)

### 3. Компонент FileUpload

**Файл:** `src/components/ui/FileUpload.tsx`

#### Основные функции

**1. Валидация размера файла:**
```typescript
if (file.size > maxSize) {
  const maxSizeMB = Math.round(maxSize / (1024 * 1024));
  setError(`Файл слишком большой. Максимальный размер: ${maxSizeMB}MB`);
  return;
}
```

**2. Валидация типа файла:**
```typescript
const acceptedTypes = accept.split(',').map(type => type.trim());
const isValidType = acceptedTypes.some(type => {
  if (type === 'image/*') {
    return file.type.startsWith('image/');
  }
  // ... другие проверки
});
```

**3. Валидация размеров изображения (для test-image):**
```typescript
if ((fileType === 'test-image' || fileType === 'trial-test-image') && file.type.startsWith('image/')) {
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  
  const dimensionValid = await new Promise<boolean>((resolve) => {
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const isValid = img.width === 340 && img.height === 280;
      if (!isValid) {
        setError(`Изображение должно быть строго 340x280 пикселей. Загружено: ${img.width}x${img.height}px`);
      }
      resolve(isValid);
    };
    img.src = objectUrl;
  });

  if (!dimensionValid) {
    return;
  }
}
```

**4. Загрузка файла:**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('type', fileType);

if (currentUrl && currentUrl.trim()) {
  formData.append('oldFileUrl', currentUrl);
}

const response = await fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
onFileSelect(result.url);
```

#### Визуальная часть FileUpload

**Область загрузки (drag & drop):**
```tsx
<div
  className={`
    relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
    ${dragActive && !currentUrl ? 'border-blue-400 bg-blue-50/10' : 'border-gray-600'}
    ${disabled || isUploading || currentUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-500'}
  `}
  onDragEnter={handleDrag}
  onDragLeave={handleDrag}
  onDragOver={handleDrag}
  onDrop={handleDrop}
  onClick={currentUrl ? undefined : openFileDialog}
>
```

**Состояния:**
1. **Пустое состояние:**
   - Иконка изображения (`Icons.Image`, 48px × 48px)
   - Текст: "Перетащите файл сюда или выберите файл"
   - Подсказка: "PNG, JPG, WEBP (строго 340x280px) до 5MB"

2. **Загрузка:**
   - Спиннер анимации
   - Текст: "Загрузка файла..."

3. **Загружено:**
   - Превью изображения
   - Кнопка удаления (появляется при наведении)

### 4. API Endpoint

**Файл:** `src/app/api/upload/route.ts`

**Процесс загрузки:**

1. **Проверка авторизации:**
```typescript
const authHeader = request.headers.get('authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
}
```

2. **Получение данных:**
```typescript
const formData = await request.formData();
const file = formData.get('file') as File;
const fileType = formData.get('type') as string;
const oldFileUrl = formData.get('oldFileUrl') as string;
```

3. **Валидация:**
   - Проверка наличия файла
   - Проверка типа файла
   - Для `test-image` и `trial-test-image`: проверка размеров 340x280px

4. **Определение пути в S3:**
```typescript
switch (fileType) {
  case 'test-image':
    s3PathType = 'lesson-test-images';
    break;
  case 'trial-test-image':
    s3PathType = 'trial-test-images';
    break;
  // ...
}
```

5. **Удаление старого файла:**
```typescript
if (oldFileUrl && oldFileUrl.trim()) {
  await deleteFileFromS3(oldFileUrl);
}
```

6. **Загрузка в S3:**
```typescript
const s3Path = getS3Path(s3PathType);
const fileName = generateFileName(file.name, '');
const buffer = Buffer.from(arrayBuffer);
const fileUrl = await uploadFileToS3(buffer, fileName, file.type, s3Path);
```

7. **Возврат результата:**
```typescript
return NextResponse.json({
  success: true,
  url: fileUrl,
  fileName: fileName,
  size: file.size,
  type: file.type
});
```

### 5. Отображение изображения

**Файл:** `src/components/dashboard/TestStandardBlock.tsx` (строки 775-793)

```tsx
{!showAIExplanation && imageUrl && (
  <div className="relative w-full max-w-[340px] mx-auto">
    <div 
      className="relative w-full bg-gray-900 rounded-lg overflow-hidden group/image" 
      style={{ height: '280px' }}
    >
      <img 
        src={imageUrl} 
        alt="Test" 
        className="w-full h-full object-contain"
      />
      <button
        onClick={handleDeleteImageClick}
        className="absolute bottom-10 left-2 p-2 bg-gray-800/90 hover:bg-red-600 rounded-lg transition-all opacity-0 group-hover/image:opacity-100"
        data-tooltip={t('testEditor.formatting.deleteImage')}
      >
        <Icons.Trash className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
      </button>
    </div>
  </div>
)}
```

**Стили отображения:**
- Контейнер: `max-w-[340px]` (максимальная ширина 340px)
- Центрирование: `mx-auto` (по центру)
- Фон контейнера: `bg-gray-900` (темно-серый)
- Скругление: `rounded-lg` (8px)
- Высота: `280px` (фиксированная)
- Изображение: `object-contain` (сохраняет пропорции)
- Кнопка удаления: появляется при наведении (`group-hover/image:opacity-100`)

### 6. Удаление изображения

**Файл:** `src/components/dashboard/TestStandardBlock.tsx` (строки 630-660)

**Процесс удаления:**

1. **Клик на кнопку удаления:**
```typescript
const handleDeleteImageClick = () => {
  setShowConfirmDeleteImage(true);
};
```

2. **Подтверждение удаления:**
```tsx
<ConfirmDialog
  isOpen={showConfirmDeleteImage}
  onClose={() => setShowConfirmDeleteImage(false)}
  onConfirm={handleDeleteImage}
  title={t('testEditor.formatting.deleteImageTitle')}
  message={t('testEditor.formatting.deleteImageMessage')}
  confirmText={t('testEditor.formatting.deleteImageConfirm')}
  cancelText={t('common.cancel')}
  variant="danger"
/>
```

3. **Удаление из S3 и очистка состояния:**
```typescript
const handleDeleteImage = async () => {
  if (!imageUrl) return;
  
  try {
    const token = getAuthToken();
    if (token) {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        console.log('Изображение успешно удалено из S3');
      }
    }
  } catch (error) {
    console.error('Ошибка при удалении изображения из S3:', error);
  }
  
  // Очищаем URL в любом случае
  setImageUrl('');
  setShowConfirmDeleteImage(false);
};
```

## Визуальная часть

### Стили кнопки загрузки

| Элемент | CSS класс | Значение | Описание |
|---------|-----------|----------|----------|
| **Кнопка** | `p-2` | `8px` | Внутренние отступы |
| **Кнопка (hover)** | `hover:bg-gray-800` | `#1f2937` | Фон при наведении |
| **Скругление** | `rounded-lg` | `8px` | Радиус скругления |
| **Иконка** | `h-5 w-5` | `20px × 20px` | Размер иконки |
| **Цвет иконки** | `text-gray-400` | `#9ca3af` | Цвет по умолчанию |
| **Цвет иконки (hover)** | `group-hover:text-blue-400` | `#60a5fa` | Цвет при наведении |

### Стили модального окна

| Элемент | CSS класс | Значение | Описание |
|---------|-----------|----------|----------|
| **Overlay** | `bg-black/50` | `rgba(0, 0, 0, 0.5)` | Полупрозрачный фон |
| **Контейнер** | `bg-[#1a1a1a]` | `#1a1a1a` | Фон модального окна |
| **Скругление** | `rounded-xl` | `12px` | Радиус скругления |
| **Отступы** | `p-6` | `24px` | Внутренние отступы |
| **Максимальная ширина** | `max-w-md` | `448px` | Максимальная ширина |

### Стили области загрузки (FileUpload)

| Элемент | CSS класс | Значение | Описание |
|---------|-----------|----------|----------|
| **Рамка** | `border-2 border-dashed` | `2px dashed` | Пунктирная рамка |
| **Рамка (default)** | `border-gray-600` | `#4b5563` | Цвет рамки по умолчанию |
| **Рамка (drag)** | `border-blue-400` | `#60a5fa` | Цвет рамки при перетаскивании |
| **Рамка (hover)** | `hover:border-gray-500` | `#6b7280` | Цвет рамки при наведении |
| **Скругление** | `rounded-lg` | `8px` | Радиус скругления |
| **Отступы** | `p-6` | `24px` | Внутренние отступы |
| **Фон (drag)** | `bg-blue-50/10` | `rgba(239, 246, 255, 0.1)` | Фон при перетаскивании |

### Стили отображения изображения

| Элемент | CSS класс | Значение | Описание |
|---------|-----------|----------|----------|
| **Контейнер** | `max-w-[340px]` | `340px` | Максимальная ширина |
| **Центрирование** | `mx-auto` | `auto` | Центрирование по горизонтали |
| **Фон** | `bg-gray-900` | `#111827` | Фон контейнера |
| **Скругление** | `rounded-lg` | `8px` | Радиус скругления |
| **Высота** | `height: 280px` | `280px` | Фиксированная высота |
| **Изображение** | `object-contain` | - | Сохранение пропорций |
| **Кнопка удаления** | `opacity-0` | `0` | Скрыта по умолчанию |
| **Кнопка удаления (hover)** | `group-hover/image:opacity-100` | `1` | Видна при наведении |
| **Кнопка удаления (фон)** | `bg-gray-800/90` | `rgba(31, 41, 55, 0.9)` | Фон кнопки |
| **Кнопка удаления (hover)** | `hover:bg-red-600` | `#dc2626` | Фон при наведении |

## Полный цикл работы

### 1. Нажатие на кнопку загрузки

```
Пользователь → Клик на иконку изображения → setIsImageModalOpen(true)
```

### 2. Открытие модального окна

```
isImageModalOpen === true → Рендеринг модального окна → Отображение FileUpload
```

### 3. Выбор файла

**Вариант A: Клик на область загрузки**
```
Клик → fileInputRef.current?.click() → Открытие диалога выбора файла
```

**Вариант B: Drag & Drop**
```
Перетаскивание файла → handleDrop() → handleFileSelect(file)
```

### 4. Валидация файла

```
handleFileSelect(file) → 
  ├─ Проверка размера (≤ 5MB)
  ├─ Проверка типа (image/*)
  └─ Проверка размеров (340x280px для test-image)
```

### 5. Загрузка на сервер

```
Валидация успешна → 
  ├─ Создание FormData
  ├─ Добавление файла и типа
  ├─ Добавление oldFileUrl (если есть)
  ├─ POST /api/upload
  ├─ Загрузка в S3
  └─ Получение URL изображения
```

### 6. Обновление состояния

```
onFileSelect(result.url) → 
  ├─ setImageUrl(url)
  └─ setIsImageModalOpen(false)
```

### 7. Отображение изображения

```
imageUrl !== '' && !showAIExplanation → 
  └─ Рендеринг изображения в блоке вопроса
```

### 8. Удаление изображения

```
Клик на кнопку удаления → 
  ├─ handleDeleteImageClick() → setShowConfirmDeleteImage(true)
  ├─ Подтверждение в ConfirmDialog
  ├─ handleDeleteImage() → DELETE /api/upload?url=...
  ├─ Удаление из S3
  └─ setImageUrl('')
```

## Требования к изображению

### Размеры

- **Ширина:** строго **340 пикселей**
- **Высота:** строго **280 пикселей**
- **Соотношение сторон:** ~1.21:1

### Формат

- **PNG** (рекомендуется)
- **JPG/JPEG**
- **WEBP**

### Размер файла

- **Максимум:** 5MB
- **Рекомендуется:** < 1MB для быстрой загрузки

### Валидация

1. **Клиентская валидация:**
   - Проверка размера файла
   - Проверка типа файла
   - Проверка размеров изображения (340x280px)

2. **Серверная валидация:**
   - Повторная проверка типа файла
   - Проверка размера файла
   - Проверка размеров изображения

## Сохранение в localStorage

**Файл:** `src/components/dashboard/TestStandardBlock.tsx` (строки 617-627)

```typescript
useEffect(() => {
  if (typeof window !== 'undefined' && blockId) {
    const data = {
      question,
      answers,
      points,
      timeLimit,
      imageUrl,
    };
    localStorage.setItem(`${storageKeyPrefix}_${blockId}`, JSON.stringify(data));
  }
}, [blockId, question, answers, points, timeLimit, imageUrl]);
```

Изображение сохраняется в localStorage вместе с другими данными блока теста.

## Обработка ошибок

### Типы ошибок

1. **Файл слишком большой:**
   ```
   "Файл слишком большой. Максимальный размер: 5MB"
   ```

2. **Неподдерживаемый тип файла:**
   ```
   "Неподдерживаемый тип файла: {type}"
   ```

3. **Неверные размеры изображения:**
   ```
   "Изображение должно быть строго 340x280 пикселей. Загружено: {width}x{height}px"
   ```

4. **Ошибка загрузки:**
   ```
   "Ошибка загрузки файла"
   ```

5. **Не авторизован:**
   ```
   "Не авторизован" (401)
   ```

### Отображение ошибок

Ошибки отображаются в компоненте `FileUpload`:

```tsx
{error && (
  <div className="flex items-center space-x-2 text-red-400 text-sm">
    <Icons.AlertCircle className="h-4 w-4" />
    <span>{error}</span>
  </div>
)}
```

## Примеры использования

### Пример 1: Загрузка изображения

```typescript
// 1. Пользователь нажимает на кнопку загрузки
onClick={() => setIsImageModalOpen(true)}

// 2. Открывается модальное окно с FileUpload
<FileUpload
  onFileSelect={(url) => {
    setImageUrl(url);
    setIsImageModalOpen(false);
  }}
  fileType="test-image"
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  currentUrl={imageUrl}
/>

// 3. Пользователь выбирает файл
// 4. Файл валидируется
// 5. Файл загружается в S3
// 6. URL сохраняется в imageUrl
// 7. Изображение отображается в блоке
```

### Пример 2: Удаление изображения

```typescript
// 1. Пользователь наводит на изображение
// 2. Появляется кнопка удаления
// 3. Пользователь нажимает на кнопку
onClick={handleDeleteImageClick}

// 4. Открывается ConfirmDialog
<ConfirmDialog
  isOpen={showConfirmDeleteImage}
  onConfirm={handleDeleteImage}
  // ...
/>

// 5. Пользователь подтверждает удаление
// 6. Файл удаляется из S3
// 7. imageUrl очищается
// 8. Изображение исчезает из блока
```

## Особенности реализации

### 1. Скрытие изображения при показе AI объяснения

```tsx
{!showAIExplanation && imageUrl && (
  // Изображение отображается только если не показывается AI объяснение
  <div>...</div>
)}
```

### 2. Автоматическое удаление старого файла

При загрузке нового изображения старое автоматически удаляется из S3:

```typescript
if (oldFileUrl && oldFileUrl.trim()) {
  await deleteFileFromS3(oldFileUrl);
}
```

### 3. Поддержка drag & drop

Компонент `FileUpload` поддерживает перетаскивание файлов:

```typescript
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  
  const files = e.dataTransfer.files;
  if (files && files[0]) {
    handleFileSelect(files[0]);
  }
};
```

### 4. Превью изображения

После загрузки в модальном окне показывается превью:

```tsx
{isImage && (
  <div className="relative inline-block group">
    <img
      src={currentUrl}
      alt="Превью"
      className="max-w-full max-h-32 rounded-lg object-cover"
    />
    <button onClick={handleRemoveClick}>
      <Icons.Trash />
    </button>
  </div>
)}
```

## Заключение

Загрузка изображения в вопросах тестов реализована через:

1. **Кнопку загрузки** в заголовке блока теста
2. **Модальное окно** с компонентом `FileUpload`
3. **Валидацию** размеров (340x280px) и типа файла
4. **API endpoint** `/api/upload` для загрузки в S3
5. **Отображение** изображения в блоке вопроса
6. **Удаление** через подтверждающий диалог

Все изображения сохраняются в S3 хранилище и отображаются с фиксированными размерами 340×280 пикселей.

