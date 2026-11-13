
import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  readdirSync,
  mkdirSync,
} from 'node:fs';

import path from 'node:path';

const ROOT = process.cwd();
const SCHEMA_PATH = path.join(ROOT, 'prisma/schema.prisma');
const SRC_PATH = path.join(ROOT, 'src');

interface PrismaField {
  name: string;
  type: string;
  isId: boolean;
  isRelation: boolean;
  isList: boolean;
  isOptional: boolean;
}

interface PrismaModel {
  name: string;
  fields: PrismaField[];
}

interface ServiceInfo {
  path: string;
  className: string;
  directory: string;
}

// =====================================
// NAME HELPERS
// =====================================

function splitWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .split(/[_\-\s]+/)
    .filter(Boolean);
}

function singularize(word: string): string {
  const lower = word.toLowerCase();

  const irregulars: Record<string, string> = {
    people: 'person',
    men: 'man',
    women: 'woman',
    children: 'child',
    teeth: 'tooth',
    feet: 'foot',
    mice: 'mouse',
    geese: 'goose',
  };

  if (irregulars[lower]) {
    return irregulars[lower];
  }

  if (/(aliases|statuses|analyses|diagnoses|theses)$/i.test(lower)) {
    return word.slice(0, -2);
  }

  if (/ies$/i.test(word)) {
    return word.slice(0, -3) + 'y';
  }

  if (/(ches|shes|xes|zes|sses)$/i.test(word)) {
    return word.slice(0, -2);
  }

  if (/s$/i.test(word) && !/ss$/i.test(word)) {
    return word.slice(0, -1);
  }

  return word;
}

function toPascalCase(value: string): string {
  return splitWords(value)
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase(),
    )
    .join('');
}

function toSingularPascalCase(value: string): string {
  return splitWords(value)
    .map(word => {
      const singular = singularize(word);

      return (
        singular.charAt(0).toUpperCase() +
        singular.slice(1).toLowerCase()
      );
    })
    .join('');
}

function toDtoFileName(value: string): string {
  const words = splitWords(value);

  if (words.length === 0) {
    return value;
  }

  words[words.length - 1] = singularize(
    words[words.length - 1],
  );

  return words.map(word => word.toLowerCase()).join('_');
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// =====================================
// FILE HELPERS
// =====================================

function ensureDirectory(directory: string): void {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
}

function writeFileIfNotExists(
  filePath: string,
  content: string,
): void {
  ensureDirectory(path.dirname(filePath));

  if (existsSync(filePath)) {
    console.log(`[EXISTS] ${filePath}`);
    return;
  }

  writeFileSync(filePath, content, 'utf8');

  console.log(`[CREATED] ${filePath}`);
}

// =====================================
// PARSE PRISMA SCHEMA
// =====================================

function removeComments(schema: string): string {
  return schema
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function parseModels(schema: string): PrismaModel[] {
  const cleanSchema = removeComments(schema);
  const models: PrismaModel[] = [];

  const modelRegex = /\bmodel\s+(\w+)\s*\{/g;

  let match: RegExpExecArray | null;

  while ((match = modelRegex.exec(cleanSchema)) !== null) {
    const name = match[1];
    const bodyStart = modelRegex.lastIndex;

    let depth = 1;
    let bodyEnd = bodyStart;

    while (bodyEnd < cleanSchema.length && depth > 0) {
      if (cleanSchema[bodyEnd] === '{') depth++;
      if (cleanSchema[bodyEnd] === '}') depth--;
      bodyEnd++;
    }

    if (depth !== 0) {
      throw new Error(`Invalid model block: ${name}`);
    }

    const body = cleanSchema.slice(bodyStart, bodyEnd - 1);
    const fields: PrismaField[] = [];

    for (const line of body.split('\n')) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('@@')) {
        continue;
      }

      const fieldMatch = trimmed.match(
        /^(\w+)\s+([\w]+)(\[\])?(\?)?\s*(.*)$/,
      );

      if (!fieldMatch) continue;

      const [, fieldName, type, list, optional, attributes] =
        fieldMatch;

      const scalarTypes = [
        'String',
        'Int',
        'Float',
        'Boolean',
        'DateTime',
        'Json',
        'Bytes',
        'BigInt',
        'Decimal',
      ];

      fields.push({
        name: fieldName,
        type,
        isId: /@id\b/.test(attributes),
        isRelation: !scalarTypes.includes(type),
        isList: Boolean(list),
        isOptional: Boolean(optional),
      });
    }

    models.push({ name, fields });

    modelRegex.lastIndex = bodyEnd;
  }

  return models;
}

// =====================================
// TYPESCRIPT TYPES
// =====================================

function getTsType(type: string): string {
  const map: Record<string, string> = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
    DateTime: 'Date',
    BigInt: 'bigint',
    Decimal: 'Prisma.Decimal',
    Json: 'Prisma.JsonValue',
    Bytes: 'Uint8Array',
  };

  return map[type] ?? 'string';
}

// =====================================
// FIND EXISTING SERVICES
// =====================================

function findAllServices(directory: string): ServiceInfo[] {
  const services: ServiceInfo[] = [];

  if (!existsSync(directory)) {
    return services;
  }

  const entries = readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (
        [
          'node_modules',
          'dist',
          'generated',
          'coverage',
        ].includes(entry.name)
      ) {
        continue;
      }

      services.push(...findAllServices(fullPath));
      continue;
    }

    if (!entry.name.endsWith('.service.ts')) {
      continue;
    }

    const content = readFileSync(fullPath, 'utf8');

    const classMatch = content.match(
      /export\s+class\s+(\w+Service)\b/,
    );

    if (!classMatch) continue;

    services.push({
      path: fullPath,
      className: classMatch[1],
      directory: path.dirname(fullPath),
    });
  }

  return services;
}

function findService(
  modelName: string,
  services: ServiceInfo[],
): ServiceInfo | null {
  const expected = normalize(modelName);

  const candidates = services.filter(service => {
    const className = normalize(
      service.className.replace(/Service$/, ''),
    );

    const fileName = normalize(
      path.basename(service.path, '.service.ts'),
    );

    return (
      className === expected ||
      fileName === expected
    );
  });

  if (candidates.length === 1) {
    return candidates[0];
  }

  if (candidates.length > 1) {
    console.warn(
      `[AMBIGUOUS] ${modelName}: multiple service files found`,
    );
  }

  return null;
}

// =====================================
// PRIMARY KEY
// =====================================

function getPrimaryKey(model: PrismaModel) {
  const idFields = model.fields.filter(field => field.isId);

  if (idFields.length !== 1) {
    return null;
  }

  const idField = idFields[0];

  if (
    idField.isRelation ||
    idField.isList ||
    idField.isOptional
  ) {
    return null;
  }

  const supportedTypes = [
    'String',
    'Int',
    'Float',
    'BigInt',
  ];

  if (!supportedTypes.includes(idField.type)) {
    return null;
  }

  return {
    name: idField.name,
    type: getTsType(idField.type),
  };
}

// =====================================
// GENERATE COMMON PAGINATION FILES
// =====================================

function generatePaginationFiles(): void {
  const dtoPath = path.join(
    SRC_PATH,
    'common/dto/find-all-query.dto.ts',
  );

  const interfacePath = path.join(
    SRC_PATH,
    'common/interfaces/pagination.interface.ts',
  );

  const dtoContent = `import { Type } from 'class-transformer';

import {
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class FindAllQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageIndex: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}
`;

  const interfaceContent = `export interface PaginatedResult<T> {
  list: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
`;

  writeFileIfNotExists(dtoPath, dtoContent);
  writeFileIfNotExists(interfacePath, interfaceContent);
}

// =====================================
// GENERATE SERVICE
// =====================================

function generateService(model: PrismaModel): string | null {
  const primaryKey = getPrimaryKey(model);

  if (!primaryKey) {
    console.log(
      `[SKIP] ${model.name}: unsupported primary key`,
    );

    return null;
  }

  const modelName = model.name;

  const dtoName = toSingularPascalCase(modelName);
  const dtoFileName = toDtoFileName(modelName);

  const serviceClass = `${toPascalCase(modelName)}Service`;

  const prismaTypeName = `${modelName}GetPayload`;
  const safeTypeName = `${toPascalCase(modelName)}Safe`;

  return `import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

import { Create${dtoName}Dto } from './dto/create-${dtoFileName}.dto.js';
import { Update${dtoName}Dto } from './dto/update-${dtoFileName}.dto.js';

import { FindAllQuery } from '../common/dto/find-all-query.dto.js';
import { PaginatedResult } from '../common/interfaces/pagination.interface.js';

type ${safeTypeName} = Prisma.${prismaTypeName}<{}>;

@Injectable()
export class ${serviceClass} {
  create(create${dtoName}Dto: Create${dtoName}Dto) {
    return prisma.${modelName}.create({
      data: create${dtoName}Dto as any,
    });
  }

  async findAll({
    pageIndex = 1,
    pageSize = 10,
  }: FindAllQuery = {}): Promise<PaginatedResult<${safeTypeName}>> {
    const page = Math.max(1, Number(pageIndex) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number(pageSize) || 10),
    );

    const [list, total] = await prisma.$transaction([
      prisma.${modelName}.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          ${primaryKey.name}: 'desc',
        },
      }),

      prisma.${modelName}.count(),
    ]);

    return {
      list,
      total,
      pageIndex: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: ${primaryKey.type}) {
    const result = await prisma.${modelName}.findUnique({
      where: {
        ${primaryKey.name}: id,
      },
    });

    if (!result) {
      throw new NotFoundException('${dtoName} not found');
    }

    return result;
  }

  async update(
    id: ${primaryKey.type},
    update${dtoName}Dto: Update${dtoName}Dto,
  ) {
    await this.findOne(id);

    return prisma.${modelName}.update({
      where: {
        ${primaryKey.name}: id,
      },
      data: update${dtoName}Dto as any,
    });
  }

  async remove(id: ${primaryKey.type}) {
    await this.findOne(id);

    return prisma.${modelName}.delete({
      where: {
        ${primaryKey.name}: id,
      },
    });
  }
}
`;
}

// =====================================
// MAIN
// =====================================

async function main() {
  console.log('\n====================================');
  console.log('       PRISMA CRUD GENERATOR');
  console.log('====================================\n');

  if (!existsSync(SCHEMA_PATH)) {
    throw new Error('Cannot find prisma/schema.prisma');
  }

  const schema = readFileSync(SCHEMA_PATH, 'utf8');

  const models = parseModels(schema);
  const services = findAllServices(SRC_PATH);

  console.log(`Models found: ${models.length}`);
  console.log(`Services found: ${services.length}\n`);

  generatePaginationFiles();

  let generated = 0;
  let skipped = 0;

  for (const model of models) {
    console.log(`Processing: ${model.name}`);

    const service = findService(model.name, services);

    if (!service) {
      console.log('  [SKIP] Service not found');
      skipped++;
      continue;
    }

    const code = generateService(model);

    if (!code) {
      skipped++;
      continue;
    }

    const backupPath = `${service.path}.bak`;

    if (!existsSync(backupPath)) {
      copyFileSync(service.path, backupPath);
    }

    writeFileSync(service.path, code, 'utf8');

    console.log(`  [GENERATED] ${service.path}`);

    generated++;
  }

  console.log('\n====================================');
  console.log('             COMPLETED');
  console.log('====================================');

  console.log(`Generated: ${generated}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch((error: unknown) => {
  console.error('\nGenerator failed:', error);
  process.exitCode = 1;
});
