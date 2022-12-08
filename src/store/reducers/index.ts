import accountReducer from './accountSlice';

const rootReducer = {
  reducer: {
    account: accountReducer,
  },
};

export default rootReducer;
