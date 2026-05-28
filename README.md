# Ecos del Corazón 💌

Aplicación premium para crear **cartas de amor y reconciliación** con inteligencia artificial. Reconecta con tus seres queridos mediante palabras sinceras, personalizadas y guardadas de forma segura.

Repositorio original: [CARTAS-DE-AMOR](https://github.com/ADRIANAMCU98/CARTAS-DE-AMOR-)

## Características

- Generación de cartas con **Google Gemini**
- Inicio de sesión con **Google** (Firebase Auth)
- Historial privado en **Firestore**
- Diseño premium: tipografía editorial, papel de carta, sello de cera, animaciones suaves
- Selector de tono visual (romántico, poético, formal, etc.)
- Efecto máquina de escribir al revelar la carta
- Copiar y compartir cartas

## Requisitos

- Node.js 18+
- Cuenta de Firebase (Auth + Firestore)
- API Key de Gemini

## Instalación local

```bash
npm install
```

Crea un archivo `.env.local` en la raíz:

```env
GEMINI_API_KEY=tu_clave_de_gemini
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Scripts

| Comando        | Descripción              |
|----------------|--------------------------|
| `npm run dev`  | Desarrollo con Vite      |
| `npm run build`| Build de producción      |
| `npm run start`| Servidor en producción   |
| `npm run lint` | Verificación TypeScript  |

## Despliegue

La app está preparada para Vercel u otros hosts Node. Configura `GEMINI_API_KEY` y las variables de Firebase en el panel de secrets del hosting.

## Licencia

Proyecto personal — úsalo con amor.
