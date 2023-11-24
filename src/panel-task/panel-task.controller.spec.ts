import { Test, TestingModule } from '@nestjs/testing';
import { PanelTaskController } from './panel-task.controller';

describe('PanelTaskController', () => {
  let controller: PanelTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelTaskController],
    }).compile();

    controller = module.get<PanelTaskController>(PanelTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
