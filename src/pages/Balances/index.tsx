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
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useSocket } from '../../context/SocketProvider';
import { useStateContext } from '../../context/StateProvider';
import './balances.scss';
import Icon from '~/components/Icon';
import ScrollBox from '~/components/Layout/ScrollBox';
import { Rings } from 'react-loading-icons';
import StyledMenu from '~/components/Menu/StyledMenu';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { style_menu_item } from '~/components/styles';
import DepositActiveIcon from '../../assets/coingroup/deposit_active.png';
import WithdrawActiveIcon from '../../assets/coingroup/withdraw_active.png';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { balance_actions } from '~/context/StateProvider/Actions/BalanceAction';
import { defaultNetId, precision } from '~/utils/helper';
import Swap from '../Swap';
import LoadingIcon from 'src/assets/utils/loading.gif';

const style_row = {
  padding: '2px 10px',
};

export const token_images = [
  'https://s.yimg.com/os/creatr-uploaded-images/2021-12/9908fc00-5398-11ec-b7bf-8dded52a981b',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKku5IPCzxbRJIP6VUcUkR4dezJxakOIH6-Q&usqp=CAU',
  'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg',
  'https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000',
  'https://static.ffx.io/images/$zoom_0.473%2C$multiply_1.545%2C$ratio_1%2C$width_378%2C$x_0%2C$y_0/t_crop_custom/q_86%2Cf_auto/d22d363b42bd80403a8a0847e21360116d15edfa',
];

const Balances = () => {
  // const [isUSD, setIsUSD] = useState<boolean>(true);
  // const [isNFT, setIsNFT] = useState<boolean>(false);
  const [token, setToken] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { loading, priceData, balanceData, tokenData, netData } = useSocket();
  const { state, dispatch } = useStateContext();
  const { isUSD } = state.balance_states;
  // const tokenData = tokenDataOrigin.slice(0, tokenDataOrigin.length - 1);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const { tab } = useParams();
  const isBalance = tab === '0';
  const isNFT = tab === '1';
  const isSwap = tab === '2';

  const total_USD_price: number =
    !loading && tokenData
      ? tokenData
          ?.map((token: any) => {
            const USD_price =
              parseFloat(balanceData[token.id] ?? '0') *
              // token.balance *
              parseFloat(priceData[token.name.concat('-USD')]);
            return USD_price;
          })
          ?.reduce((a: number, b: number) => a + (b ?? 0), 0)
      : 0;
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
  //             parseFloat(priceData[token.name.concat('-USD')]) * priceData['EUR-USD'],
  //         );
  //       return EUR_price;
  //     })
  //     ?.reduce((a: number, b: number) => a + b, 0);
  const total_EUR_price: number =
    !loading && tokenData && priceData ? total_USD_price / priceData['EUR-USD'] : 0;

  const total_NFT_price: number = 5000;

  type TotalPrice = {
    [key: string]: number;
  };
  const total_price: TotalPrice = {
    USD: total_USD_price,
    EUR: total_EUR_price,
    NFT: total_NFT_price,
  };

  const handleTypeChange = (value: number) => {
    navigate(`/balances/${value}`);
    // if (value !== isNFT) {
    // setIsNFT(value);
    // }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, token_id: number) => {
    setAnchorEl(event.currentTarget);
    setToken(token_id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (currency_select: boolean) => {
    // setIsUSD(!currency_select);
    dispatch({ type: balance_actions.TOGGLE_IS_USD });
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
            {isBalance && (
              <Switch
                onChange={handleChange}
                checked={!isUSD}
                borderRadius={40}
                className={`react-switch ${!isUSD ? 'bg-white' : 'bg-white'}`}
                offColor='black'
                onColor='black'
                offHandleColor='white'
                onHandleColor='white'
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
                      color: 'black',
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
              isActive={isBalance}
              size='large'
              width={80}
              handleFn={() => handleTypeChange(0)}
              label='Balance'
            />
            <ButtonWithActive
              isActive={isNFT}
              size='large'
              width={80}
              handleFn={() => handleTypeChange(1)}
              label='NFT'
            />
            <ButtonWithActive
              isActive={isSwap}
              size='large'
              width={80}
              handleFn={() => handleTypeChange(2)}
              label='Swap'
            />
          </Box>
          <hr style={{ border: 'none', backgroundColor: 'grey', height: '1px' }} />
          {!isSwap ? (
            <>
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
                    <MenuItem
                      onClick={handleClose}
                      disableRipple
                      sx={style_menu_item}
                      component={Link}
                      to={`/deposit/${token}`}
                    >
                      {Icon(DepositActiveIcon)}
                      {'Deposit'}
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      disableRipple
                      sx={style_menu_item}
                      component={Link}
                      to={`/withdraw/${token}`}
                    >
                      {Icon(WithdrawActiveIcon)}
                      {'Withdraw'}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleTypeChange(2);
                      }}
                      disableRipple
                      sx={style_menu_item}
                      // component={Link}
                      // to={`/swap/${token}/${
                      //   (netData.find((net: any) => net.id === defaultNetId(tokenData[token]))
                      //     ?.sort ?? 2) - 1
                      // }`}
                    >
                      <SwapVertIcon fontSize='large' sx={{ path: { fill: 'white' } }} />
                      {'Swap'}
                    </MenuItem>
                  </StyledMenu>
                  {isBalance ? (
                    <Table aria-label='simple table'>
                      <TableBody>
                        {!loading &&
                          tokenData &&
                          priceData &&
                          tokenData?.map((token: any, index: number) => {
                            const USD_price =
                              parseFloat(balanceData[token.id] ?? '0') *
                              parseFloat(priceData[token.name.concat('-USD')]);
                            const EUR_price = USD_price / priceData['EUR-USD'];
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
                                    variant='h6'
                                    component='h6'
                                    textAlign='center'
                                    fontWeight='bold'
                                    mt={2}
                                    mb={2}
                                    color='#0abab5'
                                  >
                                    {balanceData[token.id]?.toFixed(5) ?? '0'}
                                    &nbsp;
                                    {token.name}
                                  </Typography>
                                </TableCell>
                                {isUSD ? (
                                  <TableCell sx={style_row} align='center'>
                                    <Typography
                                      variant='h6'
                                      component='h6'
                                      textAlign='center'
                                      fontWeight='bold'
                                      mt={2}
                                      mb={2}
                                      color='white'
                                    >
                                      $&nbsp;
                                      {loading && <Rings style={{ marginTop: '50%' }} />}
                                      {!loading && USD_price ? USD_price.toFixed(2) : '0'}
                                    </Typography>
                                  </TableCell>
                                ) : (
                                  <TableCell sx={style_row} align='center'>
                                    <Typography
                                      variant='h6'
                                      component='h6'
                                      textAlign='center'
                                      fontWeight='bold'
                                      mt={2}
                                      mb={2}
                                      color='white'
                                    >
                                      &euro;&nbsp;
                                      {loading && <Rings style={{ marginTop: '50%' }} />}
                                      {!loading && EUR_price ? EUR_price.toFixed(2) : '0'}
                                    </Typography>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  ) : (
                    <Box display='flex' justifyContent='space-between' flexWrap='wrap' rowGap={2}>
                      {token_images.map((image, index) => (
                        <Button sx={{ padding: '0' }} component={Link} to={`/withdrawNFT/${index}`}>
                          <img
                            key={image}
                            src={token_images[index]}
                            alt='CryptoPunks'
                            width={145}
                            height={145}
                            data-xblocker='passed'
                          />
                        </Button>
                      ))}
                    </Box>
                  )}
                </Box>
              </ScrollBox>
              <Box className='bottom-box'>
                {
                  <>
                    <Typography
                      variant='h6'
                      component='h6'
                      textAlign='center'
                      fontWeight='bold'
                      color='#0abab5'
                      mx={1}
                    >
                      Total Balance
                    </Typography>
                    <Typography
                      variant='h6'
                      component='h6'
                      textAlign='center'
                      fontWeight='bold'
                      color={isUSD || isNFT ? 'white' : 'white'}
                      mx={1}
                    >
                      {!loading &&
                      Boolean(total_price[!isNFT ? (isUSD ? 'USD' : 'EUR') : 'NFT']) ? (
                        isUSD || isNFT ? (
                          <>$&nbsp;</>
                        ) : (
                          <>&euro;&nbsp;</>
                        )
                      ) : (
                        ''
                      )}
                      {!loading &&
                      Boolean(total_price[!isNFT ? (isUSD ? 'USD' : 'EUR') : 'NFT']) ? (
                        total_price[!isNFT ? (isUSD ? 'USD' : 'EUR') : 'NFT']?.toFixed(2) ?? ''
                      ) : (
                        // <Rings />
                        <img src={LoadingIcon} width={30} />
                      )}
                    </Typography>
                  </>
                }
              </Box>
            </>
          ) : (
            <Swap />
          )}
        </div>
      </Box>
    </Box>
  );
};

export default Balances;
