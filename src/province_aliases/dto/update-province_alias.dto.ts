import { PartialType } from '@nestjs/swagger';
import { CreateProvinceAliasDto } from './create-province_alias.dto.js';

export class UpdateProvinceAliasDto extends PartialType(CreateProvinceAliasDto) {}
