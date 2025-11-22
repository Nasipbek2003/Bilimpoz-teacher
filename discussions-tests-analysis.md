# Анализ возможности связи обсуждений с тестами учителя

## Текущая структура БД

### Таблица `Discussions`
```prisma
model Discussions {
  id               String   @id @default(cuid())
  name             String
  lesson_id        String   // ❌ Только связь с уроками
  student_id       String
  summarized_chat  String?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  lesson          Lessons           @relation(fields: [lesson_id], references: [id])
  student         Users             @relation(fields: [student_id], references: [id])
  discussion_chat Discussion_chat[]
}
```

### Таблица `Teacher_tests`
```prisma
model Teacher_tests {
  id          String       @id @default(cuid())
  name        String
  description String
  created_by  String       // ID учителя
  language    UserLanguage
  created_at  DateTime     @default(now())
  updated_at  DateTime     @updatedAt

  creator          Users              @relation(fields: [created_by], references: [id])
  // ❌ Нет связи с Discussions
}
```

## Проблема

**Текущая ситуация:**
- Обсуждения (`Discussions`) связаны **только с уроками** (`lesson_id`)
- Нет поля для связи с тестами учителя (`teacher_test_id`)
- Нет обратной связи в `Teacher_tests` с `Discussions`

## Варианты решения

### ✅ Вариант 1: Добавить опциональное поле `teacher_test_id` (РЕКОМЕНДУЕТСЯ)

**Изменения в схеме:**
```prisma
model Discussions {
  id               String   @id @default(cuid())
  name             String
  lesson_id        String?  // Сделать опциональным
  teacher_test_id  String?  // ДОБАВИТЬ - опциональное
  student_id       String
  summarized_chat  String?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  lesson          Lessons?          @relation(fields: [lesson_id], references: [id])
  teacher_test    Teacher_tests?    @relation(fields: [teacher_test_id], references: [id])  // ДОБАВИТЬ
  student         Users             @relation(fields: [student_id], references: [id])
  discussion_chat Discussion_chat[]
}
```

**В `Teacher_tests` добавить:**
```prisma
model Teacher_tests {
  // ... существующие поля
  discussions     Discussions[]  // ДОБАВИТЬ обратную связь
}
```

**Преимущества:**
- ✅ Гибкость: обсуждения могут быть и по урокам, и по тестам
- ✅ Обратная совместимость: существующие обсуждения по урокам продолжат работать
- ✅ Четкая структура данных
- ✅ Легко фильтровать обсуждения по типу (урок или тест)

**Недостатки:**
- ⚠️ Требуется миграция БД
- ⚠️ Нужно обновить существующие данные (сделать `lesson_id` опциональным)

---

### ⚠️ Вариант 2: Использовать `Passed_materials` для связи

**Идея:** Находить обсуждения через студентов, которые прошли тесты.

**Логика:**
```typescript
// Найти все тесты учителя
const tests = await prisma.teacher_tests.findMany({
  where: { created_by: teacherId }
})

// Найти студентов, которые прошли эти тесты
const passedMaterials = await prisma.passed_materials.findMany({
  where: {
    material_type: 'teacher_test',
    material_id: { in: tests.map(t => t.id) }
  }
})

// Найти обсуждения этих студентов
const discussions = await prisma.discussions.findMany({
  where: {
    student_id: { in: passedMaterials.map(p => p.passed_by) }
  }
})
```

**Преимущества:**
- ✅ Не требует изменения БД
- ✅ Можно реализовать сразу

**Недостатки:**
- ❌ Нет прямой связи обсуждения с тестом
- ❌ Нельзя точно определить, по какому тесту обсуждение
- ❌ Сложная логика фильтрации
- ❌ Нет возможности создать обсуждение для конкретного теста

---

### ❌ Вариант 3: Использовать `lesson_id` для хранения ID теста (НЕ РЕКОМЕНДУЕТСЯ)

**Идея:** Использовать `lesson_id` для хранения ID теста, добавив поле-флаг.

**Проблемы:**
- ❌ Нарушение целостности данных
- ❌ Невозможность использовать внешние ключи
- ❌ Путаница в данных
- ❌ Сложность поддержки

---

## Рекомендация: Вариант 1

### Миграция схемы Prisma

```prisma
// ЧАТЫ И СООБЩЕНИЯ
model Discussions {
  id               String   @id @default(cuid())
  name             String
  lesson_id        String?  // Изменить на опциональное
  teacher_test_id  String?  // ДОБАВИТЬ
  student_id       String
  summarized_chat  String?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  lesson          Lessons?          @relation(fields: [lesson_id], references: [id])
  teacher_test    Teacher_tests?   @relation(fields: [teacher_test_id], references: [id])  // ДОБАВИТЬ
  student         Users            @relation(fields: [student_id], references: [id])
  discussion_chat Discussion_chat[]
  
  // Проверка: либо lesson_id, либо teacher_test_id должен быть заполнен
  @@index([lesson_id])
  @@index([teacher_test_id])
  @@index([student_id])
  @@map("discussions")
}

// ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ
model Teacher_tests {
  id          String       @id @default(cuid())
  name        String
  description String
  created_by  String
  language    UserLanguage
  created_at  DateTime     @default(now())
  updated_at  DateTime     @updatedAt

  creator          Users              @relation(fields: [created_by], references: [id])
  discussions      Discussions[]      // ДОБАВИТЬ обратную связь

  @@map("teacher_tests")
}
```

### SQL миграция

```sql
-- 1. Сделать lesson_id опциональным
ALTER TABLE discussions 
ALTER COLUMN lesson_id DROP NOT NULL;

-- 2. Добавить новое поле teacher_test_id
ALTER TABLE discussions 
ADD COLUMN teacher_test_id TEXT;

-- 3. Добавить внешний ключ
ALTER TABLE discussions 
ADD CONSTRAINT fk_discussions_teacher_test 
FOREIGN KEY (teacher_test_id) 
REFERENCES teacher_tests(id) 
ON DELETE SET NULL;

-- 4. Добавить индексы
CREATE INDEX idx_discussions_teacher_test_id ON discussions(teacher_test_id);
CREATE INDEX idx_discussions_lesson_id ON discussions(lesson_id);
CREATE INDEX idx_discussions_student_id ON discussions(student_id);

-- 5. Добавить проверку: хотя бы одно поле должно быть заполнено
ALTER TABLE discussions 
ADD CONSTRAINT check_discussion_source 
CHECK (lesson_id IS NOT NULL OR teacher_test_id IS NOT NULL);
```

### Изменения в коде

#### 1. API роут получения обсуждений

```typescript
// Получаем обсуждения по тестам учителя
const discussions = await prisma.discussions.findMany({
  where: {
    OR: [
      // Обсуждения по урокам (существующая логика)
      {
        lesson: {
          lesson_group: {
            course: {
              created_by: teacherId
            }
          }
        }
      },
      // Обсуждения по тестам (новая логика)
      {
        teacher_test: {
          created_by: teacherId
        }
      }
    ]
  },
  include: {
    student: { select: { id: true, name: true, profile_photo_url: true } },
    lesson: { select: { id: true, title: true } },
    teacher_test: { select: { id: true, name: true } },  // ДОБАВИТЬ
    discussion_chat: {
      orderBy: { created_at: 'desc' },
      take: 1
    },
    _count: {
      select: { discussion_chat: true }
    }
  },
  orderBy: { updated_at: 'desc' }
})
```

#### 2. Создание обсуждения по тесту

```typescript
// Создание обсуждения для теста
const discussion = await prisma.discussions.create({
  data: {
    name: test.name,
    teacher_test_id: testId,  // Вместо lesson_id
    student_id: studentId
  }
})
```

#### 3. Форматирование данных

```typescript
const formattedDiscussions = discussions.map(discussion => ({
  id: discussion.id,
  name: discussion.name || 
        discussion.lesson?.title || 
        discussion.teacher_test?.name,  // ДОБАВИТЬ
  student: discussion.student.name,
  studentId: discussion.student.id,
  lessonId: discussion.lesson?.id,  // Опционально
  lessonTitle: discussion.lesson?.title,  // Опционально
  testId: discussion.teacher_test?.id,  // ДОБАВИТЬ
  testName: discussion.teacher_test?.name,  // ДОБАВИТЬ
  type: discussion.lesson_id ? 'lesson' : 'test',  // ДОБАВИТЬ тип
  // ... остальные поля
}))
```

## Вывод

### ✅ МОЖНО реализовать, но требуется миграция БД

**Что нужно сделать:**

1. **Обязательно:**
   - Изменить схему Prisma (добавить `teacher_test_id`, сделать `lesson_id` опциональным)
   - Создать миграцию БД
   - Обновить API роуты для работы с тестами
   - Обновить фронтенд для отображения типа обсуждения

2. **Рекомендуется:**
   - Добавить проверку: хотя бы одно поле (`lesson_id` или `teacher_test_id`) должно быть заполнено
   - Добавить индексы для оптимизации запросов
   - Обновить документацию

### ⚠️ Без миграции БД

Можно использовать **Вариант 2** (через `Passed_materials`), но это будет:
- Менее точное решение
- Сложнее в поддержке
- Нет прямой связи обсуждения с тестом

### 🎯 Рекомендация

**Использовать Вариант 1** - добавить поле `teacher_test_id` в таблицу `Discussions`. Это правильное решение с точки зрения архитектуры БД и позволит четко разделять обсуждения по урокам и по тестам.

