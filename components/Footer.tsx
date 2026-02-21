
import React from 'react';
import { StoreSettings, Category } from '../types';

interface FooterProps {
  settings: StoreSettings;
  categories: Category[];
  onCategoryChange: (category: string) => void;
  onSwitchView: (view: 'store' | 'admin') => void;
}

const Footer: React.FC<FooterProps> = ({ settings, categories, onCategoryChange, onSwitchView }) => {
  const handleNavClick = (cat: string) => {
    onCategoryChange(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    onSwitchView('store');
    onCategoryChange('الكل');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-premium-dark text-white pt-24 pb-12 border-t border-premium-gold/10 relative overflow-hidden">
      {/* Decorative Gold Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-8 cursor-pointer group" onClick={handleHomeClick}>
              <div className="relative">
                <div className="absolute -inset-1 bg-premium-gold/30 rounded-full blur-sm group-hover:bg-premium-gold/50 transition-all"></div>
                <div className="relative w-14 h-14 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-premium-gold overflow-hidden">
                   <div className="flex flex-col items-center">
                      <i className="fas fa-crown text-[6px] text-premium-gold mb-0.5"></i>
                      <div className="flex gap-1 items-center">
                         <i className="fas fa-drumstick-bite text-[10px] text-premium-dark"></i>
                         <i className="fas fa-egg text-[8px] text-premium-gold"></i>
                      </div>
                      <div className="w-5 h-[1px] bg-premium-gold/30 my-0.5"></div>
                      <i className="fas fa-box text-[8px] text-premium-gold/60"></i>
                   </div>
                </div>
              </div>
              <div className="flex flex-col mr-4">
                <span className="text-2xl font-black tracking-tighter text-premium-gold">الراقي</span>
                <span className="text-[7px] font-bold text-white/30 tracking-[0.1em] uppercase">Poultry • Eggs • Canned</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 max-w-xs">
              {settings.description}
            </p>
            <div className="flex gap-4">
              {[
                { icon: 'fa-instagram', color: 'hover:bg-gradient-to-tr from-yellow-400 to-pink-500' },
                { icon: 'fa-twitter', color: 'hover:bg-blue-400' },
                { icon: 'fa-whatsapp', color: 'hover:bg-green-500' }
              ].map((social, i) => (
                <a key={i} href="#" className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 border border-white/5 ${social.color} hover:shadow-lg hover:-translate-y-1`}>
                  <i className={`fab ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-black mb-10 text-premium-gold flex items-center gap-3">
              <span className="w-8 h-0.5 bg-premium-gold"></span>
              أقسام المتجر
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {categories.slice(0, 5).map(cat => (
                <li key={cat}>
                  <button onClick={() => handleNavClick(cat)} className="hover:text-premium-gold hover:pr-2 transition-all flex items-center gap-3 font-bold">
                     <i className="fas fa-chevron-left text-[8px]"></i> {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-black mb-10 text-premium-gold flex items-center gap-3">
              <span className="w-8 h-0.5 bg-premium-gold"></span>
              خدمة العملاء
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><button onClick={handleHomeClick} className="hover:text-premium-gold transition-colors font-bold">الرئيسية</button></li>
              <li><button onClick={() => handleNavClick('العروض')} className="hover:text-premium-gold transition-colors font-bold">أحدث العروض</button></li>
              <li><button className="hover:text-premium-gold transition-colors font-bold">سياسة التوصيل</button></li>
              <li><button className="hover:text-premium-gold transition-colors font-bold">تتبع طلبك</button></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
            <h4 className="text-base font-black mb-8 text-premium-gold">معلومات التواصل</h4>
            <ul className="space-y-6 text-gray-300 text-xs">
              <li className="flex items-start gap-4">
                <i className="fas fa-map-marker-alt text-premium-gold mt-1"></i>
                <span className="leading-relaxed font-bold">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <i className="fas fa-phone-alt text-premium-gold"></i>
                <span dir="ltr" className="font-black text-sm">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <i className="fas fa-envelope text-premium-gold"></i>
                <span className="truncate max-w-[150px] font-bold">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-[10px] font-bold">
          <p>© {new Date().getFullYear()} شركة {settings.name}. نعتني بجودة مائدتكم بكل فخر.</p>
          <div className="flex items-center gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
             <i className="fab fa-cc-visa text-2xl"></i>
             <i className="fab fa-cc-mastercard text-2xl"></i>
             <i className="fab fa-apple-pay text-4xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
