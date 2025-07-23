import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  DollarSignIcon,
  ShoppingCartIcon,
  PackageIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
}

export function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockStats: DashboardStats = {
        totalSales: 12580,
        totalOrders: 87,
        totalProducts: 24,
        averageRating: 4.7,
      };

      setStats(mockStats);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 2100 },
    { name: 'Feb', sales: 1800 },
    { name: 'Mar', sales: 1600 },
    { name: 'Apr', sales: 1400 },
    { name: 'May', sales: 2200 },
    { name: 'Jun', sales: 2400 },
    { name: 'Jul', sales: 1900 },
  ];

  const productPerformanceData = [
    { name: 'Week 1', product1: 400, product2: 240, product3: 320 },
    { name: 'Week 2', product1: 300, product2: 380, product3: 280 },
    { name: 'Week 3', product1: 200, product2: 400, product3: 250 },
    { name: 'Week 4', product1: 270, product2: 380, product3: 300 },
    { name: 'Week 5', product1: 500, product2: 410, product3: 270 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seller Dashboard</h2>
      <p className="text-muted-foreground">
        Welcome back, {user?.name}! Here's an overview of your store performance.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value={stats?.totalSales}
          format="currency"
          icon={<DollarSignIcon className="h-6 w-6 text-green-500" />}
          loading={loading}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders}
          icon={<ShoppingCartIcon className="h-6 w-6 text-blue-500" />}
          loading={loading}
        />
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts}
          icon={<PackageIcon className="h-6 w-6 text-purple-500" />}
          loading={loading}
        />
        <StatsCard
          title="Avg. Rating"
          value={stats?.averageRating}
          format="rating"
          icon={<TrendingUpIcon className="h-6 w-6 text-orange-500" />}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Monthly Sales</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Top Product Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="product1" stroke="#8884d8" name="Product A" />
                  <Line type="monotone" dataKey="product2" stroke="#82ca9d" name="Product B" />
                  <Line type="monotone" dataKey="product3" stroke="#ffc658" name="Product C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <Activity 
                message="New order #ORD78945 received" 
                time="2 hours ago"
                type="order" 
              />
              <Activity 
                message="Customer left a 5-star review on Smartphone X" 
                time="Yesterday" 
                type="review" 
              />
              <Activity 
                message="Inventory low for Product 'Wireless Headphones'" 
                time="2 days ago" 
                type="inventory" 
              />
              <Activity 
                message="Sales goal for July reached!" 
                time="3 days ago" 
                type="achievement" 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number | undefined;
  format?: 'number' | 'currency' | 'percentage' | 'rating';
  icon: React.ReactNode;
  loading: boolean;
}

function StatsCard({ title, value, format = 'number', icon, loading }: StatsCardProps) {
  const formattedValue = () => {
    if (value === undefined) return '—';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'rating':
        return `${value} / 5`;
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <p className="text-2xl font-bold">{formattedValue()}</p>
            )}
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityProps {
  message: string;
  time: string;
  type: 'order' | 'review' | 'inventory' | 'achievement';
}

function Activity({ message, time, type }: ActivityProps) {
  const getActivityIcon = () => {
    switch (type) {
      case 'order':
        return <ShoppingCartIcon className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <TrendingUpIcon className="h-5 w-5 text-green-500" />;
      case 'inventory':
        return <PackageIcon className="h-5 w-5 text-yellow-500" />;
      case 'achievement':
        return <DollarSignIcon className="h-5 w-5 text-purple-500" />;
    }
  };
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-md border">
      <div className="bg-muted rounded-full p-2">
        {getActivityIcon()}
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}