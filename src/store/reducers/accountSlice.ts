import { createSlice } from '@reduxjs/toolkit';
import { createNewVaultAndGetSeedPhrase } from '../action';

const accountSlice = createSlice({
  name: 'account',
  initialState: [],
  reducers: {
    createNewAccount(state: any[], action) {
      const { payload } = action;
      const seed = createNewVaultAndGetSeedPhrase(payload);
      console.log(seed);
      state.push({
        seed,
      });
    },
    // todoToggled(state: any[], action) {
    //   const todo = state.find(todo => todo.id === action.payload)
    //   todo.completed = !todo.completed
    // }
  },
});

export const { createNewAccount } = accountSlice.actions;
export default accountSlice.reducer;
