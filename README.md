# 🍔 FoodDelivery - Сервис доставки еды

Современное веб-приложение для доставки еды, построенное на Next.js 15 с TypeScript и оптимизированное для производительности.

## 🚀 Возможности

- ⚡ **Высокая производительность** - оптимизированная сборка с code splitting
- 📱 **Адаптивный дизайн** - идеально работает на всех устройствах
- 🎨 **Современный UI** - красивые анимации с Framer Motion
- 🛒 **Система корзины** - полноценная корзина с промокодами
- 👤 **Авторизация** - система входа и профилей пользователей
- 🔔 **Уведомления** - уведомления о промокодах и статусе заказов
- 📊 **Управление состоянием** - Zustand с localStorage
- 🎯 **TypeScript** - полная типизация для надежности

## 🛠 Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Стилизация**: Tailwind CSS 4, Radix UI
- **Анимации**: Framer Motion, GSAP, Lottie
- **Иконки**: FontAwesome
- **Состояние**: Zustand
- **Сборка**: Webpack с оптимизациями

## 📦 Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/igorao79/template3.git
   cd template3
   ```

2. **Установите зависимости**
   ```bash
   npm install
   ```

3. **Запустите в режиме разработки**
   ```bash
   npm run dev
   ```

4. **Откройте в браузере**
   ```
   http://localhost:3000
   ```

## 🚀 Деплой

### Автоматический деплой на GitHub Pages

1. **Форкните репозиторий** на GitHub

2. **Включите GitHub Pages**
   - Перейдите в Settings → Pages
   - Source: GitHub Actions

3. **Пуш изменений** в ветку `main`
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **GitHub Actions** автоматически:
   - Установит зависимости
   - Соберет проект с оптимизациями
   - Задеплоит на GitHub Pages

### Ручная сборка

```bash
# Продакшн сборка
npm run build:production

# Локальный деплой
npm run deploy
```

## 📊 Оптимизации

### Производительность
- **Code Splitting** - разделение бандлов для быстрой загрузки
- **Image Optimization** - оптимизация изображений
- **CSS Optimization** - минификация и сжатие стилей
- **Tree Shaking** - удаление неиспользуемого кода
- **Lazy Loading** - ленивая загрузка компонентов

### Webpack оптимизации
- Отдельные чанки для vendor библиотек
- Специальные чанки для FontAwesome и Framer Motion
- Минификация с SWC
- Сжатие ресурсов

### Размеры бандлов (примерно)
- **Main bundle**: ~50KB (gzipped)
- **Vendor bundle**: ~150KB (gzipped)  
- **FontAwesome bundle**: ~30KB (gzipped)
- **Total**: ~230KB (gzipped)

## 🎯 Структура проекта

```
├── app/                    # Next.js App Router
├── components/            # React компоненты
│   ├── ui/               # UI компоненты
│   ├── layout/           # Компоненты layout
│   ├── restaurants/      # Компоненты ресторанов
│   └── ...
├── lib/                  # Утилиты и хелперы
│   ├── store.ts         # Zustand store
│   ├── paths.ts         # Утилиты путей
│   └── utils.ts         # Общие утилиты
├── public/               # Статические файлы
└── .github/workflows/    # GitHub Actions
```

## 🔧 Конфигурация

### Next.js конфигурация
- **Static Export** для GitHub Pages
- **Image Optimization** с unoptimized для статического хостинга
- **Base Path** для поддомена GitHub Pages
- **Webpack оптимизации** для размера бандла

### Tailwind CSS
- **JIT режим** для быстрой компиляции
- **Purge** неиспользуемых стилей
- **Кастомные анимации** с tw-animate-css

## 📈 Метрики производительности

Приложение оптимизировано для достижения высоких показателей Lighthouse:

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

## 🤝 Контрибьюция

1. Форкните проект
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) - React фреймворк
- [Tailwind CSS](https://tailwindcss.com/) - CSS фреймворк
- [Framer Motion](https://www.framer.com/motion/) - анимации
- [Zustand](https://github.com/pmndrs/zustand) - управление состоянием
- [FontAwesome](https://fontawesome.com/) - иконки
