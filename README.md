# Frontend de Sistema de Inventario 'Stocker'

Este proyecto es el frontend de una aplicación fullstack. El backend se puede encontrar en
https://github.com/ncorrea-13/sistInventario-back

## Requisitos previos

Asegúrate de tener instalados los siguientes programas en tu máquina:

- **Node.js**
- **npm** o **yarn**

## Configuración del proyecto

### Scripts disponibles

#### Frontend

- `dev`: Inicia el servidor de desarrollo de Next.js.
- `build`: Compila la aplicación para producción.
- `start`: Inicia la aplicación en modo producción.

### Dependencias principales

#### Frontend

- `next`: Framework para el frontend.
- `react` y `react-dom`: Librerías para construir interfaces de usuario.
- `tailwindCss`: Framework para CSS

### Dependencias de desarrollo

#### Frontend

- Tipos para React y TypeScript.

### 1. Clonar el repositorio

```bash
git clone https://github.com/ncorrea-13/sistInventario-front
cd sistInventario-front
```

### 2. Configurar el frontend

1. Ve al directorio `frontend`:

   ```bash
   cd ../frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env.local` en el directorio `frontend` (si no existe ya).
   - Añade la URL de la API del backend:

     ```env
     NEXT_PUBLIC_API_URL=/api
     ```

### 3. Ejecutar el proyecto localmente

1. Inicia el backend:

   ```bash
   cd backend
   npm run dev
   ```

2. Inicia el frontend:

   ```bash
   cd ../frontend
   npm run dev
   ```

3. Abre tu navegador y ve a `http://localhost:3000` para ver la aplicación.

## Tecnologías utilizadas

- **React**
- **TypeScript**
- **Next.js**
- **TailWindCss**

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes una idea para mejorar el proyecto, no dudes en abrir un issue o enviar un pull request.

---

¡Gracias por usar este proyecto! 😊
