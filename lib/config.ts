export const config = {
  shopName: 'New Madhav Trading',
  tagline: 'Wholesale Suppliers of Pulses, Dry Fruits, Groceries & Spices',
  owner: 'Bhadreshbhai Lathiya',
  phoneRaw: '9824535155',
  phoneDisplay: '98245 35155',
  phoneTel: 'tel:9824535155',
  whatsapp: 'https://wa.me/919824535155',
  email: 'mmadhav51@gmail.com',
  gstn: '24ABUPL3759Q1ZN',
  address: {
    line1: '26, Kailash Nagar',
    line2: 'Opposite Jeevandhara Society',
    line3: 'Tapovan Circle, Chikuwadi',
    line4: 'Nana Varachha, Surat, Gujarat — 395009',
    short: '26, Kailash Nagar, Tapovan Circle, Chikuwadi, Nana Varachha, Surat',
  },
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1675.9818535424263!2d72.88505144708168!3d21.222457680627276!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f68b74aaddf%3A0x186a83013bc7e55f!2sNew%20Madhav%20Trading!5e0!3m2!1sen!2sin!4v1785147631413!5m2!1sen!2sin',
  mapsLink: 'https://maps.app.goo.gl/NERDnwRsniKEXgvM6',
  hours: {
    weekdays: 'Monday to Saturday, 8:00 AM to 8:00 PM',
    weekend: 'Sunday: 8:00 AM to 1:00 PM',
  },
  storageBucket: 'Orders',
} as const;

export const productCategories = [
  {
    id: 'kathol',
    name: 'Pulses (Kathodal)',
    gujarati: 'કઠોળ',
    description: 'Chana dal, toor dal, moong, urad and more — quality legumes.',
    emoji: '🫘',
    items: ['Chana Dal', 'Toor Dal', 'Moong Dal', 'Urad Dal', 'Rajma'],
  },
  {
    id: 'dry-fruits',
    name: 'Dry Fruits',
    gujarati: 'સૂકા મેવા',
    description: 'Cashew, almonds, pistachios, raisins, walnuts, figs, dates, makhana.',
    emoji: '🌰',
    items: ['Cashew (કાજુ)', 'Almonds (બદામ)', 'Pistachios (પિસ્તા)', 'Raisins (કિસમિસ)', 'Walnuts (અખરોટ)', 'Figs (અંજીર)', 'Dates (ખજૂર)', 'Makhana (મખાણા)'],
  },
  {
    id: 'groceries',
    name: 'Groceries (Kiryana)',
    gujarati: 'ગાંધી કરિયાણા',
    description: 'Traditional grocery items — flours, rice, oils, and staples.',
    emoji: '🛒',
    items: ['Wheat Flour', 'Rice', 'Cooking Oil', 'Sugar', 'Salt', 'Tea'],
  },
  {
    id: 'spices',
    name: 'Spices & Masala',
    gujarati: 'મસાલા',
    description: 'Whole spices and premium masala mixes for rich flavor.',
    emoji: '🌶️',
    items: ['Whole Spices', 'Premium Masala Mixes', 'Seeds'],
  },
] as const;

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Place Order', href: '/order' },
  { label: 'Contact', href: '/#contact' },
] as const;
