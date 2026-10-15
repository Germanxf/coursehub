# 🎓 GUÍA DE DEMOSTRACIÓN — SEMANA 6 (CONSULTAS DE DATOS)
## CourseHub API

Esta guía contiene el paso a paso estructurado para ejecutar las 7 pruebas de la **demostración requerida** de la **Semana 6**, evidenciando filtros, búsqueda textual con `QueryBuilder`, ordenamiento seguro, paginación con `skip`/`take` y respuestas consistentes con metadatos.

---

### 🚀 Preparación Inicial del Entorno

1. Iniciar la base de datos PostgreSQL y verificar variables en `.env`.
2. Iniciar el servidor NestJS:
   ```bash
   npm run start:dev
   ```
   Servidor escuchando en: `http://localhost:3000`

---

## 🧪 GUION DE DEMOSTRACIÓN (7 Pasos Obligatorios)

---

### PASO 1: Crear suficientes cursos para mostrar dos páginas de resultados
> **Objetivo**: Poblar la base de datos con al menos 6 cursos con niveles variados para poder paginar con `limit=3`.
> **Nota**: El curso solo contiene los campos `title` y `level` (valores válidos: `principiante`, `intermedio`, `avanzado`).

Ejecutar `POST http://localhost:3000/courses` con los siguientes cuerpos:

- **Curso 1**:
  ```json
  { "title": "NestJS Básico", "level": "principiante" }
  ```
- **Curso 2**:
  ```json
  { "title": "TypeScript Avanzado", "level": "avanzado" }
  ```
- **Curso 3**:
  ```json
  { "title": "Bases de Datos con PostgreSQL", "level": "intermedio" }
  ```
- **Curso 4**:
  ```json
  { "title": "Arquitectura de Software", "level": "avanzado" }
  ```
- **Curso 5**:
  ```json
  { "title": "Diseño de APIs REST", "level": "principiante" }
  ```
- **Curso 6**:
  ```json
  { "title": "Microservicios con NestJS", "level": "intermedio" }
  ```

---

### PASO 2: Solicitar dos páginas consecutivas con el mismo ordenamiento (Sin repetir elementos)
> **Objetivo**: Demostrar que la paginación con `skip`/`take` y orden estable (`sortBy` y `order`) no repite registros entre páginas.

#### Página 1 (`page=1&limit=3&sortBy=id&order=ASC`)
- **Método**: `GET`
- **URL**: `http://localhost:3000/courses?page=1&limit=3&sortBy=id&order=ASC`
- **Código esperado**: `200 OK`
- **Respuesta esperada**:
  ```json
  {
    "items": [
      { "id": 1, "title": "NestJS Básico", "level": "principiante" },
      { "id": 2, "title": "TypeScript Avanzado", "level": "avanzado" },
      { "id": 3, "title": "Bases de Datos con PostgreSQL", "level": "intermedio" }
    ],
    "meta": {
      "total": 6,
      "page": 1,
      "limit": 3,
      "totalPages": 2
    }
  }
  ```

#### Página 2 (`page=2&limit=3&sortBy=id&order=ASC`)
- **Método**: `GET`
- **URL**: `http://localhost:3000/courses?page=2&limit=3&sortBy=id&order=ASC`
- **Código esperado**: `200 OK`
- **Respuesta esperada**:
  ```json
  {
    "items": [
      { "id": 4, "title": "Arquitectura de Software", "level": "avanzado" },
      { "id": 5, "title": "Diseño de APIs REST", "level": "principiante" },
      { "id": 6, "title": "Microservicios con NestJS", "level": "intermedio" }
    ],
    "meta": {
      "total": 6,
      "page": 2,
      "limit": 3,
      "totalPages": 2
    }
  }
  ```
*Evidencia*: Ningún curso de la página 1 se repite en la página 2.

---

### PASO 3: Filtrar cursos por nivel y comprobar los metadatos
> **Objetivo**: Validar el parámetro `level` y confirmar que `total` refleja el número de elementos filtrados.

- **Método**: `GET`
- **URL**: `http://localhost:3000/courses?level=principiante&page=1&limit=10`
- **Código esperado**: `200 OK`
- **Respuesta esperada**:
  ```json
  {
    "items": [
      { "id": 1, "title": "NestJS Básico", "level": "principiante" },
      { "id": 5, "title": "Diseño de APIs REST", "level": "principiante" }
    ],
    "meta": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

---

### PASO 4: Buscar matrículas por una parte del nombre de estudiante o título de curso
> **Objetivo**: Demostrar la búsqueda parcial (`ILIKE`) mediante `QueryBuilder` cargando datos relacionados (`student` y `course`).

(Crear previamente estudiantes y matricularlos si no existen):
- Estudiante 1: `Ana García`, `isActive: true`
- Estudiante 2: `Carlos López`, `isActive: false`
- Matrícula 1: Estudiante 1 en Curso 1 (`NestJS Básico`)

#### Petición de Búsqueda por "nest" (coincide con el título del curso):
- **Método**: `GET`
- **URL**: `http://localhost:3000/enrollments?search=nest`
- **Código esperado**: `200 OK`
- **Respuesta esperada**:
  ```json
  {
    "items": [
      {
        "id": 1,
        "student": {
          "id": 1,
          "name": "Ana García",
          "email": "ana@example.com",
          "semester": 4,
          "isActive": true
        },
        "course": {
          "id": 1,
          "title": "NestJS Básico",
          "level": "principiante"
        }
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

#### Petición de Búsqueda por "ana" (coincide con el nombre del estudiante):
- **Método**: `GET`
- **URL**: `http://localhost:3000/enrollments?search=ana`
- **Código esperado**: `200 OK`

---

### PASO 5: Combinar búsqueda, estudiante activo y paginación
> **Objetivo**: Validar la combinación de múltiples condiciones simultáneas en `QueryBuilder`.

- **Método**: `GET`
- **URL**: `http://localhost:3000/enrollments?search=nest&activeOnly=true&page=1&limit=5`
- **Código esperado**: `200 OK`
- **Respuesta esperada**:
  ```json
  {
    "items": [
      {
        "id": 1,
        "student": {
          "id": 1,
          "name": "Ana García",
          "email": "ana@example.com",
          "semester": 4,
          "isActive": true
        },
        "course": {
          "id": 1,
          "title": "NestJS Básico",
          "level": "principiante"
        }
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 5,
      "totalPages": 1
    }
  }
  ```

---

### PASO 6: Petición inválida que responde 400 Bad Request
> **Objetivo**: Verificar que los DTOs y el `ValidationPipe` rechazan parámetros inválidos antes de llegar a la base de datos.

- **Método**: `GET`
- **URL**: `http://localhost:3000/courses?page=0&limit=999&sortBy=invalido&order=DESVIADO`
- **Código esperado**: `400 Bad Request`
- **Respuesta esperada**:
  ```json
  {
    "message": [
      "page must not be less than 1",
      "limit must not be greater than 50",
      "sortBy must be one of the following values: id, title, level",
      "order must be one of the following values: ASC, DESC"
    ],
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

---

### PASO 7: Búsqueda sin resultados que responde colección vacía (200 OK)
> **Objetivo**: Demostrar la calidad del contrato: una búsqueda que no encuentra coincidencias responde `200 OK` con `items: []` y `total: 0`, y no un error `404`.

- **Método**: `GET`
- **URL**: `http://localhost:3000/enrollments?search=terminoquenoexiste12345`
- **Código esperado**: `200 OK`
- **Respuesta esperada**:
  ```json
  {
    "items": [],
    "meta": {
      "total": 0,
      "page": 1,
      "limit": 10,
      "totalPages": 0
    }
  }
  ```
