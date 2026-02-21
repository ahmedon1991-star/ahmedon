
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);

  const hasOffer = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasOffer ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  // Calculate dynamic rating based on reviews
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.8"; // Default if no reviews

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleBuyNow = () => {
    // إضافة المنتج للكمية المختارة
    for(let i=0; i < quantity; i++) {
        onAddToCart(product, selectedSize);
    }
    // إغلاق النافذة (السلة ستفتح تلقائياً من خلال App.tsx)
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        
        {/* Close Button Mobile */}
        <button onClick={onClose} className="absolute top-6 left-6 md:hidden z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800">
           <i className="fas fa-times"></i>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 relative flex items-center justify-center p-6 border-l border-gray-100">
           <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500" 
           />
           {hasOffer && (
              <div className="absolute top-8 right-8 bg-[#cc0c39] text-white px-4 py-2 rounded-full font-black text-sm shadow-xl z-20">
                 خصم {discountPercent}%
              </div>
           )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 text-right flex flex-col relative">
           {/* Desktop Close Button */}
           <button onClick={onClose} className="hidden md:flex absolute top-8 left-8 text-gray-300 hover:text-gray-800 transition-colors p-2">
              <i className="fas fa-times text-2xl"></i>
           </button>

           <div className="mb-2">
              <span className="text-[#007185] text-xs font-bold hover:underline cursor-pointer">زيارة متجر الراقي الرسمي</span>
           </div>
           
           <h2 className="text-2xl md:text-3xl font-black text-[#0f1111] mb-2 leading-tight">
              {product.name}
           </h2>

           {/* Rating */}
           <div className="flex items-center gap-2 mb-6">
              <div className="flex text-[#ffa41c] text-sm">
                 {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(Number(averageRating)) ? '' : 'text-gray-200'}`}></i>
                 ))}
              </div>
              <span className="text-sm text-[#007185] font-bold">{reviews.length > 0 ? reviews.length : 248} تقييم عملاء موثق</span>
           </div>

           <div className="h-px bg-gray-100 w-full mb-6"></div>

           {/* Price Section */}
           <div className="mb-6">
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-[#0f1111]">{product.price.toLocaleString()}</span>
                 <span className="text-sm font-bold mt-1 text-gray-500 mr-1">ج.س</span>
                 {hasOffer && (
                    <span className="text-lg text-gray-400 line-through mr-4">{product.originalPrice?.toLocaleString()} ج.س</span>
                 )}
              </div>
              <p className="text-xs text-[#565959] mt-1 font-bold">الأسعار تشمل التوصيل والضرائب المعمول بها بالسودان</p>
           </div>

           {/* Tabs for Details and Reviews */}
           <div className="space-y-8 mb-8">
              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-sm font-black text-[#0f1111] mb-3">اختر الحجم / الوزن المتوفر:</p>
                  <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                            selectedSize === size 
                            ? 'border-premium-gold bg-premium-gold/5 text-premium-gold' 
                            : 'border-gray-100 hover:border-gray-200 text-gray-400'
                          }`}
                        >
                            {size}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-sm font-black text-[#0f1111] mb-2">عن هذا المنتج:</p>
                <p className="text-sm text-gray-600 leading-relaxed font-bold opacity-80">
                  {product.description}
                </p>
              </div>

              {/* Real Reviews Section */}
              <div className="border-t pt-8">
                <p className="text-sm font-black text-[#0f1111] mb-4 flex items-center gap-2">
                   آراء العملاء الحقيقية 
                   <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">موثق</span>
                </p>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                   {reviews.length > 0 ? (
                      reviews.map((r) => (
                        <div key={r.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-black text-premium-dark">{r.customerName}</span>
                              <div className="flex text-premium-gold text-[10px]">
                                 {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < r.rating ? '' : 'text-gray-200'}`}></i>
                                 ))}
                              </div>
                           </div>
                           <p className="text-[11px] text-gray-600 leading-relaxed italic">"{r.comment}"</p>
                           <p className="text-[8px] text-gray-400 mt-2">{new Date(r.date).toLocaleDateString('ar-SA')}</p>
                        </div>
                      ))
                   ) : (
                      <p className="text-xs text-gray-400 italic font-bold">لا توجد مراجعات نصية لهذا المنتج بعد. كن أول من يكتب تقييماً!</p>
                   )}
                </div>
              </div>
           </div>

           {/* Delivery Info */}
           <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-8 space-y-2">
              <p className="text-xs font-bold text-emerald-800">توصيل <span className="font-black">مجاني</span> للمناطق المختارة بحلول <span className="font-black">{getDeliveryDate()}</span></p>
              <p className="text-[10px] text-[#007600] font-black flex items-center gap-2">
                 <i className="fas fa-check-circle"></i> المنتج متوفر وجاهز للشحن الفوري
              </p>
           </div>

           {/* Actions */}
           <div className="mt-auto space-y-3">
              <div className="flex items-center gap-4 mb-4">
                 <div className="flex items-center border-2 border-gray-100 rounded-full bg-gray-50 px-2 py-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black"><i className="fas fa-minus text-xs"></i></button>
                    <span className="w-10 text-center font-black text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black"><i className="fas fa-plus text-xs"></i></button>
                 </div>
                 <span className="text-xs font-black text-gray-400">الكمية</span>
              </div>
              
              <button 
                onClick={() => {
                  onAddToCart(product, selectedSize);
                  onClose();
                }}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 border border-[#fcd200] flex items-center justify-center gap-3"
              >
                 <i className="fas fa-cart-plus text-lg"></i>
                 إضافة إلى سلة الطلبات
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="w-full bg-premium-dark hover:bg-black text-premium-gold py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-premium-gold/30"
              >
                 <i className="fas fa-shopping-bag text-lg"></i>
                 شراء المنتج الآن
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
