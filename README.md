npx prisma db pull 
npx prisma generate
npm install -D tsx
npm run generate:resources
npm run generate:types
npm run generate:crud
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"