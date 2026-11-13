import { PartialType } from '@nestjs/swagger';
import { CreateWardAliasDto } from './create-ward_alias.dto.js';

export class UpdateWardAliasDto extends PartialType(CreateWardAliasDto) {}
