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

export type Token = {
  address: Record<string, string>;
  id: string;
  name: string;
  label: string;
  icon?: string;
};
