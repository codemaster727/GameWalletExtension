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
import { grey } from '@mui/material/colors';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import { NumericFormat } from 'react-number-format';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { token_images } from '../Balances';
import { estimateGasSend, estimateGasSendNft } from '~/apis/api';
import { findBy } from '~/utils/helper';
import LoadingIcon from 'src/assets/utils/loading.gif';

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
  fontSize: '12px',
  fontWeight: 'bold',
};

const WithdrawNFT = () => {
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [gasCosts, setGasCosts] = useState<string>('0');
  const [gasEnough, setGasEnough] = useState<boolean>(false);
  const [waitingConfirm, setWaitingConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<any>(false);

  const { token } = useParams();

  const {
    networkError,
    walletData,
    balances,
    netData,
    tokenData,
    nftList,
    nftStatus,
    withdrawNft,
  } = useSocket();

  const { ownedNfts } = nftList;
  const nft = ownedNfts[token ?? '0'];
  const theme = useTheme();
  const activeNet = netData ? netData['1'] : {};
  const handleChangeAddressInput = (e: any) => {
    const { value } = e.target;
    if (address !== value) {
      setAddress(value);
    }
  };

  const validate = (addr: string | undefined) => {
    if (!addr) {
      setError('Fill in the address field.');
      return false;
    }
    setError('');
    return true;
  };

  const gasCostValidate = (gas: string) => {
    setGasCosts(gas);
    const coin_balance = balances['2']['1'];
    console.log('eth_balance:', coin_balance);
    // const txData = cloneDeep(quoteData.estimate.transactionRequest);
    // txData.chainId = parseInt(txData.chainId);
    // const gas = await estimateGasLifi(fromNet.chain_id, txData);
    const result = !(parseFloat(coin_balance) - parseFloat(gas) < 0);
    console.log(result);
    if (!result) {
      setGasEnough(false);
      setError('Insufficient gas.');
    } else {
      setGasEnough(true);
    }
    return result;
  };

  const confirmAction = () => {
    setWaitingConfirm(true);
  };

  const cancelAction = () => {
    setWaitingConfirm(false);
  };

  const sendRequestWithdraw = () => {
    if (validate(address) && gasEnough) {
      setWaitingConfirm(false);
      withdrawNft(address, nft.tokenId, nft?.contract.address)
        .then((res: any) => {
          console.log(res);
        })
        .catch((e: any) => {
          console.log(e);
          setError('Error occured while withdraw');
        });
    }
  };

  useEffect(() => {
    if (!Boolean(address)) return;
    validate(address);
    const getCost = async () => {
      setIsLoading(true);
      const gas = await estimateGasSendNft(
        walletData['1'],
        address,
        nft.tokenId,
        nft.contract.address,
      )
        .then((res) => res)
        .catch((e) => {
          console.log(e);
          setError('Error in your input');
          return '0';
        });
      setGasCosts(gas);
      gasCostValidate(gas);
      setIsLoading(false);
    };
    getCost();
  }, [address]);

  return (
    <Box className='base-box'>
      <ScrollBox>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          height='30px'
          sx={{ margin: '8px 10px' }}
        >
          <Button
            variant='text'
            size='large'
            color='secondary'
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '20px',
              minWidth: 'fit-content',
              padding: '5px',
            }}
            component={Link}
            to='/balances/0'
          >
            <ArrowBackIcon sx={{ fontSize: '20px' }} />
          </Button>
        </Box>
        <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
        <Box marginTop={2}>
          {
            // <div
            //   style={{
            //     margin: '10px auto',
            //     alignItems: 'center',
            //   }}
            // >
            //   <Box m='10px 20px' position='relative'>
            //     <PrevButtonForSwiper />
            //     <NextButtonForSwiper />
            //     <SwiperReact
            //       modules={[Pagination, Navigation]}
            //       pagination={{ clickable: false, el: '.pagination' }}
            //       spaceBetween={1}
            //       slidesPerView={2}
            //       allowSlideNext
            //       centeredSlides={false}
            //       cardsEffect={{ perSlideOffset: 0 }}
            //       virtual
            //       draggable={false}
            //       allowTouchMove={false}
            //       navigation={{
            //         nextEl: '.hl-swiper-next',
            //         prevEl: '.hl-swiper-prev',
            //       }}
            //       style={{ margin: '0 35px' }}
            //     >
            //       {nft_types.map((net, index) => (
            //         <SwiperSlide key={'swiper' + net} virtualIndex={index}>
            //           <ButtonWithActive
            //             isActive={index === activeNetIndex}
            //             size='large'
            //             handleFn={() => handleNetChange(index)}
            //             label={net}
            //           />
            //         </SwiperSlide>
            //       ))}
            //     </SwiperReact>
            //   </Box>
            // </div>
          }
          {!networkError && nftStatus === 'success' && nft ? (
            <img
              src={nft.media[0].gateway}
              alt={nft.contract.address}
              width={145}
              height={145}
              data-xblocker='passed'
            />
          ) : null}
          {networkError ? (
            <Box>Network error...</Box>
          ) : (
            <Box margin='10px 20px 0' style={{ backgroundColor: 'transparent' }}>
              <Typography variant='h6' component='h6' textAlign='left' color='#AAAAAA' mb={1}>
                Withdraw address
                <span style={{ color: '#0abab5' }}>(Note: Only on Ethereum)</span>
              </Typography>
              <Paper component='form' sx={style_input_paper}>
                <InputBase
                  sx={style_textfield}
                  fullWidth
                  placeholder='Fill in carefully according to the specific NFT'
                  inputProps={{
                    'aria-label': 'withdraw address',
                  }}
                  value={address}
                  onChange={handleChangeAddressInput}
                />
              </Paper>
              {error}
              {error ? (
                <Typography
                  variant='h5'
                  component='article'
                  textAlign='left'
                  fontWeight='bold'
                  alignItems='center'
                  mt={2}
                  color={theme.palette.error.main}
                  style={{ overflowWrap: 'break-word' }}
                >
                  {error}
                </Typography>
              ) : null}
              {/* <Typography
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
                <span style={{ color: '#0abab5' }}>0.05%</span>
              </Typography> */}
              <Typography
                variant='h6'
                component='h6'
                textAlign='left'
                fontWeight='bold'
                alignItems='left'
                color={theme.palette.text.secondary}
                style={{ overflowWrap: 'break-word' }}
                mt={2}
              >
                Gas fee:{' '}
                <span style={{ color: theme.palette.text.primary }}>
                  {Boolean(parseFloat(gasCosts)) ? parseFloat(gasCosts).toFixed(8) : gasCosts}{' '}
                  {activeNet.coin}
                </span>
              </Typography>
            </Box>
          )}
        </Box>
      </ScrollBox>
      <Box className='bottom-box'>
        {waitingConfirm ? (
          <>
            <Button
              variant='contained'
              sx={style_btn_confirm}
              disabled={isLoading}
              onClick={cancelAction}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={style_btn_confirm}
              disabled={isLoading}
              onClick={sendRequestWithdraw}
            >
              Confirm
            </Button>
          </>
        ) : isLoading ? (
          <img src={LoadingIcon} width={30} />
        ) : (
          <Button
            variant='contained'
            sx={style_btn_confirm}
            disabled={nftStatus !== 'success' || !Boolean(address) || !gasEnough || isLoading}
            onClick={confirmAction}
          >
            Withdraw
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default WithdrawNFT;
