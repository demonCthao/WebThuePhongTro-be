import { Test, TestingModule } from '@nestjs/testing';
import { ProvinceAliasesService } from './province_aliases.service.js';

describe('ProvinceAliasesService', () => {
  let service: ProvinceAliasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProvinceAliasesService],
    }).compile();

    service = module.get<ProvinceAliasesService>(ProvinceAliasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
