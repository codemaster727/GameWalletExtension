/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Button, Box, Modal, Tooltip, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import BuyCrypto from './BuyCrypto';
import Balances from './Balances';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Transactions from './Transactions';
import TransactionsIcon from '../../assets/coingroup/transactions.png';

import BuyIcon from '../../assets/coingroup/buy.png';
import BuyActiveIcon from '../../assets/coingroup/buy_active.png';
import DepositIcon from '../../assets/coingroup/deposit.png';
import DepositActiveIcon from '../../assets/coingroup/deposit_active.png';
import WithdrawIcon from '../../assets/coingroup/withdraw.png';
import WithdrawActiveIcon from '../../assets/coingroup/withdraw_active.png';
import { useWalletModal } from '../../context/WalletModalProvider';

const style_wallet_modal = {
  px: 4,
  py: 3,
  color: 'white',
  backgroundColor: '#17181b',
  borderRadius: '20px',
} as any;

const style_modal_content = {
  height: '570px',
  overflow: 'auto',
  // backgroundColor: 'transparent',
  msOverflowStyle: 'none' /* IE and Edge */,
  scrollbarWidth: 'none' /* Firefox */,
};

const style_btn = {
  color: '#F2F2F288',
  fontSize: '12px',
  minWidth: 'fit-content',
  borderColor: '#666666',
  padding: '8px',
};

const style_btn_active = {
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
  paddingY: '8px',
  backgroundColor: '#1e202d',
};

const style_transactions_btn = {
  color: '#F2F2F288',
  fontSize: '12px',
  marginLeft: 'auto',
  marginRight: '20px',
};

const Icon = (icon: any) => (
  <img
    id='u7_img'
    className='img'
    alt='BTCIcon'
    src={icon}
    width='30px'
    style={{ borderRadius: '20px' }}
  />
);

const tabs = [
  {
    name: 'Balance',
    icon: BuyIcon,
    active_icon: BuyActiveIcon,
  },
  {
    name: 'Deposit',
    icon: DepositIcon,
    active_icon: DepositActiveIcon,
  },
  {
    name: 'Withdraw',
    icon: WithdrawIcon,
    active_icon: WithdrawActiveIcon,
  },
];

interface Props {
  transactionsOpen: () => void;
}

const WalletModalMain = ({ transactionsOpen }: Props) => {
  const { setOpen, modalType, setModalType } = useWalletModal();

  const ModalByType = () => {
    switch (modalType) {
      case 0:
        return <Balances />;
      case 1:
        return <Deposit />;
      case 2:
        return <Withdraw />;
      default:
        return <Balances />;
    }
  };

  return (
    <Box>
      <Box sx={style_wallet_modal}>
        <div
          style={{
            display: 'flex',
            height: 'fit-content',
            alignItems: 'center',
          }}
        >
          <Typography variant='h3' fontStyle='italic' fontWeight='bold'>
            Wallet
          </Typography>
          <Button
            variant='text'
            startIcon={Icon(TransactionsIcon)}
            style={style_transactions_btn}
            onClick={transactionsOpen}
          >
            <Typography variant='h5'>Transactions</Typography>
          </Button>
          <Button
            sx={{
              color: '#F2F2F288',
              minWidth: 'fit-content',
            }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          {tabs.map((tab, index) => (
            <Tooltip title={tab.name} placement='bottom' key={tab.name}>
              <Button
                variant={index === modalType ? 'text' : 'outlined'}
                startIcon={index === modalType && Icon(tab.active_icon)}
                style={index === modalType ? style_btn_active : style_btn}
                onClick={() => setModalType(index)}
              >
                {index === modalType ? (
                  <Typography variant='h5' fontWeight='bold'>
                    {tab.name}
                  </Typography>
                ) : (
                  Icon(tab.icon)
                )}
              </Button>
            </Tooltip>
          ))}
        </div>
      </Box>
      <Box sx={{ borderRadius: '20px', backgroundColor: '#202328' }}>
        <Box>{ModalByType()}</Box>
      </Box>
    </Box>
  );
};

export default WalletModalMain;
