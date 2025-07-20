# Babel Candidates API

API REST profesional desarrollada con NestJS para gestión de candidatos con carga de archivos Excel y CSV.

## Stack Tecnológico

- **Backend**: NestJS (TypeScript)
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: class-validator, class-transformer
- **Procesamiento de Archivos**: xlsx, multer
- **Testing**: Jest
- **Linting**: ESLint, Prettier

## Requisitos del Sistema

- **Node.js**: v18 o superior
- **PostgreSQL**: v12 o superior
- **npm**: v8 o superior

## Instalación Rápida

### 1. Clonar e instalar dependencias

```bash
git clone <repository-url>
cd babel/backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tu configuración:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/babel_candidates?schema=public"
PORT=3000
```

### 3. Configurar base de datos

#### Opción A: Con Docker (Recomendado)

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Configurar base de datos
npx prisma generate
npx prisma migrate dev --name init
```

#### Opción B: PostgreSQL local

```bash
# Crear base de datos manualmente en PostgreSQL
createdb babel_candidates

# Configurar Prisma
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Iniciar la aplicación

```bash
# Desarrollo (con hot reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

## Endpoints de la API

### POST /candidates

Crea un nuevo candidato con archivo Excel/CSV.

**Parámetros (FormData):**

- `name` (string, required): Nombre del candidato
- `surname` (string, required): Apellido del candidato
- `file` (file, required): Archivo Excel (.xlsx, .xls) o CSV (.csv)

**Formato del archivo:**
El archivo debe contener una fila con 3 valores en cualquier orden:

- `seniority`: "junior" o "senior"
- `yearsOfExperience`: número entero positivo
- `availability`: true/false

**Ejemplos de archivos válidos:**

```csv
junior,3,true
```

```csv
senior,8,false
```

```csv
seniority,yearsOfExperience,availability
junior,2,true
```

**Respuesta exitosa (201):**

```json
{
  "id": 1,
  "name": "John",
  "surname": "Doe",
  "seniority": "junior",
  "yearsOfExperience": 3,
  "availability": true,
  "createdAt": "2025-07-20T20:00:00.000Z"
}
```

### GET /candidates

Obtiene todos los candidatos ordenados por fecha de creación descendente.

**Respuesta (200):**

```json
[
  {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "seniority": "junior",
    "yearsOfExperience": 3,
    "availability": true,
    "createdAt": "2025-07-20T20:00:00.000Z"
  }
]
```

## Testing

### Ejecutar tests

```bash
# Tests unitarios
npm run test

# Tests con watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Probar la API

#### Con cURL:

```bash
# Crear candidato
curl -X POST http://localhost:3000/candidates \
  -F "name=John" \
  -F "surname=Doe" \
  -F "file=@examples/candidate-junior.csv"

# Obtener candidatos
curl http://localhost:3000/candidates
```

#### Con archivos de ejemplo:

Los archivos en `examples/` pueden usarse para testing:

- `candidate-junior.csv`
- `candidate-senior.csv`
- `candidate-with-headers.csv`
- `postman-test.csv`
- `senior-test.csv`

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Iniciar con hot reload
npm run start:debug        # Iniciar con debugger

# Producción
npm run build              # Compilar aplicación
npm run start:prod         # Iniciar en producción

# Base de datos
npx prisma generate        # Generar cliente Prisma
npx prisma migrate dev     # Ejecutar migraciones
npx prisma migrate reset   # Reset completo de BD
npx prisma studio          # Interfaz web para BD

# Calidad de código
npm run lint               # Ejecutar ESLint
npm run format             # Formatear con Prettier

# Testing
npm run test               # Tests unitarios
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Coverage report
```

## Validaciones

### Archivo

- **Tipos permitidos**: .xlsx, .xls, .csv
- **Estructura**: Mínimo 1 fila con 3 columnas
- **Detección automática**: Los valores se detectan por tipo, no por posición

### Datos

- **name/surname**: Strings no vacíos
- **seniority**: Solo "junior" o "senior" (case-insensitive)
- **yearsOfExperience**: Entero positivo
- **availability**: Boolean (true/false como string o boolean)

## Manejo de Errores

La API retorna errores HTTP detallados:

```json
{
  "statusCode": 400,
  "message": "Seniority must be \"junior\" or \"senior\"",
  "error": "Bad Request"
}
```

**Códigos de error comunes:**

- `400`: Datos inválidos o archivo mal formateado
- `500`: Error interno del servidor

## Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada
├── app.module.ts              # Módulo principal
├── candidates/                # Módulo de candidatos
│   ├── candidates.controller.ts
│   ├── candidates.service.ts
│   ├── candidates.module.ts
│   ├── candidates.controller.spec.ts
│   └── dto/
│       └── candidate.dto.ts
└── types/                     # Definiciones de tipos
    └── multer.d.ts

prisma/
├── schema.prisma              # Esquema de BD
├── prisma.service.ts          # Servicio Prisma
├── prisma.module.ts           # Módulo Prisma
└── migrations/                # Historial de migraciones

examples/                      # Archivos de prueba
├── candidate-junior.csv
├── candidate-senior.csv
└── README.md

test/                          # Tests e2e
└── app.e2e-spec.ts
```

## Configuración de Desarrollo

### VS Code (Recomendado)

Extensiones útiles:

- Prisma
- TypeScript Importer
- ESLint
- Prettier

### Variables de Entorno

```env
# Obligatorias
DATABASE_URL="postgresql://user:pass@host:port/database"

# Opcionales
PORT=3000
NODE_ENV=development
```

## Deployment

### Preparar para producción

```bash
# 1. Construir aplicación
npm run build

# 2. Ejecutar migraciones
npx prisma migrate deploy

# 3. Iniciar aplicación
npm run start:prod
```

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## Troubleshooting

### Base de datos

```bash
# Verificar conexión
npx prisma db push

# Reset completo
npx prisma migrate reset

# Ver datos
npx prisma studio
```

### Problemas comunes

1. **Error de conexión a BD**: Verificar `DATABASE_URL` en `.env`
2. **Archivos no procesados**: Verificar tipo MIME del archivo
3. **Tests fallan**: Ejecutar `npm run test:cov` para ver coverage

## Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## License

MIT License - ver archivo LICENSE para detalles.
