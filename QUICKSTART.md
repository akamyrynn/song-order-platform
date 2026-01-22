# Быстрый старт

## 1. Установка зависимостей

```bash
npm install
```

## 2. Настройка Supabase

### 2.1. Выполните SQL миграцию

1. Откройте Supabase Dashboard: https://supabase.com/dashboard/project/ejnbpcqmfyorppjkajpp
2. Перейдите в **SQL Editor**
3. Скопируйте содержимое файла `supabase-migration.sql`
4. Вставьте в редактор и нажмите **Run**

### 2.2. Получите пароль базы данных

1. В Supabase Dashboard: **Settings** → **Database**
2. Найдите **Connection string** → **URI**
3. Скопируйте пароль из строки (между `postgres:` и `@`)

### 2.3. Обновите .env

Откройте файл `.env` и замените `[YOUR-PASSWORD]` на ваш пароль:

```env
DATABASE_URL="postgresql://postgres.ejnbpcqmfyorppjkajpp:ВАШ_ПАРОЛЬ@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.ejnbpcqmfyorppjkajpp:ВАШ_ПАРОЛЬ@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

## 3. Настройка Prisma

```bash
npx prisma generate
npx prisma db push
```

## 4. Создание тестового админа

```bash
npx ts-node scripts/create-admin.ts
```

Данные для входа:
- Email: **admin@test.com**
- Password: **admin123**

## 5. Запуск

```bash
npm run dev
```

Откройте http://localhost:3000

## Проверка работы

### Главная страница
- URL: http://localhost:3000
- Должна отображаться Hero секция с кнопкой "Создать песню"

### Конструктор
- URL: http://localhost:3000/constructor
- Многошаговая форма (4 шага)
- Заполните все поля и создайте тестовый заказ

### Админ-панель
- URL: http://localhost:3000/admin
- Дашборд со статистикой
- Список заказов: http://localhost:3000/admin/orders
- Детали заказа: http://localhost:3000/admin/orders/[id]

## Тестовый заказ

Создайте тестовый заказ через конструктор:

**Шаг 1: Основная информация**
- Имя получателя: Анна
- Отношения: Подруга
- Повод: День рождения

**Шаг 2: Музыкальный стиль**
- Стили: Поп, Рок
- Настроение: Веселое
- Темп: Быстрый

**Шаг 3: Особые пожелания**
- Любой текст с пожеланиями

**Шаг 4: Контакты**
- Телефон: +79991234567

После создания вы получите номер заказа и будете перенаправлены на страницу успеха.

## Проверка в админке

1. Откройте http://localhost:3000/admin
2. Вы должны увидеть созданный заказ в статистике
3. Перейдите в "Все заказы"
4. Найдите ваш заказ
5. Откройте детали заказа
6. Попробуйте изменить статус

## Возможные проблемы

### Ошибка подключения к базе данных
- Проверьте правильность пароля в `.env`
- Убедитесь, что Supabase проект активен

### Конструктор пустой
- Проверьте консоль браузера на ошибки
- Убедитесь, что все CSS файлы загружаются

### Заказы не отображаются в админке
- Проверьте, что API endpoint `/api/orders` работает
- Откройте http://localhost:3000/api/orders в браузере
- Должен вернуться JSON с заказами

## Полезные команды

```bash
# Просмотр базы данных
npx prisma studio

# Проверка типов
npx tsc --noEmit

# Запуск тестов
npm test

# Сброс базы данных (ОСТОРОЖНО!)
npx prisma migrate reset
```
