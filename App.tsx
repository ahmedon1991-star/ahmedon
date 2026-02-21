
import React, { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, Category, StoreSettings, Customer, Review } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import CustomerAuth from './components/CustomerAuth';
import CustomerDashboard from './components/CustomerDashboard';
import ProductDetail from './components/ProductDetail'; 

const firebaseConfig = {
    // IMPORTANT: Replace with your actual project ID
    databaseURL: "https://your-project-id.firebaseio.com" 
};

const App: React.FC = () => {
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<string>('الرياض، المملكة العربية السعودية');
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | undefined>(undefined);
  
  const [products, setProducts] = useState<Product[]>([]); // Initial empty, will load from Firebase
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | undefined>(undefined);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [showCustomerDashboard, setShowCustomerDashboard] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // Initialize Firebase and Listeners
  useEffect(() => {
    if (window.firebase && !window.firebase.apps.length) {
      try {
        window.firebase.initializeApp(firebaseConfig);
      } catch (e) {
        console.error("Firebase init error:", e);
      }
    }

    if (window.firebase) {
      const db = window.firebase.database();
      setIsFirebaseReady(true);

      // Products Listener
      db.ref('products').on('value', (snapshot: any) => {
        const data = snapshot.val();
        if (data) {
          const loadedProducts = Object.keys(data).map(key => ({ ...data[key], id: key }));
          setProducts(loadedProducts);
        } else {
          // Seed initial data if empty
          // db.ref('products').set(INITIAL_PRODUCTS.reduce((acc, p) => ({...acc, [p.id]: p}), {}));
          setProducts([]); 
        }
      });

      // Orders Listener
      db.ref('orders').on('value', (snapshot: any) => {
        const data = snapshot.val();
        if (data) {
          const loadedOrders = Object.keys(data).map(key => ({ ...data[key], id: key })).reverse();
          setOrders(loadedOrders);
        } else {
          setOrders([]);
        }
      });

      // Settings Listener
      db.ref('settings').on('value', (snapshot: any) => {
        const data = snapshot.val();
        if (data) setSettings(data);
      });

      // Categories Listener
      db.ref('categories').on('value', (snapshot: any) => {
        const data = snapshot.val();
        if (data) setCategories(data);
        else db.ref('categories').set(INITIAL_CATEGORIES);
      });
    }

    // Local Storage for Customer & Location only (Client-side preferences)
    const savedCustomer = localStorage.getItem('al-raqi-customer');
    if (savedCustomer) setCurrentCustomer(JSON.parse(savedCustomer));

    const savedLocation = localStorage.getItem('al-raqi-location');
    if (savedLocation) setUserLocation(savedLocation);

  }, []);

  // Sync Customer to LocalStorage
  useEffect(() => {
    if (currentCustomer) localStorage.setItem('al-raqi-customer', JSON.stringify(currentCustomer));
    else localStorage.removeItem('al-raqi-customer');
  }, [currentCustomer]);

  const handleLocationChange = (loc: string, coords?: {lat: number, lng: number}) => {
    setUserLocation(loc);
    if (coords) setUserCoords(coords);
    localStorage.setItem('al-raqi-location', loc);
  };

  // Firebase Operations
  const handleUpdateProduct = (product: Product) => {
    if (!isFirebaseReady) return;
    const db = window.firebase.database();
    db.ref(`products/${product.id}`).update(product);
  };

  const handleAddProduct = (product: Product) => {
    if (!isFirebaseReady) return;
    const db = window.firebase.database();
    const newRef = db.ref('products').push();
    newRef.set({ ...product, id: newRef.key });
  };

  const handleDeleteProduct = (id: string) => {
    if (!isFirebaseReady) return;
    const db = window.firebase.database();
    db.ref(`products/${id}`).remove();
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    if (!isFirebaseReady) return;
    const db = window.firebase.database();
    db.ref('settings').set(newSettings).then(() => {
      // Optional: alert("✅ تم تحديث بيانات الإدارة والواتساب بنجاح");
    });
  };

  const handleUpdateCategories = (newCategories: Category[]) => {
    if (!isFirebaseReady) return;
    const db = window.firebase.database();
    db.ref('categories').set(newCategories);
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    if (!isFirebaseReady) return;
    const db = window.firebase.database();
    db.ref(`orders/${id}`).update({ status }).then(() => {
      // alert("تم تغيير حالة الطلب رقم " + id + " إلى " + status);
    });
  };

  const placeOrder = (customerData: { name: string, phone: string, address: string, paymentMethod: 'cod' | 'bank_transfer' }) => {
    if (!isFirebaseReady) {
      alert("خطأ في الاتصال بقاعدة البيانات");
      return;
    }
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Use Firebase push for ID generation, but here we can stick to simple IDs or use push key
    // Let's use push key for backend consistency
    const db = window.firebase.database();
    const ordersRef = db.ref('orders');
    const newOrderRef = ordersRef.push();
    
    const newOrder: Order = {
      id: newOrderRef.key as string, // Use Firebase key
      customerName: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      items: [...cart],
      total: total,
      status: 'pending',
      paymentMethod: customerData.paymentMethod,
      createdAt: new Date().toISOString()
    };
    
    newOrderRef.set(newOrder).then(() => {
       setCart([]);
       alert("✅ تم إرسال طلبك بنجاح!");
    });
  };

  // Local Cart Operations
  const addToCart = (product: Product, selectedSize?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.selectedSize === selectedSize) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id: string, delta: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));

  // Reviews logic (Update product in Firebase)
  const handleAddReview = (productId: string, review: Review) => {
    if (!isFirebaseReady) return;
    const db = window.firebase.database();
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedReviews = [...(product.reviews || []), review];
      db.ref(`products/${productId}/reviews`).set(updatedReviews);
      alert('شكراً لك! تم إضافة تقييمك بنجاح وسوف يظهر للجميع قريباً.');
    }
  };

  const handleAdminAccess = () => {
    if (isAdminAuthenticated) setView('admin');
    else setShowAdminLogin(true);
  };

  const handleAdminLogin = (password: string) => {
    if (password === settings.adminPassword) {
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setView('admin');
    } else setLoginError('كلمة المرور غير صحيحة');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfb] text-[#1a2a1a] rtl">
      <Navbar 
        settings={settings}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onSwitchView={(v) => { if (v === 'admin') handleAdminAccess(); else setView(v); }}
        currentView={view}
        currentCustomer={currentCustomer}
        onAuthClick={() => setShowCustomerAuth(true)}
        onOpenAccount={() => setShowCustomerDashboard(true)}
        onLogout={() => setCurrentCustomer(undefined)}
        onCategoryChange={setActiveCategory}
        onSearch={setSearchQuery}
        userLocation={userLocation}
        onLocationChange={handleLocationChange}
      />

      {/* Floating Admin Button */}
      {view === 'store' && (
        <button onClick={handleAdminAccess} className="fixed bottom-6 left-6 z-[40] w-14 h-14 bg-premium-dark text-premium-gold rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group no-print border border-premium-gold/30">
          <div className="absolute inset-0 rounded-full bg-premium-gold/20 animate-ping group-hover:hidden"></div>
          <i className="fas fa-user-shield text-xl"></i>
        </button>
      )}

      <main className="flex-grow">
        {view === 'store' ? (
          <Storefront 
            settings={settings} products={products} categories={categories} activeCategory={activeCategory}
            onCategoryChange={setActiveCategory} onAddToCart={addToCart} onProductClick={setSelectedProduct} searchQuery={searchQuery}
          />
        ) : (
          <AdminDashboard 
            settings={settings} onUpdateSettings={handleUpdateSettings} products={products} categories={categories}
            onUpdateCategories={handleUpdateCategories} orders={orders} onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus} onSwitchView={setView}
          />
        )}
      </main>

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      {showAdminLogin && <AdminLogin onLogin={handleAdminLogin} onCancel={() => setShowAdminLogin(false)} error={loginError} />}
      {showCustomerAuth && <CustomerAuth onAuthComplete={(c) => { setCurrentCustomer(c); setShowCustomerAuth(false); }} onCancel={() => setShowCustomerAuth(false)} />}
      
      {showCustomerDashboard && currentCustomer && (
        <CustomerDashboard 
          customer={currentCustomer} orders={orders.filter(o => o.phone === currentCustomer.phone)} 
          onClose={() => setShowCustomerDashboard(false)} onUpdateProfile={setCurrentCustomer} 
          onLogout={() => setCurrentCustomer(undefined)} onAddReview={handleAddReview} allProducts={products}
        />
      )}
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} onCheckout={placeOrder} settings={settings} currentCustomer={currentCustomer} onAuthClick={() => setShowCustomerAuth(true)} />
      <Footer settings={settings} categories={categories} onCategoryChange={setActiveCategory} onSwitchView={setView} />
    </div>
  );
};

export default App;
