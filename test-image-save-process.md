# Куда и как сохраняется изображение при загрузке в вопросе

## Обзор процесса сохранения

Изображение сохраняется в **трех местах**:
1. **S3 хранилище** (физический файл)
2. **localStorage** (временное хранение для редактирования)
3. **База данных** (постоянное хранение URL в таблице `Questions`)

## 1. Сохранение в S3 хранилище

### Путь сохранения

**Для обычных тестов (lesson tests):**
```
bilimpoz/lessons/lesson-test-images/{timestamp}-{randomString}.{extension}
```

**Для пробных тестов (trial tests):**
```
bilimpoz/trial-tests/test-images/{timestamp}-{randomString}.{extension}
```

### Процесс загрузки в S3

**Файл:** `src/lib/s3.ts`

**Функция:** `uploadFileToS3()`

```typescript
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  s3Path: string
): Promise<string> {
  const s3Client = await getS3Client();
  const config = await getS3Config();
  
  // Нормализуем путь
  const normalizedPath = s3Path.replace(/\/+/g, '/');
  const normalizedFileName = fileName.replace(/^\/+/, '');
  const key = `${normalizedPath}/${normalizedFileName}`.replace(/\/+/g, '/');
  
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Публичный доступ для чтения
  });

  await s3Client.send(command);
  return `${config.url}/${config.bucketName}/${key}`;
}
```

### Генерация имени файла

**Файл:** `src/lib/s3.ts`

**Функция:** `generateFileName()`

```typescript
export function generateFileName(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  
  return `${timestamp}-${randomString}.${extension}`;
}
```

**Пример имени файла:**
```
1703123456789-abc123def456.png
```

**Формат:** `{timestamp}-{randomString}.{extension}`

### Полный URL изображения

После загрузки возвращается полный URL:

```
{S3_URL}/{BUCKET_NAME}/bilimpoz/lessons/lesson-test-images/{timestamp}-{randomString}.{extension}
```

**Пример:**
```
https://s3.example.com/bilimpoz-bucket/bilimpoz/lessons/lesson-test-images/1703123456789-abc123def456.png
```

### Настройки S3

Настройки S3 хранятся в базе данных в таблице `Settings`:

- `PRIVATE_S3_URL` - URL S3 хранилища
- `PRIVATE_S3_ACCESS_KEY` - Access Key
- `PRIVATE_S3_SECRET_ACCESS_KEY` - Secret Access Key
- `PRIVATE_BUCKET_NAME` - Имя bucket

**Файл:** `src/lib/s3.ts` (строки 23-65)

```typescript
async function getS3Config(): Promise<S3Config> {
  const [urlSetting, accessKeySetting, secretKeySetting, bucketSetting] = await Promise.all([
    prisma.settings.findUnique({ where: { key: 'PRIVATE_S3_URL' } }),
    prisma.settings.findUnique({ where: { key: 'PRIVATE_S3_ACCESS_KEY' } }),
    prisma.settings.findUnique({ where: { key: 'PRIVATE_S3_SECRET_ACCESS_KEY' } }),
    prisma.settings.findUnique({ where: { key: 'PRIVATE_BUCKET_NAME' } }),
  ]);

  return {
    url: urlSetting.value,
    accessKey: accessKeySetting.value,
    secretAccessKey: secretKeySetting.value,
    bucketName: bucketSetting.value,
  };
}
```

## 2. Сохранение в localStorage

### Когда сохраняется

Изображение сохраняется в localStorage **сразу после загрузки** и при каждом изменении состояния блока теста.

**Файл:** `src/components/dashboard/TestStandardBlock.tsx` (строки 617-627)

```typescript
useEffect(() => {
  if (typeof window !== 'undefined' && blockId) {
    const dataToSave = {
      question,
      answers,
      points,
      timeLimit,
      imageUrl, // ← URL изображения сохраняется здесь
      explanation_ai,
    };
    localStorage.setItem(`${storageKeyPrefix}_${blockId}`, JSON.stringify(dataToSave));
  }
}, [blockId, question, answers, points, timeLimit, imageUrl]);
```

### Ключ localStorage

**Формат ключа:**
```
{storageKeyPrefix}_{blockId}
```

**Примеры:**
- Для обычных тестов: `lessonTest_rac-1234567890`
- Для пробных тестов: `trialGroupTest_rac-1234567890`

### Структура данных в localStorage

```json
{
  "question": "Текст вопроса",
  "answers": [
    { "id": "answer-1", "value": "Вариант А", "isCorrect": false },
    { "id": "answer-2", "value": "Вариант Б", "isCorrect": true }
  ],
  "points": 1,
  "timeLimit": 60,
  "imageUrl": "https://s3.example.com/bilimpoz-bucket/bilimpoz/lessons/lesson-test-images/1703123456789-abc123def456.png",
  "explanation_ai": "Объяснение от AI..."
}
```

### Загрузка из localStorage

При загрузке страницы данные восстанавливаются из localStorage:

**Файл:** `src/components/dashboard/TestStandardBlock.tsx` (строки 104-120)

```typescript
const [imageUrl, setImageUrl] = useState(dataSource?.imageUrl || '');

useEffect(() => {
  if (typeof window !== 'undefined' && blockId && !isFromDB) {
    const saved = localStorage.getItem(`${storageKeyPrefix}_${blockId}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e);
      }
    }
  }
}, [blockId, storageKeyPrefix, isFromDB]);
```

## 3. Сохранение в базу данных

### Таблица Questions

**Схема:** `prisma/schema.prisma` (строки 480-501)

```prisma
model Questions {
  id                   String           @id @default(cuid())
  question             String
  correct_variants_id  String
  photo_url            String?          // ← URL изображения сохраняется здесь
  type_from            QuestionTypeFrom
  type_question        QuestionType
  source_id            String
  points               Int              @default(1)
  language             UserLanguage
  time_limit           Int              @default(60)
  explanation_ai       String?
  created_at           DateTime         @default(now())
  updated_at           DateTime         @updatedAt

  answer_variants   Answer_variants[]
  passed_questions  Passed_questions[]
  duel_questions    Duel_questions[]
  duel_answers      Duel_answers[]

  @@map("questions")
}
```

### Сохранение при создании вопроса

**Файл:** `src/app/api/courses/[courseId]/groups/[groupId]/lessons/[lessonId]/questions/route.ts` (строки 124-137)

```typescript
const question = await prisma.questions.create({
  data: {
    question: questionData.question.trim(),
    correct_variants_id: 'temp',
    photo_url: questionData.imageUrl || null, // ← URL сохраняется здесь
    type_from: 'from_lesson',
    type_question: questionData.type,
    source_id: lessonId,
    points: questionData.points || 1,
    language: courseLanguage,
    time_limit: questionData.timeLimit || 60,
    explanation_ai: questionData.explanation_ai || null
  }
});
```

### Сохранение при обновлении вопроса

**Файл:** `src/app/api/courses/[courseId]/groups/[groupId]/lessons/[lessonId]/questions/route.ts` (строки 250-270)

```typescript
const updatedQuestion = await prisma.questions.update({
  where: { id: questionId },
  data: {
    question: questionData.question.trim(),
    photo_url: questionData.imageUrl || null, // ← URL обновляется здесь
    points: questionData.points || 1,
    time_limit: questionData.timeLimit || 60,
    explanation_ai: questionData.explanation_ai || null
  }
});
```

## Полный цикл сохранения

### Шаг 1: Загрузка изображения

```
Пользователь → Выбирает файл → FileUpload → Валидация → POST /api/upload
```

### Шаг 2: Загрузка в S3

```
API /api/upload → 
  ├─ Валидация файла
  ├─ Генерация имени файла
  ├─ Определение пути в S3
  ├─ Загрузка в S3 (uploadFileToS3)
  └─ Возврат URL изображения
```

### Шаг 3: Сохранение URL в состояние

```
onFileSelect(result.url) → 
  ├─ setImageUrl(url) → Обновление состояния React
  └─ setIsImageModalOpen(false) → Закрытие модального окна
```

### Шаг 4: Сохранение в localStorage

```
useEffect([imageUrl]) → 
  └─ localStorage.setItem(key, JSON.stringify({ ...data, imageUrl }))
```

### Шаг 5: Отображение изображения

```
imageUrl !== '' → 
  └─ Рендеринг <img src={imageUrl} />
```

### Шаг 6: Сохранение в базу данных

```
Пользователь → Сохраняет урок/тест → 
  ├─ collectTestsData() → Сбор данных всех блоков
  ├─ POST /api/.../questions → Отправка на сервер
  ├─ prisma.questions.create/update → Сохранение в БД
  └─ photo_url: imageUrl → URL сохраняется в поле photo_url
```

## Пример полного процесса

### 1. Пользователь загружает изображение

```typescript
// Пользователь выбирает файл: "question-image.png" (340x280px)
// FileUpload валидирует файл
// Файл загружается через POST /api/upload
```

### 2. Генерация имени и пути

```typescript
// Имя файла: "1703123456789-abc123def456.png"
// Путь в S3: "bilimpoz/lessons/lesson-test-images"
// Полный путь: "bilimpoz/lessons/lesson-test-images/1703123456789-abc123def456.png"
```

### 3. Загрузка в S3

```typescript
// S3 URL: "https://s3.example.com"
// Bucket: "bilimpoz-bucket"
// Полный URL: "https://s3.example.com/bilimpoz-bucket/bilimpoz/lessons/lesson-test-images/1703123456789-abc123def456.png"
```

### 4. Сохранение в localStorage

```json
// Ключ: "lessonTest_rac-1234567890"
// Значение:
{
  "question": "Вопрос с изображением",
  "answers": [...],
  "points": 1,
  "timeLimit": 60,
  "imageUrl": "https://s3.example.com/bilimpoz-bucket/bilimpoz/lessons/lesson-test-images/1703123456789-abc123def456.png",
  "explanation_ai": null
}
```

### 5. Сохранение в базу данных

```sql
-- Таблица: questions
INSERT INTO questions (
  id,
  question,
  correct_variants_id,
  photo_url,  -- ← URL сохраняется здесь
  type_from,
  type_question,
  source_id,
  points,
  language,
  time_limit
) VALUES (
  'cm123...',
  'Вопрос с изображением',
  'answer-2',
  'https://s3.example.com/bilimpoz-bucket/bilimpoz/lessons/lesson-test-images/1703123456789-abc123def456.png',
  'from_lesson',
  'standard',
  'lesson-123',
  1,
  'ru',
  60
);
```

## Особенности сохранения

### 1. Автоматическое удаление старого файла

При загрузке нового изображения старое автоматически удаляется из S3:

**Файл:** `src/app/api/upload/route.ts` (строки 131-141)

```typescript
if (oldFileUrl && oldFileUrl.trim()) {
  try {
    await deleteFileFromS3(oldFileUrl);
    console.log('Старый файл успешно удален:', oldFileUrl);
  } catch (error) {
    console.warn('Предупреждение: не удалось удалить старый файл:', error);
  }
}
```

### 2. Публичный доступ к файлам

Все изображения загружаются с правами `ACL: 'public-read'`, что означает, что они доступны по прямой ссылке без авторизации.

### 3. Кэширование настроек S3

Настройки S3 кэшируются в памяти для оптимизации:

**Файл:** `src/lib/s3.ts` (строки 19-20, 25-26)

```typescript
let s3ConfigCache: S3Config | null = null;
let s3ClientCache: S3Client | null = null;

async function getS3Config(): Promise<S3Config> {
  if (s3ConfigCache) {
    return s3ConfigCache; // Возвращаем из кэша
  }
  // ... загрузка из БД
}
```

### 4. Очистка localStorage после сохранения

После успешного сохранения в базу данных localStorage очищается:

**Файл:** `src/app/dashboard/courses/[courseId]/groups/[groupId]/lessons/[lessonId]/edit/page.tsx` (строки 462-463)

```typescript
// Очищаем localStorage после успешного сохранения тестов в БД
testsRef.current.clearLocalStorage();
```

## Структура хранения

### S3 хранилище

```
bilimpoz-bucket/
  └── bilimpoz/
      └── lessons/
          └── lesson-test-images/
              ├── 1703123456789-abc123def456.png
              ├── 1703123457890-def456ghi789.jpg
              └── ...
```

### localStorage

```
Browser Storage:
  ├── lessonTest_rac-1234567890: { question, answers, imageUrl, ... }
  ├── lessonTest_rac-1234567891: { question, answers, imageUrl, ... }
  └── ...
```

### База данных

```
Table: questions
  ├── id: "cm123..."
  ├── question: "Текст вопроса"
  ├── photo_url: "https://s3.example.com/.../image.png"  ← URL изображения
  ├── type_from: "from_lesson"
  └── ...
```

## Резюме

1. **Физический файл** сохраняется в **S3 хранилище** по пути:
   - `bilimpoz/lessons/lesson-test-images/` (для обычных тестов)
   - `bilimpoz/trial-tests/test-images/` (для пробных тестов)

2. **URL изображения** сохраняется в **localStorage** вместе с другими данными блока теста для временного хранения во время редактирования.

3. **URL изображения** сохраняется в **базу данных** в поле `photo_url` таблицы `Questions` при сохранении вопроса.

4. При загрузке нового изображения **старое автоматически удаляется** из S3.

5. Все изображения имеют **публичный доступ** (`ACL: 'public-read'`) и доступны по прямой ссылке.

