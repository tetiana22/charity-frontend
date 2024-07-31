import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Success() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentID = params.get('paymentId');
    const payerID = params.get('PayerID');

    if (paymentID && payerID) {
      axios
        .post('http://emily-charity.onrender.com/execute-payment', {
          paymentID,
          payerID,
        })
        .then(response => {
          console.log('Payment successful:', response.data);
        })
        .catch(error => {
          console.error('Error executing payment:', error);
        });
    }
  }, [location.search]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment.</p>
    </div>
  );
}

export default Success;
