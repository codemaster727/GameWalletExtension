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
  style_btn_confirm,
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
import { findBy, precision } from '~/utils/helper';
import { useAuth } from '~/context/AuthProvider';
import { ETH } from '~/constants/address';
import { TailSpin } from 'react-loading-icons';
import utils from 'web3-utils';
import { cloneDeep, isEmpty, isError } from 'lodash';
import { SIMPLE_SWAP_KEYS } from '~/constants/supported-assets';
import { estimateGasSend, getLifi, getSimpleQuote, lifiSwapPost, simpleSwapPost } from '~/apis/api';
import { Token } from '~/context/types';
import LoadingIcon from 'src/assets/utils/loading.gif';
import Message from '~/components/Message';
// import { SIMPLE_SWAP_API_KEY } from '~/constants/apis';

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

const MenuProps_Token = cloneDeep(MenuProps);
// MenuProps.PaperProps.style.width = 120;
MenuProps_Token.PaperProps.style.height = (MenuProps_Token.PaperProps.style.height / 7) * 3;

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
  const [gasCosts, setGasCosts] = useState<string>('0');
  const [error, setError] = useState<string>('');
  const [waitingConfirm, setWaitingConfirm] = useState<boolean>(false);
  const [gasEnough, setGasEnough] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapQuoteIsLoading, setSwapQuoteIsLoading] = useState<boolean>(false);
  const [simpleQuoteData, setSimpleQuoteData] = useState<any>();

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
    // swapMutate,
    // swapData,
    // swapIsLoading,
    priceData,
    walletData,
    walletArray,
    quoteMutate,
    quoteIsLoading,
    quoteIsError,
    quoteData,
    quoteStatus,
    updateBalance,
  } = useSocket();

  const { user } = useAuth();

  const theme = useTheme();

  const fromToken = tokenData ? tokenData[fromTokenIndex] : ({} as Token);
  const toToken = tokenData ? tokenData[toTokenIndex] : ({} as Token);
  const fromNet = netData[fromNetIndex];
  const toNet = netData[toNetIndex];

  const handleFromTokenChange = (event: SelectChangeEvent<typeof fromTokenIndex>) => {
    const {
      target: { value },
    } = event;
    if (toNetIndex === fromNetIndex && value === toTokenIndex) return;
    setFromTokenIndex(value as number);
  };
  const handleFromNetChange = (event: SelectChangeEvent<typeof fromNetIndex>) => {
    const {
      target: { value },
    } = event;
    if (toNetIndex === value && fromTokenIndex === toTokenIndex) return;
    setFromNetIndex(value as number);
  };

  const handleToTokenChange = (event: SelectChangeEvent<typeof toTokenIndex>) => {
    const {
      target: { value },
    } = event;
    if (toNetIndex === fromNetIndex && value === fromTokenIndex) return;
    setToTokenIndex(value as number);
  };
  const handleToNetChange = (event: SelectChangeEvent<typeof toNetIndex>) => {
    const {
      target: { value },
    } = event;
    if (value === fromNetIndex && fromTokenIndex === toTokenIndex) return;
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
    // setGasCosts('0.0');
    setError('');
  };

  const setMax = async () => {
    const balance = Number(balances[fromToken.id][fromNet.id] ?? '0');
    let gas = '0';
    if (!Boolean(balance)) {
      setFromAmount('0');
      return;
    }
    if (fromToken.name === fromNet.coin) {
      if (isLifi()) {
        const routesRequest = {
          fromChain: fromNet.chain_id, // Goerli
          fromAmount: balance, // 1
          fromToken: fromToken.address[fromNet.id] ? fromToken.address[fromNet.id] : ETH,
          toChain: toNet.chain_id, // Goerli
          toToken: toToken.address[toNet.id] ? toToken.address[toNet.id] : ETH,
          fromAddress: walletData['1'],
        };
        const new_quoteData = await getLifi('/quote', routesRequest);
        gas = new_quoteData.estimate.gasCosts.map((gasCost: any) =>
          utils.fromWei(gasCost.amount, 'ether'),
        );
      } else {
        gas = await estimateGasSend(fromNet, fromToken, walletData['1'], balance.toString());
      }

      if (gasCostValidate(gas)) {
        let max_amount = balance - parseFloat(gas);
        setFromAmount(max_amount.toString());
      } else {
        setFromAmount('0');
      }

      // const max_amount = Math.min(
      //   parseFloat(fromAmount),
      //   Math.max(balance - parseFloat(gas), 0),
      // );
      // if (new_amount) {
      //   setFromAmount(new_amount.toFixed(18));
      // } else {
      //   setError('Insufficient gas.');
      // }
    } else {
      setFromAmount(balance.toString());
    }
  };

  const validate = (
    amnt: string | undefined,
    fromNet: string,
    toNet: string,
    from: string,
    to: string,
  ) => {
    if (fromToken.address[fromNet] === undefined || toToken.address[toNet] === undefined) {
      setError('Not supported token');
      return false;
    }
    const am = parseFloat(amnt as string);
    if (!am || am < 0 || am > balances[from][fromNet]) {
      setError('Insufficient balance.');
      return false;
    }
    setError('');
    return true;
  };

  const gasCostValidate = (gas: string) => {
    setGasCosts(gas);
    const coin_balance = balances[findBy(tokenData, 'name', fromNet.coin).id][fromNet.id];
    // const txData = cloneDeep(quoteData.estimate.transactionRequest);
    // txData.chainId = parseInt(txData.chainId);
    // const gas = await estimateGasLifi(fromNet.chain_id, txData);
    const result = !(coin_balance - parseFloat(gas) < 0);
    if (!result) {
      setGasEnough(false);
      setError('Insufficient gas.');
    } else {
      setGasEnough(true);
    }
    return result;
  };

  const isLifi = () => {
    if (
      ['6', '7', '8', '9', '10'].includes(fromNet.id) ||
      ['6', '7', '8', '9', '10'].includes(toNet.id)
    ) {
      return false;
    }
    return true;
  };

  const getQuote = async () => {
    resetState();
    if (Number(fromAmount) <= 0) return;
    if (!validate(fromAmount, fromNet.id, toNet.id, fromToken.id, toToken.id)) {
      return;
    }
    if (isLifi()) {
      const routesRequest = {
        fromChain: fromNet.chain_id, // Goerli
        fromAmount: fromAmount, // 1
        fromToken: fromToken.address[fromNet.id] ? fromToken.address[fromNet.id] : ETH,
        toChain: toNet.chain_id, // Goerli
        toToken: toToken.address[toNet.id] ? toToken.address[toNet.id] : ETH,
        fromAddress: walletData['1'],
        // fee: '0.05',
        // integrator: walletData['1'],
      };
      quoteMutate(routesRequest);
    } else {
      setSwapQuoteIsLoading(true);
      const routesRequest = {
        currency_from: SIMPLE_SWAP_KEYS[fromToken.id][fromNet.id],
        currency_to: SIMPLE_SWAP_KEYS[toToken.id][toNet.id],
        fixed: false,
        amount: parseFloat(fromAmount),
        // api_key: SIMPLE_SWAP_API_KEY,
      };
      const simple_result = await getSimpleQuote(routesRequest);
      setSimpleQuoteData(simple_result);
      setSwapQuoteIsLoading(false);
      const gas = await estimateGasSend(fromNet, fromToken, walletData['1'], fromAmount);
      gasCostValidate(gas);
    }
  };

  const confirmAction = () => {
    setWaitingConfirm(true);
  };

  const cancelAction = () => {
    setWaitingConfirm(false);
  };

  const sendRequestSwap = async () => {
    if (!validate(fromAmount, fromNet.id, toNet.id, fromToken.id, toToken.id) || !quoteData) {
      setWaitingConfirm(false);
      return;
    }
    let result = null;
    setIsSwapping(true);
    if (isLifi()) {
      result = await lifiSwapPost(
        quoteData.transactionRequest,
        walletArray,
        fromToken.address[fromNet.id],
        fromAmount,
      )
        .then((res: any) => {
          return res;
        })
        .catch((e: any) => {
          console.log('lifi result error:', e);
          setError(`${e.response?.data.message}.`);
          return null;
        });
    } else {
      const routesRequest = {
        currency_from: SIMPLE_SWAP_KEYS[fromToken.id][fromNet.id],
        currency_to: SIMPLE_SWAP_KEYS[toToken.id][toNet.id],
        fixed: false,
        amount: parseFloat(fromAmount),
        address_to: walletData[toNet.id],
        user_refund_address: walletData[fromNet.id],
        // api_key: SIMPLE_SWAP_API_KEY,
      };
      result = await simpleSwapPost(routesRequest, fromNet, fromToken, walletArray)
        .then((res: any) => {
          return res;
        })
        .catch((e: any) => {
          console.log('simple swap error:', e);
          setError(`${e?.response?.data.message}.`);
          return null;
        });
    }
    setTimeout(() => {
      setIsSwapping(false);
      setWaitingConfirm(false);
    }, 3000);
    updateBalance();
    return result;
  };

  useEffect(() => {
    if (loading || isEmpty(balances)) return;
    // const amount = Number(balances[fromToken.id][fromNet.id] ?? '0');
    // setFromAmount(amount.toString());
    setMax();
  }, [fromTokenIndex, fromNetIndex]);

  useEffect(() => {
    // const rate_curr =
    //   Number(priceData[fromToken?.name?.concat('-USD')]) /
    //   Number(priceData[toToken?.name?.concat('-USD')]);
    const timer = setTimeout(() => {
      if (
        quoteData?.estimate &&
        quoteData?.action.toChainId === parseInt(toNet.chain_id) &&
        quoteData?.action.toToken.symbol === toToken.name
      ) {
        const rate_curr = Number(quoteData?.estimate.toAmount)
          ? Number(quoteData?.estimate.toAmount) / Number(fromAmount)
          : 0;
        setRate(rate_curr);
        const amount = Number(quoteData.estimate.toAmount).toFixed(5);
        if (focus === Focus.From) {
          setToAmount(amount);
        } else {
          setFromAmount(amount);
        }
        const gas = quoteData.estimate.gasCosts.map((gasCost: any) =>
          utils.fromWei(gasCost.amount, 'ether'),
        );
        setGasCosts(parseFloat(gas).toString());
        gasCostValidate(gas);

        return () => clearTimeout(timer);
      }
      // else {
      //   setFromAmount('0');
      // }
    }, 1);
  }, [quoteData]);

  useEffect(() => {
    if (simpleQuoteData) {
      if (simpleQuoteData.data) {
        setToAmount(parseFloat(simpleQuoteData.data.data ?? '0').toFixed(5));
        setRate(parseFloat(simpleQuoteData.data.data ?? '0') / parseFloat(fromAmount));
      } else {
        setToAmount('0');
        console.log('simpleswap:', simpleQuoteData);
        console.log('simpleswap:', simpleQuoteData.e?.response?.data);
        setError(`Swap quote error. ${simpleQuoteData.e?.response?.data ?? ''}`);
      }
    }
  }, [simpleQuoteData]);

  useEffect(() => {
    if (fromToken.address[fromNet.id] === undefined) {
      setFromTokenIndex(tokenData?.findIndex((token) => token.address[fromNet.id] !== undefined));
    }
    if (!isLifi()) {
      const balance = Number(balances[fromToken.id][fromNet.id] ?? '0');
      if (balance) {
        estimateGasSend(fromNet, fromToken, walletData['1'], balance.toString()).then(
          (gas: string) => {
            setGasCosts(gas);
          },
        );
      } else {
        setGasCosts('0');
      }
    }
  }, [fromNetIndex]);

  useEffect(() => {
    if (toToken.address[toNet.id] === undefined) {
      setToTokenIndex(tokenData?.findIndex((token) => token.address[toNet.id] !== undefined));
    }
    if (!isLifi()) {
      const balance = Number(balances[fromToken.id][fromNet.id] ?? '0');
      if (balance > 0) {
        estimateGasSend(fromNet, fromToken, walletData['1'], balance.toString()).then(
          (gas: string) => {
            setGasCosts(gas);
          },
        );
      } else {
        setGasCosts('0');
      }
    }
  }, [toNetIndex]);

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
      console.log('quote error:', quoteData);
      setError('Insufficient balance or no available dex or bridge found.');
    }
  }, [quoteIsError]);

  return (
    <Box className='base-box'>
      <ScrollBox>
        {waitingConfirm ? (
          <Box textAlign='center'>
            {!isSwapping ? (
              <Typography
                variant='h6'
                component='article'
                textAlign='center'
                fontWeight='normal'
                fontSize='16px'
                alignItems='center'
                mt='45%'
                style={{ overflowWrap: 'break-word', textAlign: 'center' }}
              >
                Do you want to swap now?
              </Typography>
            ) : (
              <img src={LoadingIcon} width={80} style={{ marginTop: '45%' }} />
            )}
          </Box>
        ) : (
          <Box>
            {networkError ? (
              <Box>Network error...</Box>
            ) : (
              <Box margin='20px 12px 0' style={{ backgroundColor: 'transparent' }}>
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
                        return net ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {Icon(net?.icon, 18)}
                            &nbsp;
                            {net?.name}
                          </Box>
                        ) : null;
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
                            disabled={index === toNetIndex && fromTokenIndex === toTokenIndex}
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
                      MenuProps={MenuProps_Token}
                      // IconComponent={() => DownIcon(DownArrowImage, 12)}
                      // IconComponent={() => <ExpandMoreIcon />}
                      // IconComponent={() => <Person />}
                      sx={{ ...style_select, width: '120px' }}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {tokenData &&
                        'map' in tokenData &&
                        tokenData.map((token: any, index: number) =>
                          token.address[fromNet.id] !== undefined ? (
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
                          ) : null,
                        )}
                    </Select>
                  </Box>
                  <Button
                    value='0.01'
                    aria-label='left aligned'
                    sx={{
                      ...style_btn_toggle,
                      borderRadius: '5px',
                      marginLeft: 'auto',
                      minWidth: 0,
                    }}
                    onClick={setMax}
                  >
                    Max
                  </Button>
                  <Box ml='20px' width={100}>
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
                      decimalScale={9}
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
                            disabled={index === fromNetIndex && fromTokenIndex === toTokenIndex}
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
                      MenuProps={MenuProps_Token}
                      // IconComponent={() => DownIcon(DownArrowImage, 12)}
                      // IconComponent={() => <ExpandMoreIcon />}
                      // IconComponent={() => <Person />}
                      sx={{ ...style_select, width: '120px' }}
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      {tokenData &&
                        'map' in tokenData &&
                        tokenData.map((token: any, index: number) =>
                          token.address[toNet.id] !== undefined ? (
                            <MenuItem
                              className='menuitem-currency'
                              key={token?.id}
                              value={index}
                              sx={style_menuitem}
                              disabled={index === fromTokenIndex && fromNetIndex === toNetIndex}
                            >
                              {Icon(token.icon, 18)}
                              &nbsp;
                              {token?.name}
                            </MenuItem>
                          ) : null,
                        )}
                    </Select>
                  </Box>
                  {quoteIsLoading || swapQuoteIsLoading ? (
                    // <TailSpin width={20} />
                    <img src={LoadingIcon} width={30} />
                  ) : (
                    <Box ml='20px' width={100} sx={{ textAlign: 'right' }}>
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
                {error ? <Message type='error' msg={error} /> : null}
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
                  {rate ? 1 : 0} {fromToken?.name} &#8776; {rate.toFixed(5)} {toToken?.name}
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
                  Swap fee:{' '}
                  <span style={{ color: theme.palette.text.primary }}>
                    {Boolean(parseFloat(gasCosts)) ? parseFloat(gasCosts).toFixed(8) : gasCosts}{' '}
                    {fromNet.coin}
                  </span>
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
                  Total:{' '}
                  <span style={{ color: theme.palette.text.primary }}>
                    {fromNet.coin === fromToken.name
                      ? parseFloat(fromAmount).toFixed(parseFloat(fromAmount) ? 8 : 0) +
                        fromToken.name +
                        ' + '
                      : ''}
                    {Boolean(parseFloat(gasCosts))
                      ? parseFloat(gasCosts).toFixed(8)
                      : netData[fromNetIndex].gas}{' '}
                    {fromNet.coin}
                  </span>
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </ScrollBox>
      <Box className='bottom-box'>
        {waitingConfirm && !isSwapping ? (
          <>
            <Button
              variant='contained'
              sx={style_btn_confirm}
              disabled={Boolean(error) || !Boolean(toAmount)}
              onClick={cancelAction}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={style_btn_confirm}
              disabled={Boolean(error) || !Boolean(toAmount)}
              onClick={sendRequestSwap}
            >
              Confirm
            </Button>
          </>
        ) : (
          <Button
            variant='contained'
            sx={style_btn_confirm}
            disabled={
              !Boolean(fromAmount) ||
              fromAmount === '0' ||
              !Boolean(toAmount) ||
              toAmount === '0' ||
              quoteIsLoading ||
              swapQuoteIsLoading ||
              isSwapping ||
              !gasEnough
            }
            onClick={confirmAction}
          >
            Swap Now
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Swap;
