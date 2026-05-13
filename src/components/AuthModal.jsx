import React, { useState } from 'react';
import { X, ShieldCheck, Mail } from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function AuthModal({ isOpen, onClose, onLogin, activeLang }) {
  // GOOGLE_CLIENT_ID ni keyinchalik .env fayliga yoki Vercel sozlamalariga qo'yasiz
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"; 

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Google User:', decoded);
    
    onLogin({ 
      name: decoded.name, 
      method: 'google', 
      badge: '✅ Google Verified',
      photo: decoded.picture,
      email: decoded.email
    });
    onClose();
  };

  const handleError = () => {
    console.log('Login Failed');
    alert("Google orqali kirishda xatolik yuz berdi!");
  };

  const texts = {
    uz: { title: "Tizimga kirish", desc: "Google hisobingiz orqali bir marta bosish bilan kiring", back: "Orqaga" },
    en: { title: "Sign In", desc: "Sign in with your Google account in one click", back: "Back" },
    ru: { title: "Войти", desc: "Войдите через свой Google аккаунт в один клик", back: "Назад" }
  };
  const t = texts[activeLang] || texts.uz;

  if (!isOpen) return null;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative w-full max-w-md glass-panel p-10 border border-white/20 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-[#0A0F1A]/95 animate-fade-in rounded-[32px]">
          <button onClick={onClose} className="absolute top-6 right-6 text-muted hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full">
            <X size={20} />
          </button>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-cyan/20 to-blue-500/20 flex items-center justify-center text-cyan mx-auto mb-6 shadow-[0_0_30px_rgba(0,229,255,0.2)] border border-cyan/30">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight">{t.title}</h2>
            <p className="text-muted text-sm leading-relaxed max-w-[250px] mx-auto">{t.desc}</p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan/50 to-blue-500/50 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  width="100%"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted text-[10px] uppercase tracking-[0.2em]">
              <div className="flex-1 h-px bg-white/5"></div>
              Xavfsiz ulanish
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
          </div>

          <div className="mt-10 text-center text-[10px] text-muted/40 leading-relaxed italic">
            "Google orqali kirish" xizmati ma'lumotlaringiz maxfiyligini 100% kafolatlaydi.
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
