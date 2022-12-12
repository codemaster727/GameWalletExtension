import { getApi, postApi } from './DefaultRequest';
import Web3 from 'web3';
import * as web3_sol from '@solana/web3.js';
import {
  CHAIN_IDS_TEST,
  FEATURED_RPCS_MAIN,
  FEATURED_RPCS_TEST,
  NODE_ENV,
} from 'src/constants/network';
import { array2object, removePrefix } from '~/utils/helper';
import ABI from '../constants/abi/ERC20.abi.json';
import { WEI_DECIMALS, WEI_UNITS } from '~/constants/unit';
import { Chain, Common, Hardfork } from '@ethereumjs/common';
import bs58 from 'bs58';
import axios from 'axios';
import utils from 'web3-utils';
import { getDecimal } from '~/utils/web3';
import { ethers } from 'ethers';
// import { Transaction as TX } from 'ethereumjs-tx';

const API_URL = 'https://li.quest/v1';
const FEATURED_RPCS = NODE_ENV === 'test' ? FEATURED_RPCS_TEST : FEATURED_RPCS_MAIN;
const web3: Record<string, Web3> = {};
FEATURED_RPCS.map((rpc: any, index: number) => {
  web3[parseInt(FEATURED_RPCS[index].chainId).toString()] = new Web3(rpc.rpcUrl);
});

export const getQuery = async (data: any) => {
  const { queryKey } = data;
  return getApi(queryKey.join(''));
};

export const getBalance = async (wallets: any, nets: any, tokens: any) => {
  const result: any = {};
  const walletData = array2object(
    wallets && 'map' in wallets ? wallets?.map((a: any) => ({ [a.net_id]: a.address })) : [],
  );
  const pros = tokens
    .filter((token: any, index: number) => token.id !== '10')
    .map((token: any, index: number) => {
      const token_addr = token?.address;
      const middle_result = Object.keys(token_addr)
        .filter((net: any) => !['6', '7', '8', '10', '9'].includes(net))
        .map((net: any) => {
          const chainId =
            nets?.find((net_info: any) => net_info.id === net)?.chain_id ??
            parseInt(CHAIN_IDS_TEST.MAINNET).toString();
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
    result[token_id][net] = utils.fromWei(
      balance,
      WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS],
    );
  }
  return result;
};

export const withdraw = async (
  net: string,
  asset: string,
  to: string,
  amount: number,
  wallets: any,
  nets: any,
  tokens: any,
) => {
  const chain = nets?.find((net_info: any) => net_info.id === net);
  const chainId =
    nets?.find((net_info: any) => net_info.id === net)?.chain_id ?? CHAIN_IDS_TEST.MAINNET;
  const web3_net = web3[chainId];
  const walletData = array2object(
    wallets && 'map' in wallets ? wallets?.map((a: any) => ({ [a.net_id]: a })) : [],
  );
  const accountFrom: any = walletData[net];
  const send = async (): Promise<any> => {
    if (['1', '2', '5', '6', '8'].includes(asset)) {
      const nonce = await web3_net.eth.getTransactionCount(accountFrom?.address, 'latest');
      const gasPrice = await web3_net.eth.getGasPrice();

      // const common = Common.custom({
      //   name: chain?.name,
      //   networkId: parseInt(chain?.chain_d as string),
      //   chainId: parseInt(chain?.chain_id as string),
      // });

      const common = new Common({
        chain: Chain.Goerli,
        hardfork: Hardfork.Petersburg,
      });

      const txData = {
        gas: 21000,
        gasPrice: web3_net.utils.toHex(gasPrice),
        to: to.toLowerCase(),
        value: web3_net.utils.toHex(web3_net.utils.toWei(amount.toString(), 'ether')),
        nonce: nonce,
      };
      // 4. Sign tx with PK
      // const createTransaction = await web3.eth.accounts.signTransaction(
      //     txData,
      //     accountFrom.private_key
      // );

      // sign transaction with TX
      // const tx = new TX(txData, { common });
      // const privateKey = Buffer.from(removePrefix(accountFrom.private_key), 'hex');
      // tx.sign(privateKey);
      const createTransaction = await web3_net.eth.accounts.signTransaction(
        txData,
        accountFrom.private_key,
      );

      // return await web3_net.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'));

      // 5. Send tx and wait for receipt
      const createReceipt = await web3_net.eth.sendSignedTransaction(
        createTransaction.rawTransaction as string,
        (error, hash) => {
          console.log(error);
        },
      );
      return createReceipt;
      // return "result"
    } else if (asset === '7') {
      const secret_key = bs58.decode(accountFrom.private_key as string);
      // Connect to cluster
      const connection = new web3_sol.Connection(web3_sol.clusterApiUrl('devnet'));
      // Construct a `Keypair` from secret key
      const from = web3_sol.Keypair.fromSecretKey(secret_key);
      // Generate a new random public key
      // Add transfer instruction to transaction
      const transaction = new web3_sol.Transaction().add(
        web3_sol.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: new web3_sol.PublicKey(to),
          lamports: web3_sol.LAMPORTS_PER_SOL * amount,
        }),
      );
      // Sign transaction, broadcast, and confirm
      const signature = await web3_sol.sendAndConfirmTransaction(connection, transaction, [from]);
      return signature;
    } else if (['3', '4'].includes(asset)) {
      if (net === '7') {
        return null;
      } else {
        const token = tokens?.find((token: any) => token.id === asset);
        const token_addr = token?.address;
        web3_net.eth.accounts.wallet.add(accountFrom.private_key);
        //@ts-ignore
        const tokenInst = new web3_net.eth.Contract(ABI as ABIType, address);
        const result = await tokenInst.methods
          .transfer(to, web3_net.utils.toWei(amount.toString(), net === '1' ? 'Mwei' : 'ether'))
          .send({ from: accountFrom.address, gas: 100000 });
        console.log('USDT tx: ', result);
        // return !(result.error);
        return result;
      }
    } else return null;
  };

  // 6. Call send function
  const result = await send();
  console.log(result);
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

const baseURL = 'https://li.quest/v1';
export const getLifi = async (url: string, data: any) => {
  const rpcUrl = FEATURED_RPCS.find(
    (rpc) => parseInt(rpc.chainId) === parseInt(data.fromChain),
  )?.rpcUrl;
  const decimal = await getDecimal(rpcUrl, data.fromToken);
  data.fromAmount = utils.toWei(data.fromAmount.toString(), WEI_DECIMALS[decimal]);
  const result = await axios.get(`${baseURL}${url}`, {
    params: data,
  });
  if (result.data?.estimate) {
    result.data.estimate.toAmount = utils.fromWei(
      result.data.estimate.toAmount,
      WEI_DECIMALS[result.data.action.toToken.decimals],
    );
  }
  return result.data;
};

// const provider = new ethers.providers.JsonRpcProvider(FEATURED_RPCS[0].rpcUrl, 100);
// const wallet = ethers.Wallet.fromMnemonic(YOUR_PERSONAL_MNEMONIC).connect(
//     provider
// );

export const postSwap = async (data: any, wallet: any) => {
  const rpcUrl = FEATURED_RPCS.find((rpc) => parseInt(rpc.chainId) === data.chainId)?.rpcUrl;
  // const web3_net = web3[5];
  const web3_net = new Web3(rpcUrl as string);
  web3_net.eth.accounts.wallet.add(wallet.private_key);
  const signedTx = await web3_net.eth.accounts.signTransaction(data, wallet.private_key);
  const result = await web3_net.eth
    .sendSignedTransaction(signedTx.rawTransaction as string)
    .then((res) => res)
    .catch((e) => console.log(e.data));
  console.log('result:', result);
  return result;
};
