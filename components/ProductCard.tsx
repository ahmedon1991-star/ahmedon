
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const isOutOfStock = product.stock === 0;
  const hasOffer = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasOffer ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  const rating = (4 + Math.random()).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 500) + 10;

  return (
    <div 
      onClick={onClick}
      className={`group flex flex-col h-full bg-white transition-all cursor-pointer ${isOutOfStock ? 'opacity-70' : 'hover:shadow-lg'}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-sm mb-2 border border-transparent group-hover:border-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
        />
        {hasOffer && !isOutOfStock && (
           <div className="absolute top-0 right-0 bg-[#cc0c39] text-white text-[10px] px-2 py-1 font-bold rounded-bl-lg shadow-md z-10">
              وفر {discountPercent}%
           </div>
        )}
        <button className="absolute top-2 left-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
           <i className="far fa-heart"></i>
        </button>
        {isOutOfStock && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-sm text-[10px] font-bold">غير متوفر</span>
           </div>
        )}
      </div>

      <div className="flex flex-col flex-grow text-right p-2">
        <h3 className="text-sm text-[#0f1111] line-clamp-2 leading-snug group-hover:text-[#c45500] transition-colors mb-1 h-10 font-bold">
           {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-1">
           <div className="flex text-[#ffa41c] text-[10px]">
              {[...Array(5)].map((_, i) => (
                 <i key={i} className={`fas fa-star ${i < Math.floor(Number(rating)) ? '' : 'text-gray-200'}`}></i>
              ))}
           </div>
           <span className="text-[10px] text-[#007185] hover:text-[#c45500] font-medium">{reviewCount}</span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-1 mb-1">
           <div className="flex items-start text-[#0f1111]">
              <span className="text-[10px] font-bold mt-1 ml-0.5">ج.س</span>
              <span className="text-xl font-black">{product.price.toLocaleString()}</span>
           </div>
           {hasOffer && (
              <span className="text-[10px] text-gray-500 line-through">{product.originalPrice?.toLocaleString()} ج.س</span>
           )}
        </div>

        <div className="mt-auto">
           {!isOutOfStock && (
              <button 
                 onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart();
                 }}
                 className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-1.5 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95 border border-[#fcd200]"
              >
                 إضافة للطلب
              </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
