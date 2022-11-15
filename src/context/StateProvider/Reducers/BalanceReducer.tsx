import { ActionType } from '~/context/types';
import { balance_actions } from '../Actions/BalanceAction';

export const balance_reducer = (state: any, action: ActionType) => {
  console.log('state:', state);
  console.log('action:', action);
  switch (action.type) {
    case balance_actions.SET_IS_USD:
      return {
        isUSD: action.payload,
      };
    case balance_actions.TOGGLE_IS_USD: {
      return { isUSD: !state.isUSD };
    }
    default:
      return state;
  }
};
