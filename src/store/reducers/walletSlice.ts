import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createNewVaultAndGetSeedPhrase } from '../actions';

export const createNewAccountThunk = createAsyncThunk(
  'wallet/createNewVaultAndGetSeedPhrase',
  async (password: string, thunkAPI) => {
    const seed = await createNewVaultAndGetSeedPhrase(password);
    console.log('seed', seed);
    return seed;
  },
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    firstTimeFlowType: null,
    seed: '',
    completedOnboarding: false,
  },
  reducers: {
    // createNewAccount(state: any, action) {
    //   const { payload } = action;
    //   state.seed = seed;
    // },
    // todoToggled(state: any[], action) {
    //   const todo = state.find(todo => todo.id === action.payload)
    //   todo.completed = !todo.completed
    // }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(createNewAccountThunk.fulfilled, (state: any, action) => {
      console.log('action:', action);
      // Add user to the state array
      state.seed = action.payload;
    });
  },
});

export default walletSlice.reducer;
