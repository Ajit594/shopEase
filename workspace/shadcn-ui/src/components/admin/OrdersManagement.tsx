import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  EyeIcon,
  DownloadIcon,
  Filter,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');

  const { toast } = useToast();

  // Fetch orders from localStorage
  useEffect(() => {
    const fetchOrders = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get orders from localStorage, or initialize with some mock data if none exist
      const storedOrders = localStorage.getItem('orders');
      
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // Create mock orders if none exist
        const mockOrders: Order[] = [
          {
            id: 'ORD123456',
            userId: 'user_1',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            items: [
              {
                id: 'item_1',
                productId: 'prod_1',
                productName: 'Smartphone X',
                quantity: 1,
                price: 799,
              },
              {
                id: 'item_2',
                productId: 'prod_3',
                productName: 'Wireless Headphones',
                quantity: 1,
                price: 199,
              },
            ],
            totalAmount: 998,
            status: 'delivered',
            paymentStatus: 'paid',
            paymentMethod: 'Credit Card',
            shippingAddress: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA',
            },
            createdAt: '2023-06-15',
            updatedAt: '2023-06-18',
          },
          {
            id: 'ORD789012',
            userId: 'user_2',
            userName: 'Jane Smith',
            userEmail: 'jane@example.com',
            items: [
              {
                id: 'item_3',
                productId: 'prod_2',
                productName: 'Laptop Pro',
                quantity: 1,
                price: 1299,
              },
            ],
            totalAmount: 1299,
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'PayPal',
            shippingAddress: {
              street: '456 Oak Ave',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90001',
              country: 'USA',
            },
            createdAt: '2023-07-20',
            updatedAt: '2023-07-22',
          },
          {
            id: 'ORD345678',
            userId: 'user_3',
            userName: 'Mike Johnson',
            userEmail: 'mike@example.com',
            items: [
              {
                id: 'item_4',
                productId: 'prod_4',
                productName: 'Fitness Tracker',
                quantity: 2,
                price: 99,
              },
              {
                id: 'item_5',
                productId: 'prod_5',
                productName: 'Smart Home Hub',
                quantity: 1,
                price: 149,
              },
            ],
            totalAmount: 347,
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'Credit Card',
            shippingAddress: {
              street: '789 Pine Rd',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60601',
              country: 'USA',
            },
            createdAt: '2023-08-05',
            updatedAt: '2023-08-06',
          },
          {
            id: 'ORD901234',
            userId: 'user_4',
            userName: 'Sarah Wilson',
            userEmail: 'sarah@example.com',
            items: [
              {
                id: 'item_6',
                productId: 'prod_1',
                productName: 'Smartphone X',
                quantity: 1,
                price: 799,
              },
            ],
            totalAmount: 799,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'Bank Transfer',
            shippingAddress: {
              street: '101 Maple St',
              city: 'Seattle',
              state: 'WA',
              zipCode: '98101',
              country: 'USA',
            },
            createdAt: '2023-09-10',
            updatedAt: '2023-09-10',
          },
          {
            id: 'ORD567890',
            userId: 'user_5',
            userName: 'Alex Brown',
            userEmail: 'alex@example.com',
            items: [
              {
                id: 'item_7',
                productId: 'prod_3',
                productName: 'Wireless Headphones',
                quantity: 1,
                price: 199,
              },
            ],
            totalAmount: 199,
            status: 'cancelled',
            paymentStatus: 'refunded',
            paymentMethod: 'Credit Card',
            shippingAddress: {
              street: '222 Elm Blvd',
              city: 'Boston',
              state: 'MA',
              zipCode: '02108',
              country: 'USA',
            },
            createdAt: '2023-09-18',
            updatedAt: '2023-09-19',
          },
        ];
        
        setOrders(mockOrders);
        localStorage.setItem('orders', JSON.stringify(mockOrders));
      }
      
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : order
    );

    // Update in localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    setOrders(updatedOrders);
    setIsUpdateStatusDialogOpen(false);
    setSelectedOrder({
      ...selectedOrder,
      status: newStatus,
      updatedAt: new Date().toISOString().split('T')[0],
    });

    toast({
      title: "Order status updated",
      description: `Order #${selectedOrder.id} status changed to ${newStatus}`,
    });
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsDialogOpen(true);
  };

  const openUpdateStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsUpdateStatusDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableCaption>A list of all customer orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => openUpdateStatusDialog(order)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsDialogOpen} onOpenChange={setIsOrderDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder?.createdAt}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-6 pt-2">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd className="font-medium">{selectedOrder.userName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Email:</dt>
                        <dd className="font-medium">{selectedOrder.userEmail}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <address className="not-italic space-y-1 text-sm">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </address>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.quantity * item.price)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                        <TableCell className="text-right font-bold">{formatPrice(selectedOrder.totalAmount)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Payment Method:</dt>
                        <dd className="font-medium">{selectedOrder.paymentMethod}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Status:</dt>
                        <dd>{getPaymentStatusBadge(selectedOrder.paymentStatus)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Status:</span>
                      {getOrderStatusBadge(selectedOrder.status)}
                    </div>
                    <Button className="w-full" onClick={() => openUpdateStatusDialog(selectedOrder)}>
                      Update Status
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button variant="outline" className="gap-1">
                  <DownloadIcon className="h-4 w-4" /> Download Invoice
                </Button>
                <Button onClick={() => setIsOrderDetailsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrderStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}