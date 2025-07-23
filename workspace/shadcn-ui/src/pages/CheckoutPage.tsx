import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CheckoutForm, CheckoutFormData } from '@/components/checkout/CheckoutForm';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { generateReceipt, OrderDetails, downloadReceipt } from '@/utils/receipt';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initiateRazorpayPayment } from '@/lib/razorpay';

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate totals
  const subtotal = total;
  const tax = total * 0.08; // Assuming 8% tax
  const shipping = total > 0 ? (total > 100 ? 0 : 10) : 0; // Free shipping over $100
  const orderTotal = subtotal + tax + shipping;
  
  // Generate a random order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };
  
  const handleSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Generate order details
      const orderId = generateOrderId();
      const orderDate = new Date();
      
      const orderDetails: OrderDetails = {
        orderId,
        orderDate,
        items,
        subtotal,
        tax,
        shipping,
        total: orderTotal,
        shippingInfo: formData,
        paymentMethod: formData.paymentMethod === 'razorpay' ? 'Razorpay' : 'Credit Card',
      };
      
      if (formData.paymentMethod === 'razorpay') {
        // Handle Razorpay payment
        await handleRazorpayPayment(orderDetails, formData);
      } else {
        // Handle direct credit card payment
        await processDemoPayment(orderDetails);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again later.');
      setIsSubmitting(false);
    }
  };
  
  const handleRazorpayPayment = (orderDetails: OrderDetails, formData: CheckoutFormData) => {
    return new Promise<void>((resolve, reject) => {
      // For demo purposes, skip actual Razorpay integration and simulate successful payment
      setTimeout(() => {
        processDemoPayment(orderDetails, 'rzp_test_payment_' + Date.now())
          .then(resolve)
          .catch(reject);
      }, 1500);
    });
  };
  
  const processDemoPayment = async (orderDetails: OrderDetails, paymentId?: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate receipt
      const receiptDataUrl = generateReceipt(orderDetails);
      
      // Save order to localStorage for demo purposes
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({
        ...orderDetails,
        receipt: receiptDataUrl,
        paymentId: paymentId || 'demo_payment_' + Date.now(),
      });
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      clearCart();
      
      // Navigate to success page
      navigate(`/checkout/success?orderId=${orderDetails.orderId}`, {
        state: {
          orderDetails,
          receiptUrl: receiptDataUrl,
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      throw new Error("Payment processing failed");
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <Alert className="mb-6">
          <AlertDescription>
            This is a demo checkout. No real payments will be processed.
          </AlertDescription>
        </Alert>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <CheckoutForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          disableRazorpay={false}
        />
      </div>
    </MainLayout>
  );
};