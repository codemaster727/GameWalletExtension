import { connect } from 'react-redux';
import { compose } from 'redux';
import { setFirstTimeFlowType } from '../../../store/actions';
import { getFirstTimeFlowTypeRoute } from '../../../selectors';
import Welcome from './select-action.component';
import { withParamsAndNavigate } from '~/components/with/WithNavigate';

const mapStateToProps = (state: any) => {
  return {
    nextRoute: getFirstTimeFlowTypeRoute(state),
    metaMetricsId: state.wallet.metaMetricsId,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setFirstTimeFlowType: (type: any) => dispatch(setFirstTimeFlowType(type)),
  };
};

export default withParamsAndNavigate(
  compose(connect(mapStateToProps, mapDispatchToProps))(Welcome),
);
