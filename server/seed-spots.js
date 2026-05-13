const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding tourism data started...');
  
  const dataPath = path.join(__dirname, 'prisma/spots.json');
  const fileContent = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(fileContent);

  // Clear existing spots (optional)
  // await prisma.touristSpot.deleteMany();

  for (const spot of data) {
    await prisma.touristSpot.create({
      data: {
        category: spot.category,
        name_uz: spot.name_uz,
        name_en: spot.name_en,
        name_ru: spot.name_ru || '',
        description_uz: spot.description_uz || '',
        description_en: spot.description_en || '',
        description_ru: spot.description_ru || '',
        city: spot.city,
        lat: spot.lat,
        lon: spot.lon,
        map_link: spot.map_link || '',
        contact: spot.contact || '',
        rating: spot.rating || 5.0,
        image_url: spot.image_url || `https://source.unsplash.com/featured/?${spot.category},${spot.city}`
      }
    });
  }

  console.log('Tourism seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
