export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  features: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium wireless headphones with active noise cancellation, high-quality sound, and 30+ hours of battery life.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Electronics",
    inStock: true,
    rating: 4.8,
    features: ["Active Noise Cancellation", "30+ Hours Battery", "Bluetooth 5.0", "Voice Assistant Support"]
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring, sleep tracking, and waterproof design for all your activities.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=688&auto=format&fit=crop",
    category: "Electronics",
    inStock: true,
    rating: 4.5,
    features: ["Heart Rate Monitoring", "Sleep Tracking", "Waterproof Design", "7-Day Battery Life"]
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable 100% organic cotton t-shirt, ethically sourced and available in various colors and sizes.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=688&auto=format&fit=crop",
    category: "Clothing",
    inStock: true,
    rating: 4.3,
    features: ["100% Organic Cotton", "Ethically Sourced", "Multiple Colors", "Sizes XS-XXL"]
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    description: "Eco-friendly, double-walled stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=688&auto=format&fit=crop",
    category: "Home",
    inStock: true,
    rating: 4.7,
    features: ["Double-Walled Insulation", "BPA-Free", "Leak-Proof Design", "500ml Capacity"]
  },
  {
    id: "5",
    name: "Artisanal Ceramic Coffee Mug",
    description: "Handcrafted ceramic coffee mug, uniquely designed with a comfortable handle and 350ml capacity.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=688&auto=format&fit=crop",
    category: "Home",
    inStock: false,
    rating: 4.6,
    features: ["Handcrafted", "Microwave Safe", "Dishwasher Safe", "350ml Capacity"]
  },
  {
    id: "6",
    name: "Bluetooth Portable Speaker",
    description: "Compact yet powerful Bluetooth speaker with rich sound, 10 hours of playback, and waterproof design.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=688&auto=format&fit=crop",
    category: "Electronics",
    inStock: true,
    rating: 4.4,
    features: ["10-Hour Battery", "Waterproof IPX7", "Bluetooth 5.0", "Built-in Microphone"]
  },
  {
    id: "7",
    name: "Natural Scented Candle",
    description: "Hand-poured soy wax candle with essential oils and a wooden wick, providing 40+ hours of burn time.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=688&auto=format&fit=crop",
    category: "Home",
    inStock: true,
    rating: 4.2,
    features: ["Soy Wax", "Essential Oils", "Wooden Wick", "40+ Hours Burn Time"]
  },
  {
    id: "8",
    name: "Professional Chef's Knife",
    description: "High-carbon stainless steel chef's knife with ergonomic handle and precision cutting edge.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=688&auto=format&fit=crop",
    category: "Kitchen",
    inStock: true,
    rating: 4.9,
    features: ["High-Carbon Steel", "Ergonomic Handle", "Precision Edge", "8-inch Blade"]
  },
  {
    id: "9",
    name: "Vegan Leather Backpack",
    description: "Stylish and durable vegan leather backpack with multiple compartments, perfect for daily use or travel.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=688&auto=format&fit=crop",
    category: "Accessories",
    inStock: true,
    rating: 4.3,
    features: ["Vegan Leather", "Laptop Compartment", "Water-Resistant", "Adjustable Straps"]
  },
  {
    id: "10",
    name: "Smart LED Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels, color temperatures, and wireless charging base.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=688&auto=format&fit=crop",
    category: "Home",
    inStock: true,
    rating: 4.5,
    features: ["Adjustable Brightness", "Color Temperature Control", "Wireless Charging", "Touch Controls"]
  },
  {
    id: "11",
    name: "Organic Green Tea Set",
    description: "Premium organic green tea set with four varieties and a handcrafted wooden box.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=688&auto=format&fit=crop",
    category: "Food & Drink",
    inStock: true,
    rating: 4.7,
    features: ["Organic Certified", "4 Varieties", "Handcrafted Box", "40 Tea Bags"]
  },
  {
    id: "12",
    name: "Digital Drawing Tablet",
    description: "Professional drawing tablet with pressure sensitivity, customizable shortcut keys, and wireless capability.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=688&auto=format&fit=crop",
    category: "Electronics",
    inStock: false,
    rating: 4.6,
    features: ["Pressure Sensitivity", "Customizable Keys", "Wireless Capability", "Compatible with Major Software"]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCategories = (): string[] => {
  const categories = new Set<string>();
  products.forEach(product => categories.add(product.category));
  return Array.from(categories);
};