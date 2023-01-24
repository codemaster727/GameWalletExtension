import { connect } from 'react-redux';
import { setSeedPhraseBackedUp } from '../../../../store/actions';
import ConfirmSeedPhrase from './confirm-seed-phrase.component';

const mapStateToProps = (state: any) => {
  console.log('state:', state);
  return {
    seedPhrase: state.wallet.seed,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState: any) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSeedPhrase);
