/**
 * Утилиты для работы с вариантами ответов
 * Согласно документации answer-variants-sorting.md
 */

export interface AnswerVariant {
  id: string
  value: string
  isCorrect?: boolean
}

/**
 * Сортировка вариантов ответов по ID (CUID)
 * CUID содержит timestamp + counter, гарантирует правильный порядок создания
 * 
 * @param variants Массив вариантов ответов с полем id
 * @returns Отсортированный массив вариантов ответов
 */
export function sortAnswerVariantsByID<T extends { id: string }>(variants: Array<T>): Array<T> {
  return [...variants].sort((a, b) => a.id.localeCompare(b.id))
}

/**
 * Проверяет, правильно ли отсортированы варианты ответов
 * 
 * @param variants Массив вариантов ответов
 * @returns true, если варианты отсортированы по ID в порядке возрастания
 */
export function isAnswerVariantsSorted<T extends { id: string }>(variants: Array<T>): boolean {
  for (let i = 1; i < variants.length; i++) {
    if (variants[i - 1].id.localeCompare(variants[i].id) > 0) {
      return false
    }
  }
  return true
}

/**
 * Получает индекс правильного ответа в отсортированном массиве вариантов
 * 
 * @param variants Отсортированный массив вариантов ответов
 * @param correctVariantId ID правильного варианта ответа
 * @returns Индекс правильного ответа или -1, если не найден
 */
export function getCorrectAnswerIndex<T extends { id: string }>(
  variants: Array<T>, 
  correctVariantId: string
): number {
  return variants.findIndex(variant => variant.id === correctVariantId)
}

/**
 * Получает индексы всех правильных ответов в отсортированном массиве вариантов
 * 
 * @param variants Отсортированный массив вариантов ответов
 * @param correctVariantIds Массив ID правильных вариантов ответов
 * @returns Массив индексов правильных ответов
 */
export function getCorrectAnswerIndices<T extends { id: string }>(
  variants: Array<T>, 
  correctVariantIds: string[]
): number[] {
  return correctVariantIds
    .map(id => variants.findIndex(variant => variant.id === id))
    .filter(index => index !== -1)
}

/**
 * Форматирует варианты ответов для отправки в API
 * Сохраняет порядок элементов в массиве для правильного создания в БД
 * 
 * @param variants Массив вариантов ответов
 * @returns Массив вариантов в правильном порядке для создания
 */
export function formatAnswerVariantsForAPI<T extends { value: string; isCorrect?: boolean }>(
  variants: Array<T>
): Array<{ value: string; isCorrect: boolean }> {
  return variants.map(variant => ({
    value: variant.value.trim(),
    isCorrect: variant.isCorrect || false
  }))
}

/**
 * Создает объект экспорта для внешних сервисов
 * 
 * @param question Текст вопроса
 * @param variants Отсортированный массив вариантов ответов
 * @param correctVariantIds Массив ID правильных ответов
 * @returns Объект для экспорта
 */
export function exportAnswerVariants<T extends { id: string; value: string }>(
  question: string,
  variants: Array<T>,
  correctVariantIds: string[]
) {
  const correctIndices = getCorrectAnswerIndices(variants, correctVariantIds)
  
  return {
    question,
    options: variants.map((variant, index) => ({
      id: variant.id,
      text: variant.value,
      order: index
    })),
    correct_option_indices: correctIndices
  }
}












