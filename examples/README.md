# Archivos de Ejemplo para Testing

Esta carpeta contiene archivos de ejemplo que puedes usar para probar la API de candidatos.

## Archivos CSV Disponibles

- `candidate-junior.csv` - Candidato junior con 2 años de experiencia
- `candidate-senior.csv` - Candidato senior con 8 años de experiencia
- `candidate-with-headers.csv` - Archivo con headers para mejor comprensión

## Archivos Excel Disponibles

- `candidate-junior.xlsx` - Candidato junior con 2 años de experiencia (formato Excel)
- `candidate-senior.xlsx` - Candidato senior con 8 años de experiencia (formato Excel)
- `candidate-with-headers.xlsx` - Archivo con headers (formato Excel)
- `candidate-multiple.xlsx` - Múltiples candidatos con diferentes niveles
- `candidate-complex.xlsx` - Ejemplo complejo con más campos (nombre, skills, ubicación)

## Formatos Válidos

Los archivos pueden tener los valores en cualquier orden, el sistema los detectará automáticamente. Se soportan tanto archivos CSV como Excel (.xlsx).

### Archivos de Ejemplo Simples

#### CSV - Ejemplo 1: Sin headers

```csv
junior,2,true
```

#### Excel - Ejemplo 2: Candidato Senior

Los archivos Excel (.xlsx) contienen la misma estructura pero en formato de hoja de cálculo.

#### CSV - Ejemplo 3: Con headers

```csv
seniority,yearsOfExperience,availability
junior,3,true
```

### Archivos Excel Especiales

- **candidate-multiple.xlsx**: Contiene varios candidatos en una sola hoja:
  - Junior (2 años)
  - Mid (5 años)
  - Senior (8 años)
  - Lead (12 años)

- **candidate-complex.xlsx**: Incluye campos adicionales como nombre, skills y ubicación para pruebas más avanzadas.

#### Ejemplo 4: Orden diferente

```csv
5,senior,false
```

## Tipos de Datos

- **seniority**: "junior" o "senior" (case insensitive)
- **yearsOfExperience**: número entero positivo
- **availability**: booleano (true/false, True/False, TRUE/FALSE)

## Usar con cURL

### Archivos CSV

```bash
# Probar con archivo junior CSV
curl -X POST http://localhost:3000/candidates \
  -F "name=John" \
  -F "surname=Doe" \
  -F "file=@examples/candidate-junior.csv"

# Probar con archivo senior CSV
curl -X POST http://localhost:3000/candidates \
  -F "name=Jane" \
  -F "surname=Smith" \
  -F "file=@examples/candidate-senior.csv"
```

### Archivos Excel

```bash
# Probar con archivo junior Excel
curl -X POST http://localhost:3000/candidates \
  -F "name=John" \
  -F "surname=Doe" \
  -F "file=@examples/candidate-junior.xlsx"

# Probar con múltiples candidatos Excel
curl -X POST http://localhost:3000/candidates \
  -F "name=Multiple" \
  -F "surname=Candidates" \
  -F "file=@examples/candidate-multiple.xlsx"

# Probar con ejemplo complejo Excel
curl -X POST http://localhost:3000/candidates \
  -F "name=Complex" \
  -F "surname=Example" \
  -F "file=@examples/candidate-complex.xlsx"
```

## Respuesta Esperada

```json
{
  "id": 1,
  "name": "John",
  "surname": "Doe",
  "seniority": "junior",
  "yearsOfExperience": 2,
  "availability": true,
  "createdAt": "2025-07-20T20:00:00.000Z"
}
```

## Validaciones

Todos los archivos deben cumplir:

1. Contener exactamente 3 valores por fila de datos
2. Un valor debe ser "junior" o "senior"
3. Un valor debe ser un número positivo
4. Un valor debe ser un booleano (true/false)

El sistema ignora headers y detecta automáticamente el tipo de cada valor.
