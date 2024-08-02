import React, { useState } from 'react';
import {
  createPayPalOrder,
  createGoCardlessBillingRequest,
  createGoCardlessBillingRequestFlow,
} from '../Api';
import { Button, BtnContext } from './PaymentDetails.styled';
import PayPalIcon from '../Icons/PayPalIcon';
import GoCardlessIcon from '../Icons/GoCardless';

const PaymentDetails = ({ amount }) => {
  const [email, setEmail] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!givenName || !email) {
      setMessage('Please enter both your name and email.');
      return;
    }

    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    try {
      if (paymentMethod === 'paypal') {
        const response = await createPayPalOrder(donationAmount.toFixed(2));

        if (response.links) {
          const approvalLink = response.links.find(
            link => link.rel === 'approve'
          )?.href;
          if (approvalLink) {
            window.location.href = approvalLink;
          } else {
            throw new Error('Approval link not found in PayPal response.');
          }
        } else {
          throw new Error('Invalid PayPal response format.');
        }
      } else if (paymentMethod === 'gocardless') {
        const billingRequestId = await createGoCardlessBillingRequest(
          email,
          givenName,
          familyName,
          donationAmount
        );
        const redirectUrl = await createGoCardlessBillingRequestFlow(
          billingRequestId
        );

        setMessage(
          <div>
            <p>
              Click the link below to complete your donation of $
              {donationAmount}: <br />
              <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
                Complete Donation
              </a>
            </p>
          </div>
        );
      } else {
        setMessage('Please select a payment method.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
      setMessage('Error processing donation. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Select Payment Method</h2>
      <Button
        className="gocardless"
        onClick={() => setPaymentMethod('gocardless')}
      >
        <BtnContext>
          <GoCardlessIcon />
          GoCardless
        </BtnContext>
      </Button>
      <Button className="paypal" onClick={() => setPaymentMethod('paypal')}>
        <PayPalIcon />
      </Button>
      <br />
      {paymentMethod && (
        <form id="donation-form" onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Given Name:
            <input
              type="text"
              value={givenName}
              onChange={e => setGivenName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Family Name:
            <input
              type="text"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Make Donation</button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default PaymentDetails;
