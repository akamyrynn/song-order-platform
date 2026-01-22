# Настройка Supabase для Custom Song Platform

## Шаг 1: Создание таблиц

1. Откройте ваш проект Supabase: https://supabase.com/dashboard/project/ejnbpcqmfyorppjkajpp

2. Перейдите в **SQL Editor** (левое меню)

3. Создайте новый запрос и вставьте содержимое файла `supabase-migration.sql`

4. Нажмите **Run** для выполнения миграции

## Шаг 2: Настройка переменных окружения

В файле `.env` уже настроены следующие переменные:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://ejnbpcqmfyorppjkajpp.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Шаг 3: Создание тестового админа

Выполните скрипт для создания тестового администратора:

```bash
npx ts-node scripts/create-admin.ts
```

Данные для входа:
- **Email:** admin@test.com
- **Password:** admin123

## Шаг 4: Проверка

1. Запустите сервер разработки:
```bash
npm run dev
```

2. Откройте http://localhost:3000

3. Проверьте:
   - Главная страница загружается
   - Конструктор работает (/constructor)
   - Админка доступна (/admin)

## Структура таблиц

### orders
- Основная таблица заказов
- Содержит информацию о получателе, музыкальных предпочтениях, контактах
- Статусы: new, in_progress, ready, paid, completed

### messages
- Сообщения между клиентами и админами
- Связана с orders через order_id

### payments
- Информация о платежах
- Связана с orders через order_id

### admin_users
- Пользователи админ-панели
- Хранит email, хеш пароля, роль

## Индексы

Созданы индексы для оптимизации запросов:
- `idx_orders_status` - для фильтрации по статусу
- `idx_orders_created_at` - для сортировки по дате
- `idx_orders_telegram_user_id` - для поиска по Telegram ID
- `idx_messages_order_id` - для быстрого получения сообщений заказа
- `idx_payments_order_id` - для быстрого получения платежей заказа

## Триггеры

Создан триггер `update_orders_updated_at` для автоматического обновления поля `updated_at` при изменении заказа.

## Troubleshooting

### Ошибка подключения к базе данных

Проверьте:
1. Что переменные окружения правильно настроены
2. Что проект Supabase активен
3. Что IP-адрес не заблокирован (Supabase → Settings → Database → Connection pooling)

### Таблицы не создаются

1. Убедитесь, что SQL-запрос выполнен успешно в SQL Editor
2. Проверьте логи в Supabase Dashboard
3. Попробуйте выполнить запрос по частям (сначала CREATE TABLE, потом индексы)
