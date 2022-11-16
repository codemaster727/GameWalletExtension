import React, { useState } from 'react';
import { Button, Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MoonpayIcon from '../../assets/coingroup/moonpay.png';
import ChainbitsIcon from '../../assets/coingroup/chainbits.png';
import PaybisIcon from '../../assets/coingroup/paybis.png';

const style_type_btn = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '14px',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '80px',
  margin: '10px 5px',
  paddingTop: '4px',
  paddingBottom: '4px',
};

const style_btn = {
  backgroundColor: 'white',
  color: '#F2F2F288',
  fontSize: '14px',
  borderRadius: '10px',
  padding: 0,
  height: 'fit-content',
  width: 'fit-content',
  lineHeight: 0,
  marginBottom: '20px',
};

const style_btn_active = {
  ...style_btn,
  backgroundColor: 'white',
  color: '#F2F2F288',
  fontSize: '14px',
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

  const theme = useTheme();

  const handleTokenChange = (index: number) => {
    if (index !== activePaymentIndex) {
      setActivePaymentIndex(index);
    }
  };

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        sx={{ margin: '8px 20px' }}
      >
        <Link to='/balances/0'>
          <Button
            variant='contained'
            color='secondary'
            className='balance-btn'
            sx={{ color: theme.palette.text.secondary, fontSize: '14px' }}
          >
            Balance
          </Button>
        </Link>
      </Box>
      <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
      <Typography variant='h5' fontWeight='bold' margin={0} mt={2}>
        BUY CRYPTO USING CARDS
      </Typography>
      <Typography
        variant='h6'
        component='article'
        textAlign='left'
        m={2}
        color='white'
        fontWeight='400'
        fontSize='14px'
      >
        You can purchase crypto using your card via the recommended third-party services below.
        After purchasing the crypto, you can deposit it directly to your wallet account.
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
