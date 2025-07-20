import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';

describe('CandidatesController', () => {
  let controller: CandidatesController;

  const mockCandidatesService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: mockCandidatesService,
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of candidates', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          seniority: 'junior',
          yearsOfExperience: 2,
          availability: true,
          createdAt: new Date(),
        },
      ];

      mockCandidatesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toBe(expectedResult);
      expect(mockCandidatesService.findAll).toHaveBeenCalled();
    });
  });

  describe('upload', () => {
    it('should throw BadRequestException when name is missing', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.xlsx',
        encoding: '7bit',
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1024,
        buffer: Buffer.from('test data'),
      };

      await expect(controller.upload('', 'Doe', mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when surname is missing', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.xlsx',
        encoding: '7bit',
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1024,
        buffer: Buffer.from('test data'),
      };

      await expect(controller.upload('John', '', mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when file is missing', async () => {
      await expect(
        controller.upload('John', 'Doe', undefined!),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 1024,
        buffer: Buffer.from('test data'),
      };

      await expect(controller.upload('John', 'Doe', mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
