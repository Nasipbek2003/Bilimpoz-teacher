# Анимация загрузки ИИ в SVG формате

## Описание

Анимация загрузки используется в сервисе для отображения процесса работы с ИИ (улучшение текста, генерация объяснений и т.д.). Анимация представляет собой вращающийся круг с эффектом свечения в фиолетовых тонах.

## Исходная CSS реализация

Анимация реализована через CSS с использованием `box-shadow` и `transform: rotate`:

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

## Цветовая палитра

- `#a78bfa` - фиолетовый (violet-400)
- `#8b5cf6` - фиолетовый (violet-500)
- `#7c3aed` - фиолетовый (violet-600)
- `#c4b5fd` - фиолетовый (violet-300)
- `#ddd6fe` - фиолетовый (violet-200)

## SVG версия анимации

### Вариант 1: Вращающийся круг с градиентом

```svg
<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Радиальный градиент для внутреннего свечения -->
    <radialGradient id="glow-gradient" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.8">
        <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="2.3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.6">
        <animate attributeName="stop-opacity" values="0.6;0.8;0.6" dur="2.3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.4">
        <animate attributeName="stop-opacity" values="0.4;0.6;0.4" dur="2.3s" repeatCount="indefinite"/>
      </stop>
    </radialGradient>
    
    <!-- Градиент для внешнего свечения -->
    <radialGradient id="outer-glow" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#c4b5fd" stop-opacity="0.3">
        <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="2.3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <!-- Внешнее свечение -->
  <circle cx="14" cy="14" r="14" fill="url(#outer-glow)"/>
  
  <!-- Основной вращающийся круг -->
  <circle 
    cx="14" 
    cy="14" 
    r="12" 
    fill="url(#glow-gradient)" 
    opacity="0.9">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="90 14 14"
      to="450 14 14"
      dur="2.3s"
      repeatCount="indefinite"/>
  </circle>
  
  <!-- Внутренний круг для эффекта глубины -->
  <circle 
    cx="14" 
    cy="14" 
    r="8" 
    fill="#7c3aed" 
    opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2.3s" repeatCount="indefinite"/>
  </circle>
</svg>
```

### Вариант 2: Вращающийся круг с пульсирующим свечением

```svg
<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Радиальный градиент с анимацией -->
    <radialGradient id="pulse-glow" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#a78bfa">
        <animate attributeName="stop-color" 
                 values="#a78bfa;#c4b5fd;#ddd6fe;#c4b5fd;#a78bfa" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="#8b5cf6">
        <animate attributeName="stop-color" 
                 values="#8b5cf6;#a78bfa;#c4b5fd;#a78bfa;#8b5cf6" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#7c3aed">
        <animate attributeName="stop-color" 
                 values="#7c3aed;#8b5cf6;#a78bfa;#8b5cf6;#7c3aed" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
    </radialGradient>
    
    <!-- Фильтр свечения -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Вращающийся круг с градиентом -->
  <circle 
    cx="14" 
    cy="14" 
    r="12" 
    fill="url(#pulse-glow)" 
    filter="url(#glow)"
    opacity="0.9">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="90 14 14"
      to="450 14 14"
      dur="2.3s"
      repeatCount="indefinite"/>
    <animate
      attributeName="opacity"
      values="0.9;1;0.9;0.8;0.9"
      dur="2.3s"
      repeatCount="indefinite"/>
  </circle>
  
  <!-- Внутренний круг -->
  <circle 
    cx="14" 
    cy="14" 
    r="6" 
    fill="#7c3aed" 
    opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.6;0.4" dur="2.3s" repeatCount="indefinite"/>
  </circle>
</svg>
```

### Вариант 3: Многослойный эффект с точным соответствием CSS

```svg
<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Градиент для слоя 1 (внутренний) -->
    <radialGradient id="layer1" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.8">
        <animate attributeName="stop-color" 
                 values="#a78bfa;#c4b5fd;#ddd6fe;#c4b5fd;#a78bfa" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.6">
        <animate attributeName="stop-color" 
                 values="#8b5cf6;#a78bfa;#c4b5fd;#a78bfa;#8b5cf6" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
    </radialGradient>
    
    <!-- Градиент для слоя 2 (средний) -->
    <radialGradient id="layer2" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.7">
        <animate attributeName="stop-color" 
                 values="#8b5cf6;#a78bfa;#ddd6fe;#a78bfa;#8b5cf6" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.5">
        <animate attributeName="stop-color" 
                 values="#7c3aed;#8b5cf6;#a78bfa;#8b5cf6;#7c3aed" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
    </radialGradient>
    
    <!-- Градиент для слоя 3 (внешний) -->
    <radialGradient id="layer3" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.6">
        <animate attributeName="stop-color" 
                 values="#7c3aed;#8b5cf6;#a78bfa;#8b5cf6;#7c3aed" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    
    <!-- Фильтр размытия для внешнего свечения -->
    <filter id="blur-glow">
      <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Слой 3: Внешнее свечение -->
  <circle 
    cx="14" 
    cy="14" 
    r="14" 
    fill="url(#layer3)" 
    filter="url(#blur-glow)"
    opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.5;0.3;0.4;0.3" dur="2.3s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Слой 2: Средний круг -->
  <circle 
    cx="14" 
    cy="14" 
    r="11" 
    fill="url(#layer2)" 
    opacity="0.7">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="90 14 14"
      to="450 14 14"
      dur="2.3s"
      repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.7;0.9;0.7;0.8;0.7" dur="2.3s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Слой 1: Внутренний круг -->
  <circle 
    cx="14" 
    cy="14" 
    r="8" 
    fill="url(#layer1)" 
    opacity="0.9">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="90 14 14"
      to="450 14 14"
      dur="2.3s"
      repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.9;1;0.9;0.85;0.9" dur="2.3s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Центральный круг -->
  <circle 
    cx="14" 
    cy="14" 
    r="4" 
    fill="#7c3aed" 
    opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.6;0.4" dur="2.3s" repeatCount="indefinite"/>
  </circle>
</svg>
```

### Вариант 4: Упрощенная версия для использования в HTML

```svg
<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ai-loader-gradient">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.9">
        <animate attributeName="stop-color" 
                 values="#a78bfa;#c4b5fd;#ddd6fe;#c4b5fd;#a78bfa" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.7">
        <animate attributeName="stop-color" 
                 values="#8b5cf6;#a78bfa;#c4b5fd;#a78bfa;#8b5cf6" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.5">
        <animate attributeName="stop-color" 
                 values="#7c3aed;#8b5cf6;#a78bfa;#8b5cf6;#7c3aed" 
                 dur="2.3s" 
                 repeatCount="indefinite"/>
      </stop>
    </radialGradient>
  </defs>
  
  <circle 
    cx="14" 
    cy="14" 
    r="12" 
    fill="url(#ai-loader-gradient)">
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="90 14 14"
      to="450 14 14"
      dur="2.3s"
      repeatCount="indefinite"/>
  </circle>
</svg>
```

## Использование в React компоненте

```tsx
const AILoadingSpinner = () => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ai-loader-gradient">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9">
            <animate 
              attributeName="stopColor" 
              values="#a78bfa;#c4b5fd;#ddd6fe;#c4b5fd;#a78bfa" 
              dur="2.3s" 
              repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7">
            <animate 
              attributeName="stopColor" 
              values="#8b5cf6;#a78bfa;#c4b5fd;#a78bfa;#8b5cf6" 
              dur="2.3s" 
              repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5">
            <animate 
              attributeName="stopColor" 
              values="#7c3aed;#8b5cf6;#a78bfa;#8b5cf6;#7c3aed" 
              dur="2.3s" 
              repeatCount="indefinite"/>
          </stop>
        </radialGradient>
      </defs>
      
      <circle 
        cx="14" 
        cy="14" 
        r="12" 
        fill="url(#ai-loader-gradient)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="90 14 14"
          to="450 14 14"
          dur="2.3s"
          repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};
```

## Характеристики анимации

- **Размер**: 28x28 пикселей
- **Длительность**: 2.3 секунды
- **Тип анимации**: Бесконечная (infinite)
- **Направление вращения**: По часовой стрелке
- **Начальный угол**: 90 градусов
- **Конечный угол**: 450 градусов (полный оборот + 90°)
- **Цветовая схема**: Фиолетовые оттенки (violet-200 до violet-600)

## Где используется

Анимация загрузки используется в следующих компонентах:

1. `TestAIExplainButton.tsx` - кнопка получения объяснения от ИИ
2. `TestStandardBlock.tsx` - блок стандартных тестов
3. `TestMath1Block.tsx` - блок математических тестов типа 1
4. `TestMath2Block.tsx` - блок математических тестов типа 2
5. `TestAnalogyBlock.tsx` - блок тестов на аналогию
6. `TestRACBlock.tsx` - блок RAC тестов
7. `TestGrammarBlock.tsx` - блок грамматических тестов

## Примечания

- SVG версия анимации может не полностью соответствовать CSS версии из-за ограничений SVG в воспроизведении сложных `box-shadow` эффектов
- Для более точного соответствия рекомендуется использовать CSS версию или комбинировать SVG с CSS фильтрами
- Все варианты SVG анимации оптимизированы для производительности и совместимости с современными браузерами

