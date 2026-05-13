const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('Connection Successful');
    process.exit(0);
  } catch (e) {
    console.error('Connection Failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
