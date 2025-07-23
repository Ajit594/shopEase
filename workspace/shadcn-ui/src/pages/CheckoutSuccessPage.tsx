import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { downloadReceipt, OrderDetails, viewReceiptInBrowser } from '@/utils/receipt';
import { CheckIcon, FileIcon, MailIcon, EyeIcon } from 'lucide-react';

interface OrderWithReceipt extends OrderDetails {
  receipt: string;
  paymentId: string;
}

export const CheckoutSuccessPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Try to get order details from location state
    if (location.state?.orderDetails && location.state?.receiptUrl) {
      setOrderDetails(location.state.orderDetails);
      setReceiptUrl(location.state.receiptUrl);
      return;
    }
    
    // If not available in state (e.g. page refresh), try to get from localStorage
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]') as OrderWithReceipt[];
      const order = orders.find((o) => o.orderId === orderId);
      
      if (order) {
        setOrderDetails(order);
        setReceiptUrl(order.receipt);
      }
    }
  }, [location.state, orderId]);
  
  const handleDownloadReceipt = () => {
    if (receiptUrl && orderDetails) {
      downloadReceipt(receiptUrl, orderDetails.orderId);
    }
  };
  
  const handleViewReceipt = () => {
    if (orderDetails) {
      viewReceiptInBrowser(orderDetails);
    }
  };
  
  const simulateEmailReceipt = () => {
    window.alert(`Receipt has been emailed to ${orderDetails?.shippingInfo.email}`);
  };
  
  if (!orderDetails) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Order details not found</h1>
          <p className="mb-8">We couldn't find information about your order.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-gray-600">Your order has been successfully processed.</p>
        </div>
        
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-lg">Order Information</h2>
              <p className="text-gray-600">Order #{orderDetails.orderId}</p>
              <p className="text-gray-600">
                Date: {new Date(orderDetails.orderDate).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h2 className="font-semibold text-lg">Shipping Address</h2>
              <p>{orderDetails.shippingInfo.fullName}</p>
              <p>{orderDetails.shippingInfo.address}</p>
              <p>
                {orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state}{' '}
                {orderDetails.shippingInfo.zipCode}
              </p>
              <p>{orderDetails.shippingInfo.country}</p>
            </div>
            
            <div>
              <h2 className="font-semibold text-lg">Payment Method</h2>
              <p>{orderDetails.paymentMethod}</p>
            </div>
            
            <div>
              <h2 className="font-semibold text-lg">Order Summary</h2>
              <div className="border-t border-b py-2 space-y-2 my-2">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {orderDetails.shipping === 0
                      ? "Free"
                      : `$${orderDetails.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 text-base">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={handleViewReceipt} className="flex items-center gap-2" variant="default">
            <EyeIcon className="h-4 w-4" />
            View Receipt
          </Button>
          <Button onClick={handleDownloadReceipt} className="flex items-center gap-2" variant="outline">
            <FileIcon className="h-4 w-4" />
            Download Receipt
          </Button>
          <Button variant="outline" onClick={simulateEmailReceipt} className="flex items-center gap-2">
            <MailIcon className="h-4 w-4" />
            Email Receipt
          </Button>
        </div>
        
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};