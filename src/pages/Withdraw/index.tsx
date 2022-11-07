import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  MenuItem,
  OutlinedInput,
  Paper,
  InputBase,
  Select,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import { NumericFormat } from 'react-number-format';

import { useSocket } from 'src/context/SocketProvider';
import ScrollBox from '~/components/Layout/ScrollBox';
import Icon from '~/components/Icon';
import { MenuProps } from '~/constants';
import { style_box_address, style_menuitem, style_select } from '~/components/styles';
import { useTheme } from '@mui/material';
import { style_type_btn_ext, style_type_btn_active_ext } from 'src/components/styles';
import { Link, useParams } from 'react-router-dom';
import { NextButtonForSwiper, PrevButtonForSwiper } from '~/components/Buttons/ImageButton';

Swiper.use([Virtual, Navigation, Pagination]);

const style_btn_toggle = {
  color: '#AAAAAA',
  fontSize: '12px',
  margin: '2px',
  backgroundColor: '#333333',
  height: '20px',
  width: '40px',
};

const style_textfield = {
  color: 'white',
  fontSize: '11px',
  fontWeight: 'bold',
};

const style_input_paper = {
  padding: '2px 8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#191c20',
  boxSizing: 'border-box',
  border: '3px solid #333333',
  borderRadius: '10px',
  boxShadow: 'none',
  height: '40px',
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

  const { token } = useParams();

  const { networkError, balanceData, tokenData, withdrawMutate, withdrawIsLoading } = useSocket();
  const activeToken = tokenData[activeTokenIndex];

  const theme = useTheme();

  const handleTokenChange = (event: SelectChangeEvent<typeof activeTokenIndex>) => {
    const {
      target: { value },
    } = event;
    setActiveTokenIndex(value as number);
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
      setPercent('');
    }
  };

  const validate = (addr: string | undefined, amnt: string | undefined, net: number) => {
    const am = parseFloat(amnt as string);
    if (!addr) {
      alert('Invalid input.');
      return false;
    }
    if (!am || am <= 0 || am > Math.min(balanceData[activeToken?.id], 0.01)) {
      alert('Invalid input.');
      return false;
    }
    if (net === 3 || net === 5 || net === 6 || net === 7 || net === 8 || net === 10) {
      alert('Not supported yet. Please wait to complete.');
      return false;
    }
    return true;
  };

  const sendRequestWithdraw = () => {
    if (validate(address, amount, activeNet)) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'favicon-32x32.png',
        title: 'Your withdrawal request',
        message: 'After a success withdraw process, you will get tokens soon. Good luck.',
      });
      withdrawMutate({
        user: '1',
        net: activeNet.toString(),
        asset: activeToken.id,
        amount: parseFloat(amount),
        receiver: address, // SOL address
      });
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

  useEffect(() => {
    setActiveTokenIndex(parseInt(token ?? '0'));
  }, [token]);

  return (
    <Box className='base-box'>
      <ScrollBox>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          sx={{ margin: '5px 20px' }}
        >
          <Link to='/balances'>
            <Button
              variant='contained'
              size='medium'
              color='secondary'
              className='balance-btn'
              sx={{ color: theme.palette.text.secondary, fontSize: '14px' }}
            >
              Balances
            </Button>
          </Link>
          <Box className='currency_select' sx={{ margin: 0 }}>
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
              sx={{ ...style_select }}
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
        </Box>
        <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
        <Box>
          <Typography
            variant='h5'
            component='article'
            textAlign='left'
            fontWeight='normal'
            fontSize='16px'
            alignItems='center'
            mt={2}
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
                  {token_types.map((token_type: string, index: number) => (
                    <SwiperSlide key={'swiper' + token_type} virtualIndex={index}>
                      <Button
                        key={token_type}
                        variant={index === activeTokenTypeIndex ? 'outlined' : 'contained'}
                        color={index === activeTokenTypeIndex ? 'primary' : 'secondary'}
                        size='medium'
                        style={
                          index === activeTokenTypeIndex
                            ? style_type_btn_active_ext
                            : style_type_btn_ext
                        }
                        sx={{
                          backgroundColor:
                            index === activeTokenTypeIndex
                              ? theme.palette.primary.main + '20'
                              : theme.palette.secondary.main,
                        }}
                        onClick={() => handleTokenTypeChange(index)}
                      >
                        <Typography variant='h5' component='span' fontWeight='bold'>
                          {token_type}
                        </Typography>
                      </Button>
                    </SwiperSlide>
                  ))}
                </SwiperReact>
              </Box>
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
                  variant={index === activeTokenTypeEthIndex ? 'outlined' : 'contained'}
                  color={index === activeTokenTypeEthIndex ? 'primary' : 'secondary'}
                  size='medium'
                  style={
                    index === activeTokenTypeEthIndex
                      ? style_type_btn_active_ext
                      : style_type_btn_ext
                  }
                  sx={{
                    backgroundColor:
                      index === activeTokenTypeEthIndex
                        ? theme.palette.primary.main + '20'
                        : theme.palette.secondary.main,
                  }}
                  onClick={() => handleTokenTypeEthChange(index)}
                >
                  <Typography variant='h5' fontWeight='bold'>
                    {token_type}
                  </Typography>
                </Button>
              ))}
            </div>
          )}
          {networkError ? (
            <Box>Network error...</Box>
          ) : (
            <Box margin='20px 20px 0' style={{ backgroundColor: 'transparent' }}>
              <Typography variant='h5' component='h5' textAlign='left' color='#AAAAAA' mb={1}>
                Withdraw address
                <span style={{ color: '#0abab5' }}>
                  (Note: Only {tokenData[activeTokenIndex]?.label})
                </span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant='h5'
                  component='h5'
                  textAlign='left'
                  color='#AAAAAA'
                  mt={2}
                  mb={1}
                >
                  Withdraw amount
                </Typography>
                <Typography
                  variant='h5'
                  component='h5'
                  textAlign='left'
                  color='#AAAAAA'
                  mt={2}
                  mb={1}
                >
                  Min: 0.00001
                </Typography>
              </div>
              <Paper component='form' sx={style_input_paper}>
                <NumericFormat
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none',
                    paddingLeft: '0',
                    width: '100px',
                    fontSize: '11px',
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
                    marginRight: '-2px',
                    borderRadius: '15px',
                    color: 'white',
                    backgroundColor: 'transparent',
                    fontSize: '11px',
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
                component='article'
                textAlign='left'
                fontWeight='bold'
                fontSize='18px'
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
              <Typography
                variant='h6'
                textAlign='left'
                padding='0'
                fontSize='12px'
                component='article'
                color='#AAAAAA'
                mt={2}
              >
                For security purposes, large or suspicious withdrawal may take 1-6 hours for audit
                process. <br />
                We appreciate your patience!
              </Typography>
            </Box>
          )}
        </Box>
      </ScrollBox>
      <Box className='bottom-box'>
        <Button
          variant='contained'
          sx={{
            backgroundSize: 'stretch',
            width: '120px',
            height: '30px',
            color: 'white',
            margin: 'auto',
            borderRadius: '8px',
            display: 'block',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: '#0e9d9a',
            // ':hover': {
            //   backgroundColor: '#7eca0b88',
            // },
          }}
          disabled={withdrawIsLoading}
          onClick={sendRequestWithdraw}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default Withdraw;
