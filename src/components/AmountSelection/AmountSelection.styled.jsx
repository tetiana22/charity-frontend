import styled from 'styled-components';

export const Button = styled.button`
  width: 100px;
  height: 55px;
  border: 1px solid red;
  background-color: white;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: red;
  }
`;
export const Btns = styled.div`
  display: flex;
  gap: 10px;
`;
