import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Box,
  Grid,
  Input,
  Select,
  Typography,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { url } from 'inspector';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Swiper, { Virtual, Pagination, Navigation } from 'swiper';
import { useSocket } from 'src/context/SocketProvider';
import { PrevButtonForSwiper, NextButtonForSwiper } from 'src/components/Buttons/ImageButton';
import { style_box_address, style_menuitem, style_select } from 'src/components/styles';
import Icon from '~/components/Icon';
import { MenuProps } from '~/constants';
import ScrollBox from '~/components/Layout/ScrollBox';
import {} from 'src/components/styles';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import ButtonWithActive from '~/components/Buttons/ButtonWithActive';
import { Rings } from 'react-loading-icons';
import NFTIcon from 'src/assets/coingroup/NFT_Icon.png';
import AccountItem from '~/components/Items/AccountItem';
import { useAuth } from '~/context/AuthProvider';

Swiper.use([Virtual, Navigation, Pagination]);

const AccountPassword = () => {
  const [password, setPassword] = useState('');
  const { signForAccount } = useAuth();

  const theme = useTheme();

  const handlePasswordChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Box className='base-box' px={4}>
      <ScrollBox height={430}>
        <Typography variant='h5' component='h5' align='left'>
          Type Your wallet password
        </Typography>
        <Input
          type='password'
          className='pw-input'
          disableUnderline
          sx={{
            color: 'white',
            fontSize: 14,
          }}
          size='medium'
          placeholder='Type your password'
          value={password}
          onChange={handlePasswordChange}
        />
        <Box
          border='1px solid red'
          borderRadius={2}
          mt='40px'
          p={1}
          sx={{ backgroundColor: theme.palette.error.main + '22' }}
        >
          Warning: Never disclose this key. Anyone with your private keys can steal any assets held
          in your account.
        </Box>
        <Button
          variant='contained'
          sx={{
            backgroundSize: 'stretch',
            width: '120px',
            height: '30px',
            color: 'white',
            margin: 'auto',
            marginTop: 6,
            borderRadius: '8px',
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
          onClick={() => signForAccount(password)}
        >
          Confirm
        </Button>
      </ScrollBox>
    </Box>
  );
};

export default AccountPassword;
