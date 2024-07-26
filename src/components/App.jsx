import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('Processing your donation...');

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
          body: JSON.stringify({ email, name }),
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
        <p>
          Click the link below to complete your donation: <br />
          <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
            Complete Donation
          </a>
        </p>
      );
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error processing donation. Please try again later.');
    }
  };

  return (
    <div className="App">
      <h1>Make a Donation</h1>
      <form id="donation-form" onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Make Donation</button>
      </form>
      <div id="message">{message}</div>
    </div>
  );
}

export default App;
