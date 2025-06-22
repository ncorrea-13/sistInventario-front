# Frontend de Sistema de Inventario 'Stocker'

Este proyecto es el frontend de una aplicación fullstack. El backend se puede encontrar en
<https://github.com/ncorrea-13/sistInventario-back>

## Requisitos previos

Asegúrate de tener instalados los siguientes programas en tu computadora:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

## Configuración del proyecto

### Scripts disponibles

- `dev`: Inicia el servidor de desarrollo de Next.js.
- `build`: Compila la aplicación para producción.
- `start`: Inicia la aplicación en modo producción.

### Dependencias y tecnologías principales

- `typescript`: Lenguaje de programación utilizado para la web.
- `node`: Entorno para poder ejecutar apps utilizando JavaScript y TypeScript.
- `next`: Framework para el dinamismo de rutas.
- `react` y `react-dom`: Librerías para construir interfaces de usuario.
- `tailwindCss`: Framework para CSS

## Pasos para ejecutar el proyecto

Para su correcta implementación, es necesario haber levantado previamente el backend. En caso de no haberlo realizado, no se va a poder utilizar la aplicación correctamente.

### 1. Clonar el repositorio

```bash
git clone https://github.com/ncorrea-13/sistInventario-front
cd sistInventario-front
```

### 2. Instala las dependencias

   ```bash
   npm install
   ```

### 3. Configura las variables de entorno

- Crea un archivo `.env.local` en el directorio `frontend` (si no existe ya).
- Añade la URL de la API del backend:

     ```env
     NEXT_PUBLIC_API_URL=<url_de_la_API>/api
     ```

### 4. Ejecutar el proyecto localmente

   ```bash
   npm run dev
   ```

### 5. Abre tu navegador y ve a `http://localhost:3001` para ver la aplicación

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes una idea para mejorar el proyecto, no dudes en abrir un issue o enviar un pull request.

---

¡Gracias por usar este proyecto! 😊
