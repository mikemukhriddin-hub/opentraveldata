const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Root endpoint for UptimeRobot (Keep-alive)
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'OPTD Uzbekistan API is running' });
});

// Middleware: Admin ekanligini tekshirish
async function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token topilmadi' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    
    // Adminlarni tekshirish (Masalan, pochtangizni shu yerga yozasiz)
    const adminEmails = ['buriboevmukhriddin2000@gmail.com']; // O'z pochtangizni qo'shing
    if (adminEmails.includes(payload.email)) {
      req.user = payload;
      next();
    } else {
      res.status(403).json({ error: 'Ruxsat berilmagan' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Token xato' });
  }
}

// 1. Barcha nuqtalarni olish
app.get('/api/nodes', async (req, res) => {
  try {
    const nodes = await prisma.transportNode.findMany();
    // Frontend latitude/longitude deb kutayotgan bo'lishi mumkin
    const formattedNodes = nodes.map(node => ({
      ...node,
      latitude: node.lat,
      longitude: node.lon
    }));
    res.json(formattedNodes);
  } catch (error) {
    console.error('API Error (GET /nodes):', error);
    res.status(500).json({ error: error.message || 'Xatolik yuz berdi' });
  }
});

// 2. Yangi nuqta qo'shish (Faqat Admin)
app.post('/api/nodes', isAdmin, async (req, res) => {
  try {
    const newNode = await prisma.transportNode.create({ data: req.body });
    res.json(newNode);
  } catch (error) {
    res.status(500).json({ error: 'Qo\'shishda xatolik' });
  }
});

// 3. Tahrirlash (Faqat Admin)
app.put('/api/nodes/:id', isAdmin, async (req, res) => {
  try {
    const updated = await prisma.transportNode.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Tahrirlashda xatolik' });
  }
});

// 4. O'chirish (Faqat Admin)
app.delete('/api/nodes/:id', isAdmin, async (req, res) => {
  try {
    await prisma.transportNode.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'O\'chirishda xatolik' });
  }
});

// --- Tourist Spots Endpoints ---

// 5. Barcha turistik joylarni olish (Filter bilan)
app.get('/api/spots', async (req, res) => {
  const { category, city } = req.query;
  try {
    const where = {};
    if (category) where.category = category;
    if (city) where.city = city;
    
    const spots = await prisma.touristSpot.findMany({ where });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ error: 'Ma\'lumotlarni olishda xatolik' });
  }
});

// 6. Yangi joy qo'shish (Faqat Admin)
app.post('/api/spots', isAdmin, async (req, res) => {
  try {
    const newSpot = await prisma.touristSpot.create({ data: req.body });
    res.json(newSpot);
  } catch (error) {
    res.status(500).json({ error: 'Qo\'shishda xatolik' });
  }
});

// 7. Joyni tahrirlash (Faqat Admin)
app.put('/api/spots/:id', isAdmin, async (req, res) => {
  try {
    const updated = await prisma.touristSpot.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Tahrirlashda xatolik' });
  }
});

// 8. Joyni o'chirish (Faqat Admin)
app.delete('/api/spots/:id', isAdmin, async (req, res) => {
  try {
    await prisma.touristSpot.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'O\'chirishda xatolik' });
  }
});

// --- Telegram Bot Integration ---
const { Telegraf } = require('telegraf');

if (process.env.TELEGRAM_BOT_TOKEN) {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  
  bot.start((ctx) => ctx.reply("Salom! Open Travel Data Uzbekistan botiga xush kelibsiz.\n\nQuyidagi shaharlardan birini yozing (masalan: Samarqand) yoki /tourism buyrug'ini bering."));

  bot.command('tourism', async (ctx) => {
    try {
      const spots = await prisma.touristSpot.findMany({ take: 5 });
      if (spots.length === 0) return ctx.reply("Hozircha ma'lumotlar mavjud emas.");
      
      let message = "🏛 *Tavsiya etilgan joylar:*\n\n";
      spots.forEach(spot => {
        message += `📍 *${spot.name_uz}*\n🏙 ${spot.city}\n🔗 [Xaritada ko'rish](${spot.map_link})\n\n`;
      });
      ctx.replyWithMarkdown(message);
    } catch (error) {
      console.error('Bot Error:', error);
      ctx.reply("Ma'lumot olishda xatolik yuz berdi.");
    }
  });

  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return; // Ignore other commands

    try {
      const spots = await prisma.touristSpot.findMany({
        where: {
          city: { contains: text, mode: 'insensitive' }
        },
        take: 5
      });
      
      if (spots.length === 0) {
        return ctx.reply(`Afsuski, "${text}" shahri bo'yicha ma'lumot topilmadi.`);
      }

      let message = `🏙 *${text}* shahridagi joylar:\n\n`;
      spots.forEach(spot => {
        message += `🏛 *${spot.name_uz}*\n🔗 [Xaritada ko'rish](${spot.map_link})\n\n`;
      });
      ctx.replyWithMarkdown(message);
    } catch (error) {
      ctx.reply("Qidiruvda xatolik yuz berdi.");
    }
  });

  bot.launch().then(() => {
    console.log('Telegram Bot started successfully!');
  }).catch(err => {
    console.error('Failed to start Telegram Bot:', err);
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
