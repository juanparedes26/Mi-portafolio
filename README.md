# 🚀 Portafolio Personal - Juan Manuel Paredes

## 📋 Descripción

Portafolio personal full-stack desarrollado desde cero como plataforma para mostrar mis proyectos de desarrollo de software. Esta aplicación web cuenta con un sistema completo de gestión de proyectos, interfaz bilingüe (Español/Inglés), y funcionalidades avanzadas de administración.

**🎯 Objetivo:** Crear una presencia profesional en línea que demuestre mis habilidades técnicas y proyectos realizados.

**📅 Estado:** En desarrollo activo - Próximamente en producción

## ✨ Características Principales

### 🌍 Sistema Bilingüe Completo
- **Español/Inglés:** Cambio dinámico de idioma en toda la aplicación
- **Persistencia:** El idioma seleccionado se mantiene entre sesiones
- **Contenido dinámico:** Proyectos con títulos y descripciones en ambos idiomas
- **Fallback inteligente:** Sistema de respaldo automático al español

### � Gestión de Proyectos
- **CRUD completo:** Crear, leer, actualizar y eliminar proyectos
- **Galería de imágenes:** Múltiples imágenes por proyecto con imagen principal
- **Drag & Drop:** Subida de archivos intuitiva
- **Tecnologías:** Sistema de tags para categorizar proyectos
- **Enlaces:** Repositorios GitHub y demos en vivo
- **Responsive:** Diseño adaptativo para todos los dispositivos

### 🔐 Sistema de Administración
- **Autenticación JWT:** Sistema de tokens seguro
- **Panel de admin:** Interfaz completa para gestión de contenido
- **Validaciones:** Sistema robusto de validación de datos
- **Upload de archivos:** Gestión segura de imágenes

### 🎨 Interfaz de Usuario
- **Diseño moderno:** UI/UX contemporáneo con Tailwind CSS
- **Animaciones:** Transiciones suaves y efectos visuales
- **Navegación intuitiva:** Experiencia de usuario optimizada
- **Modo oscuro:** Tema profesional y elegante

## �️ Tecnologías Utilizadas

### Backend
- **Python 3.11+**
- **Flask** - Framework web minimalista y potente
- **SQLAlchemy** - ORM para manejo de base de datos
- **Flask-JWT-Extended** - Autenticación con tokens JWT
- **Alembic** - Migraciones de base de datos
- **Bcrypt** - Encriptación de contraseñas
- **CORS** - Manejo de peticiones cross-origin

### Frontend
- **React 18** - Biblioteca principal para UI
- **Vite** - Build tool y desarrollo rápido
- **React Router** - Navegación SPA
- **React i18next** - Internacionalización
- **Tailwind CSS** - Framework de estilos utility-first
- **Context API** - Gestión de estado global

### Base de Datos
- **PostgreSQL** - Base de datos relacional robusta
- **Esquema optimizado** - Diseño eficiente para escalabilidad

### DevOps y Herramientas
- **Docker** - Containerización
- **Git** - Control de versiones
- **ESLint** - Linting para JavaScript
- **Prettier** - Formateo de código

## 📊 Arquitectura del Sistema

```
📦 Portafolio
├── 🖥️ Backend (Flask API)
│   ├── 🗃️ Models (SQLAlchemy)
│   ├── 🛣️ Routes (Admin, Public, User)
│   ├── 🔧 Services (Auth, File Upload)
│   ├── 📁 Static (Images Upload)
│   └── 🔄 Migrations (Alembic)
│
├── 🎨 Frontend (React SPA)
│   ├── 📄 Views (Home, Projects, About, Admin)
│   ├── 🧩 Components (Navbar, Forms)
│   ├── 🌍 i18n (Español/Inglés)
│   ├── 📱 Responsive Design
│   └── 🎯 Context API (State Management)
│
└── 🗄️ Base de Datos (PostgreSQL)
    ├── 👤 Users (Authentication)
    ├── 📋 Projects (Portfolio Content)
    └── 🖼️ Images (File Management)
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL 12+
- Git

### Backend Setup
```bash
# Clonar repositorio
git clone https://github.com/juanparedes26/Mi-portafolio.git
cd Mi-portafolio/backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
# Crear base de datos en PostgreSQL
# Configurar variables de entorno

# Ejecutar migraciones
flask db upgrade

# Iniciar servidor
python app/run.py
```

### Frontend Setup
```bash
# Navegar al frontend
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con VITE_BACKEND_URL

# Iniciar desarrollo
npm run dev
```

### Docker Setup
```bash
# Construcción con Docker Compose
docker-compose up --build
```

## 📁 Estructura del Proyecto

```
📦 fserron-fullstack-starter/
├── 📁 backend/
│   ├── 📁 app/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 config.py
│   │   ├── 📄 database.py
│   │   ├── 📄 models.py
│   │   ├── 📄 run.py
│   │   ├── 📁 routes/
│   │   ├── 📁 services/
│   │   └── 📁 static/uploads/
│   ├── 📁 migrations/
│   └── 📄 requirements.txt
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   ├── 📁 views/
│   │   ├── 📁 js/store/
│   │   ├── 📁 locales/
│   │   ├── 📁 hooks/
│   │   └── 📄 i18n.js
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
│
├── 📄 docker-compose.yml
├── 📄 Dockerfile
└── 📄 README.md
```

## � Funcionalidades Implementadas

### ✅ Completadas
- [x] Sistema de autenticación JWT
- [x] CRUD completo de proyectos
- [x] Sistema bilingüe (ES/EN)
- [x] Upload de múltiples imágenes
- [x] Diseño responsive
- [x] Validaciones robustas
- [x] Navegación SPA
- [x] Persistencia de idioma
- [x] Panel de administración
- [x] Migraciones de BD

### 🚧 En Desarrollo
- [ ] Optimización de imágenes
- [ ] Sistema de caché
- [ ] Tests automatizados
- [ ] CI/CD Pipeline
- [ ] Monitoreo y logs
- [ ] SEO optimización

### 🎯 Próximas Características
- [ ] Blog integrado
- [ ] Sistema de comentarios
- [ ] Analytics dashboard
- [ ] PWA capabilities
- [ ] Email notifications

## � Despliegue

**Estado:** En preparación para producción

**Plataformas objetivo:**
- Frontend: Vercel/Netlify
- Backend: Railway/Heroku
- Base de datos: PostgreSQL Cloud
- CDN: Cloudinary (imágenes)

## 👨‍💻 Desarrollo

**Desarrollador:** Juan Manuel Paredes López  
**Tipo:** Proyecto personal de código abierto  
**Propósito:** Portafolio profesional y demostración de habilidades  
**Licencia:** Uso personal y educativo  

### 🎯 Objetivos del Proyecto
1. **Demostrar habilidades full-stack** en tecnologías modernas
2. **Crear presencia profesional** en línea
3. **Aprender y experimentar** con nuevas tecnologías
4. **Construir herramienta útil** para gestión de portafolio

## 📞 Contacto

- **GitHub:** [@juanparedes26](https://github.com/juanparedes26)
- **LinkedIn:** [Juan Manuel Paredes López](https://linkedin.com/in/juan-manuel-paredes-lopez-b7621224b)
- **Email:** [juan.paredes260320@gmail.com]

## 📄 Licencia

Este proyecto es de uso personal y educativo. Desarrollado por Juan Manuel Paredes López como demostración de habilidades técnicas.

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐

*"Construyendo el futuro, una línea de código a la vez"* �
