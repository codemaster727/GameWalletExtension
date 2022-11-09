import React from 'react';
import { useMutation } from 'react-query';
import { postQuery } from '~/apis/api';
import { TransactionMutateParams } from './types';

const {
  status: transactionStatus,
  isLoading: transactionIsLoading,
  isError: transactionIsError,
  mutate: transactionMutate,
  data: transactionData,
} = useMutation(
  (data: TransactionMutateParams) => {
    return postQuery('/ListTransactions', data);
  },
  {
    onError: (data: any) => {
      const { error } = data;
      // setErrorResult((prev) => ({
      //   count: (prev?.count ?? 0) + 1,
      //   message: `Fetching Transactions failed due to server errors. ${error}`,
      // }));
    },
  },
);

export default {
  transactionIsLoading,
  transactionData: transactionData?.rows,
  transactionTotal: transactionData?.total ? transactionData?.total[0].Total : 0,
  transactionMutate,
};
