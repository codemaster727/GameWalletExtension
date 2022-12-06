import { getApi, postApi } from './DefaultRequest';
import Web3 from 'web3';
import * as web3_sol from '@solana/web3.js';
import { FEATURED_RPCS, FEATURED_RPCS_TEST } from 'src/constants/network';
import { array2object } from '~/utils/helper';
import ABI from '../constants/abi/ERC20.abi.json';
import { WEI_DECIMALS, WEI_UNITS } from '~/constants/unit';

const web3: Record<string, Web3> = {};
FEATURED_RPCS_TEST.map((rpc: any) => {
  web3[parseInt(rpc.chainId).toString()] = new Web3(rpc.rpcUrl);
});

console.log(web3);

export const getQuery = async (data: any) => {
  const { queryKey } = data;
  return getApi(queryKey.join(''));
};

export const getBalance = async (wallets: any, nets: any, tokens: any) => {
  const result: any = {};
  const walletData = array2object(
    wallets && 'map' in wallets ? wallets?.map((a: any) => ({ [a.net_id]: a.address })) : [],
  );
  console.log(walletData);
  const pros = tokens
    .filter((token: any, index: number) => token.id !== '10')
    .map((token: any, index: number) => {
      const token_addr = token?.address;
      const middle_result = Object.keys(token_addr)
        .filter((net: any) => !['6', '7', '8', '10', '9'].includes(net))
        .map((net: any) => {
          const chainId = nets.find((net_info: any) => net_info.id === net)?.chain_id;
          const address = token_addr[net];
          let balance: Promise<string> = new Promise((resolve) => resolve('0'));
          let decimal: Promise<string> = new Promise((resolve) => resolve('18'));
          const web3_net = web3[chainId];
          if (address === '') {
            balance = web3_net.eth.getBalance(walletData[net] as string);
            if (net === '6') decimal = new Promise((resolve) => resolve('8'));
          } else {
            //@ts-ignore
            const tokenInst = new web3_net.eth.Contract(ABI as ABIType, address);
            balance = tokenInst.methods.balanceOf(walletData[net] as string).call({});
            decimal = tokenInst.methods.decimals().call({});
          }
          return [token.id, net, balance, decimal];
        })
        .flatMap((res) => res);
      return middle_result.length > 0 ? middle_result : [token.id, '0', '0', '0'];
    });
  const result_pros = await Promise.all(pros.flatMap((pro: any) => pro));
  while (result_pros.length) {
    const token_id = result_pros.shift();
    const net = result_pros.shift();
    const balance = result_pros.shift();
    const decimal = result_pros.shift();
    result[token_id] = result[token_id] ?? {};
    result[token_id][net] = web3['5'].utils.fromWei(
      balance,
      WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS],
    );
  }
  return result;
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
