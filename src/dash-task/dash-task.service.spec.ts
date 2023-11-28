import { Test, TestingModule } from '@nestjs/testing';
import { DashTaskService } from './dash-task.service';

describe('DashTaskService', () => {
  let service: DashTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashTaskService],
    }).compile();

    service = module.get<DashTaskService>(DashTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
