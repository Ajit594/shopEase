interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (
  options: Omit<RazorpayOptions, 'key' | 'handler'>,
  onSuccess: (paymentId: string, orderId: string, signature: string) => void,
  onError: (error: Error) => void
) => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Razorpay script failed to load');
    }

    const razorpayOptions: RazorpayOptions = {
      key: 'rzp_test_CgD4JIV0QfFMyX', // Test key
      ...options,
      handler: function (response: RazorpayResponse) {
        onSuccess(
          response.razorpay_payment_id,
          response.razorpay_order_id || '',
          response.razorpay_signature || ''
        );
      },
      theme: {
        color: '#3b82f6', // Blue color matching our theme
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
};