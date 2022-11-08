import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import { useSocket } from '../../context/SocketProvider';
import { Rings } from 'react-loading-icons';

const style_type_btn = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '14px',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '80px',
  margin: '0 15px 10px',
  paddingTop: '8px',
  paddingBottom: '8px',
};

const style_type_btn_active = {
  ...style_type_btn,
  backgroundColor: '#1c4043',
  border: '1px solid #84d309',
  fontWeight: 'bold',
  color: 'white',
};

const style_row = {
  padding: '2px 20px',
};

const style_total_price = {
  top: -12,
  right: 12,
};

const Icon = (icon: any) => (
  <img
    alt='icon'
    src={icon}
    width='40px'
    height='40px'
    style={{ borderRadius: '20px', minWidth: '40px' }}
  />
);

const Balances = () => {
  const [isUSD, setIsUSD] = useState(true);
  const { loading, priceData, balanceData, tokenData } = useSocket();

  const total_USD_price =
    !loading &&
    tokenData &&
    tokenData
      ?.map((token: any) => {
        const USD_Price =
          parseFloat(balanceData[token.id] ?? '0') *
          // token.balance *
          parseFloat(priceData[token.name.concat('-USD')]);
        return USD_Price;
      })
      ?.reduce((a: number, b: number) => a + b, 0);
  const total_EUR_price: number =
    !loading &&
    tokenData &&
    priceData &&
    (total_USD_price * priceData['USDT-EUR']) / priceData['USDT-USD'];

  const handleCurrencyChange = (value: boolean) => {
    if (value !== isUSD) {
      setIsUSD(value);
    }
  };

  return (
    <Box p='30px 20px 40px 20px'>
      <div
        style={{
          margin: 'auto',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {loading && 'loading'}
        <Box style={style_total_price} position='absolute'>
          <Typography
            variant='h4'
            component='h4'
            textAlign='center'
            fontWeight='bold'
            color='#0abab5'
            mb={1}
          >
            Total Balance
          </Typography>
          {isUSD ? (
            <Typography
              variant='h4'
              component='h4'
              textAlign='center'
              fontWeight='bold'
              color='#95F204'
            >
              $&nbsp;
              {!loading && total_USD_price ? (
                total_USD_price.toFixed(2)
              ) : (
                <Rings style={{ marginTop: '50%' }} />
              )}
            </Typography>
          ) : (
            <Typography
              variant='h4'
              component='h4'
              textAlign='center'
              fontWeight='bold'
              color='#FFFF80'
            >
              &euro;&nbsp;
              {!loading && total_EUR_price ? (
                total_EUR_price.toFixed(2)
              ) : (
                <Rings style={{ marginTop: '50%' }} />
              )}
            </Typography>
          )}
        </Box>
        <div
          style={{
            margin: 'auto',
            marginTop: '20px',
            alignItems: 'center',
            width: 'fit-content',
          }}
        >
          <Button
            variant='contained'
            size='large'
            style={isUSD ? style_type_btn_active : style_type_btn}
            onClick={() => handleCurrencyChange(true)}
          >
            <Typography variant='h5' fontWeight='bold'>
              USD
            </Typography>
          </Button>
          <Button
            variant='contained'
            size='large'
            style={!isUSD ? style_type_btn_active : style_type_btn}
            onClick={() => handleCurrencyChange(false)}
          >
            <Typography variant='h5' fontWeight='bold'>
              EUR
            </Typography>
          </Button>
        </div>
        <div
          className='no_scroll_bar'
          style={{
            padding: '0 30px',
            marginTop: '20px',
            marginBottom: '20px',
            height: '420px',
            overflow: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Table sx={{ width: '50%', margin: 'auto' }} aria-label='simple table'>
            <TableBody>
              {!loading &&
                tokenData &&
                tokenData?.map((token: any) => {
                  const USD_Price =
                    parseFloat(balanceData[token.id] ?? '0') *
                    parseFloat(priceData[token.name.concat('-USD')]);
                  const EUR_Price = USD_Price * priceData['USDT-EUR'];
                  return (
                    <TableRow key={token.name} sx={{ td: { border: 'none' } }}>
                      <TableCell sx={style_row} component='td' scope='row'>
                        {Icon(token.icon)}
                      </TableCell>
                      <TableCell sx={style_row} align='center'>
                        <Typography
                          variant='h4'
                          component='h4'
                          textAlign='center'
                          fontWeight='bold'
                          mt={2}
                          mb={2}
                          color='#0abab5'
                        >
                          {balanceData[token.id]?.toFixed(
                            Math.min(
                              Math.floor(Math.log10(priceData[token.name.concat('-USD')])),
                              3,
                            ) + 2,
                          ) ?? '0'}
                          &nbsp;
                          {token.name}
                        </Typography>
                      </TableCell>
                      {isUSD ? (
                        <TableCell sx={style_row} align='center'>
                          <Typography
                            variant='h4'
                            component='h4'
                            textAlign='center'
                            fontWeight='bold'
                            mt={2}
                            mb={2}
                            color='#95F204'
                          >
                            $&nbsp;
                            {loading && <Rings style={{ marginTop: '50%' }} />}
                            {!loading && USD_Price ? USD_Price.toFixed(2) : ''}
                          </Typography>
                        </TableCell>
                      ) : (
                        <TableCell sx={style_row} align='center'>
                          <Typography
                            variant='h4'
                            component='h4'
                            textAlign='center'
                            fontWeight='bold'
                            mt={2}
                            mb={2}
                            color='#FFFF80'
                          >
                            &euro;&nbsp;
                            {loading && <Rings style={{ marginTop: '50%' }} />}
                            {!loading && EUR_Price ? EUR_Price.toFixed(2) : ''}
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Box>
  );
};

export default Balances;
