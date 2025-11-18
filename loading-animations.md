# Анимации загрузки

Документация всех анимаций загрузки из проекта для использования в других сервисах.

---

## 1. Круглая анимация загрузки с фиолетовыми тенями (Loader Circle)

Красивая анимация вращающегося круга с динамическими фиолетовыми тенями. Используется в кнопках AI-объяснений и других компонентах.

### HTML

```html
<div class="loader-circle"></div>
```

### CSS

```css
.loader-circle {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: transparent;
  animation: loader-combined 2.3s linear infinite;
}

@keyframes loader-combined {
  0% {
    transform: rotate(90deg);
    box-shadow:
      0 2.5px 5px 0 #a78bfa inset,
      0 5px 7.5px 0 #8b5cf6 inset,
      0 15px 15px 0 #7c3aed inset,
      0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
      0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
  }
  25% {
    transform: rotate(180deg);
    box-shadow:
      0 2.5px 5px 0 #c4b5fd inset,
      0 5px 7.5px 0 #a78bfa inset,
      0 15px 15px 0 #8b5cf6 inset,
      0 0 2.4px 1px rgba(167, 139, 250, 0.3),
      0 0 4.8px 1.5px rgba(139, 92, 246, 0.2),
      0 0 7.2px 2.5px rgba(124, 58, 237, 0.15);
  }
  50% {
    transform: rotate(270deg);
    box-shadow:
      0 2.5px 5px 0 #ddd6fe inset,
      0 5px 2.5px 0 #a78bfa inset,
      0 10px 15px 0 #8b5cf6 inset,
      0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
      0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
  }
  75% {
    transform: rotate(360deg);
    box-shadow:
      0 2.5px 5px 0 #c4b5fd inset,
      0 5px 7.5px 0 #a78bfa inset,
      0 15px 15px 0 #8b5cf6 inset,
      0 0 2.4px 1px rgba(167, 139, 250, 0.3),
      0 0 4.8px 1.5px rgba(139, 92, 246, 0.2),
      0 0 7.2px 2.5px rgba(124, 58, 237, 0.15);
  }
  100% {
    transform: rotate(450deg);
    box-shadow:
      0 2.5px 5px 0 #a78bfa inset,
      0 5px 7.5px 0 #8b5cf6 inset,
      0 15px 15px 0 #7c3aed inset,
      0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
      0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
  }
}
```

### React/JSX (с styled-jsx)

```jsx
{isLoading && (
  <>
    <div className="loader-circle"></div>
    <style jsx>{`
      .loader-circle {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
        border-radius: 50%;
        background-color: transparent;
        animation: loader-combined 2.3s linear infinite;
      }
      @keyframes loader-combined {
        0% {
          transform: rotate(90deg);
          box-shadow:
            0 2.5px 5px 0 #a78bfa inset,
            0 5px 7.5px 0 #8b5cf6 inset,
            0 15px 15px 0 #7c3aed inset,
            0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
            0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
        }
        25% {
          transform: rotate(180deg);
          box-shadow:
            0 2.5px 5px 0 #c4b5fd inset,
            0 5px 7.5px 0 #a78bfa inset,
            0 15px 15px 0 #8b5cf6 inset,
            0 0 2.4px 1px rgba(167, 139, 250, 0.3),
            0 0 4.8px 1.5px rgba(139, 92, 246, 0.2),
            0 0 7.2px 2.5px rgba(124, 58, 237, 0.15);
        }
        50% {
          transform: rotate(270deg);
          box-shadow:
            0 2.5px 5px 0 #ddd6fe inset,
            0 5px 2.5px 0 #a78bfa inset,
            0 10px 15px 0 #8b5cf6 inset,
            0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
            0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
        }
        75% {
          transform: rotate(360deg);
          box-shadow:
            0 2.5px 5px 0 #c4b5fd inset,
            0 5px 7.5px 0 #a78bfa inset,
            0 15px 15px 0 #8b5cf6 inset,
            0 0 2.4px 1px rgba(167, 139, 250, 0.3),
            0 0 4.8px 1.5px rgba(139, 92, 246, 0.2),
            0 0 7.2px 2.5px rgba(124, 58, 237, 0.15);
        }
        100% {
          transform: rotate(450deg);
          box-shadow:
            0 2.5px 5px 0 #a78bfa inset,
            0 5px 7.5px 0 #8b5cf6 inset,
            0 15px 15px 0 #7c3aed inset,
            0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
            0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
        }
      }
    `}</style>
  </>
)}
```

### Характеристики

- **Размер**: 28px × 28px
- **Длительность анимации**: 2.3s
- **Тип анимации**: linear infinite
- **Цвета**: Фиолетовая палитра (#a78bfa, #8b5cf6, #7c3aed, #c4b5fd, #ddd6fe)

---

## 2. SVG Спиннер (для кнопок)

Классическая анимация вращающегося SVG спиннера. Используется в компоненте Button.

### HTML

```html
<svg 
  class="animate-spin -ml-1 mr-3 h-5 w-5" 
  xmlns="http://www.w3.org/2000/svg" 
  fill="none" 
  viewBox="0 0 24 24"
>
  <circle 
    class="opacity-25" 
    cx="12" 
    cy="12" 
    r="10" 
    stroke="currentColor" 
    stroke-width="4"
  />
  <path 
    class="opacity-75" 
    fill="currentColor" 
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>
```

### React/JSX

```jsx
{isLoading && (
  <svg 
    className="animate-spin -ml-1 mr-3 h-5 w-5" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)}
```

### CSS (если не используется Tailwind)

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Характеристики

- **Размер**: h-5 w-5 (20px × 20px в Tailwind)
- **Длительность анимации**: 1s
- **Тип анимации**: linear infinite
- **Цвет**: наследуется от `currentColor` (можно настроить через `stroke` и `fill`)

---

## 3. Shimmer анимация (для скелетонов)

Анимация мерцающего эффекта для элементов загрузки (скелетонов).

### CSS

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    #242424 0%,
    #2a2a2a 50%,
    #242424 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### HTML

```html
<div class="animate-shimmer rounded-lg" style="width: 200px; height: 20px;"></div>
```

### React/JSX

```jsx
<div 
  className="animate-shimmer rounded-lg" 
  style={{ width: 200, height: 20 }}
/>
```

### Характеристики

- **Длительность анимации**: 1.5s
- **Тип анимации**: ease-in-out infinite
- **Цвета**: Темная палитра (#242424, #2a2a2a)

---

## 4. Skeleton Pulse анимация

Пульсирующая анимация для скелетонов загрузки.

### CSS

```css
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.skeleton-loading {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
```

### HTML

```html
<div class="skeleton-loading bg-gray-800 rounded-lg" style="width: 200px; height: 20px;"></div>
```

### React/JSX

```jsx
<div 
  className="skeleton-loading bg-gray-800 rounded-lg" 
  style={{ width: 200, height: 20 }}
/>
```

### Характеристики

- **Длительность анимации**: 1.5s
- **Тип анимации**: ease-in-out infinite
- **Эффект**: Изменение прозрачности от 1 до 0.6

---

## 5. Shimmer Overlay анимация

Анимация наложения сияния, движущегося слева направо.

### CSS

```css
@keyframes shimmer-overlay {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer-overlay {
  animation: shimmer-overlay 2s ease-in-out infinite;
}
```

### HTML

```html
<div class="relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-overlay"></div>
</div>
```

### React/JSX

```jsx
<div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-overlay" />
</div>
```

### Характеристики

- **Длительность анимации**: 2s
- **Тип анимации**: ease-in-out infinite
- **Эффект**: Движущееся сияние с градиентом

---

## 6. Компонент Skeleton (React)

Полный компонент скелетона с поддержкой различных вариантов и анимаций.

### React/TypeScript

```tsx
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'wave'
}: SkeletonProps) {
  const baseClasses = 'relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] bg-[length:200%_100%]';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };
  
  const variantClasses = {
    text: 'rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-2xl'
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Эффект сияния поверх */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-overlay" />
    </div>
  );
}

// Специализированные компоненты скелетонов
export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[#151515] rounded-2xl p-6 border border-gray-800/50 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" height={20} width="40%" />
            <Skeleton variant="text" height={16} width="60%" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" height={16} width="100%" />
          <Skeleton variant="text" height={16} width="85%" />
          <Skeleton variant="text" height={16} width="70%" />
        </div>
      </div>
    </div>
  );
}
```

### Использование

```tsx
// Базовое использование
<Skeleton width={200} height={20} />

// Текст
<SkeletonText lines={3} />

// Карточка
<SkeletonCard />

// Круглый
<Skeleton variant="circular" width={48} height={48} />
```

---

## Рекомендации по использованию

### Для кнопок
- Используйте **SVG спиннер** для простых кнопок
- Используйте **Loader Circle** для более выразительных кнопок (особенно AI-функций)

### Для контента
- Используйте **Skeleton компоненты** с анимацией `wave` или `pulse`
- Комбинируйте с **Shimmer Overlay** для дополнительного эффекта

### Производительность
- Все анимации оптимизированы с использованием `transform` и `opacity`
- Используйте `will-change: transform` для сложных анимаций при необходимости

### Кастомизация
- Цвета можно легко изменить через CSS переменные
- Размеры настраиваются через параметры компонентов или CSS классы
- Длительность анимации настраивается через свойство `animation-duration`

---

## Зависимости

- **Tailwind CSS** (для некоторых классов, но можно заменить на чистый CSS)
- **React** (для React компонентов)
- **styled-jsx** (опционально, для scoped стилей)

---

## Браузерная поддержка

Все анимации используют стандартные CSS свойства и поддерживаются во всех современных браузерах:
- Chrome/Edge (последние версии)
- Firefox (последние версии)
- Safari (последние версии)
- Opera (последние версии)

