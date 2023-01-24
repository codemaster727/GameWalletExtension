import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LockIcon from '../../../../components/Icon/lock-icon';
// import Snackbar from '../../../../components/Icon/snackbar';
import {
  INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
  DEFAULT_ROUTE,
  INITIALIZE_SEED_PHRASE_INTRO_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
} from '../../../../constants/routes';
// import {
//   EVENT,
//   EVENT_NAMES,
// } from '../../../../shared/constants/metametrics';
// import { returnToOnboardingInitiatorTab } from '../../onboarding-initiator-util';
import { exportAsFile } from '../../../../utils/export-utils';
import { t } from 'src/utils/helper';
import { Box, Button } from '@mui/material';

export default class RevealSeedPhrase extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  // static propTypes = {
  //   history: PropTypes.object,
  //   seedPhrase: PropTypes.string,
  //   setSeedPhraseBackedUp: PropTypes.func,
  //   setCompletedOnboarding: PropTypes.func,
  //   onboardingInitiator: PropTypes.exact({
  //     location: PropTypes.string,
  //     tabId: PropTypes.number,
  //   }),
  // };

  state = {
    isShowingSeedPhrase: false,
  };

  handleExport = () => {
    const { seedPhrase } = this.props as any;
    exportAsFile('', seedPhrase, 'text/plain');
  };

  handleNext = () => {
    const { isShowingSeedPhrase } = this.state;
    const { navigate } = this.props as any;

    // this.context.trackEvent({
    //   category: EVENT.CATEGORIES.ONBOARDING,
    //   event: EVENT_NAMES.SRP_TO_CONFIRM_BACKUP,
    //   properties: {},
    // });

    if (!isShowingSeedPhrase) {
      return;
    }

    navigate(INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE);
  };

  handleSkip = async () => {
    const { navigate, setSeedPhraseBackedUp, setCompletedOnboarding, onboardingInitiator } = this
      .props as any;

    await Promise.all([setCompletedOnboarding(), setSeedPhraseBackedUp(false)])
      .then(() => {
        // this.context.trackEvent({
        //   category: EVENT.CATEGORIES.ONBOARDING,
        //   event: EVENT_NAMES.WALLET_CREATED,
        //   properties: {
        //     account_type: EVENT.ACCOUNT_TYPES.DEFAULT,
        //     is_backup_skipped: true,
        //   },
        // });
      })
      .catch((error) => {
        console.error(error.message);
        // this.context.trackEvent({
        //   category: EVENT.CATEGORIES.ONBOARDING,
        //   event: EVENT_NAMES.WALLET_SETUP_FAILED,
        //   properties: {
        //     account_type: EVENT.ACCOUNT_TYPES.DEFAULT,
        //     is_backup_skipped: true,
        //     reason: 'Seed Phrase Creation Error',
        //     error: error.message,
        //   },
        // });
      });

    if (onboardingInitiator) {
      console.log('returnToOnboardingInitiatorTab');
      // await returnToOnboardingInitiatorTab(onboardingInitiator);
    }
    navigate(DEFAULT_ROUTE);
  };

  renderSecretWordsContainer() {
    const { seedPhrase } = this.props as any;
    const { isShowingSeedPhrase } = this.state;

    return (
      <div className='reveal-seed-phrase__secret'>
        <div
          className={classnames('reveal-seed-phrase__secret-words notranslate', {
            'reveal-seed-phrase__secret-words--hidden': !isShowingSeedPhrase,
          })}
          data-testid={isShowingSeedPhrase ? 'showing-seed-phrase' : 'hidden-seed-phrase'}
        >
          {seedPhrase}
        </div>
        {!isShowingSeedPhrase && (
          <div
            className='reveal-seed-phrase__secret-blocker'
            data-testid='reveal-seed-blocker'
            onClick={() => {
              // this.context.trackEvent({
              //   category: EVENT.CATEGORIES.ONBOARDING,
              //   event: EVENT_NAMES.KEY_EXPORT_REVEALED,
              //   properties: {},
              // });
              this.setState({ isShowingSeedPhrase: true });
            }}
          >
            <LockIcon width='28px' height='35px' fill='var(--color-overlay-inverse)' />
            <div className='reveal-seed-phrase__reveal-button'>{t('clickToRevealSeed')}</div>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { isShowingSeedPhrase } = this.state;
    const { navigate, onboardingInitiator } = this.props as any;

    return (
      <Box sx={{ backgroundColor: '#17181b', textAlign: 'center', marginTop: '8rem' }}>
        <div className='reveal-seed-phrase' data-testid='reveal-seed-phrase'>
          <div className='seed-phrase__sections'>
            <div className='seed-phrase__main'>
              {/* <Box marginBottom={4}>
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(INITIALIZE_SEED_PHRASE_ROUTE);
                  }}
                >
                  {`< ${t('back')}`}
                </a>
              </Box> */}
              <div className='first-time-flow__header'>{t('secretRecoveryPhrase')}</div>
              <div className='first-time-flow__text-block'>
                {t('secretBackupPhraseDescription')}
              </div>
              <div className='first-time-flow__text-block'>{t('secretBackupPhraseWarning')}</div>
              {this.renderSecretWordsContainer()}
            </div>
            <div className='seed-phrase__side'>
              <div className='first-time-flow__text-block'>{`${t('tips')}:`}</div>
              <div className='first-time-flow__text-block'>{t('storePhrase')}</div>
              <div className='first-time-flow__text-block'>{t('writePhrase')}</div>
              <div className='first-time-flow__text-block'>{t('memorizePhrase')}</div>
              <div className='first-time-flow__text-block'>
                <a className='reveal-seed-phrase__export-text' onClick={this.handleExport}>
                  {t('downloadSecretBackup')}
                </a>
              </div>
            </div>
          </div>
          <div className='reveal-seed-phrase__buttons'>
            <Button
              color='primary'
              variant='outlined'
              className='first-time-flow__button'
              onClick={this.handleSkip}
            >
              {t('remindMeLater')}
            </Button>
            <Button
              color='primary'
              variant='contained'
              className='first-time-flow__button'
              onClick={this.handleNext}
              disabled={!isShowingSeedPhrase}
            >
              {t('next')}
            </Button>
          </div>
          {/* {onboardingInitiator ? (
          <Snackbar
            content={t('onboardingReturnNotice', [
              t('remindMeLater'),
              onboardingInitiator.location,
            ])}
          />
        ) : null} */}
        </div>
      </Box>
    );
  }
}
