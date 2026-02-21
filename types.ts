
export type Category = string;

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  stock: number;
  barcode?: string;
  sizes?: string[];
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  joinedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: 'cod' | 'bank_transfer';
  createdAt: string;
  customerEmail?: string;
}

export interface StoreSettings {
  name: string;
  description: string;
  phone: string;
  email: string;
  adminNotificationEmail?: string; // بريد استقبال الطلبات
  address: string;
  instagram: string;
  twitter: string;
  whatsapp: string;
  adminPassword?: string;
  bankName?: string;
  bankAccountName?: string;
  bankIBAN?: string;
}

export interface AppState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  settings: StoreSettings;
  currentCustomer?: Customer;
}

declare global {
  interface Window {
    firebase: any;
  }
}
