import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  cardName?: string;
}

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => void;
  isSubmitting: boolean;
  disableRazorpay?: boolean;
}

export const CheckoutForm = ({ 
  onSubmit, 
  isSubmitting, 
  disableRazorpay = false 
}: CheckoutFormProps) => {
  const { user } = useAuth();
  const { total } = useCart();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: disableRazorpay ? 'credit-card' : 'razorpay',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
  });
  
  // Update payment method if Razorpay is disabled
  useEffect(() => {
    if (disableRazorpay && formData.paymentMethod === 'razorpay') {
      setFormData(prev => ({ ...prev, paymentMethod: 'credit-card' }));
    }
  }, [disableRazorpay]);

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    
    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';
    
    // Email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Phone format validation (simple check)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number should be 10 digits';
    }
    
    // Credit card validations if credit card is selected
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber?.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry?.trim()) newErrors.cardExpiry = 'Expiration date is required';
      if (!formData.cardCVC?.trim()) newErrors.cardCVC = 'CVC is required';
      if (!formData.cardName?.trim()) newErrors.cardName = 'Name on card is required';
      
      // Format validations for card
      if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (formData.cardExpiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Invalid format (MM/YY)';
      }
      
      if (formData.cardCVC && !/^\d{3,4}$/.test(formData.cardCVC)) {
        newErrors.cardCVC = 'Invalid CVC';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs">{errors.fullName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs">{errors.city}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs">{errors.state}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs">{errors.zipCode}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={formData.paymentMethod} 
                onValueChange={handlePaymentMethodChange}
                className="space-y-4"
              >
                {!disableRazorpay && (
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex-grow cursor-pointer">
                      <div className="font-medium">Razorpay (Test Mode)</div>
                      <div className="text-sm text-gray-500">
                        Pay securely using credit/debit cards, UPI, or other methods
                      </div>
                    </Label>
                    <div className="text-blue-600 font-semibold">Recommended</div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex-grow cursor-pointer">
                    <div className="font-medium">Credit Card (Direct)</div>
                    <div className="text-sm text-gray-500">
                      Enter your card details directly (demo only)
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              
              {formData.paymentMethod === 'credit-card' && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={errors.cardName ? 'border-red-500' : ''}
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-xs">{errors.cardName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={errors.cardNumber ? 'border-red-500' : ''}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-xs">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiration Date</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        className={errors.cardExpiry ? 'border-red-500' : ''}
                      />
                      {errors.cardExpiry && (
                        <p className="text-red-500 text-xs">{errors.cardExpiry}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardCVC">CVC</Label>
                      <Input
                        id="cardCVC"
                        name="cardCVC"
                        placeholder="123"
                        value={formData.cardCVC}
                        onChange={handleChange}
                        className={errors.cardCVC ? 'border-red-500' : ''}
                      />
                      {errors.cardCVC && (
                        <p className="text-red-500 text-xs">{errors.cardCVC}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'razorpay' && (
                <Alert className="mt-6 bg-blue-50 border-blue-100">
                  <AlertDescription>
                    You'll be redirected to Razorpay to complete your payment securely.
                    This is in test mode, so no actual payment will be made.
                  </AlertDescription>
                </Alert>
              )}

              {formData.paymentMethod === 'credit-card' && (
                <Alert className="mt-6">
                  <AlertDescription>
                    This is a demo checkout. No real payment will be processed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full text-lg py-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};