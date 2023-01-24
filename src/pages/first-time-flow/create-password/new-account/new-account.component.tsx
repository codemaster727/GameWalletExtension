import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, InputBase } from '@mui/material';
import {
  INITIALIZE_SEED_PHRASE_INTRO_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
} from '../../../../constants/routes';
import { style_btn_confirm, style_textfield } from '~/components/styles';
import { t } from '~/utils/helper';
import { useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Message from '~/components/Message';
import { createNewAccountThunk } from '~/store/reducers/walletSlice';

export default class NewAccount extends PureComponent {
  // static contextTypes = {
  //   trackEvent: PropTypes.func,
  //   t: PropTypes.func,
  // };

  // static propTypes = {
  //   onSubmit: PropTypes.func.isRequired,
  //   history: PropTypes.object.isRequired,
  // };

  state = {
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    termsChecked: false,
  };

  isValid() {
    const { password, confirmPassword, passwordError, confirmPasswordError } = this.state;

    if (!password || !confirmPassword || password !== confirmPassword) {
      return false;
    }

    if (password.length < 8) {
      return false;
    }

    return !passwordError && !confirmPasswordError;
  }

  handlePasswordChange(password: string) {
    // const { t } = this.context;

    this.setState((state: any) => {
      const { confirmPassword } = state;
      let passwordError = '';
      let confirmPasswordError = '';

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        password,
        passwordError,
        confirmPasswordError,
      };
    });
  }

  handleConfirmPasswordChange(confirmPassword: string) {
    // const { t } = this.context;

    this.setState((state) => {
      const { password } = state as any;
      let confirmPasswordError = '';

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch');
      }

      return {
        confirmPassword,
        confirmPasswordError,
      };
    });
  }

  handleCreate = async (event: any) => {
    event.preventDefault();

    if (!this.isValid()) {
      return;
    }

    const { password } = this.state;
    const { navigate, onSubmit, dispatch } = this.props as any;

    try {
      await dispatch(createNewAccountThunk(password)).then((res: any) =>
        navigate(INITIALIZE_SEED_PHRASE_ROUTE),
      );

      // navigate(INITIALIZE_SEED_PHRASE_INTRO_ROUTE);
    } catch (error: any) {
      this.setState({ passwordError: error.message });
    }
  };

  toggleTermsCheck = () => {
    this.setState((prevState: any) => ({
      termsChecked: !prevState.termsChecked,
    }));
  };

  onTermsKeyPress = ({ key }: { key: any }) => {
    if (key === ' ' || key === 'Enter') {
      this.toggleTermsCheck();
    }
  };

  render() {
    const { theme } = this.props as any;
    // const { t } = this.context;
    const { password, confirmPassword, passwordError, confirmPasswordError, termsChecked } =
      this.state;

    return (
      <Box sx={{ backgroundColor: '#17181b', textAlign: 'center', marginTop: '8rem' }}>
        <div className='first-time-flow__create-back'>
          <a
            data-testid='onboarding-back-button'
            onClick={(e) => {
              const { navigate } = this.props as any;
              e.preventDefault();
              navigate(-1);
            }}
            href='#'
          >
            {`< ${t('back')}`}
          </a>
        </div>
        {/* <div className="first-time-flow__header">{t('createPassword')}</div> */}
        <div className='first-time-flow__header'>{t('createPassword')}</div>
        <form className='first-time-flow__form' onSubmit={this.handleCreate}>
          <InputBase
            sx={{
              ...style_textfield,
              marginBottom: 2,
              backgroundColor: theme.palette.background.default,
            }}
            className='pw-input'
            fullWidth
            type='password'
            placeholder='Password at least 6 letters'
            inputProps={{
              'aria-label': 'withdraw address',
            }}
            value={password}
            onChange={(event: any) => this.handlePasswordChange(event.target.value)}
            autoComplete='new-password'
          />
          {passwordError ? <Message type='error' msg={passwordError} /> : null}
          <InputBase
            sx={{
              ...style_textfield,
              marginBottom: 2,
              backgroundColor: theme.palette.background.default,
            }}
            className='pw-input'
            fullWidth
            type='password'
            placeholder='Confirm password'
            inputProps={{
              'aria-label': 'withdraw address',
            }}
            value={confirmPassword}
            onChange={(event: any) => this.handleConfirmPasswordChange(event.target.value)}
            autoComplete='new-password'
          />
          {termsChecked}
          <div className='first-time-flow__checkbox-container' onClick={this.toggleTermsCheck}>
            <div
              className='first-time-flow__checkbox'
              role='checkbox'
              onKeyPress={this.onTermsKeyPress}
              aria-checked={termsChecked}
              aria-labelledby='ftf-chk1-label'
            >
              {termsChecked ? <CheckIcon /> : null}
            </div>
          </div>
          <br />
          <Button
            variant='contained'
            sx={style_btn_confirm}
            disabled={!this.isValid() || !termsChecked}
            onClick={this.handleCreate}
          >
            {/* {t('create')} */}
            {'create'}
          </Button>
        </form>
      </Box>
    );
  }
}
