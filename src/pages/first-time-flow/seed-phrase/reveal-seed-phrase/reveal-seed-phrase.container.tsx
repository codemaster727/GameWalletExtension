import { connect } from 'react-redux';
import { setCompletedOnboarding, setSeedPhraseBackedUp } from '../../../../store/actions';
import { getOnboardingInitiator } from '../../../../selectors';
import RevealSeedPhrase from './reveal-seed-phrase.component';
import { withParamsAndNavigate } from '~/components/with/WithNavigate';

const mapStateToProps = (state: any) => {
  console.log('state:', state);
  return {
    onboardingInitiator: getOnboardingInitiator(state),
    seedPhrase: state.wallet.seed,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setSeedPhraseBackedUp: (seedPhraseBackupState: any) =>
      dispatch(setSeedPhraseBackedUp(seedPhraseBackupState)),
    setCompletedOnboarding: () => dispatch(setCompletedOnboarding()),
  };
};

export default withParamsAndNavigate(
  connect(mapStateToProps, mapDispatchToProps)(RevealSeedPhrase),
);
