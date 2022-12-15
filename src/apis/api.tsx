import { getApi, postApi } from './DefaultRequest';
import Web3 from 'web3';
import * as web3_sol from '@solana/web3.js';
import CryptoAccount from 'send-crypto';
//@ts-ignore
import TronWeb from 'tronweb';
//@ts-ignore
// import { InMemorySigner } from '@taquito/signer';
//@ts-ignore
// import { TezosToolkit } from '@taquito/taquito';
// import { TezBridgeSigner } from "@taquito/tezbridge-signer";
import {
  CHAIN_IDS_MAIN,
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
const CHAIN_IDS = NODE_ENV === 'test' ? CHAIN_IDS_TEST : CHAIN_IDS_MAIN;
const FEATURED_RPCS = NODE_ENV === 'test' ? FEATURED_RPCS_TEST : FEATURED_RPCS_MAIN;
const web3: Record<string, Web3> = {};
FEATURED_RPCS.map((rpc: any, index: number) => {
  web3[parseInt(FEATURED_RPCS[index].chainId).toString()] = new Web3(rpc.rpcUrl);
});

export const getQuery = async (data: any) => {
  const { queryKey } = data;
  return getApi(queryKey.join(''));
};

const getBtcLtcBalance = async (address: string, symbol: string) => {
  const balance_data = await axios
    .get(`https://chain.so/api/v2/get_address_balance/${symbol}/${address}`)
    .catch((e) => {
      return null;
    });
  if (!Boolean(balance_data)) return '0';
  const { status, data } = balance_data?.data;
  return status === 'success' ? data.confirmed_balance : '0';
};
const getSolBalance = async (address: string) => {
  const connection = new web3_sol.Connection(
    web3_sol.clusterApiUrl(NODE_ENV !== 'test' ? 'devnet' : 'mainnet-beta'),
  );
  return (
    (await connection.getBalance(new web3_sol.PublicKey(address))) / web3_sol.LAMPORTS_PER_SOL
  ).toString();
};
const getTronBalance = async (wallet: string, tokenAddress: string) => {
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider('https://api.trongrid.io');
  const solidityNode = new HttpProvider('https://api.trongrid.io');
  const eventServer = new HttpProvider('https://api.trongrid.io');
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
  const { abi } = await tronWeb.trx.getContract(tokenAddress);
  const contract = tronWeb.contract(abi.entrys, tokenAddress);
  const balance = await contract.methods.balanceOf(wallet).call({ from: wallet });
  return balance.toString();
};
const getTronDecimal = async (wallet: string, tokenAddress: string) => {
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider('https://api.trongrid.io');
  const solidityNode = new HttpProvider('https://api.trongrid.io');
  const eventServer = new HttpProvider('https://api.trongrid.io');
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
  const { abi } = await tronWeb.trx.getContract(tokenAddress);
  const contract = tronWeb.contract(abi.entrys, tokenAddress);
  const decimal = await contract.methods.decimals().call({ from: wallet });
  return decimal;
};
// const getTezosBalance = async (address: string) => {
//   const Tezos = new TezosToolkit(
//     FEATURED_RPCS.find((rpc) => rpc.chainId === CHAIN_IDS.TEZOS)?.rpcUrl as string,
//   );
//   return await Tezos.tz.getBalance(address).toString();
// };

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
        // .filter((net: any) => !['10', '9'].includes(net))
        .map((net: any) => {
          const chainId =
            nets?.find((net_info: any) => net_info.id === net)?.chain_id ??
            parseInt(CHAIN_IDS.MAINNET).toString();
          const address = token_addr[net];
          let balance: Promise<string> = new Promise((resolve) => resolve('0'));
          let decimal: Promise<string> = new Promise((resolve) => resolve('18'));
          const web3_net = web3[chainId];
          const wallet = walletData[net] as string;
          console.log(address);
          console.log(net);
          if (address === '') {
            if (net === '6') {
              balance = getBtcLtcBalance(wallet, 'BTC');
              decimal = new Promise((resolve) => resolve('0'));
            } else if (net === '8') {
              balance = getBtcLtcBalance(wallet, 'LTC');
              decimal = new Promise((resolve) => resolve('0'));
            } else if (net === '9') {
              balance = getSolBalance(wallet);
              decimal = new Promise((resolve) => resolve('0'));
            } else if (net === '10') {
              // balance = getTezosBalance(wallet);
              // decimal = new Promise((resolve) => resolve('6'));
            } else {
              balance = web3_net.eth.getBalance(wallet);
            }
          } else {
            if (net === '7') {
              balance = getTronBalance(wallet, address);
              decimal = getTronDecimal(wallet, address);
            } else {
              //@ts-ignore
              const tokenInst = new web3_net.eth.Contract(ABI as ABIType, address);
              balance = tokenInst.methods.balanceOf(wallet).call({});
              decimal = tokenInst.methods.decimals().call({});
            }
          }
          console.log([token.id, net, balance, decimal]);
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
    // console.log([token_id, net, balance, decimal]);
    result[token_id] = result[token_id] ?? {};
    if (decimal !== '0') {
      result[token_id][net] = utils.fromWei(
        balance,
        WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS],
      );
    } else {
      result[token_id][net] = balance;
    }
  }
  return result;
};
// const HttpProvider = TronWeb.providers.HttpProvider;
export const withdraw = async (
  net: any,
  token: any,
  to: string,
  amount: number,
  accountFrom: any,
) => {
  const chainId = net?.chain_id ?? CHAIN_IDS.MAINNET;
  const web3_net = web3[chainId];
  const asset = token.id;

  const send = async (): Promise<any> => {
    if (['1', '6'].includes(asset)) {
      const account = new CryptoAccount(accountFrom.private_key);
      /* Print address */
      console.log(await account.address('BTC'));
      /* Print balance */
      console.log(await account.getBalance('BTC'));
      /* Send 0.01 BTC */
      const txHash = await account
        .send(to, amount, token.name)
        .on('transactionHash', console.log)
        // > "3387418aaddb4927209c5032f515aa442a6587d6e54677f08a03b8fa7789e688"
        .on('confirmation', console.log);
      return txHash;
    } else if (['2', '5'].includes(asset)) {
      const nonce = await web3_net.eth.getTransactionCount(accountFrom?.address, 'latest');
      const gasPrice = await web3_net.eth.getGasPrice();

      const common = new Common({
        chain: Chain.Mainnet,
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
      const connection = new web3_sol.Connection(
        web3_sol.clusterApiUrl(NODE_ENV !== 'test' ? 'devnet' : 'mainnet-beta'),
      );
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
    } else if (['3', '4', '9'].includes(asset)) {
      if (net === '7' && asset !== '9') {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider('https://api.trongrid.io');
        const solidityNode = new HttpProvider('https://api.trongrid.io');
        const eventServer = new HttpProvider('https://api.trongrid.io');
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, accountFrom.private_key);
        const { abi } = await tronWeb.trx.getContract(token?.address);
        const contract = tronWeb.contract(abi.entrys, token?.address);
        // const balance = await contract.methods.balanceOf(accountFrom.address).call();
        // const decimal = await contract.methods.decimals().call({from: accountFrom.address});
        const resp = await contract.methods
          .transfer(to, web3_net.utils.toWei(amount.toString(), 'Mwei'))
          .send({ from: accountFrom.address });
        console.log('transfer:', resp);
        return resp;
      } else {
        const token_addr = token?.address;
        web3_net.eth.accounts.wallet.add(accountFrom.private_key);
        //@ts-ignore
        const tokenInst = new web3_net.eth.Contract(ABI as ABIType, token_addr);
        const result = await tokenInst.methods
          .transfer(to, web3_net.utils.toWei(amount.toString(), net === '2' ? 'ether' : 'Mwei'))
          .send({ from: accountFrom.address, gas: 100000 });
        console.log('USDT tx: ', result);
        // return !(result.error);
        return result;
      }
    } else if (asset === '8') {
      // const Tezos = new TezosToolkit(
      //   FEATURED_RPCS.find((rpc) => rpc.chainId === net.chain_id)?.rpcUrl as string,
      // );
      // Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(accountFrom.private_key) });
      // // Using the contract API, the follwing operation is signed using the configured signer:
      // const result = await Tezos.wallet.transfer({ to, amount });
      // console.log(result);
      // return result;
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
