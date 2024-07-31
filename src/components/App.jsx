import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [step, setStep] = useState('amount');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [message, setMessage] = useState('');

  const handleAmountSubmit = () => {
    if (amount || customAmount) {
      setStep('details');
    } else {
      setMessage('Please select or enter an amount.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!givenName || !email) {
      setMessage('Please enter both your name and email.');
      return;
    }

    const donationAmount = parseFloat(amount) || parseFloat(customAmount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    try {
      if (paymentMethod === 'paypal') {
        const formattedAmount = donationAmount.toFixed(2);
        const response = await axios.post(
          'https://emily-charity.onrender.com/create-paypal-order',
          { amount: formattedAmount }
        );

        // Ensure the response has the expected structure
        if (response.data && response.data.links) {
          const approvalLink = response.data.links.find(
            link => link.rel === 'approve'
          )?.href;

          if (approvalLink) {
            // Redirect to PayPal
            window.location.href = approvalLink;
          } else {
            throw new Error('Approval link not found in PayPal response.');
          }
        } else {
          throw new Error('Invalid PayPal response format.');
        }
      } else if (paymentMethod === 'gocardless') {
        const response = await fetch(
          'https://emily-charity.onrender.com/create-billing-request',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Bearer sandbox_QbpEJylc3XRJ4iE8qe1axWfIGQ4k_H_bxfs3lkQt',
            },
            body: JSON.stringify({
              email,
              given_name: givenName,
              family_name: familyName,
              amount: donationAmount,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const billingRequestId = data.billing_requests.id;

        const flowResponse = await fetch(
          'https://emily-charity.onrender.com/create-billing-request-flow',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Bearer sandbox_QbpEJylc3XRJ4iE8qe1axWfIGQ4k_H_bxfs3lkQt',
            },
            body: JSON.stringify({ billingRequestId }),
          }
        );

        if (!flowResponse.ok) {
          throw new Error(`HTTP error! status: ${flowResponse.status}`);
        }

        const flowData = await flowResponse.json();
        const redirectUrl = flowData.billing_request_flows.authorisation_url;

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
    <div className="App">
      <h1>Make a Donation</h1>

      {step === 'amount' && (
        <div>
          <h2>Select Donation Amount</h2>
          <button onClick={() => setAmount('5')}>Donate $5</button>
          <button onClick={() => setAmount('10')}>Donate $10</button>
          <button onClick={() => setAmount('15')}>Donate $15</button>
          <br />
          <label>
            Or enter your own amount:
            <input
              type="number"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleAmountSubmit}>Continue</button>
          {message && <p>{message}</p>}
        </div>
      )}

      {step === 'details' && (
        <div>
          <h2>Select Payment Method</h2>
          <button onClick={() => setPaymentMethod('gocardless')}>
            Pay with GoCardless
          </button>
          <button onClick={() => setPaymentMethod('paypal')}>
            Pay with PayPal
          </button>
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
      )}
    </div>
  );
}

export default App;
