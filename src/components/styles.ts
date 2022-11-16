import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  > svg {
    margin: 40px;
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
  margin-top: 80px;

  &:hover {
    color: #91baf8;
  }
`;

export const style_btn = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '100px',
  height: '50px',
  margin: '0 5px',
};

export const style_menu_item = {
  fontSize: '16px',
  fontWeight: 'bold',
  paddingY: '10px',
  gap: '20px',
};

export const style_select = {
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
  border: '1px solid #666666',
  height: '30px',
  width: '140px',
};

export const style_menuitem = {
  backgroundColor: '#17181b',
  padding: '5px 10px',
  position: 'relative',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
};

export const style_type_btn_ext = {
  fontSize: '14px',
  boxShadow: 'none',
  borderRadius: '10px',
  height: '30px',
  padding: '8px',
  margin: '0 4px',
};

export const style_type_btn_active_ext = {
  ...style_type_btn_ext,
  fontWeight: 'bold',
};

export const style_btn_buy_ext = {
  color: 'white',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '5px',
  backgroundColor: '#1e202d',
  display: 'block',
  margin: 'auto',
  borderRadius: '10px',
};

export const style_box_address = {
  borderRadius: '20px',
  backgroundColor: '#191c20',
  padding: '16px 16px',
  margin: '20px 20px 0',
  alignItems: 'center',
};
