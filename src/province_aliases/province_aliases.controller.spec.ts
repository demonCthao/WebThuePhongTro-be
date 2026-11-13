import { Test, TestingModule } from '@nestjs/testing';
import { ProvinceAliasesController } from './province_aliases.controller.js';
import { ProvinceAliasesService } from './province_aliases.service.js';

describe('ProvinceAliasesController', () => {
  let controller: ProvinceAliasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvinceAliasesController],
      providers: [ProvinceAliasesService],
    }).compile();

    controller = module.get<ProvinceAliasesController>(ProvinceAliasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
