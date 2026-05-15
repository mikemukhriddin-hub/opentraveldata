import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Globe, Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';

const LoginPage = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Foydalanuvchi kiritgan ma'lumotlar asosida dinamik "fake" token yasash
    const payload = {
      name: email.split('@')[0], // Emailning bosh qismini ism sifatida olamiz
      email: email,
      picture: "https://ui-avatars.com/api/?name=" + email
    };
    
    // JWT formatida base64 kodlash (jwt-decode tushunishi uchun)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const data = btoa(JSON.stringify(payload));
    const dummyToken = `${header}.${data}.signature`;
    
    onLoginSuccess({ 
      credential: dummyToken,
      dummy: true 
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate registration success
    setIsRegister(false);
    alert("Ro'yxatdan o'tish muvaffaqiyatli! Endi kirishingiz mumkin.");
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-[#5d5fef] mb-2 tracking-tight">OPTD Uzbekistan</h1>
        <p className="text-gray-500 font-medium">Explore the heritage with ease</p>
      </div>

      <div className="bg-white p-8 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[440px] border border-gray-100 animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#5d5fef]/10 rounded-xl flex items-center justify-center text-[#5d5fef]">
            <ArrowRight size={24} className={isRegister ? 'rotate-180 transition-transform' : ''} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{isRegister ? 'Create Account' : 'Login'}</h2>
        </div>

        <form className="space-y-5" onSubmit={isRegister ? handleRegister : handleSubmit}>
          {isRegister && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5d5fef] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/5 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5d5fef] transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="your@email.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/5 transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              {!isRegister && <button type="button" className="text-xs font-bold text-[#5d5fef] hover:underline">Forgot password?</button>}
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5d5fef] transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/5 transition-all text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5d5fef] transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/5 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {!isRegister && (
            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#5d5fef] focus:ring-[#5d5fef]" />
              <label htmlFor="remember" className="text-sm text-gray-600 font-medium cursor-pointer">Remember me</label>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#5d5fef] hover:bg-[#4a4ce0] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#5d5fef]/20 transition-all active:scale-[0.98]"
          >
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
        </div>

        <div className="flex justify-center">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={onLoginSuccess}
              onError={() => console.log('Login Failed')}
              useOneTap
              theme="outline"
              shape="pill"
              text="continue_with"
            />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#5d5fef] font-bold hover:underline"
          >
            {isRegister ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
