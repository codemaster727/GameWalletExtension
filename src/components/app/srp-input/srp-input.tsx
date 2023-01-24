import { ethers } from 'ethers';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
// import { useI18nContext } from '../../../hooks/useI18nContext';
// import TextField from '../../ui/text-field';
// import ActionableMessage from '../../ui/actionable-message';
// import Dropdown from '../../ui/dropdown';
import ShowHideToggle from '../show-hide-toggle';
// import {
//   FONT_WEIGHT,
//   TEXT_ALIGN,
//   TYPOGRAPHY,
// } from '../../../helpers/constants/design-system';
import { parseSecretRecoveryPhrase } from './parse-secret-recovery-phrase';
import { clearClipboard } from '~/utils/helper';
import { Box, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { MenuProps } from '~/constants';
import { style_menuitem, style_select } from '~/components/styles';
import Icon from '~/components/Icon';

const { isValidMnemonic } = ethers.utils;

const defaultNumberOfWords = 12;

const hasUpperCase = (draftSrp: any) => {
  return draftSrp !== draftSrp.toLowerCase();
};

interface PropsType {
  onChange: any;
  srpText: string;
}

export default function SrpInput({ onChange, srpText }: PropsType) {
  const [srpError, setSrpError] = useState('');
  const [pasteFailed, setPasteFailed] = useState(false);
  const [draftSrp, setDraftSrp] = useState(new Array(defaultNumberOfWords).fill(''));
  const [showSrp, setShowSrp] = useState(new Array(defaultNumberOfWords).fill(false));
  const [numberOfWords, setNumberOfWords] = useState(defaultNumberOfWords);

  // const t = useI18nContext();

  const onSrpChange = useCallback(
    (newDraftSrp: any) => {
      let newSrpError = '';
      const joinedDraftSrp = newDraftSrp.join(' ').trim();

      if (newDraftSrp.some((word: any) => word !== '')) {
        if (newDraftSrp.some((word: any) => word === '')) {
          newSrpError = 'seedPhraseReq';
        } else if (hasUpperCase(joinedDraftSrp)) {
          newSrpError = 'invalidSeedPhraseCaseSensitive';
        } else if (!isValidMnemonic(joinedDraftSrp)) {
          newSrpError = 'invalidSeedPhrase';
        }
      }

      setDraftSrp(newDraftSrp);
      setSrpError(newSrpError);
      onChange(newSrpError ? '' : joinedDraftSrp);
    },
    [setDraftSrp, setSrpError, onChange],
  );

  const toggleShowSrp = useCallback((index: any) => {
    setShowSrp((currentShowSrp) => {
      const newShowSrp = currentShowSrp.slice();
      if (newShowSrp[index]) {
        newShowSrp[index] = false;
      } else {
        newShowSrp.fill(false);
        newShowSrp[index] = true;
      }
      return newShowSrp;
    });
  }, []);

  const onSrpWordChange = useCallback(
    (index: any, newWord: string) => {
      if (pasteFailed) {
        setPasteFailed(false);
      }
      const newSrp = draftSrp.slice();
      newSrp[index] = newWord.trim();
      onSrpChange(newSrp);
    },
    [draftSrp, onSrpChange, pasteFailed],
  );

  const onSrpPaste = useCallback(
    (rawSrp: any) => {
      const parsedSrp = parseSecretRecoveryPhrase(rawSrp);
      let newDraftSrp = parsedSrp.split(' ');

      if (newDraftSrp.length > 24) {
        setPasteFailed(true);
        return;
      } else if (pasteFailed) {
        setPasteFailed(false);
      }

      let newNumberOfWords = numberOfWords;
      if (newDraftSrp.length !== numberOfWords) {
        if (newDraftSrp.length < 12) {
          newNumberOfWords = 12;
        } else if (newDraftSrp.length % 3 === 0) {
          newNumberOfWords = newDraftSrp.length;
        } else {
          newNumberOfWords = newDraftSrp.length + (3 - (newDraftSrp.length % 3));
        }
        setNumberOfWords(newNumberOfWords);
      }

      if (newDraftSrp.length < newNumberOfWords) {
        newDraftSrp = newDraftSrp.concat(new Array(newNumberOfWords - newDraftSrp.length).fill(''));
      }
      setShowSrp(new Array(newNumberOfWords).fill(false));
      onSrpChange(newDraftSrp);
      clearClipboard();
    },
    [numberOfWords, onSrpChange, pasteFailed, setPasteFailed],
  );

  const numberOfWordsOptions = [];
  for (let i = 12; i <= 24; i += 3) {
    numberOfWordsOptions.push({
      name: 'srpInputNumberOfWords',
      value: `${i}`,
    });
  }

  return (
    <div className='import-srp__container'>
      <label className='import-srp__srp-label'>
        <Typography align='left' variant='h4' fontWeight='bold'>
          {srpText}
        </Typography>
      </label>
      {/* <ActionableMessage
        className="import-srp__paste-tip"
        iconFillColor="var(--color-info-default)"
        message={'srpPasteTip'}
        useIcon
      /> */}
      {/* <Select
        className="import-srp__number-of-words-dropdown"
        onChange={(newSelectedOption:any) => {
          const newNumberOfWords = parseInt(newSelectedOption, 10);
          if (Number.isNaN(newNumberOfWords)) {
            throw new Error('Unable to parse option as integer');
          }

          let newDraftSrp = draftSrp.slice(0, newNumberOfWords);
          if (newDraftSrp.length < newNumberOfWords) {
            newDraftSrp = newDraftSrp.concat(
              new Array(newNumberOfWords - newDraftSrp.length).fill(''),
            );
          }
          setNumberOfWords(newNumberOfWords);
          setShowSrp(new Array(newNumberOfWords).fill(false));
          onSrpChange(newDraftSrp);
        }}
        options={numberOfWordsOptions}
        selectedOption={`${numberOfWords}`}
      /> */}
      <Select
        value={numberOfWords}
        onChange={(newSelectedOption: any) => {
          const newNumberOfWords = parseInt(newSelectedOption, 10);
          if (Number.isNaN(newNumberOfWords)) {
            throw new Error('Unable to parse option as integer');
          }

          let newDraftSrp = draftSrp.slice(0, newNumberOfWords);
          if (newDraftSrp.length < newNumberOfWords) {
            newDraftSrp = newDraftSrp.concat(
              new Array(newNumberOfWords - newDraftSrp.length).fill(''),
            );
          }
          setNumberOfWords(newNumberOfWords);
          setShowSrp(new Array(newNumberOfWords).fill(false));
          onSrpChange(newDraftSrp);
        }}
        input={<OutlinedInput />}
        renderValue={(selected: number) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>{numberOfWords}-word phrase</Box>
          );
        }}
        MenuProps={MenuProps}
        // IconComponent={() => DownIcon(DownArrowImage, 12)}
        // IconComponent={() => <ExpandMoreIcon />}
        // IconComponent={() => <Person />}
        sx={{ ...style_select }}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {numberOfWordsOptions &&
          'map' in numberOfWordsOptions &&
          numberOfWordsOptions?.map((token: any, index: number) => (
            <MenuItem
              className='menuitem-currency'
              key={token?.id}
              value={index}
              sx={style_menuitem}
            >
              {Icon(token.icon, 18)}
              &nbsp;
              {token?.name}
            </MenuItem>
          ))}
      </Select>
      <div className='import-srp__srp'>
        {[...Array(numberOfWords).keys()].map((index) => {
          const id = `import-srp__srp-word-${index}`;
          return (
            <div key={index} className='import-srp__srp-word'>
              <label htmlFor={id} className='import-srp__srp-word-label'>
                <Typography>{`${index + 1}.`}</Typography>
              </label>
              <TextField
                id={id}
                data-testid={id}
                type={showSrp[index] ? 'text' : 'password'}
                onChange={(e: any) => {
                  e.preventDefault();
                  onSrpWordChange(index, e.target.value);
                }}
                value={draftSrp[index]}
                autoComplete='off'
                onPaste={(event: any) => {
                  const newSrp = event.clipboardData.getData('text');

                  if (newSrp.trim().match(/\s/u)) {
                    event.preventDefault();
                    onSrpPaste(newSrp);
                  }
                }}
              />
              <ShowHideToggle
                id={`${id}-checkbox`}
                ariaLabelHidden={'srpWordHidden'}
                ariaLabelShown={'srpWordShown'}
                shown={showSrp[index]}
                data-testid={`${id}-checkbox`}
                onChange={() => toggleShowSrp(index)}
                title={'srpToggleShow'}
              />
            </div>
          );
        })}
      </div>
      {srpError ? (
        <Typography align='left' variant='h4' fontWeight='bold'>
          {srpError}
        </Typography>
      ) : null}
      {pasteFailed ? (
        <Typography align='left' variant='h4' fontWeight='bold'>
          {'srpPasteFailedTooManyWords'}
        </Typography>
      ) : null}
    </div>
  );
}

SrpInput.propTypes = {
  /**
   * Event handler for SRP changes.
   *
   * This is only called with a valid, well-formated (i.e. exactly one space
   * between each word) SRP or with an empty string.
   *
   * This is called each time the draft SRP is updated. If the draft SRP is
   * valid, this is called with a well-formatted version of that draft SRP.
   * Otherwise, this is called with an empty string.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Text to show on the left of the Dropdown component. Wrapped in Typography component.
   */
  srpText: PropTypes.string.isRequired,
};
