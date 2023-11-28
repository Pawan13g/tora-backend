import { Test, TestingModule } from '@nestjs/testing';
import { DashTaskController } from './dash-task.controller';

describe('DashTaskController', () => {
  let controller: DashTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashTaskController],
    }).compile();

    controller = module.get<DashTaskController>(DashTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
