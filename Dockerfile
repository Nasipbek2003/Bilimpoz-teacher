# Многоэтапная сборка для Next.js приложения с nginx
FROM node:20-alpine AS base

# Установка зависимостей только для сборки
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./
RUN npm ci

# Этап сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем приложение
ENV NEXT_TELEMETRY_DISABLED=1
# Устанавливаем временный DATABASE_URL для сборки (не используется для реального подключения)
ARG DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

# Продакшн зависимости
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Продакшн этап с nginx
FROM nginx:alpine AS runner
WORKDIR /app

# Устанавливаем Node.js и OpenSSL для запуска Next.js сервера и Prisma
RUN apk add --no-cache nodejs npm openssl openssl-dev

# Копируем собранное приложение
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Копируем public папку из исходного кода
COPY public/ ./public/

# Копируем продакшн зависимости
COPY --from=prod-deps /app/node_modules ./node_modules

# Копируем Prisma схему и генерируем клиент
COPY --from=builder /app/prisma ./prisma

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Устанавливаем права доступа
RUN chown -R nextjs:nodejs /app

# Копируем скрипт запуска
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Открываем порты
EXPOSE 3000 80

# Запускаем приложение (от root для nginx)
CMD ["/bin/sh", "/app/start.sh"]
