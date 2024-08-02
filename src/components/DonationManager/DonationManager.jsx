import React, { useState } from 'react';
import AmountSelection from '../AmountSelection/AmountSelection';
import PaymentDetails from '../PaymentDetails/PaymentDetails';

const DonationManager = () => {
  const [step, setStep] = useState('amount');
  const [amount, setAmount] = useState('');

  const handleAmountSelect = selectedAmount => {
    setAmount(selectedAmount);
    setStep('details');
  };

  return (
    <div>
      {step === 'amount' && (
        <AmountSelection onAmountSelect={handleAmountSelect} />
      )}
      {step === 'details' && <PaymentDetails amount={amount} />}
    </div>
  );
};

export default DonationManager;
