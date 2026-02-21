
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  onCancel: () => void;
  error?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel, error }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotHint, setShowForgotHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-premium-dark/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fade-in border border-premium-gold/20">
        {!showForgotHint ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-premium-dark text-premium-gold rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                <i className="fas fa-lock"></i>
              </div>
              <h2 className="text-2xl font-bold text-premium-dark mb-2">دخول الإدارة</h2>
              <p className="text-gray-500 text-sm">يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  autoFocus
                  className={`w-full px-6 py-4 rounded-2xl border ${error ? 'border-red-500' : 'border-gray-100'} bg-gray-50 focus:bg-white focus:ring-2 ring-premium-gold/20 outline-none transition-all text-center font-bold text-lg`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-premium-dark transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                
                {error && <p className="text-red-500 text-xs mt-2 text-center font-bold">{error}</p>}
                
                <div className="text-left mt-2">
                  <button 
                    type="button"
                    onClick={() => setShowForgotHint(true)}
                    className="text-xs text-premium-gold hover:underline font-bold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-premium-green text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-premium-green/20"
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full text-gray-400 py-2 text-sm font-medium hover:text-premium-dark transition-colors"
                >
                  العودة للمتجر
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-fade-in">
            <div className="w-16 h-16 bg-premium-gold/10 text-premium-gold rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              <i className="fas fa-info-circle"></i>
            </div>
            <h2 className="text-xl font-bold text-premium-dark mb-4">استعادة كلمة المرور</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              لأمان متجرك، لا تتوفر ميزة استعادة كلمة المرور آلياً. <br/>
              يرجى التواصل مع المالك مباشرة عبر **واتساب** أو البريد الإلكتروني المسجل لإعادة ضبط كلمة المرور.
            </p>
            
            <div className="space-y-3 mb-8">
               <a 
                 href="https://wa.me/966558735605" 
                 target="_blank"
                 className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
               >
                 <i className="fab fa-whatsapp"></i>
                 تواصل عبر واتساب
               </a>
               <p className="text-xs text-gray-400 font-mono">ahmedon1991@gmail.com</p>
            </div>

            <button 
              onClick={() => setShowForgotHint(false)}
              className="text-premium-dark font-bold text-sm hover:underline"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
