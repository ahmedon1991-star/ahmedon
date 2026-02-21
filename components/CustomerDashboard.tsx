
import React, { useState } from 'react';
import { Customer, Order, Product, Review } from '../types';

interface CustomerDashboardProps {
  customer: Customer;
  orders: Order[];
  onClose: () => void;
  onUpdateProfile: (customer: Customer) => void;
  onLogout: () => void;
  onAddReview: (productId: string, review: Review) => void;
  allProducts: Product[]; // أضفنا هذا لجلب أسماء المنتجات في تبويب التقييمات
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  customer, 
  orders, 
  onClose, 
  onUpdateProfile,
  onLogout,
  onAddReview,
  allProducts
}) => {
  const [tab, setTab] = useState<'profile' | 'orders' | 'my-reviews'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [reviewingItem, setReviewingItem] = useState<{orderId: string, product: Product} | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ ...customer, ...formData });
    setIsEditing(false);
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = { pending: 'قيد الانتظار', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل' };
    return labels[status];
  };

  const submitReview = () => {
    if (!reviewingItem) return;
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: customer.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString()
    };
    onAddReview(reviewingItem.product.id, newReview);
    setReviewingItem(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  // جلب كافة تقييمات هذا العميل من كل المنتجات
  const myReviews = allProducts.flatMap(p => 
    (p.reviews || [])
      .filter(r => r.customerName === customer.name)
      .map(r => ({ ...r, productName: p.name, productImage: p.image }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-premium-dark/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]">
        
        {/* Review Modal Overlay */}
        {reviewingItem && (
          <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-scale-up">
                <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-premium-gold/10 text-premium-gold rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      <i className="fas fa-star"></i>
                   </div>
                   <h3 className="text-xl font-black text-premium-dark">تقييم المنتج</h3>
                   <p className="text-xs text-gray-400 font-bold mt-1">{reviewingItem.product.name}</p>
                </div>
                
                <div className="space-y-6">
                   <div className="flex flex-col items-center">
                      <div className="flex gap-2 text-3xl">
                         {[1, 2, 3, 4, 5].map(star => (
                           <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`transition-all ${star <= reviewForm.rating ? 'text-premium-gold scale-110' : 'text-gray-200'}`}>
                              <i className="fas fa-star"></i>
                           </button>
                         ))}
                      </div>
                   </div>
                   <textarea 
                     value={reviewForm.comment}
                     onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                     className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none h-32 resize-none font-bold text-sm"
                     placeholder="ما هو انطباعك عن الجودة؟"
                   />
                   <div className="flex gap-3">
                      <button onClick={submitReview} className="flex-grow bg-premium-dark text-premium-gold py-4 rounded-2xl font-black shadow-xl">تأكيد التقييم</button>
                      <button onClick={() => setReviewingItem(null)} className="px-6 py-4 text-gray-400 font-bold">إلغاء</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-50 border-l border-gray-100 p-8 flex flex-col">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-premium-dark text-premium-gold rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-xl">
              <i className="fas fa-user-circle"></i>
            </div>
            <h2 className="text-lg font-black text-premium-dark truncate">{customer.name}</h2>
          </div>

          <div className="space-y-2 flex-grow">
            {[
              { id: 'profile', label: 'الملف الشخصي', icon: 'fa-id-card' },
              { id: 'orders', label: 'طلباتي', icon: 'fa-history' },
              { id: 'my-reviews', label: 'تقييماتي', icon: 'fa-star' }
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)} className={`w-full text-right px-6 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-4 ${tab === t.id ? 'bg-white text-premium-gold shadow-sm' : 'text-gray-400 hover:bg-white/50'}`}>
                <i className={`fas ${t.icon}`}></i> {t.label}
              </button>
            ))}
          </div>

          <button onClick={onLogout} className="w-full text-right px-6 py-4 rounded-2xl font-bold text-sm text-red-500 flex items-center gap-4 mt-4 border-t border-gray-200 pt-4">
            <i className="fas fa-sign-out-alt"></i> خروج
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-8 md:p-12 overflow-y-auto bg-white relative no-scrollbar">
          <button onClick={onClose} className="absolute top-8 left-8 text-gray-300 hover:text-premium-dark transition-colors"><i className="fas fa-times text-xl"></i></button>

          {tab === 'profile' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-premium-dark">بيانات الحساب</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="bg-premium-gold/10 text-premium-gold px-5 py-2 rounded-xl font-bold text-xs"><i className="fas fa-edit ml-1"></i> تعديل</button>}
              </div>
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold" placeholder="الاسم" />
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold" placeholder="الجوال" />
                  </div>
                  <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold h-32" placeholder="العنوان" />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-grow bg-premium-dark text-premium-gold py-4 rounded-2xl font-black">حفظ التغييرات</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-10 font-bold text-gray-400">إلغاء</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 mb-1">الاسم الكامل</p>
                    <p className="font-black text-premium-dark">{customer.name}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 mb-1">العنوان</p>
                    <p className="font-black text-premium-dark">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-black text-premium-dark mb-10">سجل الطلبات</h3>
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-xs font-black text-premium-gold">#{order.id}</span>
                        <p className="text-xl font-black mt-1">{order.total} ريال</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{getStatusLabel(order.status)}</span>
                    </div>
                    <div className="flex gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="relative group">
                           <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                             <img src={item.image} className="w-full h-full object-cover" alt="" />
                           </div>
                           {order.status === 'delivered' && (
                             <button onClick={() => setReviewingItem({orderId: order.id, product: item})} className="absolute -bottom-2 -right-2 w-8 h-8 bg-premium-gold text-premium-dark rounded-full shadow-lg flex items-center justify-center border-2 border-white hover:scale-110 transition-transform">
                               <i className="fas fa-star text-[10px]"></i>
                             </button>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'my-reviews' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-black text-premium-dark mb-10">تقييماتي السابقة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myReviews.map(review => (
                  <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                      <img src={review.productImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-black text-premium-dark mb-1 line-clamp-1">{review.productName}</p>
                      <div className="flex text-premium-gold text-[10px] mb-2">
                        {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < review.rating ? '' : 'text-gray-200'}`}></i>)}
                      </div>
                      <p className="text-[11px] text-gray-500 italic leading-relaxed">"{review.comment}"</p>
                      <p className="text-[8px] text-gray-300 mt-2">{new Date(review.date).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                ))}
                {myReviews.length === 0 && <div className="col-span-full py-20 text-center text-gray-300 font-bold">لم تقم بتقييم أي منتج حتى الآن</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
