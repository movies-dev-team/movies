# CINEA

CINEA es una aplicación web de cine que permite descubrir películas, consultar información sobre sus actores y directores, guardar películas favoritas y registrar valoraciones personales. El proyecto combina información cinematográfica de The Movie Database (TMDb) con una zona privada de usuario gestionada mediante Supabase.

Desarrollado en equipo como proyecto formativo de programación frontend, con React, TypeScript y un enfoque de diseño responsive **mobile-first**.

<!-- EQUIPO: añadir aquí el enlace a la aplicación desplegada y una captura de la interfaz principal. -->

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Instalación y configuración](#instalación-y-configuración)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Integración con servicios externos](#integración-con-servicios-externos)
- [Diseño y experiencia de usuario](#diseño-y-experiencia-de-usuario)
- [Testing](#testing)
- [Flujo de trabajo](#flujo-de-trabajo)
- [Equipo](#equipo)

## Funcionalidades

### Catálogo y búsqueda

- Exploración del catálogo de películas.
- Búsqueda por título, con normalización de texto y carga de resultados adicionales.
- Filtros por género y puntuación; selección de tendencias.
- Carrusel de películas y acceso a sus fichas detalladas.

<!-- EQUIPO: completar el funcionamiento de filtros, carruseles y paginación. -->

### Autenticación y perfil

- Registro e inicio de sesión.
- Acceso a funcionalidades privadas mediante autenticación.
- Gestión del perfil de usuario y cierre de sesión.

<!-- EQUIPO: describir las validaciones, protección de rutas y opciones concretas del perfil. -->

### Favoritos

- Añadir y eliminar películas de la lista de favoritos.
- Consultar las películas guardadas desde el área personal.

<!-- EQUIPO: completar la gestión del estado, persistencia y comportamiento de favoritos. -->

### Detalle de películas

Cada película dispone de una ficha que reúne:

- Título, póster, duración, géneros y puntuación de TMDb.
- Sinopsis expandible cuando supera los 150 caracteres.
- Ficha técnica con director, fecha de estreno, productoras, idioma original y países de origen.
- Reparto con fotografías, nombres y personajes, con enlaces a las fichas de los actores.
- Enlace a la ficha del director.
- Tráiler oficial de YouTube, priorizando el español y recurriendo al inglés cuando no existe uno válido en español.
- Acciones de favoritos y valoración personal.

Se contemplan estados de carga, errores, identificadores inválidos y ausencia de tráiler o de determinados datos.

### Detalle de actores y directores

Las fichas de personas comparten componentes para presentar la fotografía, el nombre, la fecha y el lugar de nacimiento (cuando están disponibles), la biografía y la filmografía.

- Biografía expandible cuando supera los 300 caracteres, con mensaje alternativo si está vacía.
- Filmografía ordenada por fecha de estreno, de más reciente a más antigua.
- Visualización inicial limitada, con opciones para mostrar más o menos películas.
- En las fichas de actores se muestran sus créditos de reparto; en las de directores, únicamente los créditos con el trabajo `Director`.
- Tarjetas de películas con póster, título y año, cuando están disponibles.
- Navegación hacia las películas de la filmografía y regreso a la película de origen o al catálogo.

### Valoración de películas

El usuario autenticado puede consultar, asignar y modificar su valoración personal mediante una escala de 1 a 10 estrellas, independiente de la puntuación pública de TMDb.

Las valoraciones se guardan en la tabla `reviews` de Supabase, asociadas al usuario y a la película. Se validan los valores enteros entre 1 y 10, se evitan guardados simultáneos y se muestran notificaciones de éxito o error. Si falla el guardado, se conserva la valoración anterior.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| React | Interfaz y gestión del estado |
| TypeScript | Tipado estático |
| Vite | Desarrollo y compilación |
| Tailwind CSS | Estilos y diseño responsive |
| shadcn/ui | Componentes de interfaz |
| React Router | Navegación |
| Axios | Peticiones HTTP a TMDb |
| TMDb API | Información cinematográfica |
| Supabase | Autenticación y persistencia de datos |
| Lucide React | Iconografía |
| Sonner | Notificaciones |
| Vitest y React Testing Library | Pruebas automatizadas |
| ESLint | Análisis estático del código |

## Instalación y configuración

### Requisitos

- Node.js y npm, en versiones compatibles con las dependencias del proyecto.
- Una clave de API de TMDb.
- Acceso a un proyecto Supabase configurado para CINÉA.

<!-- EQUIPO: confirmar versión recomendada de Node.js y documentar la configuración inicial de Supabase (esquema, migraciones y políticas RLS). -->

### Instalación local

```bash
git clone https://github.com/movies-dev-team/movies.git
cd movies
npm ci
```

### Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```dotenv
VITE_TMDB_API_KEY=tu_clave_de_tmdb
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publicable_de_supabase
```

No subir archivos con credenciales reales al repositorio. Las variables con prefijo `VITE_` están disponibles en el código cliente; nunca deben contener claves privadas de servidor ni la clave `service_role` de Supabase. La seguridad de los datos debe estar respaldada por las políticas de acceso de la base de datos.

### Ejecutar la aplicación

```bash
npm run dev
```

Abrir la URL local que indique Vite en la terminal.

### Otros comandos

| Comando | Descripción |
| --- | --- |
| `npm run build` | Comprobar tipos y generar la compilación de producción |
| `npm run preview` | Previsualizar la compilación localmente |
| `npm run lint` | Analizar el código con ESLint |
| `npm run test` | Ejecutar Vitest en modo interactivo |
| `npm run test:run` | Ejecutar las pruebas una sola vez |

## Arquitectura del proyecto

La aplicación se organiza por funcionalidades (*feature-based architecture*), separando las páginas, los componentes, los servicios, los tipos y los hooks según su responsabilidad. Los elementos reutilizables se concentran en carpetas compartidas.

```text
src/
├── assets/                 # Recursos estáticos
├── components/ui/          # Componentes base de interfaz
├── data/                   # Textos centralizados (content.json)
├── features/
│   ├── auth/               # Autenticación
│   ├── catalog/            # Catálogo y búsqueda
│   ├── details/            # Películas, actores, directores y valoraciones
│   ├── favorites/          # Películas favoritas
│   └── profile/            # Perfil de usuario
├── layout/                 # Estructuras de navegación y presentación
├── lib/                    # Configuración y utilidades de librerías
├── pages/                  # Páginas generales
├── router/                 # Definición de rutas
├── shared/                 # Componentes, constantes, servicios y utilidades
└── test/                   # Configuración y pruebas compartidas
```

Estructura simplificada, no exhaustiva. Dentro de `details/` se distinguen `components/`, `pages/`, `services/`, `types/` y `tests/`; el hook de valoraciones reside en `services/hooks/`.

Los textos de interfaz se centralizan en `src/data/content.json`. Las importaciones pueden utilizar el alias `@/` para acceder a `src/`.

### Navegación

Entre las rutas de la zona privada se encuentran:

| Ruta | Funcionalidad |
| --- | --- |
| `/app` | Catálogo |
| `/app/movie/:id` | Detalle de película |
| `/app/actor/:id` | Detalle de actor |
| `/app/director/:id` | Detalle de director |

<!-- EQUIPO: completar rutas públicas, autenticación, favoritos y perfil a partir del router definitivo. -->

## Integración con servicios externos

### The Movie Database (TMDb)

La aplicación utiliza la API de TMDb v3 mediante una instancia compartida de Axios (`src/shared/services/tmdbApi.ts`).

Base URL: `https://api.themoviedb.org/3/`.

Principales consultas del módulo Details:

| Endpoint | Finalidad |
| --- | --- |
| `movie/{movie_id}` | Detalle de película, con `append_to_response=images,credits` |
| `person/{person_id}` | Detalle de persona, con `append_to_response=movie_credits` |
| `movie/{movie_id}/videos` | Búsqueda de tráiler oficial de YouTube en español o inglés |

Las imágenes se construyen a partir de las rutas proporcionadas por TMDb y su servicio de imágenes. El tráiler se integra mediante un reproductor de YouTube con el dominio `youtube-nocookie.com`.

Documentación: [TMDb API](https://developer.themoviedb.org/).

### Supabase

El cliente se configura en `src/lib/supabaseClient.ts` mediante `@supabase/supabase-js`.

En el módulo de valoraciones, `ratingsService.ts` verifica el usuario autenticado, consulta su valoración por `user_id` y `movie_id` y utiliza `upsert` con `onConflict: "user_id,movie_id"` para insertar o actualizar el registro. El hook `useMovieRating` gestiona los estados de carga y guardado y las notificaciones; `MovieRatingControl` conecta el hook con el componente de estrellas `MovieRating`.

<!-- EQUIPO: documentar tablas de perfiles y favoritos, restricciones, RLS y procedimiento de configuración del backend. -->

Documentación: [Supabase](https://supabase.com/docs).

## Diseño y experiencia de usuario

La interfaz sigue un enfoque mobile-first, con adaptación progresiva a pantallas de mayor tamaño. Las fichas de películas, actores y directores mantienen una estructura visual coherente y reutilizan componentes para la presentación de información.

Se han incorporado estados de carga, mensajes de error, alternativas para fotografías o datos ausentes en los componentes correspondientes, controles de expansión y navegación mediante enlaces. Los controles interactivos incluyen etiquetas accesibles y estilos de foco; esto no sustituye una auditoría completa de accesibilidad.

<!-- EQUIPO: añadir capturas de móvil y escritorio, paleta visual y decisiones de diseño. -->

## Testing

Se utilizan Vitest, React Testing Library, jest-dom, user-event y jsdom. Los informes de cobertura se generan mediante el proveedor V8 de Vitest.

### Estrategia

- **Escenarios Gherkin:** definición de comportamientos esperados mediante `Feature`, `Scenario`, `Given`, `When` y `Then`, con descripciones en español.
- **Pruebas unitarias:** comprobación de componentes, servicios, validaciones y hooks.
- **Pruebas de integración del frontend:** ejecución conjunta de páginas, componentes, hooks y servicios según el caso, con dependencias externas simuladas y navegación mediante `MemoryRouter`.

Los archivos `.feature` documentan los escenarios de comportamiento; no se presentan como pruebas Gherkin ejecutables automáticamente. Se utiliza testing automatizado, sin afirmar que se haya aplicado TDD en todo el desarrollo.

### Pruebas del módulo Details

| Archivo de prueba | Alcance principal |
| --- | --- |
| `PersonBiography.test.tsx` | Biografía, estados vacíos y expansión |
| `MovieOverview.test.tsx` | Sinopsis y expansión |
| `movieDetailService.test.ts` | Endpoint, parámetros, respuesta y errores |
| `personDetailService.test.ts` | Consulta de personas y errores |
| `movieTrailerService.test.ts` | Selección de tráiler, idiomas y errores |
| `MovieDetailPage.test.tsx` | Carga, información, tráiler, errores y navegación |
| `ActorDetailPage.test.tsx` | Datos personales, filmografía, errores y navegación |
| `DirectorDetailPage.test.tsx` | Filtrado de películas dirigidas, errores y navegación |
| `ratingsService.test.ts` | Autenticación, validación y operaciones de valoración |
| `useMovieRating.test.ts` | Estado, notificaciones, concurrencia y cambio de película |
| `MovieRatingControl.test.tsx` | Integración del hook con la interfaz de estrellas |
| `MovieRatingAPI.test.tsx` | Formato de la puntuación pública (componente compartido) |

Los escenarios de películas, actores, directores y valoraciones se encuentran en `src/test/features/`. Los fixtures compartidos de personas se encuentran en `src/features/details/tests/fixtures/`.

<!-- EQUIPO: complementar con las pruebas de autenticación, catálogo, favoritos y perfil. -->

### Ejecución y cobertura

Ejecutar toda la suite:

```bash
npm run test:run
```

Calcular la cobertura del código fuente ejecutable del proyecto, incluyendo los archivos que no se han probado:

```bash
npm run test:run -- --coverage --coverage.include="src/**/*.{ts,tsx}" --coverage.exclude="src/**/tests/**" --coverage.exclude="src/test/**" --coverage.exclude="src/**/*.test.*" --coverage.exclude="src/**/types/**" --coverage.exclude="src/**/*.d.ts"
```

Calcular únicamente la cobertura de Details:

```bash
npm run test:run -- src/features/details/tests --coverage --coverage.include="src/features/details/**/*.{ts,tsx}" --coverage.exclude="src/features/details/types/**" --coverage.exclude="src/features/details/tests/**"
```

El informe HTML se genera en `coverage/index.html`. La carpeta `coverage/` contiene archivos generados y debe permanecer fuera del control de versiones y del análisis de ESLint.

### Resultados registrados

Última ejecución local de la suite completa tras añadir las pruebas de valoraciones (26 de noviembre de 2026):

- **371 pruebas aprobadas de 371**, sin fallos.
- **30 archivos de pruebas aprobados de 30**.

Cobertura específica de Details tras completar las valoraciones:

| Indicador | Cobertura |
| --- | ---: |
| Sentencias (Statements) | 98,70 % |
| Ramas (Branches) | 88,26 % |
| Funciones (Functions) | 100 % |
| Líneas (Lines) | 98,64 % |

Los 18 archivos ejecutables del módulo tienen alguna cobertura. La última medición global completa disponible, anterior al bloque de valoraciones y al test adicional del error del tráiler, registró 55,49 % de sentencias, 52,02 % de ramas, 45,72 % de funciones y 55,98 % de líneas. Ambos informes superan el umbral del 20 % exigido en la evaluación del proyecto.

<!-- EQUIPO: actualizar la cobertura global y los totales tras integrar todos los cambios finales. -->

### Alcance y limitaciones

Las peticiones a TMDb y Supabase se simulan para obtener pruebas independientes y reproducibles. No se verifica la persistencia real, las políticas RLS de Supabase ni la comunicación con los servicios en producción. Tampoco se trata de una suite E2E completa: algunas pruebas de navegación utilizan páginas de destino simuladas. Los resultados anteriores corresponden a ejecuciones locales, no a una validación CI confirmada.

## Flujo de trabajo

El equipo utiliza Git y GitHub, con `main` como rama principal, `develop` como rama de integración y ramas específicas para nuevas funcionalidades y pruebas (por ejemplo, `feature/details`, `test/details` y `test/movie-ratings`).

Los cambios se integran mediante Pull Requests hacia `develop`, con commits descriptivos siguiendo Conventional Commits. Antes de integrar cambios, se recomienda ejecutar los tests, el build y ESLint.


## Equipo

Proyecto colaborativo desarrollado por el equipo CINEA.

EQUIPO:


Alejandro Felipe Acuña  https://github.com/alefelipin 

<!-- EQUIPO: añadir nombres, enlaces de GitHub y responsabilidades de los tres integrantes. Añadir también licencia y enlace de despliegue si corresponde. -->

Repositorio: [movies-dev-team/movies](https://github.com/movies-dev-team/movies).

---

Los datos cinematográficos y las imágenes proceden de TMDb. CINEA es un proyecto independiente y no está afiliado a TMDb ni cuenta con su respaldo.
