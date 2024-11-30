import { Test, TestingModule } from '@nestjs/testing';
import { CarreterasService } from './carreteras.service';

describe('CarreterasService', () => {
  let service: CarreterasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarreterasService],
    }).compile();

    service = module.get<CarreterasService>(CarreterasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
