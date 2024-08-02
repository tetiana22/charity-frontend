import React, { useState } from 'react';
import { Button, Btns } from './AmountSelection.styled';

const AmountSelection = ({ onAmountSelect }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleAmountSubmit = () => {
    if (amount || customAmount) {
      onAmountSelect(parseFloat(amount) || parseFloat(customAmount));
    } else {
      setMessage('Please select or enter an amount.');
    }
  };

  return (
    <div>
      <Btns>
        <Button onClick={() => setAmount('5')}>Donate £5</Button>
        <Button onClick={() => setAmount('10')}>Donate £10</Button>
        <Button onClick={() => setAmount('15')}>Donate £15</Button>
      </Btns>
      <label>
        Or enter your own amount:
        <input
          type="number"
          value={customAmount}
          onChange={e => setCustomAmount(e.target.value)}
        />
      </label>

      <button onClick={handleAmountSubmit}>Continue</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AmountSelection;
