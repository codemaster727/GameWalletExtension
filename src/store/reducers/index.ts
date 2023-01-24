import walletReducer from './walletSlice';

const rootReducer = {
  reducer: {
    wallet: walletReducer,
  },
};

export default rootReducer;
