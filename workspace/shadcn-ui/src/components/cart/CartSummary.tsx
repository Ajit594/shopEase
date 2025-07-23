import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const CartSummary = () => {
  const { items, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  
  useEffect(() => {
    setSubtotal(total);
    setTax(total * 0.08); // Assuming 8% tax
    setShipping(total > 0 ? (total > 100 ? 0 : 10) : 0); // Free shipping over $100
  }, [total]);
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    }
  };
  
  const orderTotal = subtotal + tax + shipping;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>
            {shipping === 0 && subtotal > 0
              ? "Free"
              : shipping > 0
              ? `$${shipping.toFixed(2)}`
              : "$0.00"}
          </span>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
          {subtotal > 100 && (
            <p className="text-green-600 text-sm mt-2">
              You qualify for free shipping!
            </p>
          )}
          {subtotal > 0 && subtotal < 100 && (
            <p className="text-sm mt-2">
              Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isAuthenticated ? (
          <Button 
            className="w-full" 
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full" disabled={items.length === 0}>
                Proceed to Checkout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Login Required</AlertDialogTitle>
                <AlertDialogDescription>
                  You need to be logged in to proceed with checkout. Would you like to log in now?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => navigate('/login', { state: { from: '/checkout' } })}>
                  Login
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};