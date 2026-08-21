import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL ?? 'file:./dev.db',
    }),
});

async function main() {
    const existingCount = await prisma.user.count();

    if (existingCount === 0) {
        await prisma.user.createMany({
            data: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }],
        });
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
