import React, { useEffect, useState } from 'react';
import { Button, Box, Grid, Select, Typography, MenuItem, OutlinedInput } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { url } from 'inspector';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import { useSocket } from 'src/context/SocketProvider';
import { PrevButtonForSwiper, NextButtonForSwiper } from 'src/components/Buttons/ImageButton';
import { style_box_address, style_menuitem, style_select } from 'src/components/styles';
import Icon from '~/components/Icon';
import { MenuProps } from '~/constants';
import ScrollBox from '~/components/Layout/ScrollBox';
import {} from 'src/components/styles';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { Rings } from 'react-loading-icons';
import NFTIcon from 'src/assets/coingroup/NFT_Icon.png';
import AccountItem from '~/components/Items/AccountItem';

Swiper.use([Virtual, Navigation, Pagination]);

const Deposit = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);
  const [activeNetIndex, setActiveNetIndex] = useState<number>(0);

  const navigate = useNavigate();
  const { token } = useParams();

  const {
    loading,
    networkError,
    priceData,
    walletData,
    walletArray = [],
    tokenData,
    netData,
  } = useSocket();
  const wallet_erc20 = walletArray?.filter(
    (wallet: any) => wallet?.address === walletArray[0]?.address,
  );
  const wallet_none_erc20 = walletArray?.filter(
    (wallet: any) => wallet?.address !== walletArray[0]?.address,
  );

  const theme = useTheme();

  const activeToken = tokenData[activeTokenIndex] ?? {};
  const token_net_ids = Object.keys(activeToken?.address ?? {}) ?? [];
  const token_nets = netData?.filter((net: any) => token_net_ids.includes(net.id));
  const activeNet = token_nets[activeNetIndex];

  const address: any = walletData[activeNet?.id ?? '1'];

  const copyContent = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  useEffect(() => {
    setActiveTokenIndex(parseInt(token ?? '0'));
  }, [token]);

  console.log(walletArray);
  console.log(wallet_none_erc20);
  console.log(netData);

  return (
    <Box className='base-box'>
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
      </Box>
      {loading ? (
        <Rings style={{ marginTop: '50%' }} />
      ) : (
        <ScrollBox height={450}>
          <AccountItem
            label={wallet_erc20
              ?.map((wallet: any) => netData.find((net: any) => net.id === wallet?.net_id)?.name)
              .join(', ')}
            copyFn={() => copyContent(walletArray && walletArray[0]?.private_key)}
          />
          {wallet_none_erc20
            ?.sort(
              (a: any, b: any) =>
                netData.find((net: any) => net.id === a?.net_id)?.sort -
                netData.find((net: any) => net.id === b?.net_id)?.sort,
            )
            ?.map((wallet: any) => (
              <AccountItem
                label={netData.find((net: any) => net.id === wallet?.net_id)?.name}
                copyFn={() => copyContent(wallet?.private_key)}
              />
            ))}
        </ScrollBox>
      )}
    </Box>
  );
};

export default Deposit;
