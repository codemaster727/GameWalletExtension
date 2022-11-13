import React, { useEffect, useState } from 'react';
import { Button, Box, Grid, Select, Typography, MenuItem, OutlinedInput } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QRCode from 'qrcode';
import { url } from 'inspector';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import { useSocket } from 'src/context/SocketProvider';
import { PrevButtonForSwiper, NextButtonForSwiper } from 'src/components/Buttons/ImageButton';
import { style_box_address, style_menuitem, style_select } from 'src/components/styles';
import Icon from '~/components/Icon';
import { MenuProps, nft_types } from '~/constants';
import ScrollBox from '~/components/Layout/ScrollBox';
import {} from 'src/components/styles';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { Rings } from 'react-loading-icons';
import NFTIcon from 'src/assets/coingroup/NFT_Icon.png';

Swiper.use([Virtual, Navigation, Pagination]);

const style_btn_copy = {
  borderRadius: '20px',
  minWidth: 'fit-content',
  color: '#7F7F7F',
  backgroundColor: 'transparent',
  fontSize: '24px',
  padding: '0',
};

const Deposit = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);
  const [activeNetIndex, setActiveNetIndex] = useState<number>(0);

  const navigate = useNavigate();
  const { token } = useParams();

  const { loading, networkError, priceData, walletData, tokenData, netData } = useSocket();
  const theme = useTheme();

  const activeToken = tokenData[activeTokenIndex];
  const token_net_ids = Object.keys(activeToken?.address) ?? [];
  const token_nets = netData?.filter((net: any) => token_net_ids.includes(net.id));
  const activeNet = token_nets[activeNetIndex];

  const address: any = walletData[activeNet?.id ?? '1'];

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

  // useEffect(() => {
  //   let net = 1;
  //   if (activeTokenIndex === 0) net = 6;
  //   else if (activeTokenIndex === 1 || activeTokenIndex === 4 || activeTokenIndex === 8) net = 1;
  //   else if (activeTokenIndex === 2 || activeTokenIndex === 3) {
  //     net = activeNetIndex === 2 ? 7 : 1;
  //   } else if (activeTokenIndex === 5) net = 8;
  //   else if (activeTokenIndex === 6) net = 9;
  //   else if (activeTokenIndex === 7) net = 10;
  //   if (net !== activeNet) {
  //     setActiveNet(net);
  //   }
  // }, [activeTokenIndex, activeNetIndex, activeTokenTypeEthIndex]);

  console.log(tokenData);

  useEffect(() => {
    setActiveTokenIndex(parseInt(token ?? '0'));
  }, [token]);

  return (
    <Box className='base-box'>
      {loading ? (
        <Rings style={{ marginTop: '50%' }} />
      ) : (
        <ScrollBox height={480}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            sx={{ margin: '8px 20px' }}
          >
            <Button
              variant='contained'
              color='secondary'
              className='balance-btn'
              sx={{ color: theme.palette.text.secondary, fontSize: '14px' }}
              onClick={() => navigate(-1)}
            >
              Balance
            </Button>
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
                <MenuItem className='menuitem-currency' value={9} sx={style_menuitem}>
                  {Icon(NFTIcon, 18)}
                  &nbsp; NFT
                </MenuItem>
              </Select>
            </Box>
          </Box>
          <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
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
          {activeTokenIndex === 9 && (
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
                  slidesPerView={2}
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
                  // breakpoints={{
                  //   360: {
                  //     slidesPerView: 3,
                  //   },
                  //   576: {
                  //     slidesPerView: 4,
                  //   },
                  //   720: {
                  //     slidesPerView: 5,
                  //   },
                  //   992: {
                  //     slidesPerView: 6,
                  //   },
                  // }}
                  style={{ margin: '0 35px' }}
                >
                  {nft_types.map((net, index) => (
                    <SwiperSlide key={'swiper' + net} virtualIndex={index}>
                      <ButtonWithActive
                        isActive={index === activeNetIndex}
                        size='large'
                        handleFn={() => handleNetChange(index)}
                        label={net}
                      />
                    </SwiperSlide>
                  ))}
                </SwiperReact>
              </Box>
            </div>
          )}
          {activeTokenIndex !== 2 && activeTokenIndex !== 3 && activeTokenIndex !== 9 && (
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
      )}
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
