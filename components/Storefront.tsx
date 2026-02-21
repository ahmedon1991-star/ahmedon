
import React, { useState, useEffect } from 'react';
import { Product, Category, StoreSettings } from '../types';
import ProductCard from './ProductCard';

interface StorefrontProps {
  settings: StoreSettings;
  products: Product[];
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenAdmin?: () => void;
  onProductClick: (product: Product) => void; 
  searchQuery: string;
}

const Storefront: React.FC<StorefrontProps> = ({ 
  settings, 
  products, 
  categories, 
  activeCategory, 
  onCategoryChange, 
  onAddToCart,
  onOpenAdmin,
  onProductClick,
  searchQuery
}) => {
  const [timeLeft, setTimeLeft] = useState(3600 * 2.5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 3600 * 5);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCategorySelection = (category: string) => {
    onCategoryChange(category);
    // انتقال سلس لقائمة المنتجات
    const feedElement = document.getElementById('product-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeCategory === 'الكل') return true;
    if (activeCategory === 'العروض') return !!(p.originalPrice && p.originalPrice > p.price);
    if (activeCategory === 'الأكثر مبيعاً') return products.indexOf(p) < 6;
    return p.category === activeCategory;
  });

  const offerProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);
  const bestSellers = products.slice(0, 4);

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16">
      {/* Banner Carousel */}
      {!searchQuery && (
        <section className="relative w-full h-[250px] md:h-[450px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eaeded] z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover animate-slow-zoom"
            alt="Banner"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-20">
             <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-2xl max-w-lg transform -translate-y-10 border border-white">
                <h1 className="text-3xl md:text-4xl font-black text-[#131921] mb-2 leading-tight">عروض الصيف الكبرى</h1>
                <p className="text-[#c45500] font-black text-xl mb-4">خصومات تصل إلى ٦٠٪</p>
                <button 
                  onClick={() => handleCategorySelection('العروض')}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#131921] px-10 py-3 rounded-full font-bold shadow-md transition-all active:scale-95"
                >
                  تسوق العروض الآن
                </button>
             </div>
          </div>
        </section>
      )}

      <div className={`max-w-[1500px] mx-auto px-4 relative z-30 ${searchQuery ? 'pt-8' : '-mt-20 md:-mt-48'}`}>
        
        {/* Category Circles Enhanced - Hide on search for cleaner UI */}
        {!searchQuery && (
          <div className="flex justify-start md:justify-center gap-4 md:gap-10 overflow-x-auto pb-8 pt-4 no-scrollbar scroll-smooth">
            <div onClick={() => handleCategorySelection('الكل')} className="flex flex-col items-center cursor-pointer group shrink-0">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all border-2 mb-2 shadow-sm ${activeCategory === 'الكل' ? 'bg-white border-[#f08804] scale-110 shadow-lg' : 'bg-white border-transparent hover:border-gray-200'}`}>
                <i className={`fas fa-th-large text-xl md:text-2xl ${activeCategory === 'الكل' ? 'text-[#f08804]' : 'text-gray-400'}`}></i>
              </div>
              <span className={`text-xs font-bold ${activeCategory === 'الكل' ? 'text-[#f08804]' : 'text-gray-600'}`}>الكل</span>
            </div>

            <div onClick={() => handleCategorySelection('العروض')} className="flex flex-col items-center cursor-pointer group shrink-0">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all border-2 mb-2 shadow-sm relative ${activeCategory === 'العروض' ? 'bg-[#cc0c39] border-[#cc0c39] scale-110 shadow-lg shadow-red-200' : 'bg-white border-transparent hover:border-red-100'}`}>
                <i className={`fas fa-bolt text-xl md:text-2xl ${activeCategory === 'العروض' ? 'text-white' : 'text-[#cc0c39]'} animate-pulse`}></i>
                {offerProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amazon-yellow text-premium-dark text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white">
                    {offerProducts.length}
                  </span>
                )}
              </div>
              <span className={`text-xs font-bold ${activeCategory === 'العروض' ? 'text-[#cc0c39]' : 'text-gray-600'}`}>العروض</span>
            </div>

            {categories.map((cat) => (
              <div 
                key={cat}
                onClick={() => handleCategorySelection(cat)}
                className="flex flex-col items-center cursor-pointer group shrink-0"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all border-2 mb-2 shadow-sm ${
                  activeCategory === cat ? 'bg-white border-[#f08804] scale-110 shadow-lg' : 'bg-white border-transparent hover:border-gray-200'
                }`}>
                  <i className={`fas ${
                    cat === 'تمور' ? 'fa-seedling' : 
                    cat === 'عسل' ? 'fa-honey-pot' : 
                    cat === 'زيوت' ? 'fa-flask' : 'fa-box'
                  } text-xl md:text-2xl ${activeCategory === cat ? 'text-[#f08804]' : 'text-gray-400'}`}></i>
                </div>
                <span className={`text-xs font-bold ${activeCategory === cat ? 'text-[#f08804]' : 'text-gray-600'}`}>{cat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Grid Cards Section - Hide on search */}
        {!searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Flash Sales Card - Enhanced Clickability */}
            <div 
              onClick={() => handleCategorySelection('العروض')}
              className="bg-white p-5 rounded-sm shadow-sm flex flex-col h-full border border-gray-100 cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-[#cc0c39]"></div>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-lg group-hover:text-[#cc0c39] transition-colors">عروض الراقي السريعة</h3>
                 <div className="flex items-center gap-2 text-[#cc0c39] font-bold text-sm">
                    <i className="fas fa-bolt animate-pulse"></i>
                    <span>ينتهي في: {formatTime(timeLeft)}</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2 flex-grow mb-4">
                 {offerProducts.slice(0, 4).map(p => (
                   <div key={p.id} className="group/item">
                     <div className="aspect-square bg-gray-50 rounded-sm overflow-hidden mb-1">
                       <img src={p.image} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" alt={p.name} />
                     </div>
                     <div className="flex items-center gap-1">
                        <span className="bg-[#cc0c39] text-white text-[10px] px-1 font-bold">خصم {Math.round((p.originalPrice! - p.price) / p.originalPrice! * 100)}%</span>
                     </div>
                   </div>
                 ))}
                 {offerProducts.length === 0 && (
                   <div className="col-span-2 flex items-center justify-center h-full text-gray-300 text-xs py-10">لا توجد عروض حالياً</div>
                 )}
              </div>
              <button className="text-[#007185] text-xs font-black group-hover:text-[#cc0c39] self-start flex items-center gap-2">
                عرض جميع العروض ({offerProducts.length})
                <i className="fas fa-chevron-left text-[8px]"></i>
              </button>
            </div>

            <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col h-full border border-gray-100">
               <h3 className="font-bold text-lg mb-4">الأكثر مبيعاً في الرياض</h3>
               <div className="grid grid-cols-2 gap-3 flex-grow mb-4">
                  {bestSellers.map(p => (
                    <div key={p.id} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); onProductClick(p); }}>
                      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-1 border border-gray-50 group-hover:border-premium-gold/30 transition-all">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-700 truncate">{p.name}</p>
                      <p className="text-[10px] font-black text-premium-green">{p.price} ريال</p>
                    </div>
                  ))}
               </div>
               <button onClick={() => handleCategorySelection('الأكثر مبيعاً')} className="text-[#007185] text-xs font-medium hover:underline self-start">تسوق القائمة الكاملة</button>
            </div>

            <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col h-full border border-gray-100">
               <h3 className="font-bold text-lg mb-4">وصل حديثاً للراقي</h3>
               <div className="grid grid-cols-2 gap-2 flex-grow">
                  {products.slice(2, 6).map(p => (
                    <div key={p.id} className="aspect-square bg-gray-50 p-2 rounded-sm border border-gray-50 flex flex-col items-center justify-center text-center cursor-pointer" onClick={(e) => { e.stopPropagation(); onProductClick(p); }}>
                      <img src={p.image} className="w-full h-2/3 object-cover mb-2 rounded-sm" />
                      <span className="text-[10px] font-bold text-gray-700 truncate w-full">{p.name}</span>
                    </div>
                  ))}
               </div>
               <button onClick={() => handleCategorySelection('الكل')} className="text-[#007185] text-xs font-medium hover:underline mt-4 self-start">اكتشف الجديد</button>
            </div>

            <div className="bg-[#f3f3f3] p-5 rounded-sm shadow-sm flex flex-col items-center justify-center text-center h-full border border-gray-200">
               <h3 className="font-bold text-lg mb-2">استخدم تطبيق الراقي</h3>
               <p className="text-xs text-gray-500 mb-4">احصل على خصم إضافي ١٠٪ على أول طلب لك.</p>
               <div className="w-24 h-24 bg-white p-2 rounded-xl mb-4 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <i className="fas fa-qrcode text-5xl text-gray-200"></i>
               </div>
               <button className="bg-[#131921] text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg">تحميل التطبيق</button>
            </div>
          </div>
        )}

        {/* Main Product Feed - Dynamic Header */}
        <div id="product-feed" className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 scroll-mt-24">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              <h2 className="text-xl font-black text-[#131921] flex items-center gap-3">
                 {searchQuery ? (
                    <>
                      نتائج البحث عن: <span className="text-premium-gold">"{searchQuery}"</span>
                      <span className="text-sm font-normal text-gray-400">({filteredProducts.length} نتيجة)</span>
                    </>
                 ) : (
                    <>
                      {activeCategory === 'العروض' && <i className="fas fa-bolt text-[#cc0c39] animate-pulse"></i>}
                      {activeCategory === 'الكل' ? 'المقترحات المختارة لك' : 
                       activeCategory === 'العروض' ? '🔥 أقوى العروض الحصرية' :
                       activeCategory === 'الأكثر مبيعاً' ? 'القائمة الأكثر مبيعاً' : `قسم ${activeCategory}`}
                    </>
                 )}
              </h2>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-8">
             {filteredProducts.map(product => (
                <ProductCard 
                   key={product.id} 
                   product={product} 
                   onAddToCart={() => onAddToCart(product)}
                   onClick={() => onProductClick(product)}
                />
             ))}
             {filteredProducts.length === 0 && (
               <div className="col-span-full py-20 text-center text-gray-400">
                 <i className="fas fa-search text-4xl mb-4 opacity-20"></i>
                 <p className="text-lg">عذراً، لم نجد نتائج تطابق بحثك</p>
                 <button 
                   onClick={() => onCategoryChange('الكل')}
                   className="mt-4 text-premium-gold font-bold hover:underline"
                 >
                   عرض جميع المنتجات
                 </button>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Storefront;
