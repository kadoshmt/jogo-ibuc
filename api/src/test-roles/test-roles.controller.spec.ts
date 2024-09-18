import { Test, TestingModule } from '@nestjs/testing';
import { TestRolesController } from './test-roles.controller';

describe('QuizController', () => {
  let controller: TestRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestRolesController],
    }).compile();

    controller = module.get<TestRolesController>(TestRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
