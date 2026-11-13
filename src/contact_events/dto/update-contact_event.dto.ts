import { PartialType } from '@nestjs/swagger';
import { CreateContactEventDto } from './create-contact_event.dto.js';

export class UpdateContactEventDto extends PartialType(CreateContactEventDto) {}
