import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 8));
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-16">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Shop the Best Products for Your Lifestyle
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Discover amazing products with great deals. Free shipping on orders over $100!
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Button variant="ghost" asChild>
            <Link to="/products">View All</Link>
          </Button>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
      
      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/products?category=Electronics" className="group">
            <div className="h-40 bg-blue-100 rounded-lg p-6 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-200">
              <h3 className="text-xl font-medium">Electronics</h3>
            </div>
          </Link>
          <Link to="/products?category=Clothing" className="group">
            <div className="h-40 bg-green-100 rounded-lg p-6 flex items-center justify-center transition-all duration-200 group-hover:bg-green-200">
              <h3 className="text-xl font-medium">Clothing</h3>
            </div>
          </Link>
          <Link to="/products?category=Home" className="group">
            <div className="h-40 bg-amber-100 rounded-lg p-6 flex items-center justify-center transition-all duration-200 group-hover:bg-amber-200">
              <h3 className="text-xl font-medium">Home & Kitchen</h3>
            </div>
          </Link>
          <Link to="/products?category=Accessories" className="group">
            <div className="h-40 bg-purple-100 rounded-lg p-6 flex items-center justify-center transition-all duration-200 group-hover:bg-purple-200">
              <h3 className="text-xl font-medium">Accessories</h3>
            </div>
          </Link>
        </div>
      </section>
      
      {/* Promotion Section */}
      <section className="mb-16 bg-indigo-800 text-white rounded-xl p-8 md:p-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Summer Sale</h2>
          <p className="text-lg mb-8">Get up to 40% off on selected items. Limited time offer!</p>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-800" asChild>
            <Link to="/products?sale=true">Shop the Sale</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};