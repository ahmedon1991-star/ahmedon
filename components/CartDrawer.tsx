
import React, { useState, useEffect } from 'react';
import { CartItem, StoreSettings, Customer } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: (data: { name: string, phone: string, address: string, email: string, paymentMethod: 'cod' | 'bank_transfer' }) => void;
  settings: StoreSettings;
  currentCustomer?: Customer;
  onAuthClick: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity, 
  onCheckout,
  settings,
  currentCustomer,
  onAuthClick
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '' });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<{ id: string, items: CartItem[], total: number, date: string, customerName: string, customerPhone: string, customerAddress: string, customerEmail: string, paymentMethod: string } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('cart');
        setAgreeToTerms(false);
        setFormData({ 
          name: currentCustomer?.name || '', 
          phone: currentCustomer?.phone || '', 
          address: currentCustomer?.address || '',
          email: currentCustomer?.email || ''
        });
      }, 300);
    }
  }, [isOpen, currentCustomer]);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleFinalCheckout = () => {
    if (!agreeToTerms) {
      alert('يجب الموافقة على الشروط والأحكام لإتمام الطلب');
      return;
    }
    if (formData.name && formData.phone && formData.address) {
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const orderData = { 
        id: orderId, 
        items: [...items], 
        total, 
        date: new Date().toLocaleString('ar-SA'),
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerEmail: formData.email,
        paymentMethod: paymentMethod
      };
      setPlacedOrderInfo(orderData);
      onCheckout({ ...formData, paymentMethod });
      setStep('success');
    } else {
      alert('يرجى تعبئة جميع البيانات (الاسم، الجوال، العنوان)');
    }
  };

  const generateOrderMessage = (isEmail: boolean = false) => {
    if (!placedOrderInfo) return '';
    const paymentLabel = placedOrderInfo.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'تحويل بنكي (تطبيق بنكك)';
    const bullet = isEmail ? '•' : '*';
    const bold = isEmail ? '' : '*';
    
    let message = `${bold}طلب جديد من متجر الراقي 🇸🇩${bold}\n\n`;
    message += `${bold}رقم الطلب:${bold} #${placedOrderInfo.id}\n`;
    message += `${bold}التاريخ:${bold} ${placedOrderInfo.date}\n`;
    message += `${bold}العميل:${bold} ${placedOrderInfo.customerName}\n`;
    message += `${bold}الجوال:${bold} ${placedOrderInfo.customerPhone}\n`;
    message += `${bold}العنوان:${bold} ${placedOrderInfo.customerAddress}\n`;
    message += `${bold}طريقة الدفع:${bold} ${paymentLabel}\n\n`;
    message += `${bold}المنتجات:${bold}\n`;
    placedOrderInfo.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (الكمية: ${item.quantity}) - السعر: ${item.price * item.quantity} ج.س\n`;
    });
    message += `\n${bold}الإجمالي النهائي: ${placedOrderInfo.total.toLocaleString()} ج.س${bold}\n`;
    return message;
  };

  const handleWhatsAppSend = () => {
    const message = generateOrderMessage();
    const whatsappPhone = settings.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailSend = () => {
    if (!placedOrderInfo) return;
    const subject = `فاتورة طلب رقم #${placedOrderInfo.id} - متجر الراقي`;
    const message = generateOrderMessage(true);
    // إرسال للإدارة وللعميل في نفس الوقت (عبر العميل نفسه)
    window.location.href = `mailto:${settings.adminNotificationEmail || settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm no-print" onClick={onClose}></div>
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className={`w-screen max-w-md bg-white shadow-2xl transition-all duration-500 ${step === 'success' ? 'md:max-w-2xl' : ''}`}>
          <div className="h-full flex flex-col">
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between no-print">
              <h2 className="text-xl font-bold text-premium-dark">
                {step === 'cart' && 'سلة الطلبات'}
                {step === 'checkout' && 'إتمام الشراء'}
                {step === 'success' && 'تم إرسال الطلب بنجاح'}
              </h2>
              <button onClick={onClose} className="text-gray-400 p-2"><i className="fas fa-times text-xl"></i></button>
            </div>

            <div className="flex-grow overflow-y-auto px-6 py-4 custom-scrollbar">
              {step === 'cart' && items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <i className="fas fa-shopping-basket text-6xl mb-4"></i>
                  <p className="font-bold">السلة فارغة حالياً</p>
                </div>
              ) : step === 'cart' ? (
                <div className="space-y-6">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 group">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" /></div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center border rounded-lg p-1 bg-gray-50">
                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6"><i className="fas fa-minus text-[8px]"></i></button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6"><i className="fas fa-plus text-[8px]"></i></button>
                          </div>
                          <span className="font-black text-sm text-premium-green">{ (item.price * item.quantity).toLocaleString() } ج.س</span>
                        </div>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  ))}
                </div>
              ) : step === 'checkout' ? (
                <div className="space-y-6 animate-fade-in pb-10">
                  <h3 className="font-black text-lg">معلومات التوصيل والاتصال</h3>
                  <div className="space-y-4">
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border font-bold text-sm" placeholder="الاسم بالكامل" />
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border font-bold text-sm text-left" dir="ltr" placeholder="رقم الجوال (09xxxxxxxx)" />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border font-bold text-sm text-left" dir="ltr" placeholder="البريد الإلكتروني (اختياري)" />
                    <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border font-bold text-sm h-24" placeholder="العنوان بالتفصيل (المدينة، الحي، رقم المنزل...)"></textarea>
                  </div>

                  <h3 className="font-black text-lg">طريقة الدفع</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setPaymentMethod('cod')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-premium-gold bg-premium-gold/5 text-premium-gold' : 'border-gray-100 text-gray-400'}`}>
                       <i className="fas fa-money-bill-wave text-2xl"></i><span className="text-[10px] font-black uppercase">عند الاستلام</span>
                    </button>
                    <button onClick={() => setPaymentMethod('bank_transfer')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'bank_transfer' ? 'border-premium-gold bg-premium-gold/5 text-premium-gold' : 'border-gray-100 text-gray-400'}`}>
                       <i className="fas fa-university text-2xl"></i><span className="text-[10px] font-black uppercase">تطبيق بنكك</span>
                    </button>
                  </div>

                  <div className="flex items-start gap-3 pt-4">
                     <input type="checkbox" id="terms" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded text-premium-gold" />
                     <label htmlFor="terms" className="text-[11px] text-gray-500 font-bold leading-relaxed cursor-pointer">أوافق على سياسة متجر الراقي وأقر بصحة البيانات المدخلة لإتمام عملية الشحن.</label>
                  </div>
                </div>
              ) : (
                /* Success View - Detailed Invoice for Customer */
                <div className="animate-fade-in py-4">
                  <div id="customer-invoice-print" className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-10 text-right shadow-sm mb-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-100">
                       <div>
                          <h3 className="text-3xl font-black text-premium-dark mb-1">متجر الراقي</h3>
                          <p className="text-[10px] text-premium-gold font-bold uppercase tracking-[0.2em]">Premium Quality Products</p>
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-black text-premium-gold">فاتورة رقم: #{placedOrderInfo?.id}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1">{placedOrderInfo?.date}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-10">
                       <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-2">بيانات العميل</p>
                          <p className="text-sm font-black mb-1">{placedOrderInfo?.customerName}</p>
                          <p className="text-xs font-bold text-gray-500" dir="ltr">{placedOrderInfo?.customerPhone}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-2 leading-relaxed">{placedOrderInfo?.customerAddress}</p>
                       </div>
                       <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-2">طريقة الدفع</p>
                          <p className="text-sm font-black">{placedOrderInfo?.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'تحويل بنكي'}</p>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                             <p className="text-[9px] font-black text-gray-400 uppercase mb-1">حالة الطلب</p>
                             <p className="text-xs font-black text-premium-green">قيد التجهيز</p>
                          </div>
                       </div>
                    </div>

                    <table className="w-full text-right mb-10">
                       <thead>
                          <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase">
                             <th className="pb-4">الصنف</th>
                             <th className="pb-4 text-center">الكمية</th>
                             <th className="pb-4 text-left">الإجمالي</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {placedOrderInfo?.items.map((item, idx) => (
                             <tr key={idx} className="text-sm font-bold text-premium-dark">
                                <td className="py-4">{item.name}</td>
                                <td className="py-4 text-center">{item.quantity}</td>
                                <td className="py-4 text-left">{(item.price * item.quantity).toLocaleString()} ج.س</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>

                    <div className="flex justify-between items-center bg-premium-dark text-premium-gold p-8 rounded-[2rem]">
                       <span className="text-lg font-black uppercase">المبلغ الإجمالي</span>
                       <span className="text-3xl font-black">{placedOrderInfo?.total.toLocaleString()} <span className="text-sm">ج.س</span></span>
                    </div>

                    <div className="mt-10 text-center no-print">
                       <p className="text-[10px] text-gray-400 font-bold italic">مائدتكم أمانتنا.. شكراً لاختياركم الراقي</p>
                    </div>
                  </div>

                  <div className="space-y-3 no-print">
                    <button 
                      onClick={handleWhatsAppSend} 
                      className="w-full bg-[#25D366] hover:bg-[#1fb355] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
                    >
                       <i className="fab fa-whatsapp text-2xl"></i> تأكيد الطلب عبر الواتساب
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         onClick={handleEmailSend}
                         className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
                       >
                          <i className="fas fa-envelope text-xl"></i> عبر الإيميل
                       </button>
                       <button 
                         onClick={handlePrintInvoice}
                         className="bg-gray-800 hover:bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
                       >
                          <i className="fas fa-print text-xl"></i> طباعة الفاتورة
                       </button>
                    </div>
                  </div>
                  
                  <button onClick={onClose} className="w-full mt-6 text-gray-400 font-bold text-sm hover:text-red-500 transition-colors no-print">العودة للمتجر</button>
                </div>
              )}
            </div>
            
            {items.length > 0 && step !== 'success' && (
              <div className="px-6 py-6 bg-gray-50 border-t no-print">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-gray-500 font-black text-sm">مجموع المشتريات</span>
                   <span className="text-2xl font-black text-premium-dark">{total.toLocaleString()} <span className="text-xs font-bold">ج.س</span></span>
                </div>
                {step === 'cart' ? (
                  <button onClick={() => setStep('checkout')} className="w-full py-4 bg-premium-dark text-white rounded-2xl font-black shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">متابعة الطلب</button>
                ) : (
                  <button onClick={handleFinalCheckout} disabled={!agreeToTerms} className={`w-full py-4 rounded-2xl font-black shadow-xl transition-all ${!agreeToTerms ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-premium-green text-white hover:scale-[1.02] active:scale-[0.98]'}`}>تأكيد وحجز الطلب</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #customer-invoice-print, #customer-invoice-print * { visibility: visible; }
          #customer-invoice-print { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border: 2px solid #eee; 
            padding: 40px; 
            box-shadow: none;
            border-radius: 0;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
