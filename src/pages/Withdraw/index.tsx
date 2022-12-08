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
import {
  style_box_address,
  style_input_paper,
  style_menuitem,
  style_select,
} from '~/components/styles';
import { useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { style_type_btn_ext, style_type_btn_active_ext } from 'src/components/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NextButtonForSwiper, PrevButtonForSwiper } from '~/components/Buttons/ImageButton';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';

Swiper.use([Virtual, Navigation, Pagination]);

const style_btn_toggle = {
  color: '#AAAAAA',
  fontSize: '14px',
  margin: '2px',
  backgroundColor: grey[800],
  height: '20px',
  width: '40px',
};

const style_textfield = {
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
};

const Withdraw = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [percent, setPercent] = useState<string>('');
  const [activeTokenTypeIndex, setActiveTokenTypeIndex] = useState(0);
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.0001');
  const [error, setError] = useState<any>({});
  const [isLoading, setIsLoading] = useState<any>(false);
  const [activeNetIndex, setActiveNetIndex] = useState<number>(0);

  const { token } = useParams();

  const {
    networkError,
    balanceData,
    walletArray,
    tokenData,
    netData,
    withdrawMutate,
    withdrawIsLoading,
    withdraw,
  } = useSocket();

  const theme = useTheme();

  const activeToken = (tokenData && tokenData[activeTokenIndex]) ?? {};
  const token_net_ids = Object.keys(activeToken?.address) ?? [];
  const token_nets = netData?.filter((net: any) => token_net_ids.includes(net.id));
  const activeNet = token_nets && token_nets[activeNetIndex];

  const handleTokenChange = (event: SelectChangeEvent<typeof activeTokenIndex>) => {
    const {
      target: { value },
    } = event;
    setActiveTokenIndex(value as number);
    setActiveNetIndex(0);
  };

  const handleNetChange = (index: number) => {
    if (index !== activeNetIndex) {
      setActiveNetIndex(index);
    }
  };

  const handlePercentChange = (e: any) => {
    const p = e.target.value;
    setPercent(p);
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

  const validate = (
    addr: string | undefined,
    amnt: string | undefined,
    net: string,
    token_id: string,
  ) => {
    const am = parseFloat(amnt as string);
    if (!addr) {
      alert('Invalid input.');
      return false;
    }
    if (!am || am <= 0 || am > Math.min(balanceData[activeToken?.id], 0.01)) {
      alert('Invalid input.');
      return false;
    }
    if (net === '3' || net === '5' || net === '6' || net === '7' || net === '8' || net === '10') {
      alert('Not supported yet. Please wait to complete.');
      return false;
    }
    if (token_id === '10') {
      alert('Not supported yet. Please wait to complete.');
      return false;
    }
    return true;
  };

  const sendRequestWithdraw = async () => {
    if (validate(address, amount, activeNet?.id ?? '0', activeToken.id)) {
      balanceData[activeToken.id] -= parseFloat(amount);
      chrome.runtime.sendMessage('test', function (response) {
        console.log(response);
      });
      // chrome.notifications.create({
      //   type: 'basic',
      //   iconUrl: 'favicon-32x32.png',
      //   title: 'Your withdrawal request',
      //   message: 'After a success withdraw process, you will get tokens soon. Good luck.',
      // });
      // withdrawMutate({
      //   user: '1',
      //   net: activeNet.id,
      //   asset: activeToken.id,
      //   amount: parseFloat(amount),
      //   receiver: address, // SOL address
      // });
      setIsLoading(true);
      await withdraw(
        activeNet.id,
        activeToken.id,
        address, // SOL address
        parseFloat(amount),
        walletArray,
        netData,
        tokenData,
      );
      setIsLoading(false);
    }
  };

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
          sx={{ margin: '8px 20px' }}
        >
          <Button
            variant='contained'
            size='medium'
            color='secondary'
            className='balance-btn'
            sx={{ color: theme.palette.text.secondary, fontSize: '14px' }}
            component={Link}
            to='/balances/0'
          >
            Balance
          </Button>

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
                    {Icon(token.icon, 18)}
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
            variant='h6'
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
              {balanceData[activeToken?.id]?.toFixed(5) ?? '0'}
              &nbsp;
              {activeToken?.name}
            </span>
          </Typography>
          {token_nets.length > 2 && (
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
                  {token_nets.map((net: any, index: number) => (
                    <SwiperSlide key={'swiper' + net.name} virtualIndex={index}>
                      <ButtonWithActive
                        isActive={index === activeNetIndex}
                        size='large'
                        width={60}
                        handleFn={() => handleNetChange(index)}
                        label={net.name?.replace('Ethereum', 'ERC20')?.replace('Binance', 'BEP20')}
                      />
                    </SwiperSlide>
                  ))}
                </SwiperReact>
              </Box>
            </div>
          )}
          {token_nets.length === 2 && (
            <div
              style={{
                margin: 'auto',
                marginTop: '10px',
                alignItems: 'center',
                width: 'fit-content',
              }}
            >
              {token_nets.map((net: any, index: number) => (
                <ButtonWithActive
                  isActive={index === activeNetIndex}
                  size='large'
                  width={80}
                  handleFn={() => handleNetChange(index)}
                  label={net.name}
                />
              ))}
            </div>
          )}
          {networkError ? (
            <Box>Network error...</Box>
          ) : (
            <Box margin='20px 20px 0' style={{ backgroundColor: 'transparent' }}>
              <Typography variant='h6' component='h6' textAlign='left' color='#AAAAAA' mb={1}>
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
              {activeToken.id !== '10' && (
                <>
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
                        fontSize: '14px',
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
                        fontSize: '14px',
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
                </>
              )}
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
              {/* <Typography
                variant='h6'
                textAlign='left'
                padding='0'
                fontSize='14px'
                component='article'
                color='#AAAAAA'
                mt={2}
              >
                For security purposes, large or suspicious withdrawal may take 1-6 hours for audit
                process. <br />
                We appreciate your patience!
              </Typography> */}
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
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#0e9d9a',
            // ':hover': {
            //   backgroundColor: '#7eca0b88',
            // },
          }}
          disabled={isLoading}
          onClick={sendRequestWithdraw}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default Withdraw;
