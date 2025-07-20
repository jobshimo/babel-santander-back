# Archivos de Ejemplo para Testing

Esta carpeta contiene archivos de ejemplo que puedes usar para probar la API de candidatos.

## Archivos Disponibles

- `candidate-junior.csv` - Candidato junior con 2 años de experiencia
- `candidate-senior.csv` - Candidato senior con 8 años de experiencia
- `candidate-with-headers.csv` - Archivo con headers para mejor comprensión
- `postman-test.csv` - Archivo de prueba para Postman/testing
- `senior-test.csv` - Archivo adicional para candidatos senior

## Formatos Válidos

Los archivos pueden tener los valores en cualquier orden, el sistema los detectará automáticamente:

### Ejemplo 1: Sin headers

```csv
junior,2,true
```

### Ejemplo 2: Candidato Senior

```csv
senior,8,false
```

### Ejemplo 3: Con headers

```csv
seniority,yearsOfExperience,availability
junior,3,true
```

### Ejemplo 4: Orden diferente

```csv
5,senior,false
```

## Tipos de Datos

- **seniority**: "junior" o "senior" (case insensitive)
- **yearsOfExperience**: número entero positivo
- **availability**: booleano (true/false, True/False, TRUE/FALSE)

## Usar con cURL

```bash
# Probar con archivo junior
curl -X POST http://localhost:3000/candidates \
  -F "name=John" \
  -F "surname=Doe" \
  -F "file=@examples/candidate-junior.csv"

# Probar con archivo senior
curl -X POST http://localhost:3000/candidates \
  -F "name=Jane" \
  -F "surname=Smith" \
  -F "file=@examples/candidate-senior.csv"
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
