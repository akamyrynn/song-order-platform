# Деплой на Vercel

## 🚀 Быстрый деплой

1. Открой https://vercel.com/new
2. Импортируй репо: `akamyrynn/song-order-platform`
3. Добавь переменные окружения (см. ниже)
4. Нажми **Deploy**

## 🔑 Переменные окружения для Vercel

Добавь эти переменные в настройках проекта:

### Обязательные (Supabase)
```
NEXT_PUBLIC_SUPABASE_URL=https://ejnbpcqmfyorppjkajpp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой_anon_key
SUPABASE_SERVICE_ROLE_KEY=твой_service_role_key
```

### Опциональные (для будущего)
```
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_URL=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username

PAYMENT_PROVIDER_SECRET_KEY=
PAYMENT_PROVIDER_WEBHOOK_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

JWT_SECRET=твой_секретный_ключ_для_production

NEXT_PUBLIC_API_URL=https://твой-домен.vercel.app
```

## 📝 Где взять ключи Supabase

1. Открой https://supabase.com/dashboard/project/ejnbpcqmfyorppjkajpp
2. Settings → API
3. Скопируй:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## ⚠️ Важно!

Перед деплоем убедись что:
1. ✅ Выполнил SQL миграцию в Supabase (`supabase-migration.sql`)
2. ✅ Таблицы созданы в базе данных
3. ✅ Все переменные окружения добавлены в Vercel

## 🔗 После деплоя

1. Открой свой сайт на Vercel
2. Проверь `/api/test-db` - должен вернуть `success: true`
3. Проверь `/create` - форма должна работать
4. Проверь `/admin` - админка должна открываться

## 🐛 Если что-то не работает

1. Проверь логи в Vercel Dashboard
2. Проверь что все переменные окружения добавлены
3. Проверь что таблицы созданы в Supabase
4. Проверь `/api/test-db` для диагностики

## 📱 Кастомный домен

1. В Vercel Dashboard → Settings → Domains
2. Добавь свой домен
3. Обнови `NEXT_PUBLIC_API_URL` на свой домен
4. Redeploy проект
