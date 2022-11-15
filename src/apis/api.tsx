import { getApi, postApi } from './DefaultRequest';

export const getQuery = async (data: any) => {
  console.log('getQuery');
  const { queryKey } = data;
  return getApi(queryKey.join(''));
};

// export const getWallet = async () => {
//   return postApi('/ListWallets', {
//     user: '1',
//   });
// };

// export const getToken = async () => {
//   return getApi('/GetSupportedAssets');
// };

export const getPrice = async () => {
  return getApi('/GetPrice');
};

export const postQuery = async (query: string, data: any) => {
  return postApi(query, data);
};
