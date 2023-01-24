import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import Snackbar from '../../../components/ui/snackbar';
// import MetaFoxLogo from '../../../components/ui/metafox-logo';
// import { SUPPORT_REQUEST_LINK } from '../../../constants/common';
import { DEFAULT_ROUTE } from '../../../constants/routes';
// import { returnToOnboardingInitiatorTab } from '../onboarding-initiator-util';
// import {
//   EVENT,
//   EVENT_NAMES,
//   CONTEXT_PROPS,
// } from '../../../../shared/constants/metametrics';
// import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';
import { t } from '~/utils/helper';
import { Button } from '@mui/material';

export default class EndOfFlowScreen extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
    setOnBoardedInThisUISession: PropTypes.func,
  };

  // static propTypes = {
  //   history: PropTypes.object,
  //   setCompletedOnboarding: PropTypes.func,
  //   onboardingInitiator: PropTypes.exact({
  //     location: PropTypes.string,
  //     tabId: PropTypes.number,
  //   }),
  //   setOnBoardedInThisUISession: PropTypes.func,
  // };

  async _beforeUnload() {
    await this._onOnboardingComplete();
  }

  _removeBeforeUnload() {
    window.removeEventListener('beforeunload', this._beforeUnload);
  }

  async _onOnboardingComplete() {
    const { setCompletedOnboarding, setOnBoardedInThisUISession } = this.props as any;
    // setOnBoardedInThisUISession(true);
    await setCompletedOnboarding();
  }

  onComplete = async () => {
    const { navigate, onboardingInitiator } = this.props as any;

    this._removeBeforeUnload();
    await this._onOnboardingComplete();
    if (onboardingInitiator) {
      // await returnToOnboardingInitiatorTab(onboardingInitiator);
    }
    navigate(DEFAULT_ROUTE);
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this._beforeUnload.bind(this));
  }

  componentWillUnmount = () => {
    this._removeBeforeUnload();
  };

  render() {
    const { onboardingInitiator } = this.props as any;

    return (
      <div className='end-of-flow' data-testid='end-of-flow'>
        <div className='end-of-flow__emoji'>🎉</div>
        <div className='first-time-flow__header'>{t('congratulations')}</div>
        <div className='first-time-flow__text-block end-of-flow__text-1'>
          {t('endOfFlowMessage1')}
        </div>
        <div className='first-time-flow__text-block end-of-flow__text-2'>
          {t('endOfFlowMessage2')}
        </div>
        <div className='end-of-flow__text-3'>{`• ${t('endOfFlowMessage3')}`}</div>
        <div className='end-of-flow__text-3'>{`• ${t('endOfFlowMessage4')}`}</div>
        <div className='end-of-flow__text-3'>{`• ${t('endOfFlowMessage5')}`}</div>
        <div className='end-of-flow__text-3'>{`• ${t('endOfFlowMessage6')}`}</div>
        <div className='first-time-flow__text-block end-of-flow__text-4'>
          {`*${t('endOfFlowMessage8')}`}&nbsp;
        </div>
        <Button
          color='primary'
          className='first-time-flow__button'
          onClick={this.onComplete}
          data-testid='EOF-complete-button'
        >
          {t('endOfFlowMessage10')}
        </Button>
        {/* {onboardingInitiator ? (
          <Snackbar
            content={t('onboardingReturnNotice', [
              t('endOfFlowMessage10'),
              onboardingInitiator.location,
            ])}
          />
        ) : null} */}
      </div>
    );
  }
}
