import React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { Button, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logo/128px_Logo.png';
import Setting from 'src/assets/logo/setting.jpg';
import StyledMenu from '../Menu/StyledMenu';
import Divider from '@mui/material/Divider';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { style_menu_item } from '../styles';
import BuyIcon from '../../assets/coingroup/buy.png';
import BuyActiveIcon from '../../assets/coingroup/buy_active.png';
import DepositIcon from '../../assets/coingroup/deposit.png';
import DepositActiveIcon from '../../assets/coingroup/deposit_active.png';
import WithdrawIcon from '../../assets/coingroup/withdraw.png';
import WithdrawActiveIcon from '../../assets/coingroup/withdraw_active.png';
import TransactionsIcon from '../../assets/coingroup/transactions_white.png';
import CartIcon from '../../assets/coingroup/cart.png';
import Icon from '../Icon';
import { useAuth } from '~/context/AuthProvider';

const tabs = [
  {
    name: 'Balance',
    icon: BuyIcon,
    active_icon: BuyActiveIcon,
    to: 'balances',
  },
  {
    name: 'Deposit',
    icon: DepositIcon,
    active_icon: DepositActiveIcon,
    to: 'deposit/0',
  },
  {
    name: 'Withdraw',
    icon: WithdrawIcon,
    active_icon: WithdrawActiveIcon,
    to: 'withdraw/0',
  },
];

const NavBar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLock = async () => {
    handleClose();
    await signOut();
  };

  return (
    <div
      style={{
        backgroundColor: '#17181b',
        width: '100%',
        margin: 'auto',
        textAlign: 'center',
        verticalAlign: 'center',
        padding: '10px',
        top: 0,
        left: 0,
        display: 'flex',
      }}
    >
      <img
        src={Logo}
        alt='logo32'
        width={40}
        height={40}
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/balances')}
      />
      <Button sx={{ marginLeft: 'auto', minWidth: '40px', padding: 0 }} onClick={handleClick}>
        <img src={Setting} alt='logo32' width={40} />
      </Button>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {tabs.map((tab, index) => (
          <Link to={tab.to} key={tab.name}>
            <MenuItem onClick={handleClose} disableRipple sx={style_menu_item}>
              {Icon(tab.active_icon)}
              {tab.name}
            </MenuItem>
          </Link>
        ))}

        <Divider sx={{ my: 0.5, backgroundColor: 'white' }} />
        <Link to='/transactions'>
          <MenuItem onClick={handleClose} disableRipple sx={style_menu_item}>
            {Icon(TransactionsIcon)}
            Transactions
          </MenuItem>
        </Link>
        <Link to='/buy-crypto'>
          <MenuItem onClick={handleClose} disableRipple sx={style_menu_item}>
            {Icon(CartIcon)}
            Buy Cryptos
          </MenuItem>
        </Link>
        <Divider sx={{ my: 0.5, backgroundColor: 'white' }} />
        <MenuItem onClick={handleLock} disableRipple sx={style_menu_item}>
          <LockIcon sx={{ path: { fill: 'white' } }} />
          Lock
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default NavBar;
