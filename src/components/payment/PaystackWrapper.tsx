import { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PaystackWrapperProps {
  onSuccess: (reference: string) => void;
  amount: number;
  email: string;
  name: string;
  phone: string;
}

const PaystackWrapper = ({ onSuccess, amount, email, name, phone }: PaystackWrapperProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Paystack configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: Math.round(amount * 100), // Convert to lowest currency unit (kobo, cents, etc.)
    publicKey: 'pk_test_6da3f5951d0736a2f1f11f0f40b0ae2e3d2610cf',
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: name,
        },
        {
          display_name: "Customer Phone",
          variable_name: "customer_phone",
          value: phone,
        },
      ],
    },
  };

  // Handle successful payment
  const handlePaystackSuccess = (reference: any) => {
    console.log("Payment successful", reference);
    toast({
      title: "Payment successful",
      description: "Your payment has been processed successfully.",
    });
    setIsProcessing(false);
    // Pass the transaction reference back to the parent component
    onSuccess(reference.reference || reference);
  };

  // Handle payment cancellation
  const handlePaystackClose = () => {
    console.log("Payment closed");
    toast({
      title: "Payment cancelled",
      description: "You have cancelled the payment.",
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  const componentProps = {
    ...config,
    text: isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`,
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
    className: "w-full bg-gold-400 hover:bg-gold-500 text-white p-2 rounded",
  };

  return (
    <div className="mt-4">
      <PaystackButton {...componentProps} />
      <p className="text-sm text-gray-500 mt-2 text-center">
        Secure payment powered by Paystack
      </p>
    </div>
  );
};

export default PaystackWrapper;