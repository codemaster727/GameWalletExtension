import { withParamsAndNavigate } from '~/components/with/WithNavigate';
import NewAccount from './new-account.component';
import { withTheme } from '~/components/with/WithTheme';
import { withDispatch } from '~/components/with/WithDispatch';

export default withTheme(withParamsAndNavigate(withDispatch(NewAccount)));
