import { Test, TestingModule } from '@nestjs/testing';
import { WardAliasesService } from './ward_aliases.service.js';

describe('WardAliasesService', () => {
  let service: WardAliasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WardAliasesService],
    }).compile();

    service = module.get<WardAliasesService>(WardAliasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
