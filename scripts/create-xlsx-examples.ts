import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

// Datos para los diferentes archivos de ejemplo
const exampleData: { [key: string]: (string | number | boolean)[][] } = {
  'candidate-junior': [
    ['seniority', 'yearsOfExperience', 'availability'],
    ['junior', 2, true],
  ],
  'candidate-senior': [['senior', 8, false]],
  'candidate-with-headers': [
    ['seniority', 'yearsOfExperience', 'availability'],
    ['junior', 3, true],
  ],
  'candidate-multiple': [
    ['seniority', 'yearsOfExperience', 'availability'],
    ['junior', 2, true],
    ['mid', 5, true],
    ['senior', 8, false],
    ['lead', 12, true],
  ],
  'candidate-complex': [
    [
      'seniority',
      'yearsOfExperience',
      'availability',
      'name',
      'skills',
      'location',
    ],
    ['junior', 2, true, 'Juan Pérez', 'JavaScript, React', 'Madrid'],
    ['mid', 5, true, 'María García', 'Python, Django, PostgreSQL', 'Barcelona'],
    [
      'senior',
      8,
      false,
      'Carlos López',
      'Java, Spring, Microservices',
      'Valencia',
    ],
    ['lead', 12, true, 'Ana Martín', 'Node.js, AWS, Docker', 'Sevilla'],
  ],
};

const examplesDir = path.join(__dirname, '../examples');

// Crear archivos Excel
Object.entries(exampleData).forEach(([filename, data]) => {
  try {
    // Crear un nuevo workbook
    const workbook = XLSX.utils.book_new();

    // Crear una worksheet con los datos
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar el ancho de las columnas automáticamente
    if (worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const colWidths: { wch: number }[] = [];

      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10; // Ancho mínimo
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const cell = worksheet[cellAddress];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (cell && cell.v !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const cellLength = String(cell.v).length;
            if (cellLength > maxWidth) {
              maxWidth = cellLength;
            }
          }
        }
        colWidths.push({ wch: Math.max(maxWidth + 2, 10) });
      }
      worksheet['!cols'] = colWidths;
    }

    // Añadir la worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');

    // Crear el directorio si no existe
    if (!fs.existsSync(examplesDir)) {
      fs.mkdirSync(examplesDir, { recursive: true });
    }

    // Guardar el archivo
    const filePath = path.join(examplesDir, `${filename}.xlsx`);
    XLSX.writeFile(workbook, filePath);

    console.log(`✅ Creado: ${filename}.xlsx`);
  } catch (error) {
    console.error(`❌ Error creando ${filename}.xlsx:`, error);
  }
});

console.log('\n🎉 Todos los archivos Excel han sido creados exitosamente!');
