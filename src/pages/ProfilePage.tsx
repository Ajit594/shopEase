import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { ProfileTab } from '@/components/profile/ProfileTab';
import { OrderHistoryTab } from '@/components/profile/OrderHistoryTab';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRoundIcon, ShoppingBagIcon } from 'lucide-react';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'orders' ? 'orders' : 'profile');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/profile' } });
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null; // Don't render anything while checking auth status
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserRoundIcon className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBagIcon className="h-4 w-4" />
              <span>Order History</span>
            </TabsTrigger>
          </TabsList>
          
          <Card className="border rounded-lg p-6">
            <TabsContent value="profile">
              <ProfileTab user={user} />
            </TabsContent>
            <TabsContent value="orders">
              <OrderHistoryTab userId={user.id} />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </MainLayout>
  );
};