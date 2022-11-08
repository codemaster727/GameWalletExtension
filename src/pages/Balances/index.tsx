import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import Switch from 'react-switch';
import { useSocket } from '../../context/SocketProvider';
import './balances.scss';
import Icon from '~/components/Icon';
import ScrollBox from '~/components/Layout/ScrollBox';
import { Rings } from 'react-loading-icons';
import StyledMenu from '~/components/Menu/StyledMenu';
import { Link } from 'react-router-dom';
import { style_menu_item } from '~/components/styles';
import DepositActiveIcon from '../../assets/coingroup/deposit_active.png';
import WithdrawActiveIcon from '../../assets/coingroup/withdraw_active.png';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';

const style_row = {
  padding: '2px 10px',
};

const Balances = () => {
  const [isUSD, setIsUSD] = useState<boolean>(true);
  const [isNFT, setIsNFT] = useState<boolean>(false);
  const [token, setToken] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { loading, priceData, balanceData, tokenData } = useSocket();
  const open = Boolean(anchorEl);

  const total_USD_price: number =
    !loading &&
    tokenData &&
    tokenData
      ?.map((token: any) => {
        const USD_price =
          parseFloat(balanceData[token.id] ?? '0') *
          // token.balance *
          parseFloat(priceData[token.name.concat('-USD')]);
        return USD_price;
      })
      ?.reduce((a: number, b: number) => a + b, 0);
  // const total_EUR_price =
  //   !loading &&
  //   tokenData &&
  //   tokenData
  //     ?.map((token: any) => {
  //       const EUR_price =
  //         parseFloat(balanceData[token.id] ?? '0') *
  //         // token.balance *
  //         parseFloat(
  //           priceData[token.name.concat('-EUR')] ??
  //             parseFloat(priceData[token.name.concat('-USD')]) * priceData['USDT-EUR'],
  //         );
  //       return EUR_price;
  //     })
  //     ?.reduce((a: number, b: number) => a + b, 0);
  const total_EUR_price: number =
    !loading &&
    tokenData &&
    priceData &&
    (total_USD_price * priceData['USDT-EUR']) / priceData['USDT-USD'];

  const total_NFT_price: number = 5000;

  type TotalPrice = {
    [key: string]: number;
  };
  const total_price: TotalPrice = {
    USD: total_USD_price,
    EUR: total_EUR_price,
    NFT: total_NFT_price,
  };

  const handleCurrencyChange = (value: boolean) => {
    if (value !== isNFT) {
      setIsNFT(value);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, token_id: number) => {
    setAnchorEl(event.currentTarget);
    setToken(token_id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (currency_select: boolean) => {
    setIsUSD(!currency_select);
  };

  return (
    <Box className='base-box'>
      <Box>
        <div
          style={{
            margin: 'auto',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            position='relative'
            display='flex'
            justifyContent='center'
            alignItems='center'
            sx={{ margin: '8px 20px' }}
          >
            {!isNFT && (
              <Switch
                onChange={handleChange}
                checked={!isUSD}
                borderRadius={40}
                className={`react-switch ${!isUSD ? 'bg-white' : 'bg-black'}`}
                offColor='black'
                onColor='white'
                offHandleColor='white'
                onHandleColor='black'
                height={20}
                width={36}
                uncheckedIcon={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      fontSize: 14,
                      color: 'white',
                      paddingRight: 2,
                    }}
                  >
                    &euro;
                  </div>
                }
                checkedIcon={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      fontSize: 14,
                      color: 'black',
                      paddingRight: 2,
                    }}
                  >
                    $
                  </div>
                }
                uncheckedHandleIcon={
                  <div
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 18,
                      height: 18,
                      borderRadius: 20,
                      backgroundColor: 'black',
                      outline: '1px solid white',
                    }}
                  />
                }
                checkedHandleIcon={
                  <div
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 18,
                      height: 18,
                      borderRadius: 20,
                      backgroundColor: 'black',
                      outline: '1px solid black',
                    }}
                  />
                }
              />
            )}
            <ButtonWithActive
              isActive={!isNFT}
              size='large'
              width={80}
              handleFn={() => handleCurrencyChange(false)}
              label='Balance'
            />
            <ButtonWithActive
              isActive={isNFT}
              size='large'
              width={80}
              handleFn={() => handleCurrencyChange(true)}
              label='NFT'
            />
          </Box>
          <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
          {loading ? (
            <Rings style={{ marginTop: '50%' }} />
          ) : (
            <ScrollBox height={370}>
              <Box padding='20px 30px'>
                <StyledMenu
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <Link to={`/deposit/${token}`}>
                    <MenuItem onClick={handleClose} disableRipple sx={style_menu_item}>
                      {Icon(DepositActiveIcon)}
                      {'Deposit'}
                    </MenuItem>
                  </Link>
                  <Link to={`/withdraw/${token}`}>
                    <MenuItem onClick={handleClose} disableRipple sx={style_menu_item}>
                      {Icon(WithdrawActiveIcon)}
                      {'Withdraw'}
                    </MenuItem>
                  </Link>
                </StyledMenu>
                {!isNFT ? (
                  <Table aria-label='simple table'>
                    <TableBody>
                      {!loading &&
                        tokenData &&
                        priceData &&
                        tokenData?.map((token: any, index: number) => {
                          const USD_price =
                            parseFloat(balanceData[token.id] ?? '0') *
                            parseFloat(priceData[token.name.concat('-USD')]);
                          const EUR_price =
                            (USD_price * priceData['USDT-EUR']) / priceData['USDT-USD'];
                          return (
                            <TableRow
                              key={token.id}
                              sx={{ cursor: 'pointer', td: { border: 'none' } }}
                              onClick={(event: React.MouseEvent<HTMLElement>) => {
                                handleClick(event, index);
                              }}
                            >
                              <TableCell sx={style_row} component='td' scope='row'>
                                {Icon(token.icon, 30)}
                              </TableCell>
                              <TableCell sx={style_row} align='center'>
                                <Typography
                                  variant='h5'
                                  component='h5'
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
                                    variant='h5'
                                    component='h5'
                                    textAlign='center'
                                    fontWeight='bold'
                                    mt={2}
                                    mb={2}
                                    color='white'
                                  >
                                    $&nbsp;
                                    {loading && <Rings style={{ marginTop: '50%' }} />}
                                    {!loading && USD_price ? USD_price.toFixed(2) : ''}
                                  </Typography>
                                </TableCell>
                              ) : (
                                <TableCell sx={style_row} align='center'>
                                  <Typography
                                    variant='h5'
                                    component='h5'
                                    textAlign='center'
                                    fontWeight='bold'
                                    mt={2}
                                    mb={2}
                                    color='#FFFF80'
                                  >
                                    &euro;&nbsp;
                                    {loading && <Rings style={{ marginTop: '50%' }} />}
                                    {!loading && EUR_price ? EUR_price.toFixed(2) : ''}
                                  </Typography>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                ) : (
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    flexWrap='wrap'
                    sx={{ rowGap: '15px' }}
                  >
                    <img
                      src='https://lh3.googleusercontent.com/4t_V3PZIWapc3QYlGh5IVgf9PVQh_HSJiheFzru2ZPK_9zl9zuIMknH2A8lyDwV6fj2vRooV7Z4sEW2CQW66w1C2P00YvryZ1KIUlDtvPLbiR6wD4qCb2H6kWl7mAjjjYILklrPu'
                      alt='CryptoPunks'
                      width={125}
                      height={125}
                      data-xblocker='passed'
                    />
                    <img
                      src='https://lh3.googleusercontent.com/4t_V3PZIWapc3QYlGh5IVgf9PVQh_HSJiheFzru2ZPK_9zl9zuIMknH2A8lyDwV6fj2vRooV7Z4sEW2CQW66w1C2P00YvryZ1KIUlDtvPLbiR6wD4qCb2H6kWl7mAjjjYILklrPu'
                      alt='CryptoPunks'
                      width={125}
                      height={125}
                      data-xblocker='passed'
                    />
                    <img
                      src='https://lh3.googleusercontent.com/4t_V3PZIWapc3QYlGh5IVgf9PVQh_HSJiheFzru2ZPK_9zl9zuIMknH2A8lyDwV6fj2vRooV7Z4sEW2CQW66w1C2P00YvryZ1KIUlDtvPLbiR6wD4qCb2H6kWl7mAjjjYILklrPu'
                      alt='CryptoPunks'
                      width={125}
                      height={125}
                      data-xblocker='passed'
                    />
                    <img
                      src='https://lh3.googleusercontent.com/4t_V3PZIWapc3QYlGh5IVgf9PVQh_HSJiheFzru2ZPK_9zl9zuIMknH2A8lyDwV6fj2vRooV7Z4sEW2CQW66w1C2P00YvryZ1KIUlDtvPLbiR6wD4qCb2H6kWl7mAjjjYILklrPu'
                      alt='CryptoPunks'
                      width={125}
                      height={125}
                      data-xblocker='passed'
                    />
                    <img
                      src='https://lh3.googleusercontent.com/4t_V3PZIWapc3QYlGh5IVgf9PVQh_HSJiheFzru2ZPK_9zl9zuIMknH2A8lyDwV6fj2vRooV7Z4sEW2CQW66w1C2P00YvryZ1KIUlDtvPLbiR6wD4qCb2H6kWl7mAjjjYILklrPu'
                      alt='CryptoPunks'
                      width={125}
                      height={125}
                      data-xblocker='passed'
                    />
                  </Box>
                )}
              </Box>
            </ScrollBox>
          )}
        </div>
      </Box>
      {!loading && (
        <Box className='bottom-box'>
          {
            <>
              <Typography
                variant='h5'
                component='h5'
                textAlign='center'
                fontWeight='bold'
                color='#0abab5'
                mx={1}
              >
                Total Balance
              </Typography>
              <Typography
                variant='h5'
                component='h5'
                textAlign='center'
                fontWeight='bold'
                color={isUSD || isNFT ? 'white' : '#FFFF80'}
                mx={1}
              >
                {isUSD || isNFT ? <>$&nbsp;</> : <>&euro;&nbsp;</>}
                {!loading && total_price[!isNFT ? (isUSD ? 'USD' : 'EUR') : 'NFT'] ? (
                  total_price[!isNFT ? (isUSD ? 'USD' : 'EUR') : 'NFT']?.toFixed(2)
                ) : (
                  <Rings style={{ marginTop: '50%' }} />
                )}
              </Typography>
            </>
          }
        </Box>
      )}
    </Box>
  );
};

export default Balances;
