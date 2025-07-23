import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters, FilterOptions } from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products, Product, getCategories } from '@/data/products';
import { Search } from '@/components/product/Search';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const defaultFilters: FilterOptions = {
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    minPrice: 0,
    maxPrice: 500,
    inStock: false,
    minRating: 0,
  };
  
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  
  const applyFilters = () => {
    let results = [...products];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (filters.categories.length > 0) {
      results = results.filter(product => filters.categories.includes(product.category));
    }
    
    // Apply price filter
    results = results.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );
    
    // Apply in-stock filter
    if (filters.inStock) {
      results = results.filter(product => product.inStock);
    }
    
    // Apply rating filter
    results = results.filter(product => product.rating >= filters.minRating);
    
    setFilteredProducts(results);
  };
  
  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery]);
  
  // Update URL search parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (filters.categories.length > 0) {
      params.set('category', filters.categories[0]);
    }
    
    setSearchParams(params);
  }, [filters.categories, searchQuery, setSearchParams]);
  
  // Initialize from URL parameters
  useEffect(() => {
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category],
      }));
    }
  }, []);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const resetFilters = () => {
    setFilters({
      categories: [],
      minPrice: 0,
      maxPrice: 500,
      inStock: false,
      minRating: 0,
    });
    setSearchQuery('');
  };
  
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={resetFilters}
          />
        </div>
        
        {/* Products Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Products</h1>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
          </div>
          
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </MainLayout>
  );
};