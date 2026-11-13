import { Test, TestingModule } from '@nestjs/testing';
import { WardAliasesController } from './ward_aliases.controller.js';
import { WardAliasesService } from './ward_aliases.service.js';

describe('WardAliasesController', () => {
  let controller: WardAliasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WardAliasesController],
      providers: [WardAliasesService],
    }).compile();

    controller = module.get<WardAliasesController>(WardAliasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
