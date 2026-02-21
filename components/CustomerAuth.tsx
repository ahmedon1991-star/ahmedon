
import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerAuthProps {
  onAuthComplete: (customer: Customer) => void;
  onCancel: () => void;
}

const TermsModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl overflow-y-auto max-h-[80vh] text-right">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="text-xl font-bold text-[#131921]">الشروط والأحكام - متجر الراقي</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>
      <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
        <section>
          <h4 className="font-bold text-[#131921] mb-2">1. مقدمة</h4>
          <p>باستخدامك لمتجر الراقي، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل إتمام أي عملية شراء.</p>
        </section>
        <section>
          <h4 className="font-bold text-[#131921] mb-2">2. جودة المنتجات</h4>
          <p>نلتزم في "الراقي" بتقديم منتجات غذائية طبيعية 100% تم فحصها مخبرياً وتخزينها في ظروف مثالية لضمان أعلى مستويات الجودة.</p>
        </section>
        <section>
          <h4 className="font-bold text-[#131921] mb-2">3. سياسة التوصيل</h4>
          <p>يتم توصيل الطلبات داخل مدينة الرياض خلال 24-48 ساعة. قد تختلف مدة التوصيل للمناطق الأخرى حسب شركة الشحن المعتمدة.</p>
        </section>
        <section>
          <h4 className="font-bold text-[#131921] mb-2">4. خصوصية البيانات</h4>
          <p>نحن نحترم خصوصيتك. لن يتم استخدام بياناتك الشخصية (الاسم، الجوال، العنوان) إلا لغرض إتمام الطلب وتحسين تجربة التسوق الخاصة بك.</p>
        </section>
        <section>
          <h4 className="font-bold text-[#131921] mb-2">5. المرتجعات</h4>
          <p>نظراً لطبيعة المنتجات الغذائية، لا يتم قبول المرتجعات إلا في حال وجود عيب مصنعي أو خطأ في المنتج المستلم، ويجب الإبلاغ خلال 24 ساعة من الاستلام.</p>
        </section>
      </div>
      <button 
        onClick={onClose}
        className="mt-8 w-full bg-[#131921] text-white py-4 rounded-xl font-bold"
      >
        فهمت وموافق
      </button>
    </div>
  </div>
);

const CustomerAuth: React.FC<CustomerAuthProps> = ({ onAuthComplete, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !formData.agreeToTerms) {
      alert('يجب الموافقة على الشروط والأحكام للمتابعة');
      return;
    }

    if (formData.password.length < 4) {
      alert('كلمة المرور يجب أن تكون 4 رموز على الأقل');
      return;
    }

    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? (formData.email.split('@')[0] || 'عميل الراقي') : formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      joinedAt: new Date().toISOString()
    };

    onAuthComplete(customer);
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#131921]/80 backdrop-blur-md">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-in border border-[#c5a059]/20 overflow-y-auto max-h-[95vh]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#c5a059]/10 text-[#c5a059] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className={`fas ${isLogin ? 'fa-user-check' : 'fa-user-plus'}`}></i>
            </div>
            <h2 className="text-2xl font-black text-[#131921] mb-2">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h2>
            <p className="text-gray-500 text-sm">مرحباً بك في عالم الراقي للجودة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 ring-[#c5a059]/10 outline-none transition-all"
                  placeholder="أدخل اسمك الثلاثي"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 ring-[#c5a059]/10 outline-none transition-all text-left"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">كلمة المرور</label>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 ring-[#c5a059]/10 outline-none transition-all text-center font-bold tracking-widest"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-4 top-10 text-gray-400"
                >
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">رقم الجوال</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 ring-[#c5a059]/10 outline-none transition-all text-left"
                placeholder="05xxxxxxxx"
                dir="ltr"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1 mr-2 uppercase">عنوان التوصيل الافتراضي</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 ring-[#c5a059]/10 outline-none transition-all h-20 resize-none"
                  placeholder="الحي، الشارع، المعلم المميز"
                />
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start gap-3 px-2 py-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                  className="mt-1 w-4 h-4 text-[#2e7d32] border-gray-300 rounded focus:ring-[#2e7d32]"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                  أوافق على <button type="button" onClick={() => setShowTerms(true)} className="text-[#2e7d32] font-bold hover:underline">الشروط والأحكام</button> وسياسة الخصوصية الخاصة بمتجر الراقي.
                </label>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-premium-green text-white py-4 rounded-2xl font-black shadow-premium-green transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLogin ? 'تسجيل الدخول' : 'تأكيد التسجيل'}
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-[#c5a059] py-2 text-sm font-bold hover:underline"
              >
                {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 text-xs hover:text-[#131921] transition-colors"
              >
                العودة للمتجر
              </button>
            </div>
          </form>
        </div>
      </div>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  );
};

export default CustomerAuth;