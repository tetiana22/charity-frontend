import React, { useState } from 'react';

function App() {
  const [step, setStep] = useState('amount'); // Стан для перемикання між етапами
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [message, setMessage] = useState('');

  const handleAmountSubmit = () => {
    if (amount || customAmount) {
      setStep('details'); // Перехід до форми введення даних
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

    // Визначення остаточної суми
    const donationAmount = amount || customAmount;

    try {
      // Створення білінгового запиту
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

      // Створення білінгового запиту флоу
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

      // Відображення посилання для завершення донату
      setMessage(
        <div>
          <p>
            Click the link below to complete your donation of ${donationAmount}:{' '}
            <br />
            <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
              Complete Donation
            </a>
          </p>
        </div>
      );
    } catch (error) {
      console.error('Error:', error);
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
}

export default App;
