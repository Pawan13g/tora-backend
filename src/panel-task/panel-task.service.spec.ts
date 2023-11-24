import { Test, TestingModule } from '@nestjs/testing';
import { PanelTaskService } from './panel-task.service';

describe('PanelTaskService', () => {
  let service: PanelTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelTaskService],
    }).compile();

    service = module.get<PanelTaskService>(PanelTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
