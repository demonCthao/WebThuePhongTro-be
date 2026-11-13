
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'node:fs';

import path from 'node:path';

// ============================================
// CONFIGURATION
// ============================================

const ROOT = process.cwd();

const SCHEMA_PATH = path.join(
  ROOT,
  'prisma',
  'schema.prisma',
);

const OUTPUT_PATH = (() => {
  const index = process.argv.indexOf('--out');

  if (index !== -1 && process.argv[index + 1]) {
    return path.resolve(ROOT, process.argv[index + 1]);
  }

  return path.resolve(
    ROOT,
    '../thue-tro/app/types/prisma-models.ts',
  );
})();

// ============================================
// INTERFACES
// ============================================

interface PrismaField {
  name: string;
  type: string;
  isList: boolean;
  isOptional: boolean;
  isRelation: boolean;
  isEnum: boolean;
}

interface PrismaModel {
  name: string;
  fields: PrismaField[];
  isIgnored: boolean;
}

interface PrismaEnum {
  name: string;
  values: string[];
}

// ============================================
// NAMING CONVENTIONS
// ============================================

// rooms        -> Rooms
// room_stats   -> RoomStats
// blog_posts   -> BlogPosts
// ProvinceAlias -> ProvinceAlias

function toPascalCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => {
      return (
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
      );
    })
    .join('');
}

// ============================================
// REMOVE COMMENTS
// ============================================

function removeComments(schema: string): string {
  return schema
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

// ============================================
// PARSE ENUMS
// ============================================

function parseEnums(schema: string): PrismaEnum[] {
  const enums: PrismaEnum[] = [];

  const regex = /\benum\s+(\w+)\s*\{([\s\S]*?)\}/g;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(schema)) !== null) {
    const name = match[1];
    const body = match[2];

    const values = body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => {
        return (
          line.length > 0 &&
          !line.startsWith('@') &&
          /^[a-zA-Z_]\w*/.test(line)
        );
      })
      .map((line) => {
        return line.match(/^([a-zA-Z_]\w*)/)?.[1] ?? '';
      })
      .filter(Boolean);

    enums.push({
      name,
      values,
    });
  }

  return enums;
}

// ============================================
// PARSE MODELS
// ============================================

function parseModels(schema: string): PrismaModel[] {
  const models: PrismaModel[] = [];

  const modelRegex = /\bmodel\s+(\w+)\s*\{([\s\S]*?)\}/g;

  const modelNames = new Set<string>();
  const enumNames = new Set(
    parseEnums(schema).map((item) => item.name),
  );

  let match: RegExpExecArray | null;

  // First pass: collect model names
  while ((match = modelRegex.exec(schema)) !== null) {
    modelNames.add(match[1]);
  }

  // Second pass: parse model fields
  modelRegex.lastIndex = 0;

  while ((match = modelRegex.exec(schema)) !== null) {
    const name = match[1];
    const body = match[2];

    const fields: PrismaField[] = [];

    const isIgnored = /@@ignore\b/.test(body);

    if (isIgnored) {
      continue;
    }

    for (const line of body.split('\n')) {
      const trimmed = line.trim();

      if (
        !trimmed ||
        trimmed.startsWith('@') ||
        trimmed.startsWith('//')
      ) {
        continue;
      }

      const fieldMatch = trimmed.match(
        /^(\w+)\s+([\w]+)(\[\])?(\?)?\s*(.*)$/,
      );

      if (!fieldMatch) {
        continue;
      }

      const [
        ,
        fieldName,
        type,
        list,
        optional,
      ] = fieldMatch;

      const isRelation = modelNames.has(type);
      const isEnum = enumNames.has(type);

      fields.push({
        name: fieldName,
        type,
        isList: Boolean(list),
        isOptional: Boolean(optional),
        isRelation,
        isEnum,
      });
    }

    models.push({
      name,
      fields,
      isIgnored: false,
    });
  }

  return models;
}

// ============================================
// PRISMA TYPE -> TYPESCRIPT TYPE
// ============================================

function getScalarType(type: string): string {
  const types: Record<string, string> = {
    String: 'string',
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',

    DateTime: 'string',
    BigInt: 'string',
    Decimal: 'string',
    Bytes: 'string',

    Json: 'JsonValue',
  };

  return types[type] ?? 'unknown';
}

// ============================================
// GENERATE FIELD TYPE
// ============================================

function getFieldType(field: PrismaField): string {
  let type: string;

  if (field.isRelation || field.isEnum) {
    type = toPascalCase(field.type);
  } else {
    type = getScalarType(field.type);
  }

  if (field.isList) {
    type += '[]';
  } else if (field.isOptional) {
    type += ' | null';
  }

  return type;
}

// ============================================
// GENERATE ENUM
// ============================================

function generateEnum(item: PrismaEnum): string {
  const enumName = toPascalCase(item.name);

  const values = item.values
    .map((value) => `  | '${value}'`)
    .join('\n');

  return `export type ${enumName} =
${values};
`;
}

// ============================================
// GENERATE MODEL
// ============================================

function generateModel(model: PrismaModel): string {
  const modelName = toPascalCase(model.name);

  const fields = model.fields
    .map((field) => {
      // Relation fields are optional because Prisma
      // does not return relations unless included.
      const optional = field.isRelation ? '?' : '';

      const type = getFieldType(field);

      return `  ${field.name}${optional}: ${type};`;
    })
    .join('\n');

  return `export interface ${modelName} {
${fields}
}`;
}

// ============================================
// GENERATE FILE
// ============================================

function generateFile(
  models: PrismaModel[],
  enums: PrismaEnum[],
): string {
  const header = `/**
 * AUTO GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 *
 * Source: prisma/schema.prisma
 * Generated by: scripts/generate-prisma-types.ts
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

`;

  const enumContent = enums
    .map(generateEnum)
    .join('\n');

  const modelContent = models
    .map(generateModel)
    .join('\n\n');

  return [
    header,
    '// ============================================',
    '// ENUMS',
    '// ============================================',
    enumContent,
    '// ============================================',
    '// MODELS',
    '// ============================================',
    modelContent,
    '',
  ].join('\n');
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n================================');
  console.log('  PRISMA TYPES GENERATOR');
  console.log('================================\n');

  // Check schema
  if (!existsSync(SCHEMA_PATH)) {
    throw new Error(
      `Cannot find Prisma schema: ${SCHEMA_PATH}`,
    );
  }

  // Read schema
  const rawSchema = readFileSync(
    SCHEMA_PATH,
    'utf8',
  );

  const schema = removeComments(rawSchema);

  // Parse
  const enums = parseEnums(schema);
  const models = parseModels(schema);

  console.log(`Found ${models.length} models.`);
  console.log(`Found ${enums.length} enums.\n`);

  if (models.length === 0) {
    throw new Error('No Prisma models found.');
  }

  // Check duplicate generated names
  const generatedNames = new Set<string>();

  for (const model of models) {
    const name = toPascalCase(model.name);

    if (generatedNames.has(name)) {
      throw new Error(
        `Duplicate generated model name: ${name}`,
      );
    }

    generatedNames.add(name);
  }

  // Generate
  const output = generateFile(models, enums);

  // Create output directory
  const outputDir = path.dirname(OUTPUT_PATH);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, {
      recursive: true,
    });
  }

  // Write file
  writeFileSync(
    OUTPUT_PATH,
    output,
    'utf8',
  );

  // Summary
  console.log('[SUCCESS] Types generated!');
  console.log(`Output: ${OUTPUT_PATH}`);

  console.log('\nGenerated models:');

  for (const model of models) {
    console.log(`  - ${model.name} -> ${toPascalCase(model.name)}`);
  }

  console.log('\nGenerated enums:');

  for (const item of enums) {
    console.log(`  - ${item.name} -> ${toPascalCase(item.name)}`);
  }

  console.log('\nGeneration completed!\n');
}

main().catch((error) => {
  console.error('\nGenerator failed:', error);
  process.exitCode = 1;
});
