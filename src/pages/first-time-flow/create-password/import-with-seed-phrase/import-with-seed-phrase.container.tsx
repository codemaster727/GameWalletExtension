import { connect } from 'react-redux';
import { setSeedPhraseBackedUp } from '../../../../store/actions';
import ImportWithSeedPhrase from './import-with-seed-phrase.component';
import { withParamsAndNavigate } from '~/components/with/WithNavigate';
import { withTheme } from '~/components/with/WithTheme';

const mapDispatchToProps = (dispatch: any) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState: any) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
  };
};

export default withTheme(
  withParamsAndNavigate(connect(null, mapDispatchToProps)(ImportWithSeedPhrase)),
);
