import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';

import * as XLSXLib from 'xlsx';
const XLSX = XLSXLib as {
  read: (
    data: unknown,
    options?: unknown,
  ) => {
    SheetNames: string[];
    Sheets: Record<string, unknown>;
  };
  utils: {
    sheet_to_json: (sheet: unknown, options?: unknown) => unknown[][];
  };
};

interface CandidateData {
  seniority: string;
  yearsOfExperience: number;
  availability: boolean;
}

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('candidates')
export class CandidatesController {
  constructor(private svc: CandidatesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @UploadedFile() file: UploadedFile,
  ) {
    if (!name || !surname) {
      throw new BadRequestException('Name and surname are required');
    }

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed',
      );
    }

    try {
      const candidateData = this.processFile(file);

      this.validateCandidateData(candidateData);

      const candidate = await this.svc.create({
        name: name.trim(),
        surname: surname.trim(),
        seniority: candidateData.seniority,
        yearsOfExperience: candidateData.yearsOfExperience,
        availability: candidateData.availability,
      });

      return candidate;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Error processing file. Please check the file format.',
      );
    }
  }

  @Get()
  async findAll() {
    return this.svc.findAll();
  }

  private processFile(file: UploadedFile): CandidateData {
    try {
      let data: unknown[][];

      if (file.mimetype === 'text/csv') {
        const csvContent = file.buffer.toString('utf-8');
        const wb = XLSX.read(csvContent, { type: 'string' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      } else {
        const wb = XLSX.read(file.buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      }

      if (!data || data.length < 1) {
        throw new BadRequestException(
          'File must contain at least one row with data',
        );
      }

      let dataRow: unknown[] | undefined;

      if (data.length === 1) {
        dataRow = data[0];
      } else {
        for (const row of data) {
          if (this.isValidDataRow(row)) {
            dataRow = row;
            break;
          }
        }

        if (!dataRow) {
          dataRow = data[data.length - 1];
        }
      }

      if (!dataRow || dataRow.length < 3) {
        throw new BadRequestException(
          'File must contain a row with at least 3 columns: seniority, yearsOfExperience, availability',
        );
      }

      return this.extractCandidateData(dataRow);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Error reading file. Please ensure it is a valid Excel or CSV file.',
      );
    }
  }

  private isValidDataRow(row: unknown[]): boolean {
    if (!row || row.length < 3) {
      return false;
    }

    const hasSeniority = row.some(
      (cell) =>
        typeof cell === 'string' &&
        (cell.toLowerCase() === 'junior' || cell.toLowerCase() === 'senior'),
    );

    const hasNumber = row.some(
      (cell) =>
        typeof cell === 'number' ||
        (typeof cell === 'string' && !isNaN(Number(cell))),
    );

    const hasBoolean = row.some(
      (cell) =>
        typeof cell === 'boolean' ||
        (typeof cell === 'string' &&
          (cell.toLowerCase() === 'true' || cell.toLowerCase() === 'false')),
    );

    return hasSeniority && hasNumber && hasBoolean;
  }

  private extractCandidateData(dataRow: unknown[]): CandidateData {
    const seniorityIndex = dataRow.findIndex(
      (cell) =>
        typeof cell === 'string' &&
        (cell.toLowerCase() === 'junior' || cell.toLowerCase() === 'senior'),
    );

    if (seniorityIndex === -1) {
      throw new BadRequestException('Seniority must be "junior" or "senior"');
    }

    const seniorityCell = dataRow[seniorityIndex];
    const seniority =
      typeof seniorityCell === 'string' ? seniorityCell.toLowerCase() : '';

    const yearsIndex = dataRow.findIndex(
      (cell, index) =>
        index !== seniorityIndex &&
        (typeof cell === 'number' ||
          (typeof cell === 'string' && !isNaN(Number(cell)))),
    );

    if (yearsIndex === -1) {
      throw new BadRequestException(
        'Years of experience must be a valid number',
      );
    }

    const yearsOfExperience = Number(dataRow[yearsIndex]);

    const availabilityIndex = dataRow.findIndex(
      (cell, index) =>
        index !== seniorityIndex &&
        index !== yearsIndex &&
        (typeof cell === 'boolean' ||
          (typeof cell === 'string' &&
            (cell.toLowerCase() === 'true' || cell.toLowerCase() === 'false'))),
    );

    if (availabilityIndex === -1) {
      throw new BadRequestException(
        'Availability must be a boolean value (true/false)',
      );
    }

    const availabilityCell = dataRow[availabilityIndex];
    const availability =
      typeof availabilityCell === 'boolean'
        ? availabilityCell
        : typeof availabilityCell === 'string'
          ? availabilityCell.toLowerCase() === 'true'
          : false;

    return {
      seniority,
      yearsOfExperience,
      availability,
    };
  }

  private validateCandidateData(data: CandidateData): void {
    if (!['junior', 'senior'].includes(data.seniority)) {
      throw new BadRequestException('Seniority must be "junior" or "senior"');
    }

    if (
      !Number.isInteger(data.yearsOfExperience) ||
      data.yearsOfExperience < 0
    ) {
      throw new BadRequestException(
        'Years of experience must be a positive integer',
      );
    }

    if (typeof data.availability !== 'boolean') {
      throw new BadRequestException('Availability must be a boolean value');
    }
  }
}
