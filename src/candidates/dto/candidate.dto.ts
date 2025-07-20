import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;
}

export class CandidateResponseDto {
  id: number;
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  yearsOfExperience: number;
  availability: boolean;
  createdAt: Date;
}
