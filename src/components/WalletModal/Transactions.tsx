import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Typography,
  InputBase,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableHead,
  Tooltip,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import LeftArrowImage from '../../assets/utils/line-angle-left-white-icon.svg';
import RightArrowImage from '../../assets/utils/line-angle-right-icon.svg';
import { useSocket } from '../../context/SocketProvider';
import { useWalletModal } from '../../context/WalletModalProvider';
import { NextButton, PrevButton } from '../Buttons/ImageButton';
import Icon, { DownIcon } from '../Icon';
import { scansites_test as scansites } from '../../constants';
import DownArrowImage from '../../assets/utils/line-angle-down-icon.svg';
import { MenuProps, MenuProps_page, page_limits } from '../../constants';
import { style_menuitem, style_select } from '../styles';
import { Rings } from 'react-loading-icons';
import grey from '@mui/material/colors/grey';

Swiper.use([Virtual, Navigation, Pagination]);

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const style_wallet_modal = {
  px: 4,
  py: 3,
  color: 'white',
  backgroundColor: '#17181b',
  borderRadius: '20px',
} as any;

const style_modal_content = {
  borderRadius: '20px',
  backgroundColor: '#202328',
  height: '570px',
  overflow: 'auto',
  MsOverflowStyle: 'none' /* IE and Edge */,
  scrollbarWidth: 'none' /* Firefox */,
};

const style_btn = {
  backgroundColor: 'transparent',
  color: '#F2F2F288',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: 'none',
  borderRadius: '10px',
  border: '1px solid #666666',
  width: '90px',
  height: '40px',
  margin: '0',
};

const style_btn_active = {
  ...style_btn,
  backgroundColor: '#202328',
  color: 'white',
};

const style_cell = {
  padding: '2px 20px',
};

const style_transaction_body = {
  backgroundColor: grey[900],
  padding: '40px',
  margin: 'auto',
  borderRadius: '0',
  height: '440px',
  overflow: 'auto',
  marginX: '20px',
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
};

const style_pagination = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: '25px',
};

const pagination_button = {
  borderRadius: '5px',
  border: '1px solid #666666',
  padding: '0.10px 5px',
  color: 'white',
};

type Tab = {
  name: string;
};

const tabs: Tab[] = [
  {
    name: 'Deposit',
    // icon: DepositIcon,
    // active_icon: DepositActiveIcon,
  },
  {
    name: 'Withdraw',
    // icon: WithdrawIcon,
    // active_icon: WithdrawActiveIcon,
  },
];

const transactionTypes = ['deposit', 'withdraw'];

interface Props {
  transactionsClose: () => void;
  handleClose: () => void;
}

const Transactions = ({ transactionsClose, handleClose }: Props) => {
  const [transactionType, setTransactionType] = useState<number>(0);
  const [currency, setCurrency] = useState<number>(0);
  const [pageLimit, setpageLimit] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [detailShow, setDetailShow] = useState<boolean>(false);
  const [detailIndex, setDetailIndex] = useState<number>(0);

  const {
    balanceData,
    transactionData,
    transactionTotal,
    transactionMutate,
    transactionIsLoading,
    priceData,
    tokenData,
    networkError,
  } = useSocket();
  const totalPage = Math.ceil((transactionTotal ?? 0) / page_limits[pageLimit]);
  const { setOpen } = useWalletModal();

  const detailTx = transactionData && transactionData[detailIndex];

  const handleCurrencyChange = (event: SelectChangeEvent<typeof currency>) => {
    const {
      target: { value },
    } = event;
    setCurrency(value as number);
  };

  const handlepageLimitChange = (event: SelectChangeEvent<typeof pageLimit>) => {
    const {
      target: { value },
    } = event;
    setpageLimit(value as number);
  };

  const handleDetailClick = (index: number) => {
    setDetailIndex(index);
    setDetailShow(true);
  };

  const goToPage = (pageNum: number) => {
    if (pageNum > totalPage - 1) return false;
    if (pageNum < 0) return false;
    setCurrentPage(pageNum);
    return true;
  };

  useEffect(() => {
    const data = {
      user_id: '1',
      type: transactionTypes[transactionType],
      limit: page_limits[pageLimit],
      page_number: currentPage,
      token_id: currency === 0 ? '0' : tokenData[currency - 1]?.id ?? '0',
    };
    transactionMutate(data);
  }, [currentPage, pageLimit, transactionType, currency]);

  useEffect(() => {
    setCurrentPage(0);
  }, [transactionType, currency]);

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
          <button
            type='button'
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              marginTop: '4px',
              marginRight: '20px',
            }}
            onClick={transactionsClose}
          >
            <img src={LeftArrowImage} alt='LeftArrowImage' width={10} />
          </button>
          <Typography variant='h3' fontStyle='italic' fontWeight='bold'>
            TRANSACTIONS
          </Typography>
          <Button
            sx={{
              color: '#F2F2F288',
              minWidth: 'fit-content',
              marginLeft: 'auto',
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '10px',
            alignItems: 'center',
          }}
        >
          {tabs.map((tab: Tab, index: number) => (
            <Tooltip title={tab.name} placement='bottom' key={tab.name}>
              <Button
                variant={index === transactionType ? 'text' : 'outlined'}
                style={index === transactionType ? style_btn_active : style_btn}
                onClick={() => setTransactionType(index)}
              >
                <Typography variant='h6' fontWeight='bold'>
                  {tab.name}
                </Typography>
              </Button>
            </Tooltip>
          ))}
          <Box sx={{ marginLeft: 'auto' }} className='currency_select'>
            <Select
              value={currency}
              onChange={handleCurrencyChange}
              input={<OutlinedInput />}
              renderValue={(selected: number) => {
                const token = tokenData[selected - 1];
                return token ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {Icon(token?.icon, 18)}
                    &nbsp;
                    {token?.name}
                  </Box>
                ) : (
                  'All currencies'
                );
              }}
              MenuProps={MenuProps}
              // IconComponent={() => DownIcon(DownArrowImage, 12)}
              // IconComponent={() => <ExpandMoreIcon />}
              // IconComponent={() => <Person />}
              sx={{ ...style_select, marginLeft: 'auto' }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem className='menuitem-currency' value={0} sx={style_menuitem}>
                All Currencies
              </MenuItem>
              {tokenData &&
                'map' in tokenData &&
                tokenData?.map((token: any, index: number) => (
                  <MenuItem
                    className='menuitem-currency'
                    key={token?.id}
                    value={index + 1}
                    sx={style_menuitem}
                  >
                    {Icon(token.icon, 18)}
                    &nbsp;
                    {token?.name}
                  </MenuItem>
                ))}
            </Select>
          </Box>
        </div>
      </Box>
      <Box className='no_scroll_bar' sx={style_modal_content}>
        <Box
          p='20px 20px 20px 20px'
          sx={{
            width: '100%',
            margin: 'auto',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              border: 'none',
              color: '#AAAAAA',
              fontSize: '14px',
              textAlign: 'center',
              paddingBottom: '20px',
              paddingX: '60px',
            }}
          >
            <Grid item sx={style_cell} sm={2}>
              Time
            </Grid>
            <Grid item sx={style_cell} sm={2}>
              Amount
            </Grid>
            <Grid item sx={style_cell} sm={2}>
              USD
            </Grid>
            <Grid item sx={style_cell} sm={3}>
              State
            </Grid>
            <Grid item sx={style_cell} sm={3}>
              Transaction
            </Grid>
          </Grid>
          <Box sx={style_transaction_body} className='modal_content'>
            {!transactionIsLoading &&
              (transactionData?.length
                ? transactionData?.map((tx: any, index: number) => {
                    return (
                      <Grid
                        key={tx.hash + tx.created_at + Math.random()}
                        container
                        spacing={2.5}
                        alignItems='center'
                        sx={{
                          color: 'white',
                          fontSize: '14px',
                          textAlign: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Grid sm={2} item sx={{ ...style_cell, color: '#AAAAAA' }} width={10}>
                          <Typography
                            variant='h6'
                            component='h6'
                            textAlign='center'
                            color='#AAAAAA'
                          >
                            {new Date(tx.created_at).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid sm={2} item sx={style_cell} width={20}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'end',
                              justifyContent: 'start',
                            }}
                          >
                            <Typography
                              variant='h6'
                              component='h6'
                              textAlign='right'
                              fontWeight='bold'
                              color='white'
                            >
                              {tx.amount}
                            </Typography>
                            &nbsp;&nbsp;
                            {Icon(
                              tokenData.find((token: any) => token.id === tx.token_id)?.icon,
                              25,
                            )}
                          </div>
                        </Grid>
                        <Grid sm={2} item sx={style_cell}>
                          <Typography
                            variant='h6'
                            component='h6'
                            textAlign='center'
                            fontWeight='bold'
                            color='white'
                            alignItems='end'
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
                        <Grid sm={3} item sx={style_cell}>
                          <Typography
                            variant='h6'
                            component='article'
                            textAlign='center'
                            fontWeight='bold'
                            mt={2}
                            mb={2}
                            color={tx.state === 'success' ? '#0abab5' : 'red'}
                          >
                            {tx.state === 'success' ? 'Success' : 'Fail'}
                          </Typography>
                        </Grid>
                        <Grid sm={3} item sx={style_cell} onClick={() => handleDetailClick(index)}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Typography
                              variant='h6'
                              component='article'
                              textAlign='center'
                              fontWeight='bold'
                              mt={2}
                              mb={2}
                              mr={1}
                              color='#7F7F7F'
                              sx={{ alignItems: 'center' }}
                            >
                              Click for details
                            </Typography>
                            {Icon(RightArrowImage, 10)}
                          </div>
                        </Grid>
                      </Grid>
                    );
                  })
                : 'No transaction data')}
            {transactionIsLoading && <Rings style={{ marginTop: '50%' }} />}
          </Box>
        </Box>
        <Modal
          open={detailShow}
          onClose={() => setDetailShow(false)}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={{ ...style_modal, width: '450px' }}>
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
            <Grid container spacing={2} overflow='hidden'>
              <Grid item xs={3}>
                State
              </Grid>
              <Grid item xs={9} color={detailTx?.state === 'success' ? '#0abab5' : 'red'}>
                {detailTx?.state === 'success' ? 'Success' : 'Fail'}
              </Grid>
              <Grid item xs={3}>
                Txid
              </Grid>
              <Grid item xs={9}>
                {detailTx?.hash?.slice(0, 30)}
                ... &nbsp; &nbsp; &nbsp;
                <a
                  href={scansites[detailTx?.net_id] + detailTx?.hash}
                  target='_blank'
                  rel='noreferrer'
                >
                  View
                </a>
              </Grid>
              <Grid item xs={3}>
                Order ID
              </Grid>
              <Grid item xs={9}>
                {detailTx?.id}
              </Grid>
              <Grid item xs={3}>
                Currency
              </Grid>
              <Grid item xs={9}>
                {tokenData?.find((token: any) => token?.id === detailTx?.token_id)?.name}
              </Grid>
              <Grid item xs={3}>
                Quantity
              </Grid>
              <Grid item xs={9}>
                {detailTx?.amount}
              </Grid>
              <Grid item xs={3}>
                Time
              </Grid>
              <Grid item xs={9}>
                {new Date(detailTx?.created_at).toLocaleString()}
              </Grid>
              {transactionType === 1 && (
                <>
                  <Grid item xs={3}>
                    Withdraw Addr...
                  </Grid>
                  <Grid item xs={9}>
                    {detailTx?.address}
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Modal>
        <Box sx={style_pagination} className='pagination_select'>
          <Select
            value={pageLimit}
            onChange={handlepageLimitChange}
            input={<OutlinedInput />}
            renderValue={(selected: number) => {
              return page_limits[selected];
            }}
            MenuProps={MenuProps_page}
            // IconComponent={() => DownIcon(DownArrowImage, 12)}
            // IconComponent={() => <ExpandMoreIcon />}
            // IconComponent={() => <Person />}
            sx={{
              ...style_select,
              color: '#7F7F7F',
              width: '80px',
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {page_limits.map((limit: number, index: number) => (
              <MenuItem
                className='menuitem-pageLimit'
                key={limit}
                value={index}
                sx={style_menuitem}
              >
                {limit}
              </MenuItem>
            ))}
          </Select>
          <Box marginX='40px' color='#7F7F7F'>
            Total&nbsp;
            {totalPage}
          </Box>
          <Box>
            <PrevButton handleClick={() => goToPage(currentPage - 1)} />
            <Button sx={pagination_button}>{currentPage + 1}</Button>
            <NextButton handleClick={() => goToPage(currentPage + 1)} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Transactions;
