import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4">ShopEase</h2>
            <p className="text-gray-600 text-sm">
              Your one-stop destination for all your shopping needs with quality products and excellent service.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="text-gray-600 hover:text-gray-900">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=Clothing" className="text-gray-600 hover:text-gray-900">Clothing</Link>
              </li>
              <li>
                <Link to="/products?category=Home" className="text-gray-600 hover:text-gray-900">Home & Kitchen</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">Register</Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-gray-900">Order History</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-gray-900">Shipping Information</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-gray-900">Returns & Exchanges</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {currentYear} ShopEase. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};