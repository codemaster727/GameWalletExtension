import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  OutlinedInput,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Modal,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketProvider';
import ScrollBox from '~/components/Layout/ScrollBox';
// @ts-ignore
import InfiniteScroll from 'react-infinite-scroll-component';
import { useWalletModal } from '../../context/WalletModalProvider';
import { SelectChangeEvent } from '@mui/material/Select';
import { scansites_test as scansites } from '../../constants';
import Icon from '~/components/Icon';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import 'swiper/swiper-bundle.css';
import './transactions.scss';
import { useTheme } from '@mui/material';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { Rings } from 'react-loading-icons';

const style_type_btn = {
  fontSize: '14px',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '80px',
  paddingTop: '4px',
  paddingBottom: '4px',
};

const style_type_btn_active = {
  ...style_type_btn,
  border: '1px solid #84d309',
  fontWeight: 'bold',
  color: 'white',
};

const style_cell = {
  padding: '2px 20px',
};

const style_row = {
  padding: '0px 10px',
};

const style_modal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 'fit-content',
  padding: '50px 30px',
  backgroundColor: '#393a3e',
  borderRadius: '10px',
  fontSize: '12px',
  fontFamily: 'Arial, sans-serif',
};

type Tab = {
  name: string;
};

const tabs: Tab[] = [
  {
    name: 'Deposit',
  },
  {
    name: 'Withdraw',
  },
];

const transactionTypes = ['deposit', 'withdraw'];

const Transactions = () => {
  const [transactionType, setTransactionType] = useState<number>(0);
  const [isDeposit, setIsDeposit] = useState('Deposit');
  const [detailShow, setDetailShow] = useState<boolean>(false);
  const [detailIndex, setDetailIndex] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalTransactions, setTotalTransactions] = useState<number>(100);
  const {
    balanceData,
    transactionData,
    transactionTotal,
    transactionMutate,
    priceData,
    tokenData,
    transactionIsLoading,
    networkError,
  } = useSocket();

  const theme = useTheme();

  const detailTx = transactionData && transactionData[detailIndex];

  const handleDetailClick = (index: number) => {
    setDetailIndex(index);
    setDetailShow(true);
  };

  const handleTypeChange = (value: string) => {
    if (value !== isDeposit) {
      setIsDeposit(value);
    }
  };

  const fetchData = (count: number) => {
    console.log(totalTransactions);
    if (count >= (totalTransactions ?? 100) && totalTransactions != 0) {
      setHasMore(false);
      return;
    }
    const data = {
      user_id: '1',
      limit: count,
      type: transactionTypes[transactionType],
    };
    setTransactionCount(transactionCount + 10);
    setTotalTransactions(transactionTotal ?? 100);
    transactionMutate(data);
  };
  let transactionStatus = (value: string) => {
    if (value === 'success') {
      return <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '25px' }} strokeWidth={5} />;
    } else {
      return <CancelOutlinedIcon sx={{ fontSize: '25px' }} strokeWidth={5} />;
    }
  };
  useEffect(() => {
    const data = {
      user_id: '1',
      limit: 20,
      type: transactionTypes[transactionType],
    };
    setTransactionCount(transactionCount + 10);
    transactionMutate(data);
  }, [transactionType]);

  useEffect(() => {
    console.log('here');
  }, [transactionData, transactionIsLoading]);

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
          sx={{ color: theme.palette.text.secondary, marginRight: 'auto' }}
          component={Link}
          to='/balances'
        >
          Balance
        </Button>
        {tabs.map((tab: Tab, index: number) => (
          <ButtonWithActive
            isActive={index === transactionType}
            width={80}
            handleFn={() => setTransactionType(index)}
            label={tab.name}
          />
        ))}
      </Box>
      <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
      <InfiniteScroll
        dataLength={transactionCount}
        height={420}
        next={() => {
          fetchData(transactionCount);
        }}
        hasMore={hasMore}
        loader={<Rings style={{ marginTop: '50%' }} />}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>No more</b>
          </p>
        }
      >
        <Box padding='15px'>
          {!transactionIsLoading &&
            (transactionData?.length
              ? transactionData?.map((tx: any, index: number) => {
                  return (
                    <Grid
                      key={tx.hash + tx.created_at + Math.random()}
                      container
                      spacing={1.4}
                      alignItems='center'
                      sx={{
                        color: 'white',
                        fontSize: '12px',
                        textAlign: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Grid
                        item
                        xs={4}
                        sx={{ ...style_row, color: '#AAAAAA' }}
                        onClick={() => handleDetailClick(index)}
                      >
                        <Typography
                          variant='h5'
                          component='h5'
                          textAlign='center'
                          color='#AAAAAA'
                          mt={1}
                          mb={1}
                        >
                          {new Date(tx.created_at).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={style_row} onClick={() => handleDetailClick(index)}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'end',
                          }}
                        >
                          <Typography
                            variant='h4'
                            component='h4'
                            textAlign='right'
                            fontWeight='bold'
                            color='white'
                            mt={1}
                            mb={1}
                          >
                            {tx.amount}
                          </Typography>
                          &nbsp;&nbsp;
                          {Icon(tokenData.find((token: any) => token.id === tx.token_id)?.icon, 25)}
                        </div>
                      </Grid>
                      <Grid item xs={2} sx={style_row} onClick={() => handleDetailClick(index)}>
                        <Typography
                          variant='h4'
                          component='h4'
                          textAlign='center'
                          fontWeight='bold'
                          color='white'
                          alignItems='end'
                          mt={1}
                          mb={1}
                        >
                          $
                          {(
                            tx.amount *
                            priceData[
                              `${
                                tokenData.find((token: any) => token.id === tx.token_id)?.name
                              }-USD`
                            ]
                          )?.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sx={style_row} onClick={() => handleDetailClick(index)}>
                        <Typography
                          variant='h5'
                          component='h5'
                          textAlign='center'
                          fontWeight='bold'
                          mt={1}
                          mb={1}
                          color={
                            tx.state === 'success'
                              ? theme.palette.primary.main
                              : theme.palette.error.main
                          }
                        >
                          {transactionStatus(tx.state)}
                        </Typography>
                      </Grid>
                    </Grid>
                  );
                })
              : 'No transaction data')}
        </Box>
      </InfiniteScroll>
      <Modal
        open={detailShow}
        onClose={() => setDetailShow(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={{ ...style_modal, width: '300px' }}>
          <Button
            sx={{
              color: '#F2F2F288',
              minWidth: 'fit-content',
              position: 'absolute',
              top: '30px',
              right: '20px',
            }}
            onClick={() => setDetailShow(false)}
          >
            <CloseIcon />
          </Button>
          <Grid container spacing={[2, 5]} overflow='hidden'>
            <Grid item xs={4}>
              State
            </Grid>
            <Grid
              item
              xs={8}
              color={
                detailTx?.state === 'success'
                  ? theme.palette.primary.main
                  : theme.palette.error.main
              }
            >
              {detailTx?.state === 'success' ? 'Success' : 'Fail'}
            </Grid>
            <Grid item xs={4}>
              Txid
            </Grid>
            <Grid item xs={8}>
              {detailTx?.hash?.slice(0, 8)}
              ... &nbsp; &nbsp; &nbsp;
              <a
                href={scansites[detailTx?.net_id] + detailTx?.hash}
                target='_blank'
                rel='noreferrer'
              >
                View
              </a>
            </Grid>
            <Grid item xs={4}>
              Order ID
            </Grid>
            <Grid item xs={8}>
              {detailTx?.id}
            </Grid>
            <Grid item xs={4}>
              Currency
            </Grid>
            <Grid item xs={8}>
              {tokenData?.find((token: any) => token?.id === detailTx?.token_id)?.name}
            </Grid>
            <Grid item xs={4}>
              Quantity
            </Grid>
            <Grid item xs={8}>
              {detailTx?.amount}
            </Grid>
            <Grid item xs={4}>
              Time
            </Grid>
            <Grid item xs={8}>
              {new Date(detailTx?.created_at).toLocaleString()}
            </Grid>
            {transactionType === 1 && (
              <>
                <Grid item xs={4}>
                  Withdraw Addr...
                </Grid>
                <Grid item xs={8}>
                  {detailTx?.address}
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default Transactions;
