import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { ShoppingCart } from 'lucide-react';

export const CartPage = () => {
  const { items, clearCart } = useCart();
  
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-xl">Cart Items</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => clearCart()}
                >
                  Clear Cart
                </Button>
              </div>
              
              <div className="divide-y">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <CartSummary />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center py-12">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button size="lg" asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </MainLayout>
  );
};