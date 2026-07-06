import { PrismaClient } from '../generated/prisma';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  let dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

  if (process.env.VERCEL) {
    const tempDir = '/tmp';
    const dbFileName = 'dev.db';
    const tempDbPath = path.join(tempDir, dbFileName);

    if (!process.env.DATABASE_URL) {
      if (!fs.existsSync(tempDbPath)) {
        const bundledDbPath = path.join(process.cwd(), 'prisma', dbFileName);
        try {
          if (fs.existsSync(bundledDbPath)) {
            fs.copyFileSync(bundledDbPath, tempDbPath);
            console.log(`Successfully copied database to ${tempDbPath}`);
          } else {
            console.error(`Bundled database not found at ${bundledDbPath}`);
          }
        } catch (error) {
          console.error(`Failed to copy database to ${tempDbPath}:`, error);
        }
      }
      dbUrl = `file:${tempDbPath}`;
    }
  }

  const adapter = new PrismaBetterSqlite3({
    url: dbUrl,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

