import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
// import { useI18nContext } from '../../../hooks/useI18nContext';
// import TextField from '../../ui/text-field';
// import Button from '../../ui/button';
// import CheckBox from '../../ui/check-box';
// import Typography from '../../ui/typography';
import SrpInput from '../srp-input';
import { Button, Checkbox, TextField, Typography } from '@mui/material';

interface PropsType {
  disabled: boolean;
  includeTerms: boolean;
  onSubmit: any;
  submitText: any;
}

export default function CreateNewVault({
  disabled = false,
  includeTerms = false,
  onSubmit,
  submitText,
}: PropsType) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);

  // const t = useI18nContext();

  const onPasswordChange = useCallback(
    (newPassword: string) => {
      let newConfirmPasswordError = '';
      let newPasswordError = '';

      if (newPassword && newPassword.length < 8) {
        newPasswordError = 'passwordNotLongEnough';
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        newConfirmPasswordError = 'passwordsDontMatch';
      }

      setPassword(newPassword);
      setPasswordError(newPasswordError);
      setConfirmPasswordError(newConfirmPasswordError);
    },
    [confirmPassword],
  );

  const onConfirmPasswordChange = useCallback(
    (newConfirmPassword: string) => {
      let newConfirmPasswordError = '';

      if (password !== newConfirmPassword) {
        newConfirmPasswordError = 'passwordsDontMatch';
      }

      setConfirmPassword(newConfirmPassword);
      setConfirmPasswordError(newConfirmPasswordError);
    },
    [password],
  );

  const isValid =
    !disabled &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    seedPhrase &&
    (!includeTerms || termsChecked) &&
    !passwordError &&
    !confirmPasswordError;

  const onImport = useCallback(
    async (event: any) => {
      event.preventDefault();

      if (!isValid) {
        return;
      }

      await onSubmit(password, seedPhrase);
    },
    [isValid, onSubmit, password, seedPhrase],
  );

  const toggleTermsCheck = useCallback(() => {
    setTermsChecked((currentTermsChecked) => !currentTermsChecked);
  }, []);

  const termsOfUse = (
    <a
      className='create-new-vault__terms-link'
      key='create-new-vault__link-text'
      href='https://metamask.io/terms.html'
      target='_blank'
      rel='noopener noreferrer'
    >
      {'terms'}
    </a>
  );
  return (
    <form className='create-new-vault__form' onSubmit={onImport}>
      <SrpInput onChange={setSeedPhrase} srpText='Secret Recovery Phrase' />
      <div className='create-new-vault__create-password'>
        <TextField
          id='password'
          label={'newPassword'}
          type='password'
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          error={Boolean(passwordError)}
          autoComplete='new-password'
          margin='normal'
        />
        <TextField
          id='confirm-password'
          label={'confirmPassword'}
          type='password'
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          error={Boolean(confirmPasswordError)}
          autoComplete='new-password'
          margin='normal'
        />
      </div>
      {includeTerms ? (
        <div className='create-new-vault__terms'>
          <Checkbox
            id='create-new-vault__terms-checkbox'
            checked={termsChecked}
            onClick={toggleTermsCheck}
          />
          <label
            className='create-new-vault__terms-label'
            htmlFor='create-new-vault__terms-checkbox'
          >
            <Typography component='span'>{termsOfUse}</Typography>
          </label>
        </div>
      ) : null}
      <Button type='submit' disabled={!isValid}>
        {submitText}
      </Button>
    </form>
  );
}

CreateNewVault.propTypes = {
  disabled: PropTypes.bool,
  includeTerms: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
};
