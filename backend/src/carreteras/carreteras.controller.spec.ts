import { Test, TestingModule } from '@nestjs/testing';
import { CarreterasController } from './carreteras.controller';

describe('CarreterasController', () => {
  let controller: CarreterasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarreterasController],
    }).compile();

    controller = module.get<CarreterasController>(CarreterasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
