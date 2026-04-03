export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  discount?: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFkcGhvbmVzJTIwYmxhY2t8ZW58MXx8fHwxNzc0ODY4MDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    rating: 4.8,
    reviews: 1243,
    description: "Experience premium sound quality with active noise cancellation and 30-hour battery life.",
    features: ["Active Noise Cancellation", "30-Hour Battery", "Premium Sound Quality", "Bluetooth 5.0"],
    inStock: true,
    discount: 25
  },
  {
    id: 2,
    name: "True Wireless Earbuds",
    price: 149,
    image: "https://images.unsplash.com/photo-1695634463848-4db4e47703a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjB3aGl0ZXxlbnwxfHx8fDE3NzQ4NTE4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    rating: 4.6,
    reviews: 892,
    description: "Compact and powerful wireless earbuds with crystal-clear sound and all-day comfort.",
    features: ["IPX7 Water Resistant", "24-Hour Case", "Touch Controls", "Fast Charging"],
    inStock: true
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    price: 399,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1523394373826-0b47f5d8d30f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzQ5NTI0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wearables",
    rating: 4.9,
    reviews: 2156,
    description: "Advanced fitness tracking, heart rate monitoring, and seamless smartphone integration.",
    features: ["Heart Rate Monitor", "GPS Tracking", "7-Day Battery", "Waterproof"],
    inStock: true,
    discount: 20
  },
  {
    id: 4,
    name: "Ultra Portable Laptop",
    price: 1299,
    image: "https://images.unsplash.com/photo-1554125970-e3f2399e937f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1pbmltYWx8ZW58MXx8fHwxNzc0OTMzNjMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Computers",
    rating: 4.7,
    reviews: 645,
    description: "Lightweight powerhouse with all-day battery life and stunning display.",
    features: ["Intel i7 Processor", "16GB RAM", "512GB SSD", "14-inch Display"],
    inStock: true
  },
  {
    id: 5,
    name: "Professional Camera",
    price: 2499,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzQ5MzUxODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Photography",
    rating: 4.9,
    reviews: 1567,
    description: "Capture stunning photos and videos with professional-grade features.",
    features: ["45MP Sensor", "4K Video", "Dual Card Slots", "Weather Sealed"],
    inStock: true,
    discount: 17
  },
  {
    id: 6,
    name: "Flagship Smartphone",
    price: 999,
    image: "https://images.unsplash.com/photo-1646719223599-9864b351e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwZGV2aWNlfGVufDF8fHx8MTc3NDkxNjg0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Mobile",
    rating: 4.8,
    reviews: 3421,
    description: "The latest in mobile technology with cutting-edge features and performance.",
    features: ["5G Enabled", "Pro Camera System", "A16 Chip", "All-Day Battery"],
    inStock: true
  },
  {
    id: 7,
    name: "RGB Gaming Keyboard",
    price: 179,
    originalPrice: 229,
    image: "https://images.unsplash.com/photo-1645802106095-765b7e86f5bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYnxlbnwxfHx8fDE3NzQ5MjM0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Gaming",
    rating: 4.7,
    reviews: 892,
    description: "Mechanical gaming keyboard with customizable RGB lighting and responsive keys.",
    features: ["Mechanical Switches", "RGB Backlighting", "Programmable Keys", "USB-C"],
    inStock: true,
    discount: 22
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    price: 129,
    image: "https://images.unsplash.com/photo-1772683748340-ff2fa5b901b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMHNwZWFrZXIlMjBwb3J0YWJsZXxlbnwxfHx8fDE3NzQ5NTI0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    rating: 4.5,
    reviews: 756,
    description: "Powerful portable speaker with 360-degree sound and waterproof design.",
    features: ["360° Sound", "Waterproof IP67", "12-Hour Battery", "Party Mode"],
    inStock: true
  },
  {
    id: 9,
    name: "Pro Tablet",
    price: 799,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1769603795371-ad63bd85d524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBtb2Rlcm58ZW58MXx8fHwxNzc0ODczMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Tablets",
    rating: 4.8,
    reviews: 1234,
    description: "Versatile tablet for work and play with stunning display and all-day battery.",
    features: ["11-inch Display", "Stylus Support", "Face ID", "10-Hour Battery"],
    inStock: true,
    discount: 11
  },
  {
    id: 10,
    name: "Professional Drone",
    price: 1599,
    image: "https://images.unsplash.com/photo-1770411034013-e6cb865ed21a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHRlY2hub2xvZ3klMjBhZXJpYWx8ZW58MXx8fHwxNzc0ODQ4ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Photography",
    rating: 4.9,
    reviews: 543,
    description: "Capture breathtaking aerial footage with advanced stabilization and 4K camera.",
    features: ["4K HDR Camera", "40-Min Flight", "Obstacle Avoidance", "Return Home"],
    inStock: false
  },
  {
    id: 11,
    name: "Designer Sneakers",
    price: 189,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1758702701300-372126112cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjBtb2Rlcm58ZW58MXx8fHwxNzc0OTUyNDc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    rating: 4.6,
    reviews: 1876,
    description: "Modern design meets comfort in these premium lifestyle sneakers.",
    features: ["Premium Materials", "All-Day Comfort", "Sustainable", "Limited Edition"],
    inStock: true,
    discount: 24
  },
  {
    id: 12,
    name: "Luxury Watch",
    price: 599,
    image: "https://images.unsplash.com/photo-1639564879163-a2a85682410e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMHRpbWVwaWVjZXxlbnwxfHx8fDE3NzQ4NjI5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wearables",
    rating: 4.9,
    reviews: 432,
    description: "Timeless elegance with Swiss precision and sophisticated design.",
    features: ["Swiss Movement", "Sapphire Crystal", "Water Resistant", "Premium Leather"],
    inStock: true
  }
];

export interface CartItem extends Product {
  quantity: number;
}
