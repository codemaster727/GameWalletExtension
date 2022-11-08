import React, { useEffect, useRef, useState } from 'react';
import { Button, Box, Grid, Select, Typography, MenuItem, OutlinedInput } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QRCode from 'qrcode';
import { url } from 'inspector';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import BitcoinIcon from 'src/assets/coingroup/bitcoin.svg';
import EthIcon from 'src/assets/coingroup/ethereum.svg';
import UsdtIcon from 'src/assets/coingroup/usdt.svg';
import UsdcIcon from 'src/assets/coingroup/usdc.svg';
import BnbIcon from 'src/assets/coingroup/bnb.svg';
import LtcIcon from 'src/assets/coingroup/litecoin.svg';
// import SolIcon from 'src/assets/coingroup/sol.svg';
import SolIcon from 'src/assets/coingroup/sol.png';
import TezosIcon from 'src/assets/coingroup/tezos.png';
import OptimismIcon from 'src/assets/coingroup/optimism.svg';
import PaymentImage from 'src/assets/coingroup/payment.png';
import { useSocket } from 'src/context/SocketProvider';
import { PrevButtonForSwiper, NextButtonForSwiper } from 'src/components/Buttons/ImageButton';
import {
  style_box_address,
  style_btn,
  style_btn_buy_ext,
  style_menuitem,
  style_select,
  style_type_btn_active_ext,
  style_type_btn_ext,
} from 'src/components/styles';
import Icon from '~/components/Icon';
import { MenuProps, token_types, token_types_eth } from '~/constants';
import ScrollBox from '~/components/Layout/ScrollBox';
import {} from 'src/components/styles';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { Rings } from 'react-loading-icons';

Swiper.use([Virtual, Navigation, Pagination]);

const style_btn_copy = {
  borderRadius: '20px',
  minWidth: 'fit-content',
  color: '#7F7F7F',
  backgroundColor: 'transparent',
  fontSize: '24px',
  padding: '0',
};

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

const Deposit = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);
  const [activeTokenTypeIndex, setActiveTokenTypeIndex] = useState<number>(0);
  const [activeTokenTypeEthIndex, setActiveTokenTypeEthIndex] = useState<number>(0);
  const [activeNet, setActiveNet] = useState<number>(6);

  const { token } = useParams();
  console.log(token);

  const { loading, networkError, priceData, walletData, tokenData } = useSocket();
  const theme = useTheme();

  const activeToken = tokens[activeTokenIndex];

  const address: any = walletData[activeNet.toString()];

  const handleTokenChange = (event: SelectChangeEvent<typeof activeTokenIndex>) => {
    const {
      target: { value },
    } = event;
    setActiveTokenIndex(value as number);
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
        canvas.style.width = '160px';
        canvas.style.height = '160px';
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

  useEffect(() => {
    setActiveTokenIndex(parseInt(token ?? '0'));
  }, [token]);

  return (
    <Box className='base-box'>
      <ScrollBox height={480}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          sx={{ margin: '8px 20px' }}
        >
          <Link to='/balances'>
            <Button
              variant='contained'
              color='secondary'
              className='balance-btn'
              sx={{ color: theme.palette.text.secondary, fontSize: '14px' }}
            >
              Balance
            </Button>
          </Link>
          <Box className='currency_select'>
            <Select
              value={activeTokenIndex}
              onChange={handleTokenChange}
              input={<OutlinedInput />}
              renderValue={(selected: number) => {
                const token = tokenData[selected];
                return (
                  token && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {Icon(token?.icon, 18)}
                      &nbsp;
                      {token?.name}
                    </Box>
                  )
                );
              }}
              MenuProps={MenuProps}
              // IconComponent={() => DownIcon(DownArrowImage, 12)}
              // IconComponent={() => <ExpandMoreIcon />}
              // IconComponent={() => <Person />}
              sx={style_select}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {tokenData &&
                'map' in tokenData &&
                tokenData?.map((token: any, index: number) => (
                  <MenuItem
                    className='menuitem-currency'
                    key={token?.id}
                    value={index}
                    sx={style_menuitem}
                  >
                    {Icon(token.icon, 18)}
                    &nbsp;
                    {token?.name}
                  </MenuItem>
                ))}
            </Select>
          </Box>
        </Box>
        <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
        {(activeTokenIndex === 2 || activeTokenIndex === 3) && (
          <div
            style={{
              margin: 'auto',
              marginTop: '20px',
              alignItems: 'center',
            }}
          >
            <Box m='10px 20px' position='relative'>
              <PrevButtonForSwiper />
              <NextButtonForSwiper />
              <SwiperReact
                modules={[Pagination, Navigation]}
                pagination={{ clickable: false, el: '.pagination' }}
                spaceBetween={1}
                slidesPerView={3}
                allowSlideNext
                centeredSlides={false}
                cardsEffect={{ perSlideOffset: 0 }}
                virtual
                draggable={false}
                allowTouchMove={false}
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
                style={{ margin: '0 35px' }}
              >
                {token_types.map((token_type, index) => (
                  <SwiperSlide key={'swiper' + token_type} virtualIndex={index}>
                    <ButtonWithActive
                      isActive={index === activeTokenTypeIndex}
                      size='large'
                      width={60}
                      handleFn={() => handleTokenTypeChange(index)}
                      label={token_type}
                    />
                  </SwiperSlide>
                ))}
              </SwiperReact>
            </Box>
          </div>
        )}
        {activeTokenIndex !== 2 &&
        activeTokenIndex !== 3 &&
        (loading || priceData[activeToken.name.concat('-USD')] === undefined) ? (
          <Rings style={{ marginTop: '50%' }} />
        ) : (
          activeTokenIndex !== 2 &&
          activeTokenIndex !== 3 && (
            <Typography
              variant='h4'
              component='h4'
              textAlign='center'
              pt={2}
              pb={0.5}
              color='#A9ADBD'
              fontSize='15px'
            >
              {`1 ${activeToken.name} = $${priceData[activeToken.name.concat('-USD')]} USD`}
            </Typography>
          )
        )}
        {activeTokenIndex === 1 && (
          <div
            style={{
              margin: 'auto',
              marginTop: '10px',
              alignItems: 'center',
              width: 'fit-content',
            }}
          >
            {token_types_eth.map((token_type: string, index: number) => (
              <ButtonWithActive
                isActive={index === activeTokenTypeEthIndex}
                size='large'
                width={80}
                handleFn={() => handleTokenTypeEthChange(index)}
                label={token_type}
              />
            ))}
          </div>
        )}
        <Box style={style_box_address}>
          <Typography
            variant='h5'
            component='h5'
            textAlign='center'
            color='#AAAAAA'
            fontSize='14px'
          >
            Deposit address
          </Typography>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            sx={{ gap: '10px' }}
            mt={1}
          >
            <Typography
              variant='h5'
              component='article'
              textAlign='left'
              fontWeight='normal'
              fontFamily='Arial, sans-serif'
              letterSpacing={0.5}
              width={230}
              fontSize='14px'
              style={{ overflowWrap: 'break-word' }}
            >
              <span style={{ color: '#0abab5' }}>{address?.slice(0, 4)}</span>
              {address?.slice(4, -4)}
              <span style={{ color: '#0abab5' }}>{address?.slice(-4)}</span>
            </Typography>
            <Button style={style_btn_copy} onClick={copyAddress}>
              <ContentCopyIcon fontSize='large' color='info' />
            </Button>
          </Box>
          <Box textAlign='center' mt={1.5}>
            <div
              id='qrcode'
              style={{
                margin: 'auto',
                padding: '10px',
                width: 'fit-content',
                paddingBottom: 'calc(10px - 4px)',
                borderRadius: '20px',
                backgroundColor: '#555555',
              }}
            />
          </Box>
          <Typography
            variant='h6'
            textAlign='center'
            mt={1.5}
            component='article'
            color='#AAAAAA'
            width='100%'
            fontSize='11px'
          >
            Send
            {` ${activeToken.name} `}
            to the above address to deposit the equivalent token.
          </Typography>
        </Box>
      </ScrollBox>
      {/* <hr style={{ background: 'grey', height: '0.1px', border: 'none' }} /> */}
      {/* <Box className='bottom-box'>
        <Button style={style_btn_buy_ext} onClick={() => alert('Working now. Please wait.')}>
          BUY CRYPTO
        </Button>
      </Box> */}
    </Box>
  );
};

export default Deposit;
