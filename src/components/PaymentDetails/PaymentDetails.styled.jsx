import styled from 'styled-components';

export const Button = styled.button`
  margin: 10px;
  padding: 5px 20px;
  width: 180px;
  height: 55px;
  border: none;
  border-radius: 5px;
  /* display: flex;
  align-items: center; */
  /* justify-content: center; */
  cursor: pointer;

  &.paypal {
    padding: 0;
    background-color: #ffc439;
  }

  &.gocardless {
    background-color: #0070ba;
    color: #f1f252;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const BtnContext = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;

  svg {
    margin-right: 10px; // відступ між іконкою та текстом
  }
`;
