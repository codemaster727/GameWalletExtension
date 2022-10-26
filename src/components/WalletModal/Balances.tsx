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

const style_type_btn = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '14px',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '80px',
  margin: '0 1.5rem 1rem',
  paddingTop: '8px',
  paddingBottom: '8px',
};

const style_type_btn_active = {
  ...style_type_btn,
  backgroundColor: '#374b21',
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
    alt="icon"
    src={icon}
    width="40px"
    height="40px"
    style={{ borderRadius: '20px', minWidth: '40px' }}
  />
);

const Balances = () => {
  const [isUSD, setIsUSD] = useState(true);
  const { loading, priceData, balanceData, tokenData } = useSocket();

  const total_USD_Price =
    !loading &&
    tokenData
      ?.map((token: any) => {
        const USD_Price =
          parseFloat(balanceData[token.id] ?? '0') *
          // token.balance *
          parseFloat(priceData[token.name.concat('-USD')]);
        return USD_Price;
      })
      ?.reduce((a: number, b: number) => a + b, 0);
  const total_EUR_Price =
    !loading &&
    tokenData
      ?.map((token: any) => {
        const EUR_Price =
          parseFloat(balanceData[token.id] ?? '0') *
          // token.balance *
          parseFloat(
            priceData[token.name.concat('-EUR')] ??
              parseFloat(priceData[token.name.concat('-USD')]) *
                priceData['USDT-EUR'],
          );
        return EUR_Price;
      })
      ?.reduce((a: number, b: number) => a + b, 0);

  const handleCurrencyChange = (value: boolean) => {
    if (value !== isUSD) {
      setIsUSD(value);
    }
  };

  return (
    <Box p="3rem 2rem 4rem 2rem">
      <div
        style={{
          margin: 'auto',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        {loading && 'loading'}
        <Box style={style_total_price} position="absolute">
          <Typography
            variant="h4"
            component="h4"
            textAlign="center"
            fontWeight="bold"
            color="#95F204"
            mb={1}
          >
            Total Balance
          </Typography>
          {isUSD ? (
            <Typography
              variant="h4"
              component="h4"
              textAlign="center"
              fontWeight="bold"
              color="#80FFFF"
            >
              $&nbsp;
              {!loading && total_USD_Price
                ? total_USD_Price.toFixed(2)
                : 'Loading...'}
            </Typography>
          ) : (
            <Typography
              variant="h4"
              component="h4"
              textAlign="center"
              fontWeight="bold"
              color="#FFFF80"
            >
              &euro;&nbsp;
              {!loading && total_EUR_Price
                ? total_EUR_Price.toFixed(2)
                : 'Loading...'}
            </Typography>
          )}
        </Box>
        <div
          style={{
            margin: 'auto',
            marginTop: '2rem',
            alignItems: 'center',
            width: 'fit-content',
          }}
        >
          <Button
            variant="contained"
            size="large"
            style={isUSD ? style_type_btn_active : style_type_btn}
            onClick={() => handleCurrencyChange(true)}
          >
            <Typography variant="h5" fontWeight="bold">
              USD
            </Typography>
          </Button>
          <Button
            variant="contained"
            size="large"
            style={!isUSD ? style_type_btn_active : style_type_btn}
            onClick={() => handleCurrencyChange(false)}
          >
            <Typography variant="h5" fontWeight="bold">
              EUR
            </Typography>
          </Button>
        </div>
        <Table sx={{ width: '50%', margin: 'auto' }} aria-label="simple table">
          <TableBody>
            {!loading &&
              tokenData?.map((token: any) => {
                const USD_Price =
                  parseFloat(balanceData[token.id] ?? '0') *
                  // token.balance *
                  parseFloat(priceData[token.name.concat('-USD')]);
                const EUR_Price =
                  parseFloat(balanceData[token.id] ?? '0') *
                  // token.balance *
                  parseFloat(
                    priceData[token.name.concat('-EUR')] ??
                      parseFloat(priceData[token.name.concat('-USD')]) *
                        priceData['USDT-EUR'],
                  );
                return (
                  <TableRow key={token.name} sx={{ td: { border: 'none' } }}>
                    <TableCell sx={style_row} component="td" scope="row">
                      {Icon(token.icon)}
                    </TableCell>
                    <TableCell sx={style_row} align="center">
                      <Typography
                        variant="h4"
                        component="h4"
                        textAlign="center"
                        fontWeight="bold"
                        mt={2}
                        mb={2}
                        color="#95F204"
                      >
                        {balanceData[token.id].toFixed(
                          Math.min(
                            Math.floor(
                              Math.log10(priceData[token.name.concat('-USD')]),
                            ),
                            3,
                          ) + 2,
                        ) ?? '0'}
                        &nbsp;
                        {token.name}
                      </Typography>
                    </TableCell>
                    {isUSD ? (
                      <TableCell sx={style_row} align="center">
                        <Typography
                          variant="h4"
                          component="h4"
                          textAlign="center"
                          fontWeight="bold"
                          mt={2}
                          mb={2}
                          color="#80FFFF"
                        >
                          $&nbsp;
                          {loading && 'Loading...'}
                          {!loading && USD_Price ? USD_Price.toFixed(2) : ''}
                        </Typography>
                      </TableCell>
                    ) : (
                      <TableCell sx={style_row} align="center">
                        <Typography
                          variant="h4"
                          component="h4"
                          textAlign="center"
                          fontWeight="bold"
                          mt={2}
                          mb={2}
                          color="#FFFF80"
                        >
                          &euro;&nbsp;
                          {loading && 'Loading...'}
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
    </Box>
  );
};

export default Balances;
