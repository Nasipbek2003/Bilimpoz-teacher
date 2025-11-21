'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'
import Input from '@/components/ui/Input'
import Select, { SelectOption } from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Toast, { ToastVariant } from '@/components/ui/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import { generateTempId } from '@/lib/test-storage'

export type TestSectionType = 'math1' | 'math2' | 'analogy' | 'rac' | 'grammar' | 'standard'

interface CreateTestModalProps {
  isOpen: boolean
  onClose: () => void
  teacherId: string
}

interface TestSectionInfo {
  value: TestSectionType
  label: string
  description: string
}

const CreateTestModal: React.FC<CreateTestModalProps> = ({
  isOpen,
  onClose,
  teacherId
}) => {
  const { t, ready } = useTranslation()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const [section, setSection] = useState<TestSectionType | ''>('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState<'ru' | 'kg'>('ru')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; variant: ToastVariant }>({
    isOpen: false,
    message: '',
    variant: 'success'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Загружаем язык из localStorage при открытии
  useEffect(() => {
    if (isOpen && mounted) {
      const savedLanguage = localStorage.getItem('i18nextLng')
      if (savedLanguage === 'ky' || savedLanguage === 'kg') {
        setLanguage('kg')
      } else {
        setLanguage('ru')
      }
    }
  }, [isOpen, mounted])

  // Сбрасываем форму при открытии/закрытии
  useEffect(() => {
    if (!isOpen) {
      // При закрытии сбрасываем все кроме языка
      setSection('')
      setDescription('')
      setErrors({})
    }
  }, [isOpen])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    const translation = t(key)
    return translation === key ? fallback : translation
  }

  // Опции разделов теста с описаниями
  const sectionOptions: TestSectionInfo[] = useMemo(() => {
    if (!mounted || !ready) return []
    return [
      {
        value: 'math1',
        label: getText('tests.types.math1Full', 'Математика 1'),
        description: getText('tests.sections.math1Description', 'Сравнение величин. Варианты А и Б - поля ввода, В и Г - фиксированные.')
      },
      {
        value: 'math2',
        label: getText('tests.types.math2Full', 'Математика 2'),
        description: getText('tests.sections.math2Description', 'Математические задачи. 4 фиксированных варианта ответа.')
      },
      {
        value: 'analogy',
        label: getText('tests.types.analogyFull', 'Аналогия'),
        description: getText('tests.sections.analogyDescription', 'Логические тесты и закономерности. 4 фиксированных варианта (А, Б, В, Г).')
      },
      {
        value: 'rac',
        label: getText('tests.types.racFull', 'Чтение и понимание'),
        description: getText('tests.sections.racDescription', 'Тесты на чтение и понимание текста. 4 фиксированных варианта ответа.')
      },
      {
        value: 'grammar',
        label: getText('tests.types.grammarFull', 'Грамматика'),
        description: getText('tests.sections.grammarDescription', 'Тесты по языку и грамматике. 4 фиксированных варианта (А, Б, В, Г).')
      },
      {
        value: 'standard',
        label: getText('tests.types.standardFull', 'Стандартный'),
        description: getText('tests.sections.standardDescription', 'Универсальные тесты. 2-10+ динамических вариантов ответа.')
      }
    ]
  }, [t, mounted, ready, getText])

  const languageOptions: SelectOption[] = useMemo(() => {
    if (!mounted || !ready) return []
    return [
      { value: 'ru', label: getText('tests.russian', 'Русский') },
      { value: 'kg', label: getText('tests.kyrgyz', 'Кыргызский') }
    ]
  }, [t, mounted, ready, getText])

  const selectOptions: SelectOption[] = useMemo(() => {
    return sectionOptions.map(opt => ({ value: opt.value, label: opt.label }))
  }, [sectionOptions])

  const selectedSectionInfo = sectionOptions.find(opt => opt.value === section)

  // Валидация
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!section) {
      newErrors.section = getText('tests.createModal.sectionRequired', 'Раздел теста обязателен для заполнения')
    }

    if (!description.trim()) {
      newErrors.description = getText('tests.createModal.descriptionRequired', 'Описание обязательно для заполнения')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Сохранение языка в localStorage
  const handleLanguageChange = (value: string) => {
    const newLanguage = value as 'ru' | 'kg'
    setLanguage(newLanguage)
    // Сохраняем в localStorage
    localStorage.setItem('i18nextLng', newLanguage === 'kg' ? 'ky' : 'ru')
  }

  // Обработка создания теста
  const handleCreate = () => {
    if (!validate()) {
      return
    }

    if (!teacherId) {
      setToast({
        isOpen: true,
        message: getText('tests.authRequired', 'Необходима авторизация'),
        variant: 'error'
      })
      return
    }

    try {
      const tempTestId = generateTempId()
      
      // НЕ сохраняем в localStorage при создании
      // Сохранение произойдет только после нажатия кнопки "Сохранить" в редакторе
      
      // Показываем уведомление о создании теста
      setToast({
        isOpen: true,
        message: getText('tests.testCreated', 'Тест успешно создан'),
        variant: 'success'
      })
      
      // Закрываем модал
      onClose()
      
      // Переход в редактор с небольшой задержкой для показа уведомления
      // Передаем параметры через URL или state для инициализации теста
      setTimeout(() => {
        // Передаем данные теста через URL параметры или используем sessionStorage для временного хранения
        const testData = {
          id: tempTestId,
          name: selectedSectionInfo?.label || getText('tests.newTestName', 'Новый тест'),
          description: description.trim(),
          language: language,
          section: section as TestSectionType,
          teacherId: teacherId
        }
        // Используем sessionStorage для передачи данных между страницами
        sessionStorage.setItem(`temp_test_${tempTestId}`, JSON.stringify(testData))
        router.push(`/tests/${tempTestId}`)
      }, 500)
    } catch (error) {
      console.error('Ошибка создания теста:', error)
      setToast({
        isOpen: true,
        message: getText('tests.createError', 'Ошибка при создании теста') + ': ' + (error instanceof Error ? error.message : String(error)),
        variant: 'error'
      })
    }
  }

  // Обработка отмены - сброс полей кроме языка
  const handleCancel = () => {
    setSection('')
    setDescription('')
    setErrors({})
    onClose()
  }

  // Очистка ошибок при изменении полей
  const handleSectionChange = (value: string) => {
    setSection(value as TestSectionType)
    if (errors.section) {
      setErrors({ ...errors, section: '' })
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    if (errors.description) {
      setErrors({ ...errors, description: '' })
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel()
        }
      }}
    >
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[var(--border-primary)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {getText('tests.createModal.title', 'Создать новый тест')}
          </h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          >
            <Icons.X className="h-5 w-5 text-[var(--text-tertiary)]" />
          </button>
        </div>

        {/* Форма */}
        <div className="p-6 space-y-6">
          {/* Раздел теста */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {getText('tests.createModal.section', 'Раздел теста')} <span className="text-red-400">*</span>
            </label>
            <Select
              value={section}
              onChange={handleSectionChange}
              options={selectOptions}
              placeholder={getText('tests.createModal.sectionPlaceholder', 'Выберите раздел теста')}
              error={!!errors.section}
            />
            {errors.section && (
              <p className="text-sm text-red-400 mt-1">{errors.section}</p>
            )}
            {/* Краткое описание при выборе */}
            {selectedSectionInfo && (
              <div className="mt-2 p-3 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]">
                <p className="text-sm text-[var(--text-secondary)]">
                  {selectedSectionInfo.description}
                </p>
              </div>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {getText('tests.createModal.description', 'Описание')} <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder={getText('tests.createModal.descriptionPlaceholder', 'Введите описание теста')}
              rows={4}
              className={`
                w-full px-4 py-3 rounded-xl border text-sm
                bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
                focus:outline-none transition-all duration-300 ease-in-out resize-none
                ${errors.description 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)] focus:border-[var(--accent-primary)]'
                }
              `}
            />
            {errors.description && (
              <p className="text-sm text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Язык */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {getText('tests.createModal.language', 'Язык')} <span className="text-red-400">*</span>
            </label>
            <Select
              value={language}
              onChange={handleLanguageChange}
              options={languageOptions}
              placeholder={getText('tests.createModal.languagePlaceholder', 'Выберите язык')}
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-primary)]">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              {getText('common.cancel', 'Отмена')}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleCreate}
            >
              {getText('tests.createModal.createButton', 'Создать')}
            </Button>
          </div>
        </div>
      </div>

      {/* Toast уведомления */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        variant={toast.variant}
        duration={4000}
      />
    </div>
  )
}

export default CreateTestModal

