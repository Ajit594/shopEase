import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { MainLayout } from '@/components/layout/MainLayout';

const App = () => (
  <AuthProvider>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={
              <MainLayout>
                <div className="max-w-md mx-auto py-12">
                  <LoginForm />
                </div>
              </MainLayout>
            } />
            <Route path="/register" element={
              <MainLayout>
                <div className="max-w-md mx-auto py-12">
                  <RegisterForm />
                </div>
              </MainLayout>
            } />
            <Route path="/forgot-password" element={
              <MainLayout>
                <div className="max-w-md mx-auto py-12">
                  <ForgotPasswordForm />
                </div>
              </MainLayout>
            } />
            <Route path="/reset-password" element={
              <MainLayout>
                <div className="max-w-md mx-auto py-12">
                  <ResetPasswordForm />
                </div>
              </MainLayout>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;