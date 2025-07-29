# CookShare 🍪

CookShare es una aplicación web moderna para compartir y descubrir recetas de cocina. Desarrollada con React y Vite, ofrece una experiencia de usuario fluida con animaciones suaves y un diseño atractivo.

## 🚀 Características

- **Interfaz moderna**: Diseño responsive con gradientes y efectos de glassmorphism
- **Animaciones suaves**: Transiciones fluidas y animaciones CSS personalizadas
- **Navegación intuitiva**: Barra de navegación fija con indicadores visuales
- **Autenticación**: Sistema de login y registro
- **Feed de recetas**: Visualización de recetas con interacciones sociales
- **Responsive**: Optimizado para móviles, tablets y desktop

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **Backend**: Laravel 10 + Sanctum (API REST)
- **Routing**: React Router DOM
- **Estilos**: Tailwind CSS con configuración personalizada
- **Iconos**: Lucide React
- **Animaciones**: GSAP + CSS personalizado
- **Estado**: React Hooks (useState, useEffect, useContext)
- **Autenticación**: JWT Tokens (Laravel Sanctum)

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn** (gestor de paquetes)
- **PHP** (versión 8.1 o superior)
- **Composer** (gestor de dependencias de PHP)
- **Laravel** (versión 10 o superior)

### Verificar instalación:
```bash
node --version
npm --version
php --version
composer --version
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd cookshare-front
```

### 2. Configurar el Backend (Laravel)

#### 2.1. Instalar dependencias del backend
```bash
cd ../cookshare-backend  # o la ruta donde esté tu backend
composer install
```

#### 2.2. Configurar variables de entorno del backend
```bash
cp .env.example .env
php artisan key:generate
```

#### 2.3. Configurar la base de datos
Edita el archivo `.env` del backend y configura tu base de datos:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cookshare_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

#### 2.4. Ejecutar migraciones
```bash
php artisan migrate
```

#### 2.5. Iniciar el servidor del backend
```bash
php artisan serve
```

El backend estará disponible en: `http://localhost:8000`

#### 2.6. Configurar CORS (si es necesario)
Si tienes problemas de CORS, asegúrate de que tu backend de Laravel tenga configurado CORS correctamente. En `config/cors.php`:

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'], // URL del frontend
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 3. Configurar el Frontend

#### 3.1. Instalar dependencias
```bash
cd cookshare-front
npm install
```

#### 3.2. Configurar variables de entorno (opcional)
Si necesitas configurar variables de entorno, crea un archivo `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### 5. Construir para producción
```bash
npm run build
```

### 6. Previsualizar build de producción
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
cookshare-front/
├── public/
│   └── images/
│       └── logo/
│           └── LogoCookie.png
├── src/
│   ├── components/
│   │   ├── Feed.jsx
│   │   ├── HomePage.jsx
│   │   ├── Login/
│   │   │   ├── LoginCard.jsx
│   │   │   ├── LoginDecor.jsx
│   │   │   └── LoginForm.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar/
│   │   │   ├── NavbarDesktop.jsx
│   │   │   ├── NavbarItem.jsx
│   │   │   ├── NavbarLogo.jsx
│   │   │   └── NavbarMobile.jsx
│   │   ├── Navbar.jsx
│   │   ├── Register/
│   │   │   ├── RegisterCard.jsx
│   │   │   ├── RegisterDecor.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── Register.jsx
│   ├── functions/
│   │   └── api.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Paleta de Colores

El proyecto utiliza una paleta personalizada de colores "Pavlova":

- **Pavlova-50**: #faf7f2 (Fondo principal)
- **Pavlova-100**: #f4eee0 (Fondo secundario)
- **Pavlova-200**: #e8dac0 (Bordes y separadores)
- **Pavlova-300**: #dbc49b (Elementos interactivos)
- **Pavlova-400**: #caa36d (Acentos)
- **Pavlova-500**: #be8c51 (Botones principales)
- **Pavlova-600**: #b17845 (Hover states)
- **Pavlova-700**: #93603b (Texto importante)
- **Pavlova-800**: #774f35 (Títulos)
- **Pavlova-900**: #61412d (Texto principal)

## 🎭 Animaciones

El proyecto incluye animaciones CSS personalizadas:

- **fade-in-up**: Entrada desde abajo con fade
- **fade-in-down**: Entrada desde arriba con fade
- **scale-in**: Escalado suave
- **float**: Efecto flotante
- **pulse-slow**: Pulso lento
- **stagger-X**: Entrada escalonada

## 📱 Rutas Disponibles

- `/` - Página de inicio
- `/login` - Página de login
- `/register` - Página de registro
- `/feed` - Feed de recetas
- `/perfil` - Perfil de usuario (en desarrollo)
- `/crear` - Crear receta (en desarrollo)
- `/favoritos` - Recetas favoritas (en desarrollo)

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build
npm run lint         # Ejecutar ESLint
```

## 🐛 Solución de Problemas

### Error de puerto ocupado
Si el puerto 5173 está ocupado, Vite automáticamente usará el siguiente puerto disponible.

### Problemas de dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas de cache
```bash
npm run dev -- --force
```

### Error 404 en endpoints de la API
Si recibes errores 404 al intentar acceder a los endpoints de la API:

1. **Verificar que el backend esté corriendo:**
   ```bash
   php artisan serve
   ```

2. **Verificar la URL del backend:**
   - El frontend está configurado para usar `http://localhost:8000/api/`
   - Asegúrate de que tu backend de Laravel esté corriendo en el puerto 8000

3. **Verificar las rutas de la API:**
   - Asegúrate de que las rutas estén definidas en `routes/api.php`
   - Verifica que los endpoints coincidan con los que usa el frontend

### Problemas de CORS
Si tienes errores de CORS:

1. **Verificar configuración de CORS en Laravel:**
   ```bash
   php artisan config:cache
   ```

2. **Verificar que el middleware de CORS esté habilitado:**
   - Asegúrate de que `HandleCors` esté en el array de middleware global

3. **Verificar orígenes permitidos:**
   - El frontend debe estar en `http://localhost:5173`
   - Ajusta la configuración en `config/cors.php` si es necesario

### Problemas de autenticación
Si tienes problemas con el login o registro:

1. **Verificar que Sanctum esté configurado:**
   ```bash
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   php artisan migrate
   ```

2. **Verificar la configuración de tokens:**
   - Asegúrate de que los tokens se estén generando correctamente
   - Verifica que el middleware `auth:sanctum` esté aplicado a las rutas protegidas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuUsuario](https://github.com/TuUsuario)

## 🙏 Agradecimientos

- [Vite](https://vitejs.dev/) por el bundler rápido
- [Tailwind CSS](https://tailwindcss.com/) por el framework de CSS
- [Lucide](https://lucide.dev/) por los iconos
- [React Router](https://reactrouter.com/) por el routing

---

⭐ Si este proyecto te gusta, ¡dale una estrella!
