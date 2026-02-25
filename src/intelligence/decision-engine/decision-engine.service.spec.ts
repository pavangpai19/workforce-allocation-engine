import { Test, TestingModule } from '@nestjs/testing';
import { DecisionEngineService } from './decision-engine.service';

describe('DecisionEngineService', () => {
  let service: DecisionEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecisionEngineService],
    }).compile();

    service = module.get<DecisionEngineService>(DecisionEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
