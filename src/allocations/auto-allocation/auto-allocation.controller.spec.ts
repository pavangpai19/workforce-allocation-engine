import { Test, TestingModule } from '@nestjs/testing';
import { AutoAllocationController } from './auto-allocation.controller';

describe('AutoAllocationController', () => {
  let controller: AutoAllocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoAllocationController],
    }).compile();

    controller = module.get<AutoAllocationController>(AutoAllocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
