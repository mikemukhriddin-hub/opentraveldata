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
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Xatolik yuz berdi' });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
