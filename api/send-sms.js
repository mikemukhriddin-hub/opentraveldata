// Vercel Serverless Function: api/send-sms.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code are required' });
  }

  // Eskiz.uz Credentiallari (Vercel Dashboard'da o'rnatilishi kerak)
  const ESKIZ_EMAIL = process.env.ESKIZ_EMAIL;
  const ESKIZ_PASSWORD = process.env.ESKIZ_PASSWORD;

  if (!ESKIZ_EMAIL || !ESKIZ_PASSWORD) {
    console.error('Eskiz credentials missing in environment variables');
    return res.status(500).json({ error: 'SMS service configuration error' });
  }

  try {
    // 1. Eskiz.uz dan TOKEN olish
    const authResponse = await fetch('https://notify.eskiz.uz/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ESKIZ_EMAIL, password: ESKIZ_PASSWORD }),
    });

    const authData = await authResponse.json();
    const token = authData?.data?.token;

    if (!token) {
      throw new Error('Failed to get Eskiz token');
    }

    // 2. SMS yuborish
    // Raqam formatini to'g'rilash (masalan: 998940196420)
    const cleanPhone = phone.replace(/\D/g, '');

    const smsResponse = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mobile_phone: cleanPhone,
        message: `OPTD Uzbekistan tasdiqlash kodi: ${code}`,
        from: '4545', // Eskiz'dan berilgan nickname (masalan 4545)
        callback_url: ''
      }),
    });

    const smsData = await smsResponse.json();

    return res.status(200).json({ success: true, data: smsData });
  } catch (error) {
    console.error('SMS sending error:', error);
    return res.status(500).json({ error: 'Failed to send SMS via Eskiz' });
  }
}
