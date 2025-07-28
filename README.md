# TutorHub - Plataforma de Tutorías Académicas Accesible

Una aplicación web completa para la gestión de tutorías académicas con un fuerte enfoque en accesibilidad y diseño inclusivo.

## 🌟 Características

### Funcionalidades Principales
- **Sistema de Autenticación Completo** - Registro seguro de usuarios, inicio de sesión y gestión de perfiles
- **Acceso Basado en Roles** - Interfaces separadas para estudiantes, tutores y administradores
- **Gestión de Sesiones** - Programa, administra y da seguimiento a las tutorías
- **Búsqueda Avanzada** - Encuentra tutores por materia, disponibilidad y calificaciones
- **Notificaciones en Tiempo Real** - Mantente actualizado sobre cambios en las sesiones y recordatorios
- **Sistema de Retroalimentación** - Califica y comenta las sesiones de tutoría

### Características de Accesibilidad
- **Cumple con WCAG 2.1 Nivel AA** - Cumple con los estándares internacionales de accesibilidad
- **Compatibilidad con Lector de Pantalla** - Compatibilidad total con tecnologías de asistencia
- **Navegación por Teclado** - Accesibilidad completa mediante teclado para todas las funciones
- **Modo Alto Contraste** - Mejor visibilidad para usuarios con discapacidad visual
- **Tamaños de Fuente Ajustables** - Personalización del tamaño del texto para mejor legibilidad
- **Soporte para Daltonismo** - Múltiples opciones de accesibilidad para visión de colores
- **Movimiento Reducido** - Respeta las preferencias de los usuarios sensibles al movimiento
- **Gestión del Foco** - Indicadores de enfoque claros y orden lógico de tabulación

## 🚀 Comenzando

### Requisitos Previos
- Node.js 18 o superior
- npm o yarn
- Una cuenta de Supabase

### Instalación

1. **Clona el repositorio**
   \`\`\`bash
   git clone https://github.com/your-username/sistema-tutorias.git
   cd sistema-tutorias
   \`\`\`

2. **Instala las dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configura las variables de entorno**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Completa con tus credenciales de Supabase:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_proyecto_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
   \`\`\`

4. **Configura la base de datos**
   
   Ejecuta los scripts SQL en el editor de SQL de Supabase:
   \`\`\`bash
   # Primero ejecuta scripts/01-esquema-inicial.sql
   # Luego ejecuta scripts/02-datos-iniciales.sql
   \`\`\`

5. **Inicia el servidor de desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Abre tu navegador**
   Navega a [http://localhost:3000](http://localhost:3000)

## 🏗️ Arquitectura

### Tecnologías Utilizadas
- **Frontend**: Next.js 14 con App Router, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Autenticación, Almacenamiento, Tiempo real)
- **Estilos**: Tailwind CSS con mejoras personalizadas de accesibilidad
- **Componentes UI**: Primitivas de Radix UI con envoltorios accesibles personalizados
- **Gestión de Estado**: React Context API

### Estructura del Proyecto
\`\`\`
├── app/                    # Páginas de Next.js App Router
├── components/            
│   ├── forms/             # Componentes de formulario accesibles
│   ├── layout/            # Componentes de diseño (Encabezado, Pie de página, etc.)
│   └── ui/                # Componentes UI reutilizables
├── contexts/              # Proveedores de contexto de React
├── lib/                   # Funciones de utilidad y configuraciones
├── scripts/               # Scripts de configuración y migración de base de datos
└── public/                # Archivos estáticos
\`\`\`

## 🎯 Implementación de Accesibilidad

### Características Clave de Accesibilidad

1. **Estructura HTML Semántica**
   - Jerarquía de encabezados adecuada (h1-h6)
   - Regiones de puntos de referencia (main, nav, aside, footer)
   - Etiquetas ARIA para mejorar la navegación con lectores de pantalla
   - Textos alternativos para imágenes y elementos no textuales
   - Controles de formulario correctamente etiquetados
   - Etiquetas y descripciones de formularios

2. **Implementación de ARIA**
   - Etiquetas ARIA para interacciones complejas
   - Regiones dinámicas para actualizaciones de contenido en tiempo real
   - Roles y estados adecuados

3. **Navegación por Teclado**
   - Gestión del orden de tabulación
   - Enlaces de salto al contenido principal
   - Atajos de teclado para acciones comunes

4. **Accesibilidad Visual**
   - Esquemas de color de alto contraste
   - Tamaños de fuente escalables
   - Paletas de colores para daltónicos
   - Indicadores de foco visibles

5. **Soporte para Lectores de Pantalla**
   - Texto alternativo descriptivo para imágenes
   - Contenido exclusivo para lectores de pantalla cuando es necesario
   - Asociaciones correctas de campos de formulario

### Pruebas de Accesibilidad

\`\`\`bash
# Instalar herramientas de prueba de accesibilidad
npm install -D @axe-core/react eslint-plugin-jsx-a11y

# Ejecutar verificación de accesibilidad
npm run lint

# Lista de verificación para pruebas manuales:
# - Navegar usando solo el teclado
# - Probar con lector de pantalla (NVDA, JAWS, VoiceOver)
# - Verificar proporciones de contraste de color
# - Probar con diferentes niveles de zoom
\`\`\`

## 🔧 Configuración

### Configuración de Supabase

1. **Crea un nuevo proyecto en Supabase**
2. **Ejecuta las migraciones de base de datos** (ver carpeta scripts)
3. **Configura las políticas de seguridad a nivel de fila**
4. **Configura proveedores de autenticación** (opcional)

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de rol de servicio (para funciones de administrador) | No |

## 📱 Diseño Responsivo

La aplicación es completamente adaptable y funciona en:
- **Escritorio** (1024px o más)
- **Tabletas** (768px - 1023px)
- **Móviles** (hasta 767px)
- Se adapta automáticamente a diferentes tamaños de pantalla
- Mantiene la usabilidad en todos los dispositivos
- **Móviles** (320px - 767px)

## 🧪 Pruebas

\`\`\`bash
# Verificación de tipos
npm run type-check

# Análisis de código
npm run lint

# Construir para producción
npm run build
\`\`\`

## 🚀 Despliegue

### Desplegar en Vercel

1. **Conecta tu repositorio a Vercel**
2. **Añade las variables de entorno** en el panel de control de Vercel
3. **Despliega** - Vercel construirá y desplegará automáticamente

### Desplegar en Otras Plataformas

La aplicación puede desplegarse en cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contribuciones

¡Apreciamos las contribuciones que mejoren la accesibilidad y funcionalidad!

### Pautas de Desarrollo

1. **Sigue las mejores prácticas de accesibilidad**
2. **Prueba la navegación por teclado**
3. **Verifica la compatibilidad con lectores de pantalla**
4. **Mantén el cumplimiento con WCAG 2.1 Nivel AA**
5. **Escribe HTML semántico**
6. **Incluye atributos ARIA apropiados**

### Proceso de Pull Request

1. Haz un fork del repositorio
2. Crea una rama para tu característica
3. Realiza tus cambios
4. Prueba la accesibilidad minuciosamente
5. Envía una solicitud de extracción

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- **Documentación**: Revisa este README y los comentarios en el código
- **Problemas**: Reporta errores y solicitudes de características a través de GitHub Issues
- **Accesibilidad**: Para preguntas relacionadas con accesibilidad, incluye detalles sobre tu tecnología de asistencia

## 🙏 Agradecimientos

- **Supabase** por su excelente plataforma backend como servicio
- **Radix UI** por sus primitivos de componentes accesibles
- **Tailwind CSS** por su enfoque de utilidades primero para CSS
- **Equipo de Next.js** por el increíble framework React
- **Iniciativa de Accesibilidad Web (WAI)** por las pautas WCAG

---

Construido con ❤️ y accesibilidad en mente.
