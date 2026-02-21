
import { Product, StoreSettings, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  'دواجن ولحوم طازجة',
  'سلع تموينية',
  'صلصات وزيوت',
  'مجمدات سودانية',
  'بقوليات ومعلبات'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'كيلو فراخ طازج (نخب أول)',
    description: 'دواجن طازجة من مزارعنا، ذبح اليوم، مغلفة بمعايير صحية عالية لضمان أفضل مذاق.',
    price: 4500,
    originalPrice: 5200,
    category: 'دواجن ولحوم طازجة',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    sizes: ['1 كجم', '2 كجم']
  },
  {
    id: '2',
    name: 'طبق بيض طازج (30 حبة)',
    description: 'بيض مزارع طازج، حجم كبير، غني بالفيتامينات، يصلكم مغلفاً بعناية.',
    price: 3800,
    category: 'دواجن ولحوم طازجة',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=800',
    stock: 100
  },
  {
    id: '3',
    name: 'زيت طعام كريستال (1 لتر)',
    description: 'زيت نباتي نقي، مثالي للقلي والطبخ، جودة مضمونة لمائدتكم.',
    price: 2400,
    category: 'سلع تموينية',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=800',
    stock: 100
  },
  {
    id: '4',
    name: 'سكر كنانة نقي (1 كيلو)',
    description: 'أجود أنواع السكر السوداني، نقي وسريع الذوبان.',
    price: 1800,
    category: 'سلع تموينية',
    image: 'https://images.unsplash.com/photo-1581448670546-37016335168e?auto=format&fit=crop&q=80&w=800',
    stock: 200
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  name: 'الراقي للمواد الغذائية',
  description: 'الراقي هو وجهتكم الأولى في السودان للحصول على أجود أنواع الدواجن والسلع التموينية الفاخرة. نعتني بجودة مائدتكم لتصلكم طازجة وبأفضل الأسعار.',
  phone: '00249912345678',
  email: 'info@alraqi-sd.com',
  address: 'السودان، الخرطوم - حي الرياض، شارع المشتل',
  instagram: '#',
  twitter: '#',
  whatsapp: 'https://wa.me/249912345678',
  adminPassword: '5605',
  bankName: 'بنك الخرطوم (BOK)',
  bankAccountName: 'متجر الراقي للمواد الغذائية',
  bankIBAN: 'SD00 0000 0000 0000 0000 0000'
};
