
import React, { useState, useEffect } from 'react';
import { Product, Order, Category, StoreSettings, Review } from '../types';

interface AdminDashboardProps {
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  products: Product[];
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onSwitchView?: (view: 'store' | 'admin') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  settings,
  onUpdateSettings,
  products, 
  categories,
  onUpdateCategories,
  orders, 
  onUpdateProduct, 
  onAddProduct, 
  onDeleteProduct,
  onUpdateOrderStatus,
  onSwitchView
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'settings'>('dashboard');
  const [tempSettings, setTempSettings] = useState<StoreSettings>(settings);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  
  // Product Editing
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', description: '', price: 0, originalPrice: 0, category: '', image: '', stock: 0, barcode: '', sizes: []
  });

  // Category Management
  const [newCategory, setNewCategory] = useState('');

  // Order Details
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { setTempSettings(settings); }, [settings]);

  // Statistics
  const totalRevenue = orders.filter(o => o.status !== 'pending').reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  // Handlers
  const handleLogout = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج الآمن؟')) {
      onSwitchView?.('store');
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct = {
      ...productForm,
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      category: productForm.category || categories[0],
      reviews: editingProduct?.reviews || []
    } as Product;
    
    if (editingProduct) onUpdateProduct(finalProduct);
    else onAddProduct(finalProduct);
    
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: 0, category: '', image: '', stock: 0 });
  };

  const handleDeleteProduct = (id: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      onDeleteProduct(id);
    }
  };

  const handleUpdatePassword = () => {
    if (passwordForm.current !== settings.adminPassword) return alert('كلمة المرور الحالية غير صحيحة');
    if (passwordForm.new !== passwordForm.confirm) return alert('كلمات المرور غير متطابقة');
    if (passwordForm.new.length < 4) return alert('كلمة المرور قصيرة جداً');

    onUpdateSettings({ ...settings, adminPassword: passwordForm.new });
    setPasswordForm({ current: '', new: '', confirm: '' });
    alert('تم تغيير كلمة المرور بنجاح');
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onUpdateCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${cat}"؟`)) {
      onUpdateCategories(categories.filter(c => c !== cat));
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = { pending: 'قيد الانتظار', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل' };
    return labels[status];
  };

  // Timeline Component for Order Status
  const OrderTimeline = ({ status }: { status: Order['status'] }) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = steps.indexOf(status);
    
    return (
      <div className="flex items-center justify-between w-full relative my-8 px-4">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 right-0 h-1 bg-premium-gold -z-10 rounded-full transition-all duration-500" 
          style={{ width: `${((currentIdx) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const icons: any = { pending: 'fa-file-invoice', processing: 'fa-box-open', shipped: 'fa-shipping-fast', delivered: 'fa-check-circle' };
          
          return (
            <div key={step} className="flex flex-col items-center gap-2 bg-gray-50 px-2 rounded-full z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-premium-gold border-premium-gold text-white shadow-lg scale-110' : 'bg-white border-gray-300 text-gray-300'}`}>
                <i className={`fas ${icons[step]} text-sm`}></i>
              </div>
              <span className={`text-[10px] font-bold ${isCompleted ? 'text-premium-dark' : 'text-gray-400'}`}>
                {getStatusLabel(step as any)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col md:flex-row rtl font-sans text-right">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#004d40] text-white flex-shrink-0 flex flex-col shadow-2xl z-50 transition-all sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="p-8 text-center border-b border-white/10 bg-[#003d33]">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-premium-gold shadow-lg">
               <i className="fas fa-crown text-3xl text-premium-gold"></i>
           </div>
           <h2 className="text-xl font-bold text-premium-gold tracking-wide">الراقي Admin</h2>
           <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-widest opacity-80">نظام الإدارة المتكامل</p>
        </div>
        
        <nav className="flex-grow py-6 space-y-1 px-3">
           {[
             { id: 'dashboard', icon: 'fa-th-large', label: 'الرئيسية' },
             { id: 'products', icon: 'fa-box-open', label: 'الأصناف والمنتجات' },
             { id: 'categories', icon: 'fa-layer-group', label: 'إدارة الأقسام' },
             { id: 'orders', icon: 'fa-shopping-cart', label: 'الطلبات والمتابعة', badge: pendingOrders },
             { id: 'settings', icon: 'fa-cogs', label: 'إعدادات الإدارة' }
           ].map(item => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 mb-2 font-bold ${activeTab === item.id ? 'bg-[#ffd700] text-[#004d40] shadow-lg transform scale-105' : 'text-gray-200 hover:bg-white/10 hover:text-white'}`}
             >
               <div className="flex items-center gap-3">
                 <i className={`fas ${item.icon} w-6 text-center`}></i>
                 <span className="text-sm">{item.label}</span>
               </div>
               {item.badge ? (
                 <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{item.badge}</span>
               ) : null}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-white/10 bg-[#003d33]">
           <button onClick={handleLogout} className="w-full bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm border border-red-500/20">
              <i className="fas fa-sign-out-alt"></i> تسجيل خروج آمن
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow h-screen overflow-y-auto custom-scrollbar bg-[#f8f9fa]">
         {/* Top Header */}
         <header className="bg-white p-6 shadow-sm sticky top-0 z-40 flex justify-between items-center border-b-2 border-premium-gold">
            <div className="flex items-center gap-4">
               <button className="md:hidden text-gray-500"><i className="fas fa-bars text-xl"></i></button>
               <div>
                  <h2 className="text-2xl font-black text-gray-700">
                    {activeTab === 'dashboard' && 'لوحة القيادة العامة'}
                    {activeTab === 'products' && 'المخزون والمنتجات'}
                    {activeTab === 'categories' && 'تصنيفات المتجر'}
                    {activeTab === 'orders' && 'مركز الطلبات'}
                    {activeTab === 'settings' && 'إعدادات النظام'}
                  </h2>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-left hidden md:block leading-tight">
                  <p className="text-xs font-bold text-gray-400">مرحباً، المدير العام</p>
                  <p className="text-sm font-black text-[#004d40]">الراقي ستور</p>
               </div>
               <img src={`https://ui-avatars.com/api/?name=${settings.name}&background=004d40&color=ffd700`} className="w-12 h-12 rounded-full border-2 border-premium-gold shadow-sm" alt="Admin" />
               <button onClick={() => onSwitchView?.('store')} className="bg-gray-100 p-3 rounded-xl text-gray-500 hover:text-premium-gold transition-colors shadow-sm border border-gray-200" title="معاينة المتجر">
                  <i className="fas fa-external-link-alt"></i>
               </button>
            </div>
         </header>

         <div className="p-6 md:p-10 space-y-8 max-w-[1600px] mx-auto">
            
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                  {[
                    { title: 'إجمالي المبيعات', value: totalRevenue.toLocaleString(), unit: 'ج.س', icon: 'fa-coins', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' },
                    { title: 'عدد الطلبات', value: totalOrders, unit: 'طلب', icon: 'fa-shopping-bag', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
                    { title: 'العملاء المسجلين', value: 34, unit: 'عميل', icon: 'fa-users', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-500' }, // Hardcoded as per prompt mockup image
                    { title: 'عدد الأصناف', value: products.length, unit: 'منتج', icon: 'fa-cubes', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-500' }
                  ].map((stat, idx) => (
                    <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border-t-4 ${stat.border} flex justify-between items-center transform hover:-translate-y-1 transition-transform duration-300`}>
                       <div>
                          <p className="text-gray-500 text-xs font-bold mb-2">{stat.title}</p>
                          <h3 className="text-3xl font-black text-gray-800">{stat.value} <span className="text-xs font-bold text-gray-400">{stat.unit}</span></h3>
                       </div>
                       <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
                          <i className={`fas ${stat.icon}`}></i>
                       </div>
                    </div>
                  ))}

                  <div className="col-span-full md:col-span-2 lg:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-4">
                     <h3 className="font-bold text-lg mb-6 text-gray-800 border-b pb-4">آخر الطلبات الواردة</h3>
                     <table className="w-full text-right text-sm">
                        <thead className="text-gray-400 bg-gray-50 uppercase text-xs">
                           <tr>
                              <th className="px-4 py-3 rounded-r-lg">رقم الطلب</th>
                              <th className="px-4 py-3">العميل</th>
                              <th className="px-4 py-3">الحالة</th>
                              <th className="px-4 py-3">المبلغ</th>
                              <th className="px-4 py-3 rounded-l-lg">التاريخ</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {orders.slice(0, 5).map(order => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                 <td className="px-4 py-4 font-bold">#{order.id}</td>
                                 <td className="px-4 py-4">{order.customerName}</td>
                                 <td className="px-4 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                                       {getStatusLabel(order.status)}
                                    </span>
                                 </td>
                                 <td className="px-4 py-4 font-bold">{order.total.toLocaleString()}</td>
                                 <td className="px-4 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  <div className="col-span-full md:col-span-2 lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-4">
                     <h3 className="font-bold text-lg mb-6 text-gray-800 border-b pb-4">تنبيهات المخزون</h3>
                     <div className="space-y-4">
                        {products.filter(p => p.stock < 10).map(p => (
                           <div key={p.id} className="flex items-center gap-4 p-3 bg-red-50 rounded-xl border border-red-100">
                              <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                 <p className="text-xs font-bold text-gray-800 truncate w-32">{p.name}</p>
                                 <p className="text-[10px] text-red-600 font-bold">متبقي: {p.stock} قطع فقط</p>
                              </div>
                           </div>
                        ))}
                        {products.filter(p => p.stock < 10).length === 0 && (
                           <p className="text-center text-gray-400 text-sm py-4">جميع المنتجات متوفرة بكميات جيدة</p>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
              <div className="flex flex-col xl:flex-row gap-6 animate-fade-in h-[calc(100vh-180px)]">
                 {/* Orders List */}
                 <div className={`w-full xl:w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${selectedOrder ? 'hidden xl:flex' : ''}`}>
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                       <div className="relative">
                          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                          <input 
                            type="text" 
                            placeholder="بحث برقم الطلب أو الجوال..." 
                            value={orderSearch}
                            onChange={e => setOrderSearch(e.target.value)}
                            className="w-full pr-10 pl-4 py-3 bg-white rounded-xl text-sm font-bold border border-gray-200 focus:border-premium-gold outline-none"
                          />
                       </div>
                    </div>
                    <div className="overflow-y-auto flex-grow custom-scrollbar p-3 space-y-2">
                       {orders.filter(o => o.id.includes(orderSearch) || o.phone.includes(orderSearch)).map(order => (
                          <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedOrder?.id === order.id ? 'bg-premium-gold/10 border-premium-gold shadow-md' : 'bg-white border-transparent hover:bg-gray-50 border-gray-100'}`}
                          >
                             <div className="flex justify-between items-start mb-2">
                                <span className="font-black text-sm text-gray-800">#{order.id}</span>
                                <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                   <span className="text-xs font-bold text-gray-600">{order.customerName}</span>
                                   <span className={`mt-1 text-[10px] px-2 py-0.5 rounded-full w-fit ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                                </div>
                                <span className="font-black text-premium-gold">{order.total} ج.س</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Order Detail View */}
                 <div className={`w-full xl:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 overflow-y-auto custom-scrollbar relative ${!selectedOrder ? 'hidden xl:flex items-center justify-center' : ''}`}>
                    {selectedOrder ? (
                       <div className="w-full animate-scale-up">
                          <button onClick={() => setSelectedOrder(null)} className="xl:hidden absolute top-6 left-6 text-gray-400 hover:text-black"><i className="fas fa-arrow-left text-xl"></i></button>
                          
                          <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-6">
                             <div>
                                <h2 className="text-2xl font-black text-gray-800 mb-1">تفاصيل الطلب <span className="text-premium-gold">#{selectedOrder.id}</span></h2>
                                <p className="text-xs text-gray-400 font-bold">{new Date(selectedOrder.createdAt).toLocaleString('ar-SA')}</p>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => window.print()} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"><i className="fas fa-print"></i></button>
                                <button onClick={() => window.open(`https://wa.me/${selectedOrder.phone}`, '_blank')} className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-colors"><i className="fab fa-whatsapp text-lg"></i></button>
                             </div>
                          </div>

                          {/* Visual Timeline */}
                          <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                             <h4 className="font-bold text-sm mb-4 text-gray-700">تتبع حالة الطلب</h4>
                             <OrderTimeline status={selectedOrder.status} />
                             
                             <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-2 justify-end">
                                <span className="ml-auto text-xs font-bold text-gray-500 self-center">تغيير الحالة إلى:</span>
                                {(['pending', 'processing', 'shipped', 'delivered'] as const).map(st => (
                                   <button 
                                     key={st}
                                     onClick={() => onUpdateOrderStatus(selectedOrder.id, st)}
                                     disabled={selectedOrder.status === st}
                                     className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedOrder.status === st ? 'bg-premium-gold text-white shadow-lg cursor-default' : 'bg-white border hover:bg-gray-200 text-gray-600'}`}
                                   >
                                      {getStatusLabel(st)}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-wider border-b pb-2">بيانات العميل</h4>
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><i className="fas fa-user"></i></div>
                                      <div>
                                         <p className="text-[10px] text-gray-400">الاسم</p>
                                         <p className="font-bold text-sm text-gray-800">{selectedOrder.customerName}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><i className="fas fa-phone"></i></div>
                                      <div>
                                         <p className="text-[10px] text-gray-400">الجوال</p>
                                         <p className="font-bold text-sm text-gray-800" dir="ltr">{selectedOrder.phone}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><i className="fas fa-map-marker-alt"></i></div>
                                      <div>
                                         <p className="text-[10px] text-gray-400">العنوان</p>
                                         <p className="font-bold text-sm text-gray-800 leading-tight">{selectedOrder.address}</p>
                                      </div>
                                   </div>
                                </div>
                             </div>

                             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-wider border-b pb-2">تفاصيل الفاتورة</h4>
                                <div className="space-y-3">
                                   <div className="flex justify-between text-sm">
                                      <span className="text-gray-500 font-bold">طريقة الدفع</span>
                                      <span className="font-black bg-gray-100 px-2 py-1 rounded text-xs">{selectedOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'تحويل بنكي'}</span>
                                   </div>
                                   <div className="flex justify-between text-sm">
                                      <span className="text-gray-500 font-bold">عدد الأصناف</span>
                                      <span className="font-black">{selectedOrder.items.length}</span>
                                   </div>
                                   <div className="border-t border-dashed border-gray-200 my-2"></div>
                                   <div className="flex justify-between text-xl font-black text-premium-dark bg-premium-gold/10 p-3 rounded-xl">
                                      <span>الإجمالي</span>
                                      <span>{selectedOrder.total.toLocaleString()} ج.س</span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div>
                             <h4 className="font-bold text-sm mb-4 text-gray-800">المنتجات ({selectedOrder.items.length})</h4>
                             <div className="space-y-3">
                                {selectedOrder.items.map((item, idx) => (
                                   <div key={idx} className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-white" />
                                      <div className="flex-grow">
                                         <h5 className="font-bold text-sm text-gray-800">{item.name}</h5>
                                         <p className="text-xs text-gray-500 mt-1">الكمية: <span className="font-black text-black">{item.quantity}</span></p>
                                         {item.selectedSize && <span className="text-[10px] bg-white border px-2 rounded text-gray-500">{item.selectedSize}</span>}
                                      </div>
                                      <span className="font-black text-sm text-gray-800">{(item.price * item.quantity).toLocaleString()} ج.س</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center text-center opacity-40">
                          <i className="fas fa-shopping-basket text-6xl mb-6 text-gray-300"></i>
                          <p className="text-xl font-bold text-gray-400">اختر طلباً لعرض التفاصيل</p>
                       </div>
                    )}
                 </div>
              </div>
            )}

            {/* --- PRODUCTS TAB --- */}
            {activeTab === 'products' && (
               <div className="animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                     <div className="relative w-full md:w-96">
                        <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input 
                          type="text" 
                          placeholder="بحث عن منتج..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pr-10 pl-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:border-premium-gold outline-none"
                        />
                     </div>
                     <button 
                       onClick={() => { setEditingProduct(null); setProductForm({name:'', price:0, category: categories[0]}); setIsProductModalOpen(true); }}
                       className="bg-[#004d40] text-[#ffd700] px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all flex items-center gap-3 w-full md:w-auto justify-center"
                     >
                        <i className="fas fa-plus"></i> إضافة صنف جديد
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                     {products.filter(p => p.name.includes(searchTerm)).map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col group hover:shadow-lg transition-all relative overflow-hidden">
                           <div className="relative h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden">
                              <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                 <button onClick={() => { setEditingProduct(product); setProductForm(product); setIsProductModalOpen(true); }} className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-110 transition-transform"><i className="fas fa-pen"></i></button>
                                 <button onClick={() => handleDeleteProduct(product.id)} className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center hover:scale-110 transition-transform"><i className="fas fa-trash"></i></button>
                              </div>
                              {product.stock < 5 && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-sm">ينفذ قريباً</span>}
                           </div>
                           <h4 className="font-bold text-gray-800 text-sm truncate mb-1">{product.name}</h4>
                           <p className="text-xs text-gray-400 mb-3 bg-gray-50 w-fit px-2 py-0.5 rounded-lg">{product.category}</p>
                           <div className="mt-auto flex justify-between items-center border-t border-gray-50 pt-3">
                              <span className="font-black text-premium-dark text-lg">{product.price.toLocaleString()} <span className="text-[10px] text-gray-400">ج.س</span></span>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {product.stock} متوفر
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* --- CATEGORIES TAB --- */}
            {activeTab === 'categories' && (
               <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 animate-fade-in">
                  <div className="text-center mb-10">
                     <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
                        <i className="fas fa-layer-group"></i>
                     </div>
                     <h3 className="text-2xl font-black text-gray-800">أقسام المتجر</h3>
                     <p className="text-gray-400 text-sm mt-2">قم بإضافة وتعديل التصنيفات لتنظيم منتجاتك</p>
                  </div>

                  <div className="flex gap-4 mb-12">
                     <input 
                       type="text" 
                       value={newCategory}
                       onChange={(e) => setNewCategory(e.target.value)}
                       placeholder="اسم القسم الجديد..." 
                       className="flex-grow px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-purple-500 outline-none font-bold"
                     />
                     <button onClick={handleAddCategory} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-purple-700 transition-colors shadow-lg">
                        <i className="fas fa-plus ml-2"></i> إضافة
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {categories.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                           <div className="flex items-center gap-4">
                              <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{idx + 1}</span>
                              <span className="font-bold text-gray-700 text-lg">{cat}</span>
                           </div>
                           <button onClick={() => handleDeleteCategory(cat)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                              <i className="fas fa-trash-alt text-lg"></i>
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
               <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                  {/* General Settings */}
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
                     <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-premium-gold/10 text-premium-gold flex items-center justify-center"><i className="fas fa-store"></i></div>
                        <h3 className="text-xl font-black text-gray-800">إعدادات المتجر العامة</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="block text-xs font-bold text-gray-400 mb-2">اسم المتجر</label>
                           <input type="text" value={tempSettings.name} onChange={e => setTempSettings({...tempSettings, name: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-gray-700" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-400 mb-2">رقم الواتساب الرسمي</label>
                           <div className="relative">
                              <input type="text" value={tempSettings.phone} onChange={e => setTempSettings({...tempSettings, phone: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-gray-700 text-left" dir="ltr" />
                              <i className="fab fa-whatsapp absolute top-1/2 left-3 -translate-y-1/2 text-green-500"></i>
                           </div>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-xs font-bold text-gray-400 mb-2">بريد استقبال الطلبات (Admin Email)</label>
                           <input type="email" value={tempSettings.adminNotificationEmail || ''} onChange={e => setTempSettings({...tempSettings, adminNotificationEmail: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-gray-700 text-left" dir="ltr" />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                           <button onClick={() => { onUpdateSettings(tempSettings); alert('تم حفظ الإعدادات بنجاح'); }} className="bg-[#004d40] text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-all">حفظ التعديلات</button>
                        </div>
                     </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
                     <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><i className="fas fa-shield-alt"></i></div>
                        <h3 className="text-xl font-black text-gray-800">الأمان وتغيير كلمة المرور</h3>
                     </div>
                     <div className="max-w-md space-y-5">
                        <input type="password" placeholder="كلمة المرور الحالية" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-red-300 transition-colors" />
                        <input type="password" placeholder="كلمة المرور الجديدة" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-red-300 transition-colors" />
                        <input type="password" placeholder="تأكيد كلمة المرور" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full px-5 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-red-300 transition-colors" />
                        <button onClick={handleUpdatePassword} className="w-full bg-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-red-600 transition-all">تحديث كلمة المرور</button>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
         <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
               <h3 className="text-xl font-black text-gray-800 mb-6 border-b pb-4 text-center">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h3>
               <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                       <label className="text-xs font-bold text-gray-400 mb-1 block">اسم المنتج</label>
                       <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-sm" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-400 mb-1 block">السعر (ج.س)</label>
                       <input type="number" required value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-sm" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-gray-400 mb-1 block">المخزون</label>
                       <input type="number" required value={productForm.stock || ''} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-sm" />
                     </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1 block">القسم</label>
                    <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-sm text-gray-600">
                       <option value="">اختر القسم المناسب</option>
                       {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1 block">رابط الصورة</label>
                    <input type="text" placeholder="https://..." value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-sm text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-1 block">الوصف</label>
                    <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-premium-gold outline-none font-bold text-sm h-24"></textarea>
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button type="submit" className="flex-grow bg-[#004d40] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">حفظ البيانات</button>
                     <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-8 text-gray-500 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">إلغاء</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #e0e0e0; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5a059; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
