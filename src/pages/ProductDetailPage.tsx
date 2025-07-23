import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProductById, Product } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate('/not-found');
      }
    }
  }, [id, navigate]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
      
      // Show success message
      window.alert(`${quantity} ${product.name} added to cart!`);
    }
  };
  
  if (!product) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading product...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
          Product Image
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex text-amber-400">
                {Array(5).fill(0).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">({product.rating.toFixed(1)})</span>
              </div>
            </div>
          </div>
          
          <div className="text-3xl font-semibold">${product.price.toFixed(2)}</div>
          
          <div className="border-t border-b py-4">
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-2">Quantity:</span>
              <div className="flex items-center border rounded">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </Button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-12 h-8 text-center border-0"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2">Availability:</span>
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2">Category:</span>
              <Link 
                to={`/products?category=${product.category}`}
                className="text-blue-600 hover:underline"
              >
                {product.category}
              </Link>
            </div>
            
            <Button 
              size="lg" 
              className="w-full"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
            <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-6">
            <p>{product.description}</p>
            <p className="mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum iusto placeat consequatur voluptas
              natus explicabo earum, eum cum quibusdam omnis esse deleniti cupiditate quam ratione quidem magnam
              nesciunt molestiae delectus!
            </p>
            <p className="mt-4">
              Rerum iusto placeat consequatur voluptas natus explicabo earum, eum cum quibusdam omnis
              esse deleniti cupiditate quam ratione quidem.
            </p>
          </TabsContent>
          <TabsContent value="features" className="p-6">
            <ul className="list-disc pl-5 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};