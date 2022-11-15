import { ActionType } from '~/context/types';
import { balance_reducer } from './BalanceReducer';

const mainReducer = ({ balance_states }: { balance_states: any }, action: ActionType) => ({
  balance_states: balance_reducer(balance_states, action),
});

export default mainReducer;
