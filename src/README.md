# 📁 Estructura Modular de CookShare

## 🏗️ **Organización del Proyecto**

```
src/
├── 📄 App.jsx              # Componente principal de la aplicación
├── 📄 main.jsx             # Punto de entrada de React
├── 📁 pages/               # Páginas principales de la aplicación
├── 📁 components/          # Componentes reutilizables
├── 📁 routes/              # Configuración de rutas y navegación
├── 📁 hooks/               # Hooks personalizados de React
├── 📁 functions/           # Funciones de API y utilidades
├── 📁 styles/              # Estilos globales y CSS
└── 📁 utils/               # Utilidades generales
```

## 📋 **Descripción de Carpetas**

### 🏠 **`pages/`** - Páginas Principales
Contiene las páginas principales de la aplicación:
- `HomePage.jsx` - Página de inicio (pública)
- `Login.jsx` - Página de inicio de sesión
- `Register.jsx` - Página de registro
- `Feed.jsx` - Feed principal de recetas
- `Profile.jsx` - Perfil del usuario
- `UserProfileEdit.jsx` - Edición de perfil
- `Favoritos.jsx` - Recetas favoritas
- `NotFound.jsx` - Página 404

### 🧩 **`components/`** - Componentes Reutilizables
Componentes modulares y reutilizables:
- `Navbar/` - Componentes de navegación
- `Login/` - Componentes específicos de login
- `Register/` - Componentes específicos de registro
- `Animations/` - Componentes de animación

### 🛣️ **`routes/`** - Configuración de Rutas
Manejo de navegación y protección de rutas:
- `AppRoutes.jsx` - Configuración principal de rutas
- `PublicRoute.jsx` - Rutas públicas (redirigen si autenticado)
- `ProtectedRoute.jsx` - Rutas protegidas (requieren autenticación)

### 🪝 **`hooks/`** - Hooks Personalizados
Hooks de React personalizados:
- `useAuth.jsx` - Hook de autenticación y contexto

### 🔧 **`functions/`** - Funciones de API
Funciones para comunicación con el backend:
- `api.js` - Funciones de API (GET, POST, PUT, DELETE)

### 🎨 **`styles/`** - Estilos Globales
Archivos de estilos:
- `App.css` - Estilos globales de la aplicación

### 🛠️ **`utils/`** - Utilidades
Funciones utilitarias generales (futuro uso)

## 🔄 **Flujo de Navegación**

### **Rutas Públicas** (`PublicRoute`)
- `/` → Redirige a `/feed` si está autenticado
- `/login` → Redirige a `/feed` si está autenticado  
- `/register` → Redirige a `/feed` si está autenticado

### **Rutas Protegidas** (`ProtectedRoute`)
- `/feed` → Requiere autenticación
- `/perfil` → Requiere autenticación
- `/editar-perfil` → Requiere autenticación
- `/crear` → Requiere autenticación
- `/favoritos` → Requiere autenticación

## 🎯 **Ventajas de esta Estructura**

1. **📦 Modularidad**: Cada carpeta tiene una responsabilidad específica
2. **🔄 Reutilización**: Componentes separados y reutilizables
3. **🧹 Mantenibilidad**: Fácil de mantener y escalar
4. **👥 Colaboración**: Estructura clara para trabajo en equipo
5. **🚀 Escalabilidad**: Fácil agregar nuevas funcionalidades

## 🔧 **Cómo Agregar Nuevos Elementos**

### **Nueva Página:**
1. Crear archivo en `src/pages/NuevaPagina.jsx`
2. Importar en `src/routes/AppRoutes.jsx`
3. Agregar ruta correspondiente

### **Nuevo Componente:**
1. Crear archivo en `src/components/NuevoComponente.jsx`
2. Importar donde sea necesario

### **Nueva Función de API:**
1. Agregar función en `src/functions/api.js`
2. Exportar y usar en componentes

---

*Esta estructura sigue las mejores prácticas de React y facilita el desarrollo y mantenimiento del proyecto.* 