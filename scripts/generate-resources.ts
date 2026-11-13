import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const schema = readFileSync('prisma/schema.prisma', 'utf8');

const models = [...schema.matchAll(/^model\s+(\w+)\s*\{/gm)]
  .map((match) => match[1]);

for (const model of models) {
  const resource = model.replace(
    /[A-Z]/g,
    (letter, index) => (index ? '-' : '') + letter.toLowerCase(),
  );

  console.log(`Generating resource: ${resource}`);

  execSync(`npx nest g resource ${resource}`, {
    stdio: 'inherit',
  });
}