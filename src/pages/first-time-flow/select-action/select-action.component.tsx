import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import Button from '../../../components/ui/button';
// import MetaFoxLogo from '../../../components/ui/metafox-logo';
// import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
} from '../../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
// import './index.scss';
import { t } from 'src/utils/helper';

export default class SelectAction extends PureComponent {
  // static propTypes = {
  //   history: PropTypes.object,
  //   isInitialized: PropTypes.bool,
  //   setFirstTimeFlowType: PropTypes.func,
  //   nextRoute: PropTypes.string,
  //   metaMetricsId: PropTypes.string,
  // };

  // static contextTypes = {
  //   trackEvent: PropTypes.func,
  //   t: PropTypes.func,
  // };
  // navigate = useNavigate();

  // componentDidMount() {
  //   const { history, isInitialized, nextRoute } = this.props as any;

  //   if (isInitialized) {
  //     history.push(nextRoute);
  //   }
  // }

  handleCreate = () => {
    const { isInitialized, nextRoute, navigate, setFirstTimeFlowType } = this.props as any;
    // const { trackEvent } = this.context;
    setFirstTimeFlowType('create');
    // trackEvent(
    //   {
    //     category: EVENT.CATEGORIES.ONBOARDING,
    //     event: EVENT_NAMES.WALLET_SETUP_STARTED,
    //     properties: {
    //       account_type: EVENT.ACCOUNT_TYPES.DEFAULT,
    //     },
    //   },
    //   {
    //     isOptIn: true,
    //     metaMetricsId,
    //     flushImmediately: true,
    //   },
    // );
    navigate(INITIALIZE_CREATE_PASSWORD_ROUTE);
  };

  handleImport = () => {
    const { setFirstTimeFlowType, navigate } = this.props as any;
    // const { trackEvent } = this.context;
    setFirstTimeFlowType('import');
    // trackEvent(
    //   {
    //     category: EVENT.CATEGORIES.ONBOARDING,
    //     event: EVENT_NAMES.WALLET_SETUP_STARTED,
    //     properties: {
    //       account_type: EVENT.ACCOUNT_TYPES.IMPORTED,
    //     },
    //   },
    //   {
    //     isOptIn: true,
    //     metaMetricsId,
    //     flushImmediately: true,
    //   },
    // );
    navigate(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE);
  };

  render() {
    // const { t } = this.context;

    return (
      <Box sx={{ backgroundColor: '#17181b', textAlign: 'center', marginTop: '8rem' }}>
        <div className='select-action'>
          <div className='select-action__wrapper'>
            <div className='select-action__body'>
              <div className='select-action__body-header'>{t('newToWallet')}</div>
              <div className='select-action__select-buttons'>
                <div className='select-action__select-button'>
                  <div className='select-action__button-content'>
                    <div className='select-action__button-symbol'>
                      <i className='fa fa-download fa-2x' />
                    </div>
                    <div className='select-action__button-text-big'>{t('noAlreadyHaveSeed')}</div>
                    <div className='select-action__button-text-small'>
                      {t('importYourExisting')}
                    </div>
                  </div>
                  <Button
                    color='primary'
                    className='first-time-flow__button'
                    onClick={this.handleImport}
                    data-testid='import-wallet-button'
                  >
                    {t('importWallet')}
                  </Button>
                </div>
                <div className='select-action__select-button'>
                  <div className='select-action__button-content'>
                    <div className='select-action__button-symbol'>
                      <i className='fa fa-plus fa-2x' />
                    </div>
                    <div className='select-action__button-text-big'>{t('letsGoSetUp')}</div>
                    <div className='select-action__button-text-small'>{t('thisWillCreate')}</div>
                  </div>
                  <Button
                    color='primary'
                    className='first-time-flow__button'
                    onClick={this.handleCreate}
                    data-testid='create-wallet-button'
                  >
                    {t('createAWallet')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    );
  }
}
