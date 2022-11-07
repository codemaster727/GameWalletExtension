import React, { useEffect, useRef, useState } from 'react';
import { Button, Box, Grid, Typography } from '@mui/material';
import QRCode from 'qrcode';
import { url } from 'inspector';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import BitcoinIcon from '../../assets/coingroup/bitcoin.svg';
import EthIcon from '../../assets/coingroup/ethereum.svg';
import UsdtIcon from '../../assets/coingroup/usdt.svg';
import UsdcIcon from '../../assets/coingroup/usdc.svg';
import BnbIcon from '../../assets/coingroup/bnb.svg';
import LtcIcon from '../../assets/coingroup/litecoin.svg';
// import SolIcon from '../../assets/coingroup/sol.svg';
import SolIcon from '../../assets/coingroup/sol.png';
import TezosIcon from '../../assets/coingroup/tezos.png';
import OptimismIcon from '../../assets/coingroup/optimism.svg';
import PaymentImage from '../../assets/coingroup/payment.png';
import { useSocket } from '../../context/SocketProvider';
import { PrevButtonForSwiper, NextButtonForSwiper } from '../Buttons/ImageButton';
import { style_btn } from '../styles';

Swiper.use([Virtual, Navigation, Pagination]);

const style_btn_active = {
  ...style_btn,
  backgroundColor: '#3c3c41',
};

const style_type_btn = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '14px',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '80px',
  margin: '0 5px',
  paddingTop: '8px',
  paddingBottom: '8px',
};

const style_type_btn_active = {
  ...style_type_btn,
  backgroundColor: '#374b21',
  border: '1px solid #84d309',
  fontWeight: 'bold',
  color: 'white',
};

const style_box_address = {
  borderRadius: '10px',
  backgroundColor: '#191c20',
  padding: '30px 20px',
  width: '500px',
  margin: 'auto',
  marginTop: '10px',
  display: 'flex',
  // gridTemplateColumns: '0.5fr 164px',
  gap: '40px',
};

const style_btn_copy = {
  borderRadius: '20px',
  color: '#7F7F7F',
  backgroundColor: '#333333',
  fontSize: '16px',
  padding: '10px 20px',
  marginTop: '60px',
};

const style_btn_buy = {
  color: 'white',
  fontSize: '15px',
  fontWeight: 'bold',
  padding: '10px 20px',
  backgroundColor: '#1e202d',
  display: 'block',
  margin: 'auto',
  borderRadius: '10px',
};

const Icon = (icon: any) => (
  <img alt='icon' src={icon} width='30px' style={{ borderRadius: '20px', minWidth: '30px' }} />
);

const tokens = [
  {
    name: 'BTC',
    label: 'Bitcoin',
    icon: BitcoinIcon,
  },
  {
    name: 'ETH',
    label: 'Ethereum',
    icon: EthIcon,
  },
  {
    name: 'USDT',
    label: 'USDT',
    icon: UsdtIcon,
  },
  {
    name: 'USDC',
    label: 'USDC',
    icon: UsdcIcon,
  },
  {
    name: 'BNB',
    label: 'BNB',
    icon: BnbIcon,
  },
  {
    name: 'LTC',
    label: 'Litecoin',
    icon: LtcIcon,
  },
  {
    name: 'SOL',
    label: 'Solana',
    icon: SolIcon,
  },
  {
    name: 'XTZ',
    label: 'Tezos',
    icon: TezosIcon,
  },
  {
    name: 'OP',
    label: 'Optimism',
    icon: OptimismIcon,
  },
];

const addresses = {
  BTC: '3KzxwsemrrFDFvdZYdT3BGqVW2cPhjBbxn',
  ETH: '0x5CbF00B2B08A54F59b7dcb53AE4C2c3718204DC1',
  USDT: '0x5CbF00B2B08A54F59b7dcb53AE4C2c3718204DC1',
  USDC: '0x5CbF00B2B08A54F59b7dcb53AE4C2c3718204DC1',
  TRC: 'TQnULvAtSP21dHApZNTHizuyFcvsP4juNj',
  BNB: '0x5CbF00B2B08A54F59b7dcb53AE4C2c3718204DC1',
  LTC: 'M8zU1MGWge3uLU2nQxg8TZ1Gw9UkFbeHZh',
  SOL: '5c9ErF1ddCydhbnfDnsk7poXcb6JL3UaLX1wfb1qnSWZ',
  XTZ: '5c9ErF1ddCydhbnfDnsk7poXcb6JL3UaLX1wfb1qnSWZ',
  OP: '0x5CbF00B2B08A54F59b7dcb53AE4C2c3718204DC1',
};

const token_types = ['ERC20', 'BEP20', 'TRC20', 'Polygon'];
const token_types_eth = ['Ethereum', 'Arbitrum'];

const Deposit = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);
  const [activeTokenTypeIndex, setActiveTokenTypeIndex] = useState<number>(0);
  const [activeTokenTypeEthIndex, setActiveTokenTypeEthIndex] = useState<number>(0);
  const [activeNet, setActiveNet] = useState<number>(6);

  const { loading, networkError, priceData, walletData, tokenData } = useSocket();

  const activeToken = tokens[activeTokenIndex];

  const address: any = walletData[activeNet.toString()];

  const handleTokenChange = (index: number) => {
    if (index !== activeTokenIndex) {
      setActiveTokenIndex(index);
    }
  };

  const handleTokenTypeChange = (index: number) => {
    if (index !== activeTokenTypeIndex) {
      setActiveTokenTypeIndex(index);
    }
  };

  const handleTokenTypeEthChange = (index: number) => {
    if (index !== activeTokenTypeEthIndex) {
      setActiveTokenTypeEthIndex(index);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  useEffect(() => {
    const container = document.getElementById('qrcode');
    if (container?.childNodes[0]) container?.removeChild(container?.childNodes[0]);
    if (!networkError && !loading && address) {
      QRCode?.toCanvas(address, { errorCorrectionLevel: 'H' }, function (err: any, canvas: any) {
        if (err) throw err;

        canvas.style.borderRadius = '20px';
        canvas.style.width = '180px';
        canvas.style.height = '180px';
        container?.appendChild(canvas);
      });
    } else {
      // container?.appendChild();
    }
  }, [address, networkError, loading]);

  useEffect(() => {
    let net = 1;
    if (activeTokenIndex === 0) net = 6;
    else if (activeTokenIndex === 1 || activeTokenIndex === 4 || activeTokenIndex === 8) net = 1;
    else if (activeTokenIndex === 2 || activeTokenIndex === 3) {
      net = activeTokenTypeIndex === 2 ? 7 : 1;
    } else if (activeTokenIndex === 5) net = 8;
    else if (activeTokenIndex === 6) net = 9;
    else if (activeTokenIndex === 7) net = 10;
    if (net !== activeNet) {
      setActiveNet(net);
    }
  }, [activeTokenIndex, activeTokenTypeIndex, activeTokenTypeEthIndex]);

  return (
    <Box p='20px'>
      <Box p='10px 20px' position='relative'>
        <PrevButtonForSwiper />
        <NextButtonForSwiper />
        <SwiperReact
          modules={[Pagination, Navigation]}
          pagination={{ clickable: false, el: '.pagination' }}
          spaceBetween={1}
          slidesPerView={6}
          allowSlideNext
          centeredSlides={false}
          cardsEffect={{ perSlideOffset: 0 }}
          virtual
          navigation={{
            nextEl: '.hl-swiper-next',
            prevEl: '.hl-swiper-prev',
          }}
          breakpoints={{
            360: {
              slidesPerView: 3,
            },
            576: {
              slidesPerView: 4,
            },
            720: {
              slidesPerView: 5,
            },
            992: {
              slidesPerView: 6,
            },
          }}
          style={{ margin: '0 45px 0 43px' }}
        >
          {tokenData &&
            'map' in tokenData &&
            tokenData?.map((token: any, index: any) => (
              <SwiperSlide key={token.name} virtualIndex={index}>
                <Button
                  key={token.name}
                  variant='contained'
                  startIcon={Icon(token.icon)}
                  style={index === activeTokenIndex ? style_btn_active : style_btn}
                  onClick={(e) => handleTokenChange(index)}
                >
                  {token.name}
                </Button>
              </SwiperSlide>
            ))}
        </SwiperReact>
      </Box>
      {(activeTokenIndex === 2 || activeTokenIndex === 3) && (
        <div
          style={{
            margin: 'auto',
            marginTop: '20px',
            alignItems: 'center',
            width: 'fit-content',
          }}
        >
          {token_types.map((token_type, index) => (
            <Button
              key={token_type}
              variant='contained'
              size='medium'
              style={index === activeTokenTypeIndex ? style_type_btn_active : style_type_btn}
              onClick={() => handleTokenTypeChange(index)}
            >
              <Typography variant='h5' fontWeight='bold'>
                {token_type}
              </Typography>
            </Button>
          ))}
        </div>
      )}
      {activeTokenIndex !== 2 &&
      activeTokenIndex !== 3 &&
      (loading || priceData[activeToken.name.concat('-USD')] === undefined) ? (
        <Typography
          variant='h4'
          component='h4'
          textAlign='center'
          mt={2.6}
          mb={2.7}
          color='#A9ADBD'
        >
          Loading...
        </Typography>
      ) : (
        activeTokenIndex !== 2 &&
        activeTokenIndex !== 3 && (
          <Typography
            variant='h4'
            component='h4'
            textAlign='center'
            mt={2.6}
            mb={2.7}
            color='#A9ADBD'
          >
            {`1 ${activeToken.name} = $${priceData[activeToken.name.concat('-USD')]} USD`}
          </Typography>
        )
      )}
      {activeTokenIndex === 1 && (
        <div
          style={{
            margin: 'auto',
            marginTop: '20px',
            alignItems: 'center',
            width: 'fit-content',
          }}
        >
          {token_types_eth.map((token_type, index) => (
            <Button
              key={token_type}
              variant='contained'
              size='medium'
              style={index === activeTokenTypeEthIndex ? style_type_btn_active : style_type_btn}
              onClick={() => handleTokenTypeEthChange(index)}
            >
              <Typography variant='h5' fontWeight='bold'>
                {token_type}
              </Typography>
            </Button>
          ))}
        </div>
      )}
      <Box mt={2} style={style_box_address}>
        <div style={{ width: 'calc(100% - 248px)' }}>
          <Typography variant='h5' component='h5' textAlign='left' color='#AAAAAA'>
            Deposit address
          </Typography>
          <Typography
            variant='h5'
            component='article'
            textAlign='left'
            fontWeight='bold'
            mt={2}
            style={{ overflowWrap: 'break-word' }}
          >
            <span style={{ color: '#0abab5' }}>{address?.slice(0, 4)}</span>
            {address?.slice(4, -4)}
            <span style={{ color: '#0abab5' }}>{address?.slice(-4)}</span>
          </Typography>
          <Button style={style_btn_copy} onClick={copyAddress}>
            COPY
          </Button>
        </div>
        <div>
          <div
            id='qrcode'
            style={{
              marginRight: 'auto',
              padding: '10px',
              paddingBottom: 'calc(10px - 4px)',
              borderRadius: '20px',
              backgroundColor: '#555555',
            }}
          />
        </div>
      </Box>
      <Typography
        variant='h6'
        textAlign='center'
        mt={2}
        padding='0 40px'
        fontSize='1.40px'
        component='article'
        color='#A9ADBD'
      >
        Send the amount of
        {` ${activeToken.name} `}
        of your choice to the following address to receive the equivalent in Coins.
      </Typography>
      <Grid container justifyContent='center' alignItems='center' mt={4}>
        <Grid item xs={4}>
          <Typography
            variant='h5'
            component='article'
            textAlign='center'
            color='#A9ADBD'
            fontWeight='bold'
          >
            {`Don't have any ${activeToken?.label}?`}
          </Typography>
        </Grid>
        <Grid item xs={4} alignContent='center' justifyContent='center'>
          <Button style={style_btn_buy} onClick={() => alert('Working now. Please wait.')}>
            BUY CRYPTO
          </Button>
        </Grid>
        <Grid item xs>
          <img alt='payment' src={PaymentImage} height='32px' />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Deposit;
