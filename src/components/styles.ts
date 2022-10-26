import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  > svg {
    margin: 4rem;
    transition: all 0.2s ease;

    &:hover {
      color: tomato;
    }
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Description = styled.h2``;

export const Warning = styled.h4``;

export const Link = styled.a`
  font-size: 24px;
  transition: all 0.2s ease;
  font-weight: 500;
  margin-top: 8rem;

  &:hover {
    color: #91baf8;
  }
`;

export const style_btn = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '15px',
  fontWeight: 'bold',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '100px',
  height: '50px',
  margin: '0 0.5rem',
};
