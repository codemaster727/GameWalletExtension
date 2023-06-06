import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
  INITIALIZE_ROUTE,
} from '../../../../constants/routes';
import CreateNewVault from '../../../../components/app/create-new-vault';
import { Box } from '@mui/material';
// import {
//   EVENT,
//   EVENT_NAMES,
// } from '../../../../../shared/constants/metametrics';

export default class ImportWithSeedPhrase extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  // static propTypes = {
  //   history: PropTypes.object,
  //   onSubmit: PropTypes.func.isRequired,
  //   setSeedPhraseBackedUp: PropTypes.func,
  // };

  // UNSAFE_componentWillMount() {
  //   this._onBeforeUnload = () =>
  //     this.context.trackEvent({
  //       category: EVENT.CATEGORIES.ONBOARDING,
  //       event: EVENT_NAMES.WALLET_SETUP_FAILED,
  //       properties: {
  //         account_type: EVENT.ACCOUNT_TYPES.IMPORTED,
  //         account_import_type: EVENT.ACCOUNT_IMPORT_TYPES.SRP,
  //         reason: 'Seed Phrase Error',
  //         error: this.state.seedPhraseError,
  //       },
  //     });
  //   window.addEventListener('beforeunload', this._onBeforeUnload);
  // }

  componentWillUnmount() {
    // window.removeEventListener('beforeunload', this._onBeforeUnload);
  }

  handleImport = async (password: string, seedPhrase: any) => {
    const { history, onSubmit, setSeedPhraseBackedUp } = this.props as any;

    await onSubmit(password, seedPhrase);
    // this.context.trackEvent({
    //   category: EVENT.CATEGORIES.ONBOARDING,
    //   event: EVENT_NAMES.WALLET_CREATED,
    //   properties: {
    //     account_type: EVENT.ACCOUNT_TYPES.IMPORTED,
    //     account_import_type: EVENT.ACCOUNT_IMPORT_TYPES.SRP,
    //   },
    // });

    await setSeedPhraseBackedUp(true);
    history.replace(INITIALIZE_END_OF_FLOW_ROUTE);
  };

  render() {
    const { theme } = this.props as any;
    // const { t } = this.context;

    return (
      <Box sx={{ backgroundColor: '#17181b', textAlign: 'center', marginTop: '8rem' }}>
        <div className='first-time-flow__import'>
          <div className='first-time-flow__create-back'>
            <a
              onClick={(e) => {
                const { navigate } = this.props as any;
                e.preventDefault();
                // this.context.trackEvent({
                //   category: EVENT.CATEGORIES.ONBOARDING,
                //   event: EVENT_NAMES.WALLET_SETUP_CANCELED,
                //   properties: {
                //     account_type: EVENT.ACCOUNT_TYPES.IMPORTED,
                //     account_import_type: EVENT.ACCOUNT_IMPORT_TYPES.SRP,
                //     text: 'Back',
                //   },
                // });
                navigate(INITIALIZE_ROUTE);
              }}
              href='#'
            >
              {`< ${'back'}`}
            </a>
          </div>
          <div className='first-time-flow__header'>{'importAccountSeedPhrase'}</div>
          <div className='first-time-flow__text-block'>{'secretPhrase'}</div>
          <CreateNewVault
            disabled={false}
            includeTerms
            onSubmit={this.handleImport}
            submitText={'import'}
          />
        </div>
      </Box>
    );
  }
}
