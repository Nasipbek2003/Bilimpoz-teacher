# Стили RadioButton при нажатии (checked состояние)

Подробное описание всех стилей, которые применяются к RadioButton когда он находится в состоянии checked (нажат/выбран).

---

## Селектор для checked состояния

Стили применяются через CSS селектор:
```css
.radio-input:checked ~ .radio-check
.radio-input:checked ~ .radio-check .radio-inside
.radio-input:checked ~ .radio-label
```

Селектор `:checked` применяется к input элементу с типом `radio`, а стили применяются к соседним элементам через селектор `~` (general sibling combinator).

---

## Стили внешнего круга (.radio-check)

### CSS правило
```css
.radio-input:checked ~ .radio-check {
  border: 2px solid #FFFFFF;
}
```

### Применяемые стили

**Граница:**
- **Width**: `2px` (толщина границы)
- **Style**: `solid` (сплошная линия)
- **Color**: `#FFFFFF` (белый цвет)

**Остальные свойства остаются без изменений:**
- **Display**: `block`
- **Position**: `absolute`
- **Border Radius**: `100%` (круглая форма)
- **Height**: `24px`
- **Width**: `24px`
- **Top**: `50%`
- **Left**: `0`
- **Transform**: `translateY(-50%)` (центрирование по вертикали)
- **Z-index**: `5`
- **Transition**: `border 0.25s linear` (плавный переход границы 250ms)

### Визуальное изменение

**До checked (не выбран):**
- Граница: `2px solid #6B7280` (серая - gray-500)

**После checked (выбран):**
- Граница: `2px solid #FFFFFF` (белая)

**Переход:**
- Плавное изменение цвета границы за 250ms (0.25s linear)

---

## Стили внутреннего круга (.radio-inside)

### CSS правило
```css
.radio-input:checked ~ .radio-check .radio-inside {
  background: #FFFFFF;
}
```

### Применяемые стили

**Фон:**
- **Background**: `#FFFFFF` (белый цвет)

**Остальные свойства остаются без изменений:**
- **Display**: `block`
- **Position**: `absolute`
- **Border Radius**: `100%` (круглая форма)
- **Height**: `10px`
- **Width**: `10px`
- **Top**: `50%`
- **Left**: `50%`
- **Transform**: `translate(-50%, -50%)` (точное центрирование)
- **Transition**: `background 0.25s linear` (плавный переход фона 250ms)

### Визуальное изменение

**До checked (не выбран):**
- Фон: `transparent` (прозрачный)

**После checked (выбран):**
- Фон: `#FFFFFF` (белый)

**Переход:**
- Плавное появление белого круга внутри за 250ms (0.25s linear)

---

## Стили текстовой метки (.radio-label)

### CSS правило
```css
.radio-input:checked ~ .radio-label {
  color: #FFFFFF;
}
```

### Применяемые стили

**Цвет текста:**
- **Color**: `#FFFFFF` (белый цвет)

**Остальные свойства остаются без изменений:**
- **Display**: `block`
- **Position**: `relative`
- **Font Weight**: `400` (normal)
- **Font Size**: `0.875rem` (14px)
- **Padding Left**: `2rem` (32px - отступ для радио-кнопки)
- **Margin**: `0`
- **Z-index**: `9`
- **Cursor**: `pointer`
- **Transition**: `all 0.25s linear` (плавный переход всех свойств 250ms)

### Визуальное изменение

**До checked (не выбран):**
- Цвет: `#9CA3AF` (серый - gray-400)

**После checked (выбран):**
- Цвет: `#FFFFFF` (белый)

**Переход:**
- Плавное изменение цвета текста за 250ms (0.25s linear)

---

## Полная структура HTML при checked состоянии

```html
<div class="radio-button-wrapper">
  <input 
    type="radio" 
    id="answer-1" 
    name="correct-answer-rac-1764076584395" 
    class="radio-input"
    checked
  />
  <div class="radio-check" style="border: 2px solid #FFFFFF;">
    <div class="radio-inside" style="background: #FFFFFF;"></div>
  </div>
  <label for="answer-1" class="radio-label" style="color: #FFFFFF;">
    А
  </label>
</div>
```

---

## Визуальное представление

### Не выбран (unchecked)
```
┌─────────────────┐
│  ○  А           │  ← Серая граница (#6B7280)
└─────────────────┘     Прозрачная середина
                        Серый текст (#9CA3AF)
```

### Выбран (checked)
```
┌─────────────────┐
│  ◉  А           │  ← Белая граница (#FFFFFF)
└─────────────────┘     Белая середина (#FFFFFF)
                        Белый текст (#FFFFFF)
```

---

## Анимация перехода

При изменении состояния с unchecked на checked происходит плавная анимация:

1. **Граница внешнего круга**: Серая → Белая (250ms)
2. **Фон внутреннего круга**: Прозрачный → Белый (250ms)
3. **Цвет текста**: Серый → Белый (250ms)

Все переходы синхронизированы и происходят одновременно за 250 миллисекунд с линейной функцией времени (`linear`).

---

## Сравнительная таблица стилей

| Элемент | Свойство | Unchecked | Checked | Переход |
|---------|----------|-----------|---------|---------|
| **.radio-check** | border | `2px solid #6B7280` | `2px solid #FFFFFF` | 250ms linear |
| **.radio-inside** | background | `transparent` | `#FFFFFF` | 250ms linear |
| **.radio-label** | color | `#9CA3AF` | `#FFFFFF` | 250ms linear |

---

## CSS код полностью

```css
/* Стили для checked состояния */

/* Внешний круг - белая граница */
.radio-input:checked ~ .radio-check {
  border: 2px solid #FFFFFF;
}

/* Внутренний круг - белая заливка */
.radio-input:checked ~ .radio-check .radio-inside {
  background: #FFFFFF;
}

/* Текстовая метка - белый цвет */
.radio-input:checked ~ .radio-label {
  color: #FFFFFF;
}
```

---

## Особенности реализации

1. **Плавные переходы**: Все изменения происходят с анимацией 250ms для плавного визуального эффекта

2. **Синхронизация**: Все три элемента (граница, середина, текст) меняются одновременно

3. **Контрастность**: Белый цвет на темном фоне обеспечивает хорошую видимость выбранного состояния

4. **Доступность**: Использование стандартного input с type="radio" обеспечивает правильную работу с клавиатурой и screen readers

5. **Визуальная обратная связь**: Четкое визуальное отличие между выбранным и невыбранным состоянием

---

## Цветовая палитра

| Состояние | Граница | Середина | Текст |
|-----------|---------|----------|-------|
| **Unchecked** | #6B7280 (gray-500) | transparent | #9CA3AF (gray-400) |
| **Checked** | #FFFFFF (white) | #FFFFFF (white) | #FFFFFF (white) |
| **Hover (unchecked)** | #9CA3AF (gray-400) | transparent | #FFFFFF (white) |

---

## Размеры элементов

| Элемент | Размер |
|---------|--------|
| **Внешний круг (.radio-check)** | 24px × 24px |
| **Внутренний круг (.radio-inside)** | 10px × 10px |
| **Толщина границы** | 2px |
| **Отступ текста слева** | 32px (2rem) |

---

## Интерактивность

При клике на RadioButton:
1. Input получает атрибут `checked`
2. CSS селектор `:checked` активируется
3. Применяются стили для `.radio-check`, `.radio-inside` и `.radio-label`
4. Происходит плавная анимация перехода (250ms)
5. Визуально RadioButton отображается как выбранный

При выборе другого RadioButton в той же группе (с тем же `name`):
1. Предыдущий RadioButton теряет `checked`
2. Новый RadioButton получает `checked`
3. Стили переключаются между элементами с анимацией

