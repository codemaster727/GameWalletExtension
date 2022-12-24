import React, { useEffect, useState, useMemo } from 'react';
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
// import InfiniteScroll from 'react-infinite-scroll-component';
import { useWalletModal } from '../../context/WalletModalProvider';
import { SelectChangeEvent } from '@mui/material/Select';
import { scansites_test, scansites_main } from '../../constants';
import Icon from '~/components/Icon';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LoadingIcon from 'src/assets/utils/loading.gif';
import 'swiper/swiper-bundle.css';
import './transactions.scss';
import { useTheme } from '@mui/material';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { Rings } from 'react-loading-icons';
import { TransactionMutateParams } from '~/context/types';
import { NODE_ENV } from '~/constants/network';

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
  fontSize: '14px',
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

const scansites = NODE_ENV === 'test' ? scansites_test : scansites_main;

const Transactions = () => {
  const [transactionType, setTransactionType] = useState<number>(0);
  const [isDeposit, setIsDeposit] = useState('Deposit');
  const [detailShow, setDetailShow] = useState<boolean>(false);
  const [detailIndex, setDetailIndex] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(10);
  // const [hasMore, setHasMore] = useState<boolean>(true);
  // const [transactionTotal, setTotalTransactions] = useState<number>(100);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    balanceData,
    transactionIsLoading,
    // transactionData,
    // transactionTotal,
    transactionMutate,
    priceData,
    tokenData,
    networkError,
    ethTx,
    bscTx,
    arbiTx,
    polyTx,
    optTx,
    btcTx,
    ltcTx,
    solTx,
    tezosTx,
    tronTx,
    getTx,
  } = useSocket();

  const theme = useTheme();
  const totalTxs: any[] = useMemo(
    () =>
      []
        .concat(ethTx)
        .concat(bscTx)
        .concat(arbiTx)
        .concat(polyTx)
        .concat(optTx)
        .concat(btcTx)
        .concat(ltcTx)
        .concat(solTx)
        .concat(tezosTx)
        .concat(tronTx),
    [ethTx, bscTx, arbiTx, polyTx, optTx, btcTx, ltcTx, solTx, tezosTx, tronTx],
  );
  const transactionTotal = totalTxs.length;
  const tx_deposit = totalTxs
    ?.filter((tx: any, index: number) => {
      return tx && tx.action === transactionTypes[0];
    })
    .sort((tx1: any, tx2: any) => tx2.created_at - tx1.created_at);
  const tx_withdraw = totalTxs
    ?.filter((tx: any, index: number) => {
      return tx && tx.action === transactionTypes[1];
    })
    .sort((tx1: any, tx2: any) => tx2.created_at - tx1.created_at);
  const transactionData = transactionType === 0 ? tx_deposit : tx_withdraw;
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

  const fetchData = () => {
    // const count =
    //   transactionCount + 10 >= (transactionTotal ?? 0) ? transactionTotal : transactionCount + 10;
    // const data: TransactionMutateParams = {
    //   user_id: '1',
    //   limit: count ?? 0,
    //   page: 0,
    //   type: transactionTypes[transactionType],
    // };
    // setTransactionCount(count as number);
    // setLoading(false);
    // setTotalTransactions(transactionTotal??0);
    // transactionMutate(data);
    // if (count === (transactionTotal ?? 100) && transactionTotal != 0) {
    //   setHasMore(false);
    // }
  };
  let transactionStatus = (value: string) => {
    if (value === 'success') {
      return (
        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '25px', width: '20px' }} strokeWidth={5} />
      );
    } else {
      return <CancelOutlinedIcon sx={{ fontSize: '25px', width: '20px' }} strokeWidth={5} />;
    }
  };

  useEffect(() => {
    getTx();
  }, []);

  useEffect(() => {
    const data = {
      user_id: '1',
      limit: 10,
      page: 0,
      type: transactionTypes[transactionType],
    };
    setTransactionCount(10);
    // setLoading(true);
    // setHasMore(true);
    setItems([]);
    // transactionMutate(data);
  }, [transactionType]);

  // useEffect(() => {
  //   if (!transactionIsLoading) {
  //     // setLoading(false);
  //     if (transactionData?.length !== items?.length)
  //       setTimeout(() => setItems(transactionData), 1000);
  //   }
  // }, [transactionIsLoading]);

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
          to='/balances/0'
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
      <ScrollBox height={430}>
        {!(!transactionIsLoading && (transactionTotal ?? 0) === 0) ? (
          transactionIsLoading ? (
            <img src={LoadingIcon} width={80} style={{ marginTop: '45%' }} />
          ) : (
            // <InfiniteScroll
            //   dataLength={items?.length}
            //   height={420}
            //   next={() => fetchData()}
            //   hasMore={!transactionIsLoading && items?.length < (transactionTotal ?? 0)}
            //   loader={<Rings style={{ marginBottom: loading ? '50%' : '10px' }} />}
            //   scrollThreshold={0.9}
            //   endMessage={
            //     <p style={{ textAlign: 'center' }}>
            //       {!transactionIsLoading &&
            //       transactionData !== undefined &&
            //       transactionData?.length > 0 &&
            //       !loading ? (
            //         <b>No more</b>
            //       ) : (
            //         <Rings style={{ marginBottom: '50%' }} />
            //       )}
            //     </p>
            //   }
            // >
            //   {/* {!loading ? ( */}
            //   <Box padding='15px'>
            //     {items?.length ? (
            //       items?.map((tx: any, index: number) => {
            //         return (
            //           <Grid
            //             key={tx.hash + tx.id}
            //             container
            //             spacing={1.4}
            //             alignItems='center'
            //             sx={{
            //               color: 'white',
            //               fontSize: '14px',
            //               textAlign: 'center',
            //               alignItems: 'center',
            //               cursor: 'pointer',
            //             }}
            //           >
            //             <Grid
            //               item
            //               xs={4}
            //               sx={{ ...style_row, color: '#AAAAAA' }}
            //               onClick={() => handleDetailClick(index)}
            //             >
            //               <Typography
            //                 variant='h6'
            //                 component='h6'
            //                 textAlign='center'
            //                 color='#AAAAAA'
            //                 mt={1}
            //                 mb={1}
            //               >
            //                 {new Date(tx.created_at).toLocaleString()}
            //               </Typography>
            //             </Grid>
            //             <Grid item xs={4} sx={style_row} onClick={() => handleDetailClick(index)}>
            //               <div
            //                 style={{
            //                   display: 'flex',
            //                   alignItems: 'center',
            //                   justifyContent: 'end',
            //                 }}
            //               >
            //                 <Typography
            //                   variant='h5'
            //                   component='h5'
            //                   textAlign='right'
            //                   fontWeight='bold'
            //                   color='white'
            //                   mt={1}
            //                   mb={1}
            //                 >
            //                   {tx.amount}
            //                 </Typography>
            //                 &nbsp;&nbsp;
            //                 {Icon(tokenData.find((token: any) => token.id === tx.token_id)?.icon, 25)}
            //               </div>
            //             </Grid>
            //             <Grid item xs={2} sx={style_row} onClick={() => handleDetailClick(index)}>
            //               <Typography
            //                 variant='h5'
            //                 component='h5'
            //                 textAlign='center'
            //                 fontWeight='bold'
            //                 color='white'
            //                 alignItems='end'
            //                 mt={1}
            //                 mb={1}
            //               >
            //                 $
            //                 {(
            //                   tx.amount *
            //                   priceData[
            //                     `${tokenData.find((token: any) => token.id === tx.token_id)?.name}-USD`
            //                   ]
            //                 )?.toFixed(2)}
            //               </Typography>
            //             </Grid>
            //             <Grid item xs={2} sx={style_row} onClick={() => handleDetailClick(index)}>
            //               <Typography
            //                 variant='h6'
            //                 component='h6'
            //                 textAlign='center'
            //                 fontWeight='bold'
            //                 mt={1}
            //                 mb={1}
            //                 color={
            //                   tx.state === 'success'
            //                     ? theme.palette.primary.main
            //                     : theme.palette.error.main
            //                 }
            //               >
            //                 {transactionStatus(tx.state)}
            //               </Typography>
            //             </Grid>
            //           </Grid>
            //         );
            //       })
            //     ) : (
            //       <></>
            //     )}
            //   </Box>
            //   {/* ) : ( */}
            //   {/* // <Rings style={{ marginTop: '50%' }} /> */}
            //   <></>
            //   {/* )} */}
            // </InfiniteScroll>
            <Box padding='15px'>
              {transactionData?.length
                ? transactionData.map((tx: any, index: number) => {
                    return (
                      <Grid
                        key={tx.hash + transactionType + index}
                        container
                        spacing={1.4}
                        alignItems='center'
                        sx={{
                          color: 'white',
                          fontSize: '14px',
                          textAlign: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {/* <Grid
                          item
                          xs={2}
                          sx={{ ...style_row, color: '#AAAAAA' }}
                          onClick={() => handleDetailClick(index)}
                        >
                          {transactionType}-{index}
                        </Grid> */}
                        <Grid
                          item
                          xs={4}
                          sx={{ ...style_row, color: '#AAAAAA' }}
                          onClick={() => handleDetailClick(index)}
                        >
                          <Typography
                            variant='h6'
                            component='h6'
                            textAlign='center'
                            color='#AAAAAA'
                            mt={1}
                            mb={1}
                          >
                            {new Date(parseInt(tx?.created_at ?? '0')).toLocaleString()}
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
                              variant='h5'
                              component='h5'
                              textAlign='right'
                              fontWeight='bold'
                              color='white'
                              mt={1}
                              mb={1}
                            >
                              {parseFloat(tx?.amount ?? 0).toFixed(5)}
                            </Typography>
                            &nbsp;&nbsp;
                            {Icon(
                              tokenData.find((token: any) => token.name === tx.asset)?.icon,
                              25,
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={2} sx={style_row} onClick={() => handleDetailClick(index)}>
                          <Typography
                            variant='h5'
                            component='h5'
                            textAlign='center'
                            fontWeight='bold'
                            color='white'
                            alignItems='end'
                            mt={1}
                            mb={1}
                          >
                            ${((tx?.amount ?? 0) * priceData[`${tx.asset}-USD`])?.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={style_row} onClick={() => handleDetailClick(index)}>
                          <Typography
                            variant='h6'
                            component='h6'
                            textAlign='center'
                            fontWeight='bold'
                            mt={1}
                            mb={1}
                            color={
                              tx.state === 'success' || true
                                ? theme.palette.primary.main
                                : theme.palette.error.main
                            }
                          >
                            {transactionStatus(tx?.state ?? 'success')}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  })
                : null}
            </Box>
          )
        ) : (
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
            No transaction data
          </Typography>
        )}
      </ScrollBox>
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
                detailTx?.state === 'success' || true
                  ? theme.palette.primary.main
                  : theme.palette.error.main
              }
            >
              {detailTx?.state === 'success' || true ? 'Success' : 'Fail'}
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
              BlockNum
            </Grid>
            <Grid item xs={8}>
              {detailTx?.blockNum}
            </Grid>
            <Grid item xs={4}>
              Currency
            </Grid>
            <Grid item xs={8}>
              {tokenData?.find((token: any) => token?.name === detailTx?.asset)?.name}
            </Grid>
            <Grid item xs={4}>
              Quantity
            </Grid>
            <Grid item xs={8}>
              {parseFloat(detailTx?.amount ?? 0).toFixed(5)}
            </Grid>
            <Grid item xs={4}>
              Time
            </Grid>
            <Grid item xs={8}>
              {new Date(detailTx?.created_at ?? 0).toLocaleString()}
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
