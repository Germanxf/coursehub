<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observer](https://observer.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

# Evaluación práctica: Integración Cursos, Estudiantes y Matrículas

API NestJS con listas en memoria (sin base de datos). Tres módulos: `CoursesModule`, `StudentsModule` y `EnrollmentsModule`.

## Integración de ramas

`feature/estudiantes` se integró en `main` con `git merge` (commit de merge verificable en `git log --graph`).
La rama tenía historia independiente y su proyecto estaba dentro de `Documents/NikolaiR8/coursehub/`, por lo que se usó:

```bash
git merge -X subtree=Documents/NikolaiR8/coursehub --allow-unrelated-histories origin/feature/estudiantes
```

Conflictos resueltos: se conservó Courses de `main`, se incorporó Students completo y se unificaron `app.module.ts`, `main.ts` y `package.json`.

## Estructura final

```
src/
├── app.module.ts            # registra Courses, Students y Enrollments
├── main.ts                  # ValidationPipe global (whitelist + forbidNonWhitelisted + transform)
├── common/pipes/positive-int.pipe.ts   # Pipe personalizado para ids de ruta
├── courses/                 # módulo de cursos (exporta CoursesService)
├── students/                # módulo de estudiantes (exporta StudentsService)
└── enrollments/
    ├── dto/create-enrollment.dto.ts
    ├── dto/filter-enrollments.dto.ts
    ├── enrollments.controller.ts   # sin reglas de negocio
    ├── enrollments.service.ts      # lista en memoria + reglas de negocio
    └── enrollments.module.ts
```

## Endpoints de matrículas

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/enrollments` | Registra una matrícula | 201, 400, 404, 409, 422 |
| GET | `/enrollments?studentId=&courseId=` | Lista con filtros opcionales combinables | 200, 400 |
| GET | `/students/:studentId/enrollments` | Matrículas de un estudiante | 200, 400, 404 |
| GET | `/courses/:courseId/enrollments` | Matrículas de un curso | 200, 400, 404 |
| DELETE | `/enrollments/:id` | Cancela una matrícula | 200, 400, 404 |

### Reglas de negocio (en `EnrollmentsService`)

1. El estudiante debe existir, si no **404**.
2. El curso debe existir, si no **404**.
3. El estudiante debe estar activo (`isActive`), si no **422**.
4. No puede repetirse la combinación `studentId + courseId`, si no **409**.

## Ejemplos

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

## Pruebas

```bash
npm run test -- src/enrollments
```
