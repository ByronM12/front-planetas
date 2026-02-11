# 🌐 Frontend - Sistema de Gestión de Planetas

Frontend web sencillo con HTML, Bootstrap y JavaScript Vanilla para interactuar con la API de planetas.

## 🚀 Características

- ✅ Interfaz responsiva con Bootstrap 5
- 🔐 Sistema de login con JWT
- 👥 Control de acceso por roles
- 📱 Diseño mobile-first
- ✨ Validaciones en formularios
- 🎨 Interfaz moderna e intuitiva
- ⚡ Sin frameworks pesados (JavaScript Vanilla)

## 📋 Páginas

### 1. Login (index.html)
- Formulario de autenticación
- Almacenamiento de token JWT
- Configuración de URL del API
- Usuarios de prueba precargados

### 2. Dashboard (dashboard.html)
- Crear nuevos planetas (ADMIN y USUARIO)
- Listar todos los planetas (solo ADMIN)
- Eliminar planetas (solo ADMIN)
- Panel de control según rol

## 🛠️ Instalación y Uso

### Opción 1: Servidor HTTP Simple (Python)

```bash
cd frontend
python -m http.server 8080
```

Abrir navegador en: `http://localhost:8080`

### Opción 2: Servidor HTTP Simple (Node.js)

```bash
cd frontend
npx serve
```

### Opción 3: Live Server (VS Code)

1. Instalar extensión "Live Server"
2. Click derecho en `index.html`
3. Seleccionar "Open with Live Server"

### Opción 4: Abrir directamente

Simplemente abrir el archivo `index.html` en un navegador.

## ⚙️ Configuración

### Configurar URL del API

Por defecto, el frontend se conecta a: `http://localhost:8000`

Para cambiar la URL del API:

1. En la página de login, hacer clic en "Configurar API URL"
2. Ingresar la nueva URL (ej: `https://tu-api.railway.app`)
3. Guardar

La configuración se guarda en `localStorage`.

## 👤 Usuarios de Prueba

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| admin | admin123 | ADMIN | Crear, Listar, Eliminar |
| usuario | usuario123 | USUARIO | Solo Crear |

## 📱 Funcionalidades por Rol

### ADMIN
- ✅ Crear planetas
- ✅ Listar todos los planetas
- ✅ Ver detalles de un planeta
- ✅ Editar planetas
- ✅ Eliminar planetas

### USUARIO
- ✅ Crear (registrar) planetas
- ❌ No puede listar todos
- ❌ No puede editar
- ❌ No puede eliminar

## 🔒 Seguridad

- Token JWT almacenado en `localStorage`
- Auto-logout cuando el token expira
- Validación de rol en cada acción
- Mensajes de error amigables
- Headers de autorización automáticos

## 📁 Estructura del Proyecto

```
frontend/
├── index.html              # Página de login
├── dashboard.html          # Panel principal
├── css/
│   └── style.css          # Estilos personalizados
├── js/
│   ├── config.js          # Configuración y utilidades
│   └── dashboard.js       # Lógica del dashboard
└── README.md
```

## 🎨 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **Bootstrap 5.3**: Framework CSS responsivo
- **Bootstrap Icons**: Iconos
- **JavaScript Vanilla**: Lógica del cliente
- **LocalStorage API**: Almacenamiento de token

## 🔄 Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. POST /auth/login
   ↓
3. Recibe token JWT
   ↓
4. Token guardado en localStorage
   ↓
5. Token enviado en cada request
   ↓
6. Si token expira → Auto logout
```

## ✅ Validaciones Implementadas

### Formulario de Crear Planeta

- ✅ Nombre: obligatorio, mínimo 1 carácter
- ✅ Tipo: obligatorio, valores predefinidos
- ✅ Distancia: numérica, no negativa (opcional)
- ✅ Número de lunas: numérica, no negativa (opcional)
- ✅ Masa: numérica positiva (opcional)
- ✅ Estado: valores predefinidos
- ✅ Fecha: formato de fecha válido (opcional)

### Manejo de Errores

El frontend maneja los siguientes códigos de error del API:

- **400**: Muestra mensaje "Error en los datos enviados"
- **401**: Auto-logout y redirección al login
- **403**: Mensaje "No tienes permisos"
- **404**: Mensaje "Recurso no encontrado"
- **409**: Mensaje "Ya existe un planeta con ese nombre"
- **500**: Mensaje "Error del servidor"

## 📖 Ejemplos de Uso

### Crear un Planeta

1. Iniciar sesión con usuario o admin
2. Completar el formulario de creación
3. Campos obligatorios: Nombre y Tipo
4. Click en "Guardar Planeta"
5. Ver mensaje de confirmación

### Listar Planetas (Solo ADMIN)

1. Iniciar sesión como admin
2. Click en "Listar Planetas"
3. Ver tabla con todos los planetas
4. Opciones para editar o eliminar

### Eliminar un Planeta (Solo ADMIN)

1. En la lista de planetas
2. Click en botón de eliminar (icono basura)
3. Confirmar la eliminación
4. Ver mensaje de confirmación

## 🌐 Despliegue

### Opción 1: Netlify

```bash
# Arrastrar carpeta frontend a netlify.com
```

### Opción 2: Vercel

```bash
vercel frontend
```

### Opción 3: GitHub Pages

1. Subir carpeta frontend a repositorio GitHub
2. Settings → Pages
3. Seleccionar branch y carpeta
4. Deploy

### Configuración Post-Despliegue

Después de desplegar:

1. Abrir la aplicación
2. Click en "Configurar API URL"
3. Ingresar URL del API desplegado
4. Guardar configuración

## 🐛 Solución de Problemas

### Error: "Error de conexión con el servidor"

**Solución**: 
- Verificar que el backend esté corriendo
- Revisar la URL del API en configuración
- Verificar que CORS esté habilitado en el backend

### Error: "No tienes permisos"

**Solución**:
- Verificar que estés usando el rol correcto
- Algunas funciones solo están disponibles para ADMIN

### Token expirado

**Solución**:
- El token expira a los 30 minutos
- Volver a iniciar sesión
- El sistema hace auto-logout automáticamente

## 🚀 Mejoras Futuras

- [ ] Paginación en listado de planetas
- [ ] Búsqueda y filtros
- [ ] Gráficos y estadísticas
- [ ] Modo oscuro
- [ ] Notificaciones push
- [ ] Edición inline en tabla
- [ ] Exportar datos a CSV/PDF

## 📝 Notas

- El frontend es completamente estático (HTML/CSS/JS)
- No requiere Node.js ni npm para ejecutarse
- Compatible con todos los navegadores modernos
- Se puede servir desde cualquier servidor HTTP

## 👨‍💻 Desarrollo

Para desarrollar nuevas funcionalidades:

1. Modificar archivos HTML/CSS/JS
2. Probar localmente con servidor HTTP
3. Verificar compatibilidad con API
4. Actualizar README si es necesario

## 📄 Licencia

MIT License - 2025
