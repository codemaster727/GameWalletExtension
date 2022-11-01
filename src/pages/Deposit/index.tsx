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

Swiper.use([Virtual, Navigation, Pagination]);

const style_box_address = {
  borderRadius: '10px',
  backgroundColor: '#191c20',
  padding: '10px 15px',
  margin: '10px 15px 0',
  alignItems: 'center',
};

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

  const { loading, networkError, priceData, walletData, tokenData } = useSocket();

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

  return (
    <Box className='base-box'>
      <ScrollBox>
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
            sx={{ ...style_select, marginLeft: '20px', marginTop: '15px' }}
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
                  {Icon(token.icon, 15)}
                  &nbsp;
                  {token?.name}
                </MenuItem>
              ))}
          </Select>
        </Box>
        {(activeTokenIndex === 2 || activeTokenIndex === 3) && (
          <div
            style={{
              margin: 'auto',
              marginTop: '10px',
              alignItems: 'center',
              width: 'fit-content',
            }}
          >
            {token_types.map((token_type, index) => (
              <Button
                key={token_type}
                variant='contained'
                size='medium'
                style={
                  index === activeTokenTypeIndex ? style_type_btn_active_ext : style_type_btn_ext
                }
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
            pt={2}
            pb={0.5}
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
              pt={2}
              pb={0.5}
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
              marginTop: '10px',
              alignItems: 'center',
              width: 'fit-content',
            }}
          >
            {token_types_eth.map((token_type, index) => (
              <Button
                key={token_type}
                variant='contained'
                size='medium'
                style={
                  index === activeTokenTypeEthIndex ? style_type_btn_active_ext : style_type_btn_ext
                }
                onClick={() => handleTokenTypeEthChange(index)}
              >
                <Typography variant='h5' fontWeight='bold'>
                  {token_type}
                </Typography>
              </Button>
            ))}
          </div>
        )}
        <Box style={style_box_address}>
          <Typography variant='h5' component='h5' textAlign='center' color='#AAAAAA'>
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
              fontWeight='bold'
              width={230}
              style={{ overflowWrap: 'break-word' }}
            >
              <span style={{ color: '#95f204' }}>{address?.slice(0, 4)}</span>
              {address?.slice(4, -4)}
              <span style={{ color: '#95f204' }}>{address?.slice(-4)}</span>
            </Typography>
            <Button style={style_btn_copy} onClick={copyAddress}>
              <ContentCopyIcon fontSize='large' />
            </Button>
          </Box>
          <Box textAlign='center' mt={1}>
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
            mt={1}
            component='article'
            color='#A9ADBD'
            width='100%'
          >
            Send the amount of
            {` ${activeToken.name} `}
            of your choice to the following address to receive the equivalent in Coins.
          </Typography>
        </Box>
      </ScrollBox>
      {/* <hr style={{ background: 'grey', height: '0.1px', border: 'none' }} /> */}
      <Box className='bottom-box'>
        <Button style={style_btn_buy_ext} onClick={() => alert('Working now. Please wait.')}>
          BUY CRYPTO
        </Button>
      </Box>
    </Box>
  );
};

export default Deposit;
