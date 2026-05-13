import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, CheckCircle, MapPin } from 'lucide-react';

export default function EditModal({ isOpen, onClose, node, activeLang }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ latitude: '', longitude: '' });

  useEffect(() => {
    if (node) {
      setFormData({ latitude: node.latitude, longitude: node.longitude });
    }
    setIsSubmitted(false);
  }, [node]);

  if (!isOpen || !node) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  const translations = {
    uz: {
      edit: "Tahrirlash", lat: "Kenglik (Latitude)", lng: "Uzunlik (Longitude)",
      warning: "O'zgarishlar moderatorlar tomonidan tekshirilgandan so'ng bazaga qo'shiladi.",
      save: "Saqlash va Yuborish", success: "Muvaffaqiyatli!",
      successDesc: "Sizning tahriringiz moderatorlarga yuborildi. Rahmat!"
    },
    en: {
      edit: "Edit", lat: "Latitude", lng: "Longitude",
      warning: "Changes will be added to the database after QA by moderators.",
      save: "Save & Submit", success: "Success!",
      successDesc: "Your edit has been submitted to the moderators. Thank you!"
    },
    ru: {
      edit: "Редактировать", lat: "Широта (Latitude)", lng: "Долгота (Longitude)",
      warning: "Изменения будут добавлены в базу после проверки модераторами.",
      save: "Сохранить и Отправить", success: "Успешно!",
      successDesc: "Ваши изменения отправлены модераторам. Спасибо!"
    }
  };
  const t = translations[activeLang] || translations.uz;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass-panel p-8 animate-fade-in border border-white/20 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-[#0A0F1A]/90">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-full">
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <MapPin className="text-cyan" /> {t.edit}
              </h2>
              <p className="text-muted text-sm">{node.name_uz}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">{t.lat}</label>
                <input 
                  type="text" 
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  className="w-full bg-[#070B14] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-cyan transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">{t.lng}</label>
                <input 
                  type="text" 
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  className="w-full bg-[#070B14] border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-cyan transition-colors font-mono"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex items-start gap-3 mt-4">
                <ShieldAlert className="text-yellow-500 shrink-0" size={18} />
                <p className="text-xs text-yellow-500/80 leading-relaxed">
                  {t.warning}
                </p>
              </div>

              <button type="submit" className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-6">
                <Save size={18} /> {t.save}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t.success}</h2>
            <p className="text-muted text-sm">{t.successDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
