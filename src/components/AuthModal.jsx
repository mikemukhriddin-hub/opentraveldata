import React, { useState } from 'react';
import { X, Phone, MessageCircle, Code, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, activeLang }) {
  const [authStep, setAuthStep] = useState('select'); // select, phone, sms
  const [phone, setPhone] = useState('+998 ');
  const [smsCode, setSmsCode] = useState('');

  if (!isOpen) return null;

  const handleSimulateLogin = (method) => {
    onLogin({ name: method === 'tg' ? 'Azizbek_Dev' : 'DeveloperUser', method, badge: '🌟 Contributor' });
    onClose();
  };

  // Telegram Login Callback
  window.onTelegramAuth = (user) => {
    console.log('Telegram User Authenticated:', user);
    onLogin({ 
      name: user.username || user.first_name, 
      method: 'tg', 
      badge: '✅ Verified via Telegram',
      photo: user.photo_url 
    });
    onClose();
  };

  React.useEffect(() => {
    if (authStep === 'select' && isOpen) {
      const script = document.createElement('script');
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute('data-telegram-login', "optd_login_bot"); // Bot username updated
      script.setAttribute('data-size', "large");
      script.setAttribute('data-radius', "12");
      script.setAttribute('data-onauth', "onTelegramAuth(user)");
      script.setAttribute('data-request-access', "write");
      script.async = true;
      
      const container = document.getElementById('telegram-login-container');
      if (container) {
        container.innerHTML = ''; // Tozalash
        container.appendChild(script);
      }
    }
  }, [authStep, isOpen]);

  const texts = {
    uz: {
      title: "Tizimga kirish",
      desc: "O'zbekiston Ochiq Ma'lumotlar platformasiga xush kelibsiz",
      tgBtn: "Telegram orqali tezkor kirish",
      smsBtn: "SMS orqali kirish (+998)",
      devTitle: "Dasturchilar uchun",
      phoneTitle: "Telefon raqamingiz",
      sendSms: "SMS kod yuborish",
      smsTitle: "SMS kodni kiriting",
      verifySms: "Tasdiqlash",
      back: "Orqaga"
    },
    en: {
      title: "Sign In",
      desc: "Welcome to Uzbekistan Open Data Platform",
      tgBtn: "Quick login via Telegram",
      smsBtn: "Login via SMS (+998)",
      devTitle: "For Developers",
      phoneTitle: "Your Phone Number",
      sendSms: "Send SMS Code",
      smsTitle: "Enter SMS Code",
      verifySms: "Verify",
      back: "Back"
    },
    ru: {
      title: "Войти",
      desc: "Добро пожаловать в платформу открытых данных",
      tgBtn: "Быстрый вход через Telegram",
      smsBtn: "Вход по SMS (+998)",
      devTitle: "Для разработчиков",
      phoneTitle: "Ваш номер телефона",
      sendSms: "Отправить SMS код",
      smsTitle: "Введите SMS код",
      verifySms: "Подтвердить",
      back: "Назад"
    }
  };

  const t = texts[activeLang] || texts.uz;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass-panel p-8 animate-fade-in border border-white/20 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-[#0A0F1A]/90">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan/20 to-blue-500/20 flex items-center justify-center text-cyan mx-auto mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)] border border-cyan/30">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
          <p className="text-muted text-sm">{t.desc}</p>
        </div>

        {authStep === 'select' && (
          <div className="space-y-4">
            <div id="telegram-login-container" className="w-full flex justify-center mb-2">
              {/* Telegram Widget shu yerda paydo bo'ladi */}
            </div>
            
            <button 
              onClick={() => setAuthStep('phone')}
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              <Phone size={20} />
              {t.smsBtn}
            </button>.5 rounded-xl font-medium transition-colors"
            >
              <Phone size={20} />
              {t.smsBtn}
            </button>

            <div className="py-4 flex items-center gap-4 text-muted text-xs uppercase tracking-wider">
              <div className="flex-1 h-px bg-white/10"></div>
              {t.devTitle}
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSimulateLogin('github')}
                className="flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#1b1f23] text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Code size={18} /> GitHub
              </button>
              <button 
                onClick={() => handleSimulateLogin('google')}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Mail size={18} /> Google
              </button>
            </div>
          </div>
        )}

        {authStep === 'phone' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">{t.phoneTitle}</label>
              <div className="flex items-center bg-[#070B14] border border-white/10 rounded-xl px-4 py-1 focus-within:border-cyan transition-colors">
                <span className="text-muted mr-2">🇺🇿</span>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent py-3 text-white outline-none font-mono text-lg"
                  autoFocus
                />
              </div>
            </div>
            <button 
              onClick={() => setAuthStep('sms')}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,229,255,0.3)]"
            >
              {t.sendSms} <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => setAuthStep('select')}
              className="w-full text-sm text-muted hover:text-white transition py-2"
            >
              {t.back}
            </button>
          </div>
        )}

        {authStep === 'sms' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-muted mb-2 text-center">{t.smsTitle}</label>
              <p className="text-xs text-cyan mb-6 text-center">{phone} raqamiga maxfiy kod yuborildi</p>
              <div className="flex gap-2 justify-center mb-4">
                {[1,2,3,4,5].map(i => (
                  <input 
                    key={i} 
                    type="text" 
                    maxLength={1} 
                    className="w-12 h-14 bg-[#070B14] border border-white/10 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-cyan focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all" 
                  />
                ))}
              </div>
            </div>
            <button 
              onClick={() => handleSimulateLogin('sms')}
              className="w-full btn-primary py-3.5 shadow-[0_4px_20px_rgba(0,229,255,0.3)]"
            >
              {t.verifySms}
            </button>
            <button 
              onClick={() => setAuthStep('phone')}
              className="w-full text-sm text-muted hover:text-white transition py-2"
            >
              {t.back}
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-[10px] text-muted/50 max-w-xs mx-auto leading-relaxed">
          Tizimga kirish orqali siz loyihaning CC-BY litsenziyasi ostida ochiq hissa qo'shish qoidalariga rozilik bildirasiz. Shaxsiy ma'lumotlar O'zbekiston hududida saqlanadi.
        </div>
      </div>
    </div>
  );
}
