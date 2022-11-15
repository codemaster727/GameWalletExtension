export type TransactionMutateParams = {
  user_id: string;
  limit: number;
  page: number;
  type: string;
};

export type ActionType = {
  type: string;
  payload: any;
};
