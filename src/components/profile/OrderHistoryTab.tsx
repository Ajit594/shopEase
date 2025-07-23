import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { OrderDetails, downloadReceipt, viewReceiptInBrowser } from '@/utils/receipt';
import { ChevronDownIcon, ChevronUpIcon, FileIcon, EyeIcon } from 'lucide-react';

interface OrderWithReceiptAndPaymentId extends OrderDetails {
  receipt: string;
  paymentId: string;
}

export const OrderHistoryTab = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<OrderWithReceiptAndPaymentId[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Load orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]') as OrderWithReceiptAndPaymentId[];
    
    // Sort by date (newest first)
    const sortedOrders = [...allOrders].sort((a, b) => {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    });
    
    setOrders(sortedOrders);
  }, [userId]);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDownloadReceipt = (order: OrderWithReceiptAndPaymentId) => {
    downloadReceipt(order.receipt, order.orderId);
  };

  const handleViewReceipt = (order: OrderWithReceiptAndPaymentId) => {
    viewReceiptInBrowser(order);
  };

  const getStatusBadge = (date: Date) => {
    const orderDate = new Date(date);
    const now = new Date();
    const daysSinceOrder = Math.floor(
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceOrder < 1) {
      return <Badge className="bg-blue-500">Processing</Badge>;
    } else if (daysSinceOrder < 3) {
      return <Badge className="bg-amber-500">Shipped</Badge>;
    } else {
      return <Badge className="bg-green-500">Delivered</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
        <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
        <Button asChild>
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        <p className="text-muted-foreground">View and manage your orders</p>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Collapsible
            key={order.orderId}
            open={expandedOrder === order.orderId}
            className="border rounded-lg"
          >
            <CollapsibleTrigger asChild>
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50"
                onClick={() => toggleOrderExpand(order.orderId)}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order #{order.orderId}</span>
                    {getStatusBadge(order.orderDate)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(order.orderDate), 'MMM d, yyyy')} • ${order.total.toFixed(2)}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  {expandedOrder === order.orderId ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="p-4 border-t">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingInfo.fullName}<br />
                    {order.shippingInfo.address}<br />
                    {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}<br />
                    {order.shippingInfo.country}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm">Payment Method</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.paymentMethod}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm">Items</h4>
                  <div className="space-y-2 mt-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0
                        ? "Free"
                        : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium mt-1">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleViewReceipt(order)}
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Receipt
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDownloadReceipt(order)}
                  >
                    <FileIcon className="h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};