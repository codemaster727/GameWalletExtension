import React, { useEffect, useState } from 'react';
import { Button, Box, Grid, Select, Typography, MenuItem, OutlinedInput } from '@mui/material';
import { Buffer } from 'buffer';
import { useSocket } from 'src/context/SocketProvider';
import ScrollBox from '~/components/Layout/ScrollBox';
// import {} from 'src/components/styles';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Rings } from 'react-loading-icons';
import AccountItem from '~/components/Items/AccountItem';

const Deposit = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);
  const [activeNetIndex, setActiveNetIndex] = useState<number>(0);

  const navigate = useNavigate();

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
      <ScrollBox height={430}>
        <AccountItem
          label={wallet_erc20
            ?.map((wallet: any) => netData.find((net: any) => net.id === wallet?.net_id)?.name)
            .join(', ')}
          value={Buffer.from(walletArray && walletArray[0]?.private_key).toString('base64')}
          copyFn={() =>
            copyContent(Buffer.from(walletArray && walletArray[0]?.private_key).toString('base64'))
          }
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
              value={Buffer.from(wallet?.private_key).toString('base64')}
              copyFn={() => copyContent(Buffer.from(wallet?.private_key).toString('base64'))}
            />
          ))}
      </ScrollBox>
    </Box>
  );
};

export default Deposit;
