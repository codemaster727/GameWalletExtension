/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Box, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast, ToastPosition, Theme } from 'react-toastify';
// import BuyCrypto from './BuyCrypto';
import Transactions from './Transactions';
import { useWalletModal } from '../../context/WalletModalProvider';
import Main from './Main';

const style_modal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '820px',
  height: 'fit-content',
  padding: 0,
  backgroundColor: '#17181b',
  borderRadius: '20px',
};

interface VoidPureFuntion {
  (): void;
}

const WalletModal = () => {
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);

  const { open, setOpen, setModalType } = useWalletModal();

  const transactionsOpen: VoidPureFuntion = () => setIsTransactionOpen(true);
  const transactionsClose: VoidPureFuntion = () => setIsTransactionOpen(false);

  const handleClose: VoidPureFuntion = () => {
    setOpen(false);
    transactionsClose();
    setModalType(0);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style_modal}>
        {!isTransactionOpen ? (
          <Main transactionsOpen={transactionsOpen} />
        ) : (
          <Transactions transactionsClose={transactionsClose} handleClose={handleClose} />
        )}
      </Box>
    </Modal>
  );
};

export default WalletModal;
