import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  MenuItem,
  OutlinedInput,
  Paper,
  InputBase,
  Select,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import 'swiper/swiper-bundle.css';
import { NumericFormat } from 'react-number-format';

import { useSocket } from 'src/context/SocketProvider';
import ScrollBox from '~/components/Layout/ScrollBox';
import Icon from '~/components/Icon';
import { MenuProps } from '~/constants';
import { style_box_address, style_menuitem, style_select } from '~/components/styles';

const style_type_btn_ext = {
  backgroundColor: '#282b31',
  color: '#F2F2F288',
  fontSize: '14px',
  boxShadow: 'none',
  borderRadius: '10px',
  width: '80px',
  margin: '0 5px',
  paddingTop: '8px',
  paddingBottom: '8px',
};

const style_type_btn_active_ext = {
  ...style_type_btn_ext,
  backgroundColor: '#374b21',
  border: '1px solid #84d309',
  fontWeight: 'bold',
  color: 'white',
};

const style_btn_toggle = {
  color: '#AAAAAA',
  fontSize: '12px',
  margin: '2px',
  backgroundColor: '#333333',
  height: '20px',
  width: '40px',
};

const style_textfield = {
  color: 'white',
  fontSize: '11px',
  fontWeight: 'bold',
};

const style_input_paper = {
  padding: '2px 8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#191c20',
  boxSizing: 'border-box',
  border: '3px solid #333333',
  borderRadius: '10px',
  boxShadow: 'none',
  height: '40px',
};

const token_types = ['ERC20', 'BEP20', 'TRC20', 'Polygon'];
const token_types_eth = ['Ethereum', 'Arbitrum'];

const Withdraw = () => {
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [activeNet, setActiveNet] = useState<number>(6);
  const [percent, setPercent] = useState<string>('');
  const [activeTokenTypeIndex, setActiveTokenTypeIndex] = useState(0);
  const [address, setAddress] = useState<string>('0x0fbd6e14566A30906Bc0c927a75b1498aE87Fd43');
  const [amount, setAmount] = useState<string>('0.0001');
  const [error, setError] = useState<any>({});
  const [activeTokenTypeEthIndex, setActiveTokenTypeEthIndex] = useState<number>(0);

  const { networkError, balanceData, tokenData, withdrawMutate, withdrawIsLoading } = useSocket();
  const activeToken = tokenData[activeTokenIndex];

  const handleTokenChange = (event: SelectChangeEvent<typeof activeTokenIndex>) => {
    const {
      target: { value },
    } = event;
    setActiveTokenIndex(value as number);
  };

  const handlePercentChange = (e: any) => {
    const p = e.target.value;
    setPercent(p);
  };

  const handleTokenTypeChange = (index: number) => {
    if (index !== activeTokenTypeIndex) {
      setActiveTokenTypeIndex(index);
    }
  };

  const handleTokenTypeEthChange = (index: number) => {
    if (index !== activeTokenTypeEthIndex) {
      setActiveTokenTypeEthIndex(index);
    }
  };

  const handleChangeAddressInput = (e: any) => {
    const { value } = e.target;
    if (address !== value) {
      setAddress(value);
    }
  };

  const handleChangeAmountInput = (e: any) => {
    const { value }: { value: string } = e.target;
    if (amount !== value) {
      setAmount(value);
      setPercent('');
    }
  };

  const validate = (addr: string | undefined, amnt: string | undefined, net: number) => {
    const am = parseFloat(amnt as string);
    if (!addr) {
      alert('Invalid input.');
      return false;
    }
    if (!am || am <= 0 || am > Math.min(balanceData[activeToken?.id], 0.01)) {
      alert('Invalid input.');
      return false;
    }
    if (net === 3 || net === 5 || net === 6 || net === 7 || net === 8 || net === 10) {
      alert('Not supported yet. Please wait to complete.');
      return false;
    }
    return true;
  };

  const sendRequestWithdraw = () => {
    if (validate(address, amount, activeNet)) {
      withdrawMutate({
        user: '1',
        net: activeNet.toString(),
        asset: activeToken.id,
        amount: parseFloat(amount),
        receiver: address, // SOL address
      });
    }
  };

  useEffect(() => {
    const token_id = parseInt(activeToken?.id, 10);
    if (token_id === 1) setActiveNet(6);
    else if (token_id === 5) setActiveNet(2);
    else if (token_id === 6) setActiveNet(7);
    else if (token_id === 7) setActiveNet(9);
    else if (token_id === 8) setActiveNet(10);
    else if (token_id === 9) setActiveNet(5);
    else if (token_id === 2) {
      if (activeTokenTypeEthIndex === 0) setActiveNet(1);
      else if (activeTokenTypeEthIndex === 1) setActiveNet(3);
    } else if (token_id === 3 || token_id === 4) {
      if (activeTokenTypeIndex === 0) setActiveNet(1);
      else if (activeTokenTypeIndex === 1) setActiveNet(2);
      else if (activeTokenTypeIndex === 2) setActiveNet(7);
      else if (activeTokenTypeIndex === 3) setActiveNet(4);
    }
  }, [activeTokenTypeIndex, activeTokenTypeEthIndex, activeToken]);

  useEffect(() => {
    if (percent === '' || percent === '0') return;
    setAmount(
      (
        Math.floor(
          ((parseFloat(balanceData[activeToken?.id]) * parseFloat(percent)) / 100) * 100000,
        ) / 100000
      ).toString(),
    );
  }, [percent]);

  return (
    <Box className='base-box'>
      <ScrollBox>
        <Box className='currency_select'>
          <Select
            value={activeTokenIndex}
            onChange={handleTokenChange}
            input={<OutlinedInput />}
            renderValue={(selected: number) => {
              const token = tokenData[selected];
              return (
                token && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {Icon(token?.icon, 18)}
                    &nbsp;
                    {token?.name}
                  </Box>
                )
              );
            }}
            MenuProps={MenuProps}
            // IconComponent={() => DownIcon(DownArrowImage, 12)}
            // IconComponent={() => <ExpandMoreIcon />}
            // IconComponent={() => <Person />}
            sx={{ ...style_select, marginLeft: '20px', marginTop: '15px' }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {tokenData &&
              'map' in tokenData &&
              tokenData?.map((token: any, index: number) => (
                <MenuItem
                  className='menuitem-currency'
                  key={token?.id}
                  value={index}
                  sx={style_menuitem}
                >
                  {Icon(token.icon, 15)}
                  &nbsp;
                  {token?.name}
                </MenuItem>
              ))}
          </Select>
        </Box>
        <Box>
          <Typography
            variant='h5'
            component='article'
            textAlign='left'
            fontWeight='bold'
            fontSize='16px'
            alignItems='center'
            mt={2}
            style={{ overflowWrap: 'break-word', textAlign: 'center' }}
          >
            Current balance:&nbsp;
            <span style={{ color: '#95f204' }}>
              {balanceData[activeToken?.id] ?? '0'}
              &nbsp;
              {activeToken?.name}
            </span>
          </Typography>
          {(activeTokenIndex === 2 || activeTokenIndex === 3) && (
            <div
              style={{
                margin: 'auto',
                marginTop: '20px',
                alignItems: 'center',
                width: 'fit-content',
              }}
            >
              {token_types.map((token_type, index) => (
                <Button
                  key={token_type}
                  variant='contained'
                  size='medium'
                  style={
                    index === activeTokenTypeIndex ? style_type_btn_active_ext : style_type_btn_ext
                  }
                  onClick={() => handleTokenTypeChange(index)}
                >
                  <Typography variant='h5' fontWeight='bold'>
                    {token_type}
                  </Typography>
                </Button>
              ))}
            </div>
          )}
          {activeTokenIndex === 1 && (
            <div
              style={{
                margin: 'auto',
                marginTop: '20px',
                alignItems: 'center',
                width: 'fit-content',
              }}
            >
              {token_types_eth.map((token_type, index) => (
                <Button
                  key={token_type}
                  variant='contained'
                  size='medium'
                  style={
                    index === activeTokenTypeEthIndex
                      ? style_type_btn_active_ext
                      : style_type_btn_ext
                  }
                  onClick={() => handleTokenTypeEthChange(index)}
                >
                  <Typography variant='h5' fontWeight='bold'>
                    {token_type}
                  </Typography>
                </Button>
              ))}
            </div>
          )}
          {networkError ? (
            <Box>Network error...</Box>
          ) : (
            <Box mt={2} style={{ ...style_box_address, backgroundColor: 'transparent' }}>
              <Typography variant='h6' component='h6' textAlign='left' color='#AAAAAA' mb={1}>
                Withdraw address
                <span style={{ color: '#95f204' }}>
                  (Note: Only {tokenData[activeTokenIndex]?.label})
                </span>
              </Typography>
              <Paper component='form' sx={style_input_paper}>
                <InputBase
                  sx={style_textfield}
                  fullWidth
                  placeholder='Fill in carefully according to the specific currency'
                  inputProps={{
                    'aria-label': 'withdraw address',
                  }}
                  value={address}
                  onChange={handleChangeAddressInput}
                />
              </Paper>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant='h6'
                  component='h6'
                  textAlign='left'
                  color='#AAAAAA'
                  mt={2}
                  mb={1}
                >
                  Withdraw amount
                </Typography>
                <Typography
                  variant='h6'
                  component='h6'
                  textAlign='left'
                  color='#AAAAAA'
                  mt={2}
                  mb={1}
                >
                  Min: 0.00001
                </Typography>
              </div>
              <Paper component='form' sx={style_input_paper}>
                <NumericFormat
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none',
                    paddingLeft: '0',
                    width: '100px',
                    marginRight: '1rem',
                  }}
                  thousandSeparator
                  decimalScale={5}
                  value={amount}
                  onChange={handleChangeAmountInput}
                  // prefix="$"
                />
                {/* <InputBase
              sx={style_textfield}
              placeholder="Amount to withdraw"
              inputProps={{
                'aria-label': 'amount to withdraw',
              }}
              value={amount}
              componentsProps={{
                root: (
                  <NumericFormat
                    value="20020220"
                    allowLeadingZeros
                    thousandSeparator=","
                  />
                ),
              }}
              onChange={handleChangeAmountInput}
            /> */}
                <ToggleButtonGroup
                  value={percent}
                  exclusive
                  onChange={handlePercentChange}
                  aria-label='text alignment'
                  color='success'
                  sx={{
                    marginRight: '0',
                    borderRadius: '15px',
                    color: 'white',
                    backgroundColor: 'transparent',
                    fontSize: '11px',
                  }}
                >
                  <ToggleButton
                    value='0.01'
                    aria-label='left aligned'
                    sx={{ ...style_btn_toggle, borderRadius: '15px' }}
                  >
                    Min
                  </ToggleButton>
                  <ToggleButton value='25' aria-label='centered' sx={style_btn_toggle}>
                    25%
                  </ToggleButton>
                  <ToggleButton value='50' aria-label='right aligned' sx={style_btn_toggle}>
                    50%
                  </ToggleButton>
                  <ToggleButton
                    value='100'
                    aria-label='justified'
                    sx={{ ...style_btn_toggle, borderRadius: '15px' }}
                  >
                    Max
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>
              <Typography
                variant='h5'
                component='article'
                textAlign='left'
                fontWeight='bold'
                fontSize='18px'
                alignItems='center'
                mt={3}
                mb={2}
                style={{ overflowWrap: 'break-word', textAlign: 'center' }}
              >
                Fee&nbsp;
                <span style={{ color: '#95f204' }}>
                  {1}
                  &nbsp;
                  {activeToken?.name}
                </span>
              </Typography>
              <Typography
                variant='h6'
                textAlign='left'
                padding='0'
                fontSize='12px'
                component='article'
                color='#A9ADBD'
                mt={2}
              >
                For security purposes, large or suspicious withdrawal may take 1-6 hours for audit
                process. <br />
                We appreciate your patience!
              </Typography>
            </Box>
          )}
        </Box>
      </ScrollBox>
      <Box className='bottom-box'>
        {withdrawIsLoading ? (
          // <LoadingButton
          //   loading
          //   variant="contained"
          //   loadingPosition="center"
          //   sx={{
          //     // backgroundImage: `url(${ConfirmBtn})`,
          //     backgroundColor: 'green',
          //     backgroundSize: 'stretch',
          //     width: '325px',
          //     height: '56px',
          //     color: 'white',
          //     margin: 'auto',
          //     borderRadius: '50px',
          //     display: 'block',
          //   }}
          // />
          <Button
            sx={{
              backgroundColor: '#95F204',
              backgroundSize: 'stretch',
              width: '120px',
              height: '30px',
              color: 'white',
              margin: 'auto',
              borderRadius: '8px',
              display: 'block',
              opacity: 0.3,
            }}
            disabled={withdrawIsLoading}
            onClick={sendRequestWithdraw}
          >
            Confirm
          </Button>
        ) : (
          <Button
            sx={{
              backgroundColor: '#7eca0b',
              backgroundSize: 'stretch',
              width: '120px',
              height: '30px',
              color: 'white',
              margin: 'auto',
              borderRadius: '8px',
              display: 'block',
              fontSize: '12px',
              fontWeight: 'bold',
              ':hover': {
                backgroundColor: '#7eca0b88',
              },
            }}
            onClick={sendRequestWithdraw}
          >
            Confirm
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Withdraw;
