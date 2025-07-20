import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    surname: string;
    seniority: string;
    yearsOfExperience: number;
    availability: boolean;
  }) {
    return this.prisma.candidate.create({ data });
  }

  async findAll() {
    return this.prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
