import React, { useEffect, useState, useDeferredValue } from 'react';
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
import SwapVertIcon from '@mui/icons-material/SwapVert';
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
import { style_type_btn_ext, style_type_btn_active_ext } from 'src/components/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NextButtonForSwiper, PrevButtonForSwiper } from '~/components/Buttons/ImageButton';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { grey } from '@mui/material/colors';
import { precision } from '~/utils/helper';
import { useAuth } from '~/context/AuthProvider';
import { ETH } from '~/constants/address';
import { TailSpin } from 'react-loading-icons';
import utils from 'web3-utils';
import { isEmpty } from 'lodash';

enum Focus {
  From,
  To,
}

const style_btn_toggle = {
  color: '#AAAAAA',
  fontSize: '14px',
  margin: '2px',
  backgroundColor: grey[900],
  height: '20px',
  width: '40px',
};

MenuProps.PaperProps.style.width = 120;

const Swap = () => {
  const { token, net } = useParams();
  const [fromTokenIndex, setFromTokenIndex] = useState(parseInt(token ?? '1'));
  const [fromNetIndex, setFromNetIndex] = useState(parseInt(net ?? '1'));
  const [toTokenIndex, setToTokenIndex] = useState(parseInt(token !== '2' ? '2' : '3'));
  const [toNetIndex, setToNetIndex] = useState(parseInt(net ?? '1'));
  const [fromAmount, setFromAmount] = useState<string>('0');
  const [toAmount, setToAmount] = useState<string>('0');
  const [focus, setFocus] = useState<Focus>(Focus.From);
  const [rate, setRate] = useState<number>(0);
  const [gasCosts, setGasCosts] = useState<string>('0.0');
  const [error, setError] = useState<string>('');

  const fromDeferredAmount = useDeferredValue(fromAmount);
  const toDeferredAmount = useDeferredValue(toAmount);

  const navigate = useNavigate();

  const {
    loading,
    networkError,
    balances,
    balanceData,
    tokenData,
    netData,
    swapMutate,
    swapIsLoading,
    priceData,
    walletData,
    quoteMutate,
    quoteIsLoading,
    quoteIsError,
    quoteData,
  } = useSocket();

  const { user } = useAuth();

  const theme = useTheme();

  const fromToken = tokenData[fromTokenIndex];
  const toToken = tokenData[toTokenIndex];
  const fromNet = netData[fromNetIndex];
  const toNet = netData[toNetIndex];

  const handleFromTokenChange = (event: SelectChangeEvent<typeof fromTokenIndex>) => {
    const {
      target: { value },
    } = event;
    setFromTokenIndex(value as number);
  };
  const handleFromNetChange = (event: SelectChangeEvent<typeof fromNetIndex>) => {
    const {
      target: { value },
    } = event;
    setFromNetIndex(value as number);
  };

  const handleToTokenChange = (event: SelectChangeEvent<typeof toTokenIndex>) => {
    const {
      target: { value },
    } = event;
    setToTokenIndex(value as number);
  };
  const handleToNetChange = (event: SelectChangeEvent<typeof toNetIndex>) => {
    const {
      target: { value },
    } = event;
    setToNetIndex(value as number);
  };

  const handleChangeFromInput = (e: any) => {
    const { value }: { value: string } = e.target;
    setFromAmount(value);
    setFocus(Focus.From);
  };

  const handleChangeToInput = (e: any) => {
    const { value }: { value: string } = e.target;
    setToAmount(value);
    setFocus(Focus.To);
  };

  const handleConvert = () => {
    setFromTokenIndex(toTokenIndex);
    setToTokenIndex(fromTokenIndex);
    setFromNetIndex(toNetIndex);
    setToNetIndex(fromNetIndex);
  };

  const resetState = () => {
    setRate(0);
    setToAmount('0');
    setGasCosts('0.0');
  };

  const setMax = () => {
    const amount = Number(balances[fromToken.id][fromNet.id] ?? '0');
    setFromAmount(amount.toFixed(amount ? 5 : 0));
  };

  const validate = (
    amnt: string | undefined,
    fromNet: string,
    toNet: string,
    from: string,
    to: string,
  ) => {
    // if (["3", "5", "6", "7", "8", "9", "10"].includes(fromNet) || ["3", "5", "6", "7", "8", "9", "10"].includes(toNet)) {
    //   setError('Not supported yet. Please wait to complete.');
    //   return false;
    // }
    // if (from !== '2' && from !== '3' && from !== '4') {
    //   setError('Not supported yet. Please wait to complete.');
    //   return false;
    // }
    // if (to !== '2' && to !== '3' && to !== '4') {
    //   setError('Not supported yet. Please wait to complete.');
    //   return false;
    // }
    if (fromToken.address[fromNet] === undefined) {
      setError('Not supported token');
      return false;
    }
    const am = parseFloat(amnt as string);
    if (!am || am <= 0 || am > balances[from][fromNet]) {
      setError('Insufficient balance.');
      return false;
    }
    setError('');
    return true;
  };

  const getQuote = () => {
    resetState();
    if (!validate(fromAmount, fromNet.id, toNet.id, fromToken.id, toToken.id)) {
      return;
    }
    const routesRequest = {
      fromChain: fromNet.chain_id, // Goerli
      fromAmount: fromAmount, // 1
      fromToken: fromToken.address[fromNet.id] ? fromToken.address[fromNet.id] : ETH,
      toChain: toNet.chain_id, // Goerli
      toToken: toToken.address[toNet.id] ? toToken.address[toNet.id] : ETH,
      fromAddress: walletData['1'],
      fee: '0.05',
      integrator: walletData['1'],
    };
    console.log(routesRequest);
    quoteMutate(routesRequest);
  };

  const sendRequestSwap = () => {
    if (!validate(fromAmount, fromNet.id, toNet.id, fromToken.id, toToken.id) || !quoteData) return;
    swapMutate();
  };

  useEffect(() => {
    if (loading || isEmpty(balances)) return;
    const amount = Number(balances[fromToken.id][fromNet.id] ?? '0');
    setFromAmount(amount.toFixed(amount ? 5 : 0));
  }, [fromTokenIndex, fromNetIndex]);

  useEffect(() => {
    // const rate_curr =
    //   Number(priceData[fromToken?.name?.concat('-USD')]) /
    //   Number(priceData[toToken?.name?.concat('-USD')]);
    const timer = setTimeout(() => {
      if (quoteData?.estimate) {
        const rate_curr = Number(quoteData?.estimate.toAmount)
          ? Number(quoteData?.estimate.toAmount) / Number(fromAmount)
          : 0;
        setRate(rate_curr);
        const amount = Number(quoteData.estimate.toAmount).toFixed(precision(rate_curr));
        if (focus === Focus.From) {
          setToAmount(amount);
        } else {
          setFromAmount(amount);
        }
        setGasCosts(
          quoteData.estimate.gasCosts
            .map(
              (gasCost: any) => utils.fromWei(gasCost.amount, 'ether') + ' ' + gasCost.token.symbol,
            )
            .join(),
        );
        return () => clearTimeout(timer);
      }
      // else {
      //   setFromAmount('0');
      // }
    }, 500);
  }, [quoteData]);

  useEffect(() => {
    if (loading || isEmpty(balances)) return;
    const timer = setTimeout(() => {
      getQuote();
    }, 500);

    return () => clearTimeout(timer);
  }, [fromTokenIndex, toTokenIndex, fromDeferredAmount, fromNetIndex, toNetIndex]);

  useEffect(() => {
    if (quoteIsError) {
      setRate(0);
      setError('No available dex or bridge found.');
    }
  }, [quoteIsError]);

  return (
    <Box className='base-box'>
      <ScrollBox>
        <Box>
          {networkError ? (
            <Box>Network error...</Box>
          ) : (
            <Box margin='20px 12px 0' style={{ backgroundColor: 'transparent' }}>
              <Typography variant='h6' component='h6' textAlign='left' color='#AAAAAA' mb={1}>
                You get approximately
              </Typography>
              <Paper
                component='form'
                sx={style_input_paper}
                style={{ borderRadius: '10px 10px 0 0', position: 'relative', height: '75px' }}
              >
                <Button
                  color='secondary'
                  variant='contained'
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '100%',
                    transform: 'translate(-50%, -40%)',
                    minWidth: 0,
                    padding: 0.5,
                    borderRadius: '10px',
                    border: `1px solid ${grey[800]}`,
                  }}
                  onClick={handleConvert}
                >
                  <SwapVertIcon fontSize='large' sx={{ path: { fill: 'white' } }} />
                </Button>
                <Box className='currency_select' sx={{ margin: 0, textAlign: 'left' }}>
                  <Select
                    value={fromNetIndex}
                    onChange={handleFromNetChange}
                    input={<OutlinedInput />}
                    renderValue={(selected: number) => {
                      const net = netData[selected];
                      return (
                        net && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {Icon(net?.icon, 18)}
                            &nbsp;
                            {net?.name}
                          </Box>
                        )
                      );
                    }}
                    MenuProps={MenuProps}
                    // IconComponent={() => DownIcon(DownArrowImage, 12)}
                    // IconComponent={() => <ExpandMoreIcon />}
                    // IconComponent={() => <Person />}
                    sx={{ ...style_select, width: '120px' }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {netData &&
                      'map' in netData &&
                      netData?.map((net: any, index: number) => (
                        <MenuItem
                          className='menuitem-currency'
                          key={net?.id}
                          value={index}
                          sx={style_menuitem}
                        >
                          {Icon(net.icon, 18)}
                          &nbsp;
                          {net?.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <Select
                    value={fromTokenIndex}
                    onChange={handleFromTokenChange}
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
                    sx={{ ...style_select, width: '120px' }}
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
                          disabled={index === toTokenIndex && fromNetIndex === toNetIndex}
                        >
                          {Icon(token.icon, 18)}
                          &nbsp;
                          {token?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
                <Button
                  value='0.01'
                  aria-label='left aligned'
                  sx={{ ...style_btn_toggle, borderRadius: '5px', marginLeft: 'auto', minWidth: 0 }}
                  onClick={setMax}
                >
                  Max
                </Button>
                <Box ml='20px' width={80}>
                  <Typography
                    variant='h6'
                    component='h6'
                    lineHeight={'normal'}
                    textAlign='right'
                    color={theme.palette.text.secondary}
                  >
                    Send
                  </Typography>
                  <NumericFormat
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      paddingLeft: '0',
                      width: '100%',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                    thousandSeparator
                    decimalScale={5}
                    value={fromAmount}
                    onChange={handleChangeFromInput}
                  />
                </Box>
              </Paper>
              <Paper
                component='form'
                sx={style_input_paper}
                style={{ borderRadius: '0 0 10px 10px', height: '75px' }}
              >
                <Box className='currency_select' sx={{ margin: 0, textAlign: 'left' }}>
                  <Select
                    value={toNetIndex}
                    onChange={handleToNetChange}
                    input={<OutlinedInput />}
                    renderValue={(selected: number) => {
                      const net = netData[selected];
                      return (
                        net && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {Icon(net?.icon, 18)}
                            &nbsp;
                            {net?.name}
                          </Box>
                        )
                      );
                    }}
                    MenuProps={MenuProps}
                    // IconComponent={() => DownIcon(DownArrowImage, 12)}
                    // IconComponent={() => <ExpandMoreIcon />}
                    // IconComponent={() => <Person />}
                    sx={{ ...style_select, width: '120px' }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {netData &&
                      'map' in netData &&
                      netData?.map((net: any, index: number) => (
                        <MenuItem
                          className='menuitem-currency'
                          key={net?.id}
                          value={index}
                          sx={style_menuitem}
                        >
                          {Icon(net.icon, 18)}
                          &nbsp;
                          {net?.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <Select
                    value={toTokenIndex}
                    onChange={handleToTokenChange}
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
                    sx={{ ...style_select, width: '120px' }}
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
                          disabled={index === fromTokenIndex}
                        >
                          {Icon(token.icon, 18)}
                          &nbsp;
                          {token?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
                {quoteIsLoading ? (
                  <TailSpin width={20} />
                ) : (
                  <Box ml='20px' width={80} sx={{ textAlign: 'right' }}>
                    <Typography
                      variant='h6'
                      component='h6'
                      lineHeight={'normal'}
                      textAlign='right'
                      color={theme.palette.text.secondary}
                    >
                      Get
                    </Typography>
                    <NumericFormat
                      style={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: 'none',
                        paddingLeft: '0',
                        width: '100%',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}
                      thousandSeparator
                      decimalScale={5}
                      value={toAmount}
                      onChange={handleChangeToInput}
                      disabled
                    />
                  </Box>
                )}
              </Paper>
              {error ? (
                <Typography
                  variant='h5'
                  component='article'
                  textAlign='left'
                  fontWeight='bold'
                  alignItems='left'
                  mt={2}
                  color={theme.palette.error.main}
                  style={{ overflowWrap: 'break-word' }}
                >
                  {error}
                </Typography>
              ) : null}
              <Typography
                variant='h6'
                component='h6'
                textAlign='left'
                fontWeight='bold'
                alignItems='center'
                mt={2}
                color={theme.palette.text.secondary}
                style={{ overflowWrap: 'break-word' }}
              >
                {rate ? 1 : 0} {fromToken?.name} &#8776; {rate.toFixed(precision(rate))}{' '}
                {toToken?.name}
              </Typography>
              <Typography
                variant='h6'
                component='h6'
                textAlign='left'
                fontWeight='bold'
                alignItems='center'
                color={theme.palette.text.secondary}
                style={{ overflowWrap: 'break-word' }}
              >
                Swap fee: <span style={{ color: theme.palette.text.primary }}>{gasCosts}</span>
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
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#0e9d9a',
            // ':hover': {
            //   backgroundColor: '#7eca0b88',
            // },
          }}
          disabled={swapIsLoading}
          onClick={sendRequestSwap}
        >
          Swap Now
        </Button>
      </Box>
    </Box>
  );
};

export default Swap;
