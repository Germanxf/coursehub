# CourseHub API 🚀

API REST desarrollada con **NestJS**, **TypeScript**, **TypeORM** y **PostgreSQL** para la gestión integral de cursos, estudiantes y matrículas (*Enrollments*).

---

## 🏗️ Arquitectura y Estructura del Proyecto

El proyecto está modularizado en tres módulos funcionales principales registrados en `AppModule`:
- **`CoursesModule`**: Administración de cursos con filtros, ordenamiento seguro y paginación controlada.
- **`StudentsModule`**: Gestión de estudiantes con filtros, control de estado activo/inactivo y validaciones de unicidad de correo.
- **`EnrollmentsModule`**: Administración de matrículas persistentes con búsqueda textual insensible a mayúsculas (`ILIKE`), carga de relaciones (`student`, `course`), filtros combinables y paginación mediante `QueryBuilder`.

```
src/
├── app.controller.ts
├── app.module.ts                   # Registra TypeORM y módulos funcionales
├── app.service.ts
├── main.ts                         # Configuración de ValidationPipe global
├── welcome.controller.ts
├── welcome.service.ts
├── courses/
│   ├── courses.controller.ts       # Endpoint GET /courses paginado y ordenable
│   ├── courses.module.ts
│   ├── courses.service.ts          # findAndCount con skip, take y ordenamiento
│   ├── dto/
│   │   ├── create-course.dto.ts    # title y level
│   │   ├── courses-query.dto.ts    # DTO con level, page, limit, sortBy, order
│   │   └── update-couerse.dto.ts
│   └── entities/
│       └── course.entity.ts        # Campos: id, title, level
├── students/
│   ├── students.controller.ts
│   ├── students.module.ts
│   ├── students.service.ts
│   ├── dto/
│   │   ├── create-student.dto.ts
│   │   ├── get-students-filter.dto.ts
│   │   ├── update-student-status.dto.ts
│   │   └── update-student.dto.ts
│   ├── entities/
│   │   └── student.entity.ts
│   └── pipes/
│       └── parse-id.pipe.ts        # Pipe para validar enteros positivos (> 0)
└── enrollments/
    ├── enrollments.controller.ts   # Endpoints de matrículas con QueryBuilder
    ├── enrollments.module.ts
    ├── enrollments.service.ts      # QueryBuilder con :search, leftJoinAndSelect, skip/take
    ├── dto/
    │   ├── create-enrollment.dto.ts
    │   ├── enrollments-query.dto.ts # DTO con search, studentId, courseId, activeOnly, page, limit
    │   └── get-enrollments-filter.dto.ts
    └── entities/
        └── enrollment.entity.ts
```

---

## ⚙️ Instalación y Ejecución

### 1. Variables de Entorno (`.env`)
Configurar el archivo `.env` en la raíz del proyecto basándose en `.env.example`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=coursehub
DATABASE_USER=postgres
DATABASE_PASSWORD=tucontraseña
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar la aplicación
```bash
# Modo desarrollo (watch)
npm run start:dev

# Compilar proyecto
npm run build
```

### 4. Ejecutar Pruebas y Linter
```bash
# Pruebas unitarias
npm run test

# Verificación de código (Linter)
npm run lint
```

---

## 🔍 Semana 6: Consultas de Datos, Paginación y QueryBuilder

### 1. Parámetros de Consulta y Valores por Defecto

#### A. Cursos (`GET /courses` - `CoursesQueryDto`)
| Parámetro | Tipo | Requerido | Valor por defecto | Validaciones / Restricciones |
| :--- | :---: | :---: | :---: | :--- |
| `level` | `string` | No | `undefined` | Filtro exacto por nivel del curso. |
| `page` | `number` | No | `1` | Entero positivo `>= 1`. |
| `limit` | `number` | No | `10` | Entero positivo entre `1` y `50`. |
| `sortBy` | `string` | No | `'id'` | Lista permitida: `'id'`, `'title'`, `'level'`. |
| `order` | `string` | No | `'ASC'` | Lista permitida: `'ASC'`, `'DESC'` (insensible a mayúsculas/minúsculas). |

#### B. Matrículas (`GET /enrollments` - `EnrollmentsQueryDto`)
| Parámetro | Tipo | Requerido | Valor por defecto | Validaciones / Restricciones |
| :--- | :---: | :---: | :---: | :--- |
| `search` | `string` | No | `undefined` | Coincidencia parcial insensible a mayúsculas (`ILIKE`) en nombre de estudiante o título de curso. |
| `studentId` | `number` | No | `undefined` | Entero positivo `>= 1`. |
| `courseId` | `number` | No | `undefined` | Entero positivo `>= 1`. |
| `activeOnly` | `string` | No | `undefined` | Booleano en cadena (`'true'` / `'false'`). Si es `'true'`, filtra solo estudiantes activos. |
| `page` | `number` | No | `1` | Entero positivo `>= 1`. |
| `limit` | `number` | No | `10` | Entero positivo entre `1` y `50`. |

---

### 2. Formato del Contrato de Respuesta Paginada

Tanto `GET /courses` como `GET /enrollments` retornan una estructura uniforme con `items` y `meta`:

```json
{
  "items": [
    {
      "id": 1,
      "title": "NestJS Fundamentals",
      "level": "principiante"
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

- Si una búsqueda o filtro no produce coincidencias, la API responde con código `200 OK` y `items: []` (no `404`, pues la colección existe).
- `skip = (page - 1) * limit` asegura páginas no solapadas y consistentes.

---

### 3. Seguridad y Validación

1. **Prevención de Inyección SQL**: La búsqueda en matrículas utiliza marcadores de posición parametrizados en `SelectQueryBuilder`:
   ```ts
   qb.andWhere('(student.name ILIKE :search OR course.title ILIKE :search)', {
     search: `%${query.search.trim()}%`,
   });
   ```
   Nunca se interpola texto del cliente directamente en la consulta SQL.
2. **Lista Permitida (Allowlist) en Ordenamiento**: Solo los campos autorizados (`id`, `title`, `level`) y las direcciones (`ASC`, `DESC`) son admitidos. Cualquier otro valor es rechazado con `400 Bad Request`.
3. **Validación Global (`ValidationPipe`)**: Transforma los query strings a sus tipos reales (`number`, etc.) y rechaza parámetros fuera de rango (`page < 1`, `limit > 50`) con `400 Bad Request`.

---

## 🌐 Ejemplos de URLs de Consulta

### Ejemplo 1: Listado paginado de cursos con ordenamiento
```http
GET /courses?page=1&limit=5&sortBy=title&order=ASC
```
**Respuesta:** `200 OK`
```json
{
  "items": [
    { "id": 3, "title": "Arquitectura de Software", "level": "avanzado" },
    { "id": 1, "title": "Fundamentos de NestJS", "level": "principiante" },
    { "id": 2, "title": "TypeScript Avanzado", "level": "intermedio" }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  }
}
```

### Ejemplo 2: Filtrado de cursos por nivel
```http
GET /courses?level=principiante&page=1&limit=10
```
**Respuesta:** `200 OK`
```json
{
  "items": [
    { "id": 1, "title": "Fundamentos de NestJS", "level": "principiante" }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Ejemplo 3: Búsqueda textual y filtro activo en matrículas relacionadas
```http
GET /enrollments?search=nest&activeOnly=true&page=1&limit=5
```
**Respuesta:** `200 OK`
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
        "title": "Fundamentos de NestJS",
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

### Ejemplo 4: Filtrado combinado de matrículas por estudiante y curso
```http
GET /enrollments?studentId=1&courseId=2
```
**Respuesta:** `200 OK`
```json
{
  "items": [
    {
      "id": 2,
      "student": {
        "id": 1,
        "name": "Ana García",
        "email": "ana@example.com",
        "semester": 4,
        "isActive": true
      },
      "course": {
        "id": 2,
        "title": "TypeScript Avanzado",
        "level": "intermedio"
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

### Ejemplo 5: Petición inválida rechazada por validación
```http
GET /courses?page=0&limit=100&sortBy=invalido
```
**Respuesta:** `400 Bad Request`
```json
{
  "message": [
    "page must not be less than 1",
    "limit must not be greater than 50",
    "sortBy must be one of the following values: id, title, level"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Ejemplo 6: Búsqueda sin coincidencias (colección vacía)
```http
GET /enrollments?search=registroinexistente
```
**Respuesta:** `200 OK`
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

---

## 📋 Tabla Completa de Endpoints de la API

| Módulo | Método | Endpoint | Descripción | Parámetros Query / Body | Código Éxito | Códigos Error |
| :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| **App** | `GET` | `/` | Estado general de la API | N/A | `200 OK` | - |
| **Courses** | `GET` | `/courses` | Listar cursos paginados | Query: `level`, `page`, `limit`, `sortBy`, `order` | `200 OK` | `400` |
| **Courses** | `GET` | `/courses/:id` | Obtener curso por ID | Param: `id` | `200 OK` | `404` |
| **Courses** | `POST` | `/courses` | Crear nuevo curso | Body: `CreateCourseDto` (`title`, `level`) | `201 Created` | `400` |
| **Courses** | `PATCH` | `/courses/:id` | Modificar curso | Param: `id`, Body: `UpdateCourseDto` | `200 OK` | `400, 404` |
| **Courses** | `DELETE` | `/courses/:id` | Eliminar curso | Param: `id` | `200 OK` | `404` |
| **Students** | `GET` | `/students` | Listar estudiantes | Query: `career`, `semester`, `isActive` | `200 OK` | `400` |
| **Students** | `GET` | `/students/:id` | Obtener estudiante por ID | Param: `id` (ParseIdPipe) | `200 OK` | `400, 404` |
| **Students** | `POST` | `/students` | Registrar estudiante | Body: `CreateStudentDto` | `201 Created` | `400, 409` |
| **Students** | `PATCH` | `/students/:id` | Actualizar estudiante | Param: `id`, Body: `UpdateStudentDto` | `200 OK` | `400, 404, 409` |
| **Students** | `PATCH` | `/students/:id/status` | Cambiar estado activo/inactivo | Param: `id`, Body: `UpdateStudentStatusDto` | `200 OK` | `400, 404` |
| **Students** | `DELETE` | `/students/:id` | Eliminar estudiante | Param: `id` (ParseIdPipe) | `200 OK` | `400, 404` |
| **Enrollments** | `POST` | `/enrollments` | Registrar matrícula | Body: `CreateEnrollmentDto` | `201 Created` | `400, 404, 409` |
| **Enrollments** | `GET` | `/enrollments` | Listar matrículas con búsqueda/relaciones | Query: `search`, `studentId`, `courseId`, `activeOnly`, `page`, `limit` | `200 OK` | `400` |
| **Enrollments** | `GET` | `/enrollments/:id` | Obtener matrícula por ID | Param: `id` (ParseIdPipe) | `200 OK` | `400, 404` |
| **Enrollments** | `GET` | `/students/:studentId/enrollments` | Matrículas de un estudiante | Param: `studentId` (ParseIdPipe) | `200 OK` | `400, 404` |
| **Enrollments** | `GET` | `/courses/:courseId/enrollments` | Matrículas de un curso | Param: `courseId` (ParseIdPipe) | `200 OK` | `400, 404` |
| **Enrollments** | `DELETE` | `/enrollments/:id` | Cancelar matrícula | Param: `id` (ParseIdPipe) | `200 OK` | `400, 404` |
