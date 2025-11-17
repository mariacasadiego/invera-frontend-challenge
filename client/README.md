npm installologías Utilizadas

- **Next.js 13** - Framework React con App Router
- **React 18** - Biblioteca UI
- **React Query (@tanstack/react-query)** - Gestión de estado del servidor
- **Tailwind CSS 4** - Framework CSS utility-first
- **SCSS** - Preprocesador CSS
- **Recharts** - Biblioteca de gráficos
- **React Icons** - Iconos
- **Jest** - Framework de pruebas
- **React Testing Library** - Utilidades para pruebas
- **ESLint** - Linter de código

## 📝 Uso

### Ver usuarios
La tabla muestra todos los usuarios con paginación. Puedes navegar entre páginas con los botones "Prev" y "Next".

### Buscar usuarios
Usa el campo de búsqueda en la parte superior de la tabla para filtrar usuarios por nombre, email, teléfono, ubicación o compañía.

### Ordenar columnas
Haz clic en los encabezados de las columnas (Name, Phone, Location, Company, Status) para ordenar ascendente o descendente.

### Agregar usuario
1. Haz clic en el botón "Add User" en el header
2. Completa el formulario
3. Haz clic en "Add User"

### Editar usuario
1. Haz clic en el ícono de editar (lápiz) en la fila del usuario
2. Modifica los campos en el modal
3. Haz clic en "Update User"

### Eliminar usuario
1. Haz clic en el ícono de eliminar (basura) en la fila del usuario
2. Confirma la eliminación en el modal

### Cambiar tema
Haz clic en el botón de sol/luna en el header para alternar entre modo oscuro y claro.

## Funcionalidades Implementadas

### Obligatorias
-  Vista de usuarios con todas las secciones
-  Estadísticas generales
-  Gráfico circular con estadísticas
-  Tabla de usuarios con paginación
-  Consumo de API mock
-  Diseño responsive
-  Código limpio y estructurado

### Extras
-  Búsqueda de usuarios
-  CRUD completo (crear, editar, eliminar)
-  Ordenamiento en columnas
-  Modo oscuro/claro
-  Pruebas unitarias

##  Configuración

### Variables de Entorno

El proyecto usa las siguientes variables (con valores por defecto):

- `NEXT_PUBLIC_API_URL` - URL del servidor API (default: `http://localhost:8000`)

### Constantes

Las constantes están definidas en `utils/constants.js`:
- `ITEMS_PER_PAGE` - Número de items por página (default: 10)
- `DEBOUNCE_DELAY` - Delay para búsqueda (default: 400ms)

##  Responsive Design

La aplicación está optimizada para:
-  Mobile (320px+)
-  Tablet (768px+)
-  Desktop (1024px+)

##  Solución de Problemas

### El servidor no responde
Asegúrate de que el servidor mock esté corriendo en `http://localhost:8000`

### Los estilos no se cargan
Ejecuta `npm run build` para generar los estilos de Tailwind

### Las pruebas fallan
Asegúrate de tener todas las dependencias instaladas: `npm install`
