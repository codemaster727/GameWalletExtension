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
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [percent, setPercent] = useState<string>('');
  const [activeTokenTypeIndex, setActiveTokenTypeIndex] = useState(0);
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.0001');
  const [error, setError] = useState<any>({});
  const [activeNetIndex, setActiveNetIndex] = useState<number>(0);

  const navigate = useNavigate();
  const { token } = useParams();

  const { networkError, balanceData, tokenData, netData, withdrawMutate, withdrawIsLoading } =
    useSocket();

  const theme = useTheme();

  const activeToken = tokenData[activeTokenIndex];
  const token_net_ids = Object.keys(activeToken?.address) ?? [];
  const token_nets = netData?.filter((net: any) => token_net_ids.includes(net.id));
  const activeNet = token_nets[activeNetIndex];

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

  const sendRequestWithdraw = () => {
    alert('Cannot withdraw NFT yet.');
    // if (validate(address, amount, activeNet?.id ?? '0', activeToken.id)) {
    //   balanceData[activeToken.id] -= parseFloat(amount);
    //   chrome.runtime.sendMessage('test', function (response) {
    //     console.log(response);
    //   });
    //   withdrawMutate({
    //     user: '1',
    //     net: activeNet.id,
    //     asset: activeToken.id,
    //     amount: parseFloat(amount),
    //     receiver: address, // SOL address
    //   });
    // }
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
            onClick={() => navigate(-1)}
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
          {!networkError && (
            <img
              src={token_images[parseInt(token ?? '0')]}
              alt={token_images[parseInt(token ?? '0')]}
              width={145}
              height={145}
              data-xblocker='passed'
            />
          )}
          {networkError ? (
            <Box>Network error...</Box>
          ) : (
            <Box margin='10px 20px 0' style={{ backgroundColor: 'transparent' }}>
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
              <Typography
                variant='h5'
                component='h5'
                textAlign='left'
                fontWeight='bold'
                alignItems='center'
                mt={2}
                mb={0}
                style={{ overflowWrap: 'break-word', textAlign: 'center' }}
              >
                Fee&nbsp;
                <span style={{ color: '#0abab5' }}>
                  {1}
                  &nbsp; USD
                </span>
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
          disabled={withdrawIsLoading}
          onClick={sendRequestWithdraw}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

export default WithdrawNFT;
