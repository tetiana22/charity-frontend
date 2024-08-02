import axios from 'axios';

const createPayPalOrder = async amount => {
  const response = await axios.post(
    'https://emily-charity.onrender.com/create-paypal-order',
    { amount }
  );
  return response.data;
};

const createGoCardlessBillingRequest = async (
  email,
  givenName,
  familyName,
  amount
) => {
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
        amount,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.billing_requests.id;
};

const createGoCardlessBillingRequestFlow = async billingRequestId => {
  const response = await fetch(
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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.billing_request_flows.authorisation_url;
};

export {
  createPayPalOrder,
  createGoCardlessBillingRequest,
  createGoCardlessBillingRequestFlow,
};
