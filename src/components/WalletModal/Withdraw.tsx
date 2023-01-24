import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  InputBase,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { grey } from '@mui/material/colors';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import NumberFormat, { InputAttributes, NumericFormat } from 'react-number-format';
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
import LeftArrowImage from '../../assets/utils/line-angle-left-icon.svg';
import RightArrowImage from '../../assets/utils/line-angle-right-icon.svg';
import PaymentImage from '../../assets/coingroup/payment.png';
import ConfirmBtn from '../../assets/coingroup/confirmBtn.png';
import { useSocket } from '../../context/SocketProvider';
import { NextButtonForSwiper, PrevButtonForSwiper } from '../Buttons/ImageButton';
import { style_input_paper } from '../styles';

Swiper.use([Virtual, Navigation, Pagination]);

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const style_btn = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '100px',
  height: '50px',
  margin: '0 0.5rem',
};

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
  margin: '0 0.5rem',
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
  backgroundColor: 'transparent',
  padding: '30px 20px',
  width: '500px',
  margin: 'auto',
  marginTop: '10px',
};

const style_btn_buy = {
  color: 'white',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '10px 20px',
  backgroundColor: '#1e202d',
  display: 'block',
  margin: 'auto',
  borderRadius: '10px',
};

const style_btn_toggle = {
  color: '#AAAAAA',
  fontSize: '14px',
  margin: '2px',
  backgroundColor: grey[800],
  height: '30px',
  width: '40px',
};

const style_textfield = {
  ml: 1,
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
};

const Icon = (icon: any) => (
  <img alt='icon' src={icon} width='30px' style={{ borderRadius: '20px', minWidth: '30px' }} />
);

const init_tokens = [
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
  BNB: '0x5CbF00B2B08A54F59b7dcb53AE4C2c3718204DC1',
  LTC: 'M8zU1MGWge3uLU2nQxg8TZ1Gw9UkFbeHZh',
  SOL: '5c9ErF1ddCydhbnfDnsk7poXcb6JL3UaLX1wfb1qnSWZ',
};

const token_types = ['ERC20', 'BEP20', 'TRC20', 'Polygon'];
const token_types_eth = ['Ethereum', 'Arbitrum'];

const Withdraw = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [activeNet, setActiveNet] = useState<number>(6);
  const [percent, setPercent] = useState<string>('');
  const [activeTokenTypeIndex, setActiveTokenTypeIndex] = useState(0);
  const [address, setAddress] = useState<string>('0x0fbd6e14566A30906Bc0c927a75b1498aE87Fd43');
  const [amount, setAmount] = useState<string>('0.0001');
  const [error, setError] = useState<any>({});
  const [activeTokenTypeEthIndex, setActiveTokenTypeEthIndex] = useState<number>(0);

  const theme = useTheme();

  const { networkError, balanceData, tokenData } = useSocket();

  const activeToken = tokenData[activeTokenIndex];

  const handleTokenChange = (index: number) => {
    if (index !== activeTokenIndex) {
      setActiveTokenIndex(index);
    }
  };

  const handlePercentChange = (e: any) => {
    const p = e.target.value;
    setPercent(p);
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

  const handleChangeAddressInput = (e: any) => {
    const { value } = e.target;
    if (address !== value) {
      setAddress(value);
    }
  };

  const handleChangeAmountInput = (e: any) => {
    const { value }: { value: string } = e.target;
    if (amount !== value) {
      setAmount(value);
    }
  };

  const validate = (addr: string | undefined, amnt: string | undefined, net: number) => {
    if (net === 3 || net === 5 || net === 6 || net === 7 || net === 8 || net === 10) {
      setError('Not supported yet. Please wait to complete.');
      return false;
    }
    const am = parseFloat(amnt as string);
    if (!addr) {
      setError('Invalid address.');
      return false;
    }
    if (!am || am <= 0 || am > Math.min(balanceData[activeToken?.id], 0.01)) {
      setError('Invalid amount.');
      return false;
    }
    setError('');
    return true;
  };

  const sendRequestWithdraw = () => {
    if (validate(address, amount, activeNet)) {
      // withdrawMutate({
      //   user: '1',
      //   net: activeNet.toString(),
      //   asset: activeToken.id,
      //   amount: parseFloat(amount),
      //   receiver: address, // SOL address
      // });
    }
  };

  useEffect(() => {
    const token_id = parseInt(activeToken?.id, 10);
    if (token_id === 1) setActiveNet(6);
    else if (token_id === 5) setActiveNet(2);
    else if (token_id === 6) setActiveNet(7);
    else if (token_id === 7) setActiveNet(9);
    else if (token_id === 8) setActiveNet(10);
    else if (token_id === 9) setActiveNet(5);
    else if (token_id === 2) {
      if (activeTokenTypeEthIndex === 0) setActiveNet(1);
      else if (activeTokenTypeEthIndex === 1) setActiveNet(3);
    } else if (token_id === 3 || token_id === 4) {
      if (activeTokenTypeIndex === 0) setActiveNet(1);
      else if (activeTokenTypeIndex === 1) setActiveNet(2);
      else if (activeTokenTypeIndex === 2) setActiveNet(7);
      else if (activeTokenTypeIndex === 3) setActiveNet(4);
    }
  }, [activeTokenTypeIndex, activeTokenTypeEthIndex, activeToken]);

  useEffect(() => {
    if (percent === '' || percent === '0') return;
    setAmount(
      (
        Math.floor(
          ((parseFloat(balanceData[activeToken?.id]) * parseFloat(percent)) / 100) * 100000,
        ) / 100000
      ).toString(),
    );
  }, [percent]);

  return (
    <Box p='20px 20px 10px'>
      <Box>
        <Box p='10px 20px' position='relative'>
          <div style={{ height: 'fit-content' }}>
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
                tokenData?.map((token: any, index: number) => (
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
          </div>
        </Box>
        <Typography
          variant='h6'
          component='article'
          textAlign='left'
          fontWeight='bold'
          fontSize='18px'
          alignItems='center'
          mt={2.2}
          style={{ overflowWrap: 'break-word', textAlign: 'center' }}
        >
          Current balance:&nbsp;
          <span style={{ color: '#0abab5' }}>
            {balanceData[activeToken?.id] ?? '0'}
            &nbsp;
            {activeToken?.name}
          </span>
        </Typography>
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
                <Typography variant='h6' fontWeight='bold'>
                  {token_type}
                </Typography>
              </Button>
            ))}
          </div>
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
                <Typography variant='h6' fontWeight='bold'>
                  {token_type}
                </Typography>
              </Button>
            ))}
          </div>
        )}
        {networkError ? (
          <Box>Network error...</Box>
        ) : (
          <Box mt={2} style={style_box_address}>
            <Typography variant='h6' component='h6' textAlign='left' color='#AAAAAA' mb={1}>
              Withdraw address
            </Typography>
            <Paper component='form' sx={style_input_paper}>
              <InputBase
                sx={style_textfield}
                fullWidth
                placeholder='Fill in carefully according to the specific currency'
                inputProps={{
                  'aria-label': 'withdraw address',
                }}
                value={address}
                onChange={handleChangeAddressInput}
              />
            </Paper>
            {error ? (
              <Typography
                variant='h6'
                component='h6'
                textAlign='left'
                fontWeight='bold'
                alignItems='center'
                mt={2}
                // color={theme.palette.error.main}
                style={{ overflowWrap: 'break-word' }}
              >
                {error}
              </Typography>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                variant='h6'
                component='h6'
                textAlign='left'
                color='#AAAAAA'
                mt={2}
                mb={1}
              >
                Withdraw amount
              </Typography>
              <Typography
                variant='h6'
                component='h6'
                textAlign='left'
                color='#AAAAAA'
                mt={2}
                mb={1}
              >
                Min: 101.6725 (0.00001 for test mode)
              </Typography>
            </div>
            <Paper component='form' sx={style_input_paper}>
              <NumericFormat
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  paddingLeft: '10px',
                }}
                thousandSeparator
                decimalScale={5}
                value={amount}
                onChange={handleChangeAmountInput}
                // prefix="$"
              />
              {/* <InputBase
              sx={style_textfield}
              placeholder="Amount to withdraw"
              inputProps={{
                'aria-label': 'amount to withdraw',
              }}
              value={amount}
              componentsProps={{
                root: (
                  <NumericFormat
                    value="20020220"
                    allowLeadingZeros
                    thousandSeparator=","
                  />
                ),
              }}
              onChange={handleChangeAmountInput}
            /> */}
              <ToggleButtonGroup
                value={percent}
                exclusive
                onChange={handlePercentChange}
                aria-label='text alignment'
                color='success'
                sx={{
                  marginRight: '0',
                  borderRadius: '15px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                }}
              >
                <ToggleButton
                  value='0.01'
                  aria-label='left aligned'
                  sx={{ ...style_btn_toggle, borderRadius: '15px' }}
                >
                  Min
                </ToggleButton>
                <ToggleButton value='25' aria-label='centered' sx={style_btn_toggle}>
                  25%
                </ToggleButton>
                <ToggleButton value='50' aria-label='right aligned' sx={style_btn_toggle}>
                  50%
                </ToggleButton>
                <ToggleButton
                  value='100'
                  aria-label='justified'
                  sx={{ ...style_btn_toggle, borderRadius: '15px' }}
                >
                  Max
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
            <Typography
              variant='h5'
              component='h5'
              textAlign='left'
              fontWeight='bold'
              alignItems='center'
              mt={3}
              mb={2}
              style={{ overflowWrap: 'break-word', textAlign: 'center' }}
            >
              Fee&nbsp;
              <span style={{ color: '#0abab5' }}>
                {1}
                &nbsp;
                {activeToken?.name}
              </span>
            </Typography>
            {/* {withdrawIsLoading ? (
              <Button
                sx={{
                  backgroundImage: `url(${ConfirmBtn})`,
                  backgroundSize: 'stretch',
                  width: '325px',
                  height: '56px',
                  color: 'white',
                  margin: 'auto',
                  borderRadius: '50px',
                  display: 'block',
                  opacity: 0.3,
                }}
                disabled={withdrawIsLoading}
                onClick={sendRequestWithdraw}
              />
            ) : (
              <Button
                sx={{
                  backgroundImage: `url(${ConfirmBtn})`,
                  backgroundSize: 'stretch',
                  width: '325px',
                  height: '56px',
                  color: 'white',
                  margin: 'auto',
                  borderRadius: '50px',
                  display: 'block',
                }}
                onClick={sendRequestWithdraw}
              />
            )} */}
            {/* <Typography
              variant='h6'
              textAlign='left'
              padding='0'
              fontSize='14px'
              component='article'
              color='#A9ADBD'
              mt={2}
            >
              For security purposes, large or suspicious withdrawal may take 1-6 hours for audit
              process. We appreciate your patience!
            </Typography> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Withdraw;
