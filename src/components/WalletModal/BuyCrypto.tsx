import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';

import MoonpayIcon from '../../assets/coingroup/moonpay.png';
import ChainbitsIcon from '../../assets/coingroup/chainbits.png';
import PaybisIcon from '../../assets/coingroup/paybis.png';

const style_btn = {
  backgroundColor: 'white',
  color: '#F2F2F288',
  fontSize: '12px',
  borderRadius: '10px',
  padding: 0,
  height: 'fit-content',
  lineHeight: 0,
};

const style_btn_active = {
  backgroundColor: 'white',
  color: '#F2F2F288',
  fontSize: '12px',
  fontWeight: 'bold',
  borderRadius: '10px',
  padding: 0,
  height: 'fit-content',
  lineHeight: 0,
};

const Icon = (icon: any) => (
  <img
    id='u7_img'
    className='img'
    alt='BTCIcon'
    src={icon}
    width='30px'
    style={{ borderRadius: '20px' }}
  />
);

const payments = [
  {
    name: 'MoonPay',
    icon: MoonpayIcon,
    url: 'https://www.moonpay.com/',
  },
  {
    name: 'CHAINBITS',
    icon: ChainbitsIcon,
    url: 'https://www.chainbits.com/',
  },
  {
    name: 'paybis',
    icon: PaybisIcon,
    url: 'https://paybis.com/',
  },
];

const BuyCrypto = ({ handleClose }: any) => {
  const [activePaymentIndex, setActivePaymentIndex] = useState(0);

  const handleTokenChange = (index: number) => {
    if (index !== activePaymentIndex) {
      setActivePaymentIndex(index);
    }
  };

  return (
    <Box p='20px 40px 40px 40px'>
      <Typography variant='h4' fontWeight='bold' fontStyle='italic' margin={0}>
        BUY CRYPTO USING CARDS
      </Typography>
      <Typography
        variant='h5'
        component='article'
        textAlign='left'
        mt={2}
        mb={2}
        color='white'
        fontWeight='bold'
      >
        While we look for a reliable card payment processor, you can purchase crypto using your card
        via the recommended third-party services below. After purchasing the crypto, you can deposit
        it directly to your Rollbit account.
      </Typography>
      <div style={{ display: 'flex', gap: '40px' }}>
        {payments?.map((payment, index) => (
          <Button
            key={payment.name}
            variant='contained'
            style={index === activePaymentIndex ? style_btn_active : style_btn}
            // onClick={() => handleTokenChange(index)}
          >
            <a href={payment.url} target='_blank' rel='noreferrer'>
              <img
                alt='BTCIcon'
                src={payment.icon}
                height='40px'
                style={{ borderRadius: '10px' }}
              />
            </a>
          </Button>
        ))}
      </div>
      {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </Typography> */}
    </Box>
  );
};

export default BuyCrypto;
