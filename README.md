# CourseHub

API REST desarrollada con [NestJS](https://nestjs.com) que gestiona **Cursos**, **Estudiantes** y **Matrículas** utilizando listas en memoria (sin base de datos). Proyecto realizado como evaluación práctica de integración de ramas (Asignatura: Aplicaciones para el servidor web).

## Instalación

```bash
npm install
```

## Ejecución

```bash
# desarrollo
npm run start

# desarrollo con recarga automática
npm run start:dev

# producción
npm run start:prod
```

## Pruebas

```bash
# pruebas unitarias
npm run test

# pruebas end-to-end
npm run test:e2e

# cobertura
npm run test:cov
```

---

## Integración de ramas

La rama `feature/estudiantes` (con historia independiente, ubicada originalmente en `Documents/NikolaiR8/coursehub/`) se integró en `main` mediante `git merge`, conservando el módulo `CoursesModule` ya existente e incorporando el módulo `StudentsModule` completo:

```bash
git merge -X subtree=Documents/NikolaiR8/coursehub --allow-unrelated-histories origin/feature/estudiantes
```

El commit de merge y la historia combinada son verificables con:

```bash
git log --graph --oneline --all
```

Tras el merge se unificaron `app.module.ts`, `main.ts` y `package.json`, y se registraron `CoursesModule`, `StudentsModule` y `EnrollmentsModule` en `AppModule`.

## Estructura final
src/
├── app.module.ts # registra Courses, Students y Enrollments
├── main.ts # ValidationPipe global (whitelist + forbidNonWhitelisted + transform)
├── common/
│ └── pipes/
│ └── positive-int.pipe.ts # Pipe personalizado para ids de ruta (entero positivo)
├── courses/ # módulo de cursos (exporta CoursesService)
│ ├── courses.controller.ts
│ ├── courses.service.ts
│ └── courses.module.ts
├── students/ # módulo de estudiantes (exporta StudentsService)
│ ├── dto/
│ │ ├── create-student.dto.ts
│ │ ├── update-student.dto.ts
│ │ └── filter-student.dto.ts
│ ├── entities/student.entity.ts
│ ├── pipes/parse-status.pipe.ts # valida el body de PATCH /students/:id/status
│ ├── students.controller.ts
│ ├── students.service.ts
│ └── students.module.ts
└── enrollments/
├── dto/
│ ├── create-enrollment.dto.ts
│ └── filter-enrollments.dto.ts
├── enrollments.controller.ts # sin reglas de negocio
├── enrollments.service.ts # lista en memoria + reglas de negocio
└── enrollments.module.ts

---

## Endpoints

### Cursos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/courses?level=` | Lista cursos, filtro opcional por nivel |
| GET | `/courses/:id` | Obtiene un curso |
| POST | `/courses` | Crea un curso |
| PATCH | `/courses/:id` | Actualiza un curso |
| DELETE | `/courses/:id` | Elimina un curso |

### Estudiantes

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/students` | Crea un estudiante | 201, 400, 409 |
| GET | `/students?career=&semester=&isActive=` | Lista con filtros opcionales combinables | 200 |
| GET | `/students/:id` | Obtiene un estudiante | 200, 404 |
| PATCH | `/students/:id` | Actualiza datos del estudiante | 200, 404, 409 |
| PATCH | `/students/:id/status` | Cambia exclusivamente `isActive` | 200, 400, 404 |
| DELETE | `/students/:id` | Elimina un estudiante (solo si está inactivo) | 200, 400, 404 |

### Matrículas

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/enrollments` | Registra una matrícula | 201, 400, 404, 409, 422 |
| GET | `/enrollments?studentId=&courseId=` | Lista con filtros opcionales combinables | 200, 400 |
| GET | `/students/:studentId/enrollments` | Matrículas de un estudiante | 200, 400, 404 |
| GET | `/courses/:courseId/enrollments` | Matrículas de un curso | 200, 400, 404 |
| DELETE | `/enrollments/:id` | Cancela una matrícula | 200, 400, 404 |

#### Reglas de negocio (en `EnrollmentsService`)

1. El estudiante debe existir, si no **404**.
2. El curso debe existir, si no **404**.
3. El estudiante debe estar activo (`isActive`), si no **422**.
4. No puede repetirse la combinación `studentId + courseId`, si no **409**.

El controlador (`EnrollmentsController`) no contiene lógica de negocio: solo delega en `EnrollmentsService`. La validación de los ids de ruta se hace con el Pipe personalizado `PositiveIntPipe`, y el body de entrada se valida con `CreateEnrollmentDto` / `FilterEnrollmentsDto` mediante el `ValidationPipe` global.

---

## Ejemplos de uso

Preparación: crear estudiantes (el módulo arranca vacío).

```bash
curl -X POST localhost:3000/students -H "Content-Type: application/json" \
  -d '{"name":"Ana Pérez","email":"ana@x.com","age":20,"career":"Software","semester":5}'

curl -X POST localhost:3000/students -H "Content-Type: application/json" \
  -d '{"name":"Luis Mora","email":"luis@x.com","age":22,"career":"Software","semester":6,"isActive":false}'
```

**Matrícula válida**: `POST /enrollments` `{"studentId":1,"courseId":1}`
```json
201 {"id":1,"studentId":1,"courseId":1}
```

**Matrícula duplicada**: mismo body
```json
409 {"message":"El estudiante 1 ya está matriculado en el curso 1","error":"Conflict","statusCode":409}
```

**Estudiante inactivo**: `{"studentId":2,"courseId":1}`
```json
422 {"message":"El estudiante 2 está inactivo y no puede matricularse","error":"Unprocessable Entity","statusCode":422}
```

**Identificador inexistente**: `{"studentId":99,"courseId":1}`
```json
404 {"message":"El estudiante con ID 99 no existe","error":"Not Found","statusCode":404}
```

**Body inválido**: `{"studentId":"abc","courseId":1,"extra":true}`
```json
400 {"message":["property extra should not exist","studentId must be a positive number","studentId must be an integer number"],"error":"Bad Request","statusCode":400}
```

**Filtros**: `GET /enrollments?studentId=1&courseId=2`
```json
200 [{"id":2,"studentId":1,"courseId":2}]
```

**Id de ruta inválido (Pipe)**: `GET /students/abc/enrollments`
```json
400 {"message":"El identificador de la ruta debe ser un entero positivo","error":"Bad Request","statusCode":400}
```

**Cancelación**: `DELETE /enrollments/1` responde `200 {"id":1,"studentId":1,"courseId":1}`; repetirlo responde `404`.

---

## Evidencia de la evaluación práctica

- ✅ **Merge e integración inicial**: merge verificable en `git log --graph`, Courses y Students conservados, tres módulos registrados en `AppModule`.
- ✅ **Diseño del módulo Matrículas**: `EnrollmentsModule`, `EnrollmentsController` y `EnrollmentsService` separados; datos administrados en memoria.
- ✅ **Flujos de matrícula**: registro, listado por estudiante/curso y cancelación mediante rutas REST.
- ✅ **Validación y reglas de negocio**: DTOs con `class-validator`, `ValidationPipe` global (`whitelist` + `forbidNonWhitelisted` + `transform`), `PositiveIntPipe` personalizado, y excepciones para existencia, estudiante activo y duplicados.
- ✅ **Pruebas y evidencia**: casos exitosos y fallidos documentados arriba; pruebas unitarias en `src/enrollments/enrollments.service.spec.ts` (`npm run test`); commits verificables en el historial del repositorio.
