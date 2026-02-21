
import React, { useState, useEffect, useRef } from 'react';
import { StoreSettings, Customer } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  cartCount: number;
  onOpenCart: () => void;
  onSwitchView: (view: 'store' | 'admin') => void;
  currentView: 'store' | 'admin';
  currentCustomer?: Customer;
  onAuthClick: () => void;
  onOpenAccount: () => void;
  onLogout: () => void;
  onGoToOffers?: () => void;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  userLocation: string;
  onLocationChange: (location: string, coords?: {lat: number, lng: number}) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  settings, 
  cartCount, 
  onOpenCart, 
  onSwitchView, 
  currentView, 
  currentCustomer,
  onAuthClick,
  onOpenAccount,
  onLogout,
  onGoToOffers,
  onCategoryChange,
  onSearch,
  userLocation,
  onLocationChange
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationView, setLocationView] = useState<'list' | 'map' | 'manual'>('list');
  const [searchValue, setSearchValue] = useState('');
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (locationView === 'map' && showLocationModal && mapContainerRef.current) {
      const L = (window as any).L;
      if (!L) return;
      if (!mapRef.current) {
        // Updated to Khartoum Coordinates [15.5007, 32.5599]
        mapRef.current = L.map(mapContainerRef.current, { center: [15.5007, 32.5599], zoom: 14, zoomControl: false, attributionControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
      }
    }
  }, [locationView, showLocationModal]);

  return (
    <nav className="sticky top-0 z-50 bg-[#131921] text-white shadow-xl no-print border-b border-premium-gold/30">
      <div className="max-w-[1500px] mx-auto px-4 py-3 flex items-center gap-4">
        
        {/* Luxury Brand Identity */}
        <div className="flex items-center cursor-pointer p-1 shrink-0 group" onClick={() => onSwitchView('store')}>
          <div className="relative">
            <div className="absolute -inset-2 bg-premium-gold/20 rounded-full blur-md group-hover:bg-premium-gold/40 transition-all duration-500"></div>
            <div className="relative w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] border-[3px] border-premium-gold overflow-hidden transition-transform group-hover:scale-105">
               <i className="fas fa-crown text-[8px] text-premium-gold absolute top-1.5 drop-shadow-sm"></i>
               <div className="flex flex-col items-center mt-2">
                  <div className="flex items-center gap-1.5 text-premium-dark">
                    <i className="fas fa-drumstick-bite text-sm"></i>
                    <i className="fas fa-egg text-xs text-premium-gold/70"></i>
                  </div>
                  <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-premium-gold/40 to-transparent my-1"></div>
                  <i className="fas fa-box text-[9px] text-premium-gold"></i>
               </div>
               <div className="absolute -bottom-1 w-full bg-premium-gold py-0.5 flex justify-center">
                  <span className="text-[5px] font-black text-white uppercase tracking-tighter">Premium Quality</span>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col mr-4">
            <h1 className="text-3xl font-black leading-none bg-gradient-to-l from-premium-gold via-yellow-200 to-premium-gold bg-clip-text text-transparent filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">الراقي</h1>
            <div className="flex items-center gap-2 mt-1.5 opacity-90">
              <span className="text-[8px] font-black text-premium-gold uppercase tracking-[0.05em]">دواجن • سلع • تموين</span>
              <div className="w-1 h-1 bg-premium-gold rounded-full"></div>
              <span className="text-[6px] font-bold text-gray-400 uppercase tracking-[0.2em] hidden sm:block">Sudan Market 🇸🇩</span>
            </div>
          </div>
        </div>

        {/* Deliver To */}
        <div 
          className="hidden lg:flex flex-col text-[10px] px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer ml-4 transition-all"
          onClick={() => setShowLocationModal(true)}
        >
          <span className="text-premium-gold/80 font-bold">التوصيل إلى</span>
          <div className="flex items-center gap-1 font-black whitespace-nowrap">
            <i className="fas fa-location-dot text-yellow-400 text-[10px]"></i>
            <span className="max-w-[140px] truncate text-xs">{userLocation}</span>
          </div>
        </div>

        {/* Global Search */}
        <form onSubmit={(e) => { e.preventDefault(); onSearch(searchValue); }} className="flex-grow flex items-center group relative">
          <input 
            type="text" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full py-2.5 px-6 text-black outline-none rounded-2xl font-bold placeholder:font-normal placeholder:text-gray-400 focus:ring-4 ring-premium-gold/20 transition-all border-none" 
            placeholder="دجاج طازج، سكر كنانة، زيت طعام..."
          />
          <button type="submit" className="absolute left-1 bg-gradient-to-r from-premium-gold to-yellow-500 text-[#131921] px-6 py-2 rounded-xl transition-all shadow-lg active:scale-95 font-black">
            <i className="fas fa-search text-lg"></i>
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div 
            className="hidden md:flex flex-col items-end px-3 py-1 hover:bg-white/5 rounded-xl cursor-pointer transition-all" 
            onClick={() => currentCustomer ? onOpenAccount() : onAuthClick()}
          >
            <span className="text-[10px] text-gray-400">أهلاً، {currentCustomer ? currentCustomer.name.split(' ')[0] : 'سجل الدخول'}</span>
            <span className="font-black text-xs flex items-center text-premium-gold">حسابي <i className="fas fa-caret-down mr-1 text-[8px]"></i></span>
          </div>
          
          <div 
            onClick={onOpenCart} 
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-premium-gold hover:from-premium-gold hover:to-yellow-500 rounded-2xl cursor-pointer relative transition-all shadow-lg shadow-yellow-400/10 text-[#131921] group active:scale-90"
          >
            <div className="relative">
              <span className="absolute -top-4 -right-2 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full border-2 border-[#131921]">
                {cartCount}
              </span>
              <i className="fas fa-shopping-basket text-lg"></i>
            </div>
            <span className="font-black text-sm hidden lg:block">السلة</span>
          </div>
        </div>
      </div>

      {showLocationModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in no-print">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 text-black text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/10 rounded-bl-full"></div>
              <i className="fas fa-map-location-dot text-6xl text-premium-gold mb-6 relative z-10"></i>
              <h3 className="text-3xl font-black mb-2">تحديد موقع التوصيل بالسودان</h3>
              <p className="text-gray-400 mb-10 font-bold max-w-sm mx-auto">لنصل إليكم بأسرع وقت في الخرطوم والولايات، يرجى تحديد موقعكم</p>
              <div className="grid grid-cols-2 gap-6">
                 <button onClick={() => setLocationView('map')} className="bg-premium-dark text-premium-gold p-8 rounded-[2.5rem] font-black flex flex-col items-center gap-4 hover:scale-105 transition-all shadow-xl">
                    <i className="fas fa-map-marked-alt text-3xl"></i> تحديد عبر الخريطة
                 </button>
                 <button onClick={() => setLocationView('manual')} className="bg-gray-100 text-gray-500 p-8 rounded-[2.5rem] font-black flex flex-col items-center gap-4 hover:bg-gray-200 transition-all">
                    <i className="fas fa-keyboard text-3xl"></i> إدخال يدوي
                 </button>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="mt-10 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">إغلاق</button>
           </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
