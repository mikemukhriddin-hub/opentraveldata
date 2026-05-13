// server/seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data started...');
  
  // JSON faylni o'qish
  const dataPath = path.join(__dirname, '../src/data/transport_nodes.json');
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(fileContent);

  // Eski ma'lumotlarni tozalash (ixtiyoriy)
  await prisma.transportNode.deleteMany();

  // Ma'lumotlarni bazaga qo'shish
  for (const node of data) {
    await prisma.transportNode.create({
      data: {
        type: node.type,
        name_uz: node.name_uz,
        name_en: node.name_en,
        name_ru: node.name_ru || '',
        iata_code: node.iata || null,
        locode: node.locode || null,
        region: node.region,
        lat: node.lat ? parseFloat(node.lat) : null,
        lon: node.lng ? parseFloat(node.lng) : null
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
