import { getApi, postApi } from './DefaultRequest';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import * as web3_sol from '@solana/web3.js';
import CryptoAccount from 'send-crypto';
// const CryptoAccount = require('send-crypto');
import bitcoin from 'bitcore-lib';
import * as litecoin from 'bitcore-lib-ltc';

//@ts-ignore
import TronWeb from 'tronweb';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { TezBridgeSigner } from '@taquito/tezbridge-signer';
import { Alchemy, AssetTransfersCategory, Network } from 'alchemy-sdk';
import {
  CHAIN_IDS_MAIN,
  CHAIN_IDS_TEST,
  FEATURED_RPCS_MAIN,
  FEATURED_RPCS_TEST,
  NODE_ENV,
  SOL_MAINNET_ALCHEMY,
} from 'src/constants/network';
import { array2object, findBy, findTokenByNetIdAndAddress, removePrefix } from '~/utils/helper';
import ABI from '../constants/abi/ERC20.abi.json';
import ABI721 from '../constants/abi/ERC721.abi.json';
import { WEI_DECIMALS, WEI_UNITS } from '~/constants/unit';
import { Chain, Common, Hardfork } from '@ethereumjs/common';
import bs58 from 'bs58';
import axios from 'axios';
import utils, { AbiType, fromDecimal } from 'web3-utils';
import { getDecimal } from '~/utils/web3';
import { ethers } from 'ethers';
import { Token, TXDATA } from '~/context/types';
import {
  ALCHEMY_API_KEY_TEST,
  ALCHEMY_API_KEY_MAIN,
  BSCSCAN_API_KEY,
  COMPARE_API_KEY,
  MORALIS_API_URL,
  MORALIS_API_KEY,
  PRICE_API_URL,
  TZSTATS_API_URL,
  SOLSCAN_API_URL,
  TRON_API_URL,
  TRON_API_KEY,
  SIMPLE_SWAP_API_KEY,
  BTC_LTC_API_URL,
  TATUM_API_KEY,
} from '~/constants/apis';
import { ASSETS_MAIN, ASSETS_TEST } from '~/constants/supported-assets';
import pushTx from './push-tx';
import getUTXOs from './get-utxos';
// import { Transaction as TX } from 'ethereumjs-tx';
// console.log(crypto);
// console.log(crypto.getHashes);
// console.log(crypto.subtle.encrypt);
// const ltcSDK = TatumLtcSDK({ apiKey: '7d5c2721-9499-43c7-9487-d4e956c71e67_100' });
const API_URL = 'https://li.quest/v1';
const CHAIN_IDS = NODE_ENV === 'test' ? CHAIN_IDS_TEST : CHAIN_IDS_MAIN;
const FEATURED_RPCS = NODE_ENV === 'test' ? FEATURED_RPCS_TEST : FEATURED_RPCS_MAIN;
const tokenData = NODE_ENV === 'test' ? ASSETS_TEST : ASSETS_MAIN;
const ALCHEMY_API_KEY = NODE_ENV === 'test' ? ALCHEMY_API_KEY_TEST : ALCHEMY_API_KEY_MAIN;
const web3: Record<string, Web3> = {};
FEATURED_RPCS.filter((rpc: any, index: number) => parseInt(rpc.chainId)).map(
  (rpc: any, index: number) => {
    web3[parseInt(rpc.chainId).toString()] = new Web3(rpc.rpcUrl);
  },
);

export const getQuery = async (data: any) => {
  const { queryKey } = data;
  return getApi(queryKey.join(''));
};

const getBtcLtcBalance = async (address: string, symbol: string) => {
  const balance_data = await axios
    .get(`${BTC_LTC_API_URL}/get_address_balance/${symbol}/${address}`)
    .catch((e) => {
      return null;
    });
  if (!Boolean(balance_data)) return '0';
  const { status, data } = balance_data?.data;
  return status === 'success' ? data.confirmed_balance : '0';
};
export const getBtcLtcTx = async (address: string, symbol: string) => {
  const tx_data: TXDATA | null = await axios
    .get(`${BTC_LTC_API_URL}/address/${symbol}/${address}`)
    .then((res: any) => {
      if (res.status === 200 && res.data.status === 'success') {
        if (!Boolean(res.data.data.total_txs)) return null;
        return (
          res.data.data.txs
            // .filter((tx: any) => {
            //   return !('outgoing' in tx && 'incoming' in tx);
            // })
            .map((tx: any) => {
              const out_value = parseFloat(tx?.outgoing?.value ?? '0');
              const in_value = parseFloat(tx?.incoming?.value ?? '0');
              const direction = out_value > in_value ? 'outgoing' : 'incoming';
              const tx_put = direction === 'outgoing' && tx[direction]['outputs'];
              const value = direction === 'outgoing' ? tx_put[0]?.value ?? '0' : tx.incoming.value;
              return {
                created_at: tx.time * 1000,
                hash: tx.txid,
                blockNum: tx.block_no,
                action: direction === 'outgoing' ? 'withdraw' : 'deposit',
                asset: symbol,
                net_id: symbol === 'BTC' ? '6' : '8',
                amount: value,
                address: tx_put && tx_put[0]?.address,
              };
            })
        );
      } else return null;
    })
    .catch((e) => {
      return null;
    });
  return tx_data;
};
const getErcTx = async (address: string, network: Network, chain_id: string, net_id: string) => {
  const config = {
    apiKey: ALCHEMY_API_KEY[network],
    network: network,
  };
  const alchemy = new Alchemy(config);

  let category = ['external'];
  if (
    network === Network.ETH_MAINNET ||
    network === Network.ETH_GOERLI ||
    network === Network.MATIC_MAINNET ||
    network === Network.MATIC_MUMBAI
  ) {
    category.push('internal');
  }
  if (network !== Network.ARB_GOERLI && network !== Network.OPT_GOERLI) {
    category = category.concat(['erc20', 'erc721', 'erc1155']);
  }
  const sendTx = await alchemy.core.getAssetTransfers({
    fromBlock: '0x0',
    fromAddress: address,
    category: category as AssetTransfersCategory[],
  });
  const rcvTx = await alchemy.core.getAssetTransfers({
    fromBlock: '0x0',
    toAddress: address,
    category: category as AssetTransfersCategory[],
  });
  const totalTx = sendTx.transfers.concat(rcvTx.transfers);
  const blocks = await Promise.all(
    totalTx.map((tx: any) => {
      return web3[chain_id].eth.getBlock(parseInt(tx.blockNum));
    }),
  );
  return totalTx
    .map((tx: any, index: number) => {
      return {
        hash: tx.hash,
        blockNum: tx.blockNum,
        asset: tx.asset,
        action: address === tx.from ? 'withdraw' : 'deposit',
        address: address === tx.from ? tx.to : tx.from,
        amount: tx.value,
        net_id,
        created_at: parseInt(`${blocks[index].timestamp}000`),
      };
    })
    .sort((tx1: any, tx2: any) => tx2.created_at - tx1.created_at);
};
export const getEthTx = async (address: string) => {
  return await getErcTx(
    address,
    NODE_ENV === 'test' ? Network.ETH_GOERLI : Network.ETH_MAINNET,
    parseInt(CHAIN_IDS.MAINNET).toString(),
    '1',
  );
};
export const getArbiTx = async (address: string) => {
  return await getErcTx(
    address,
    NODE_ENV === 'test' ? Network.ARB_GOERLI : Network.ARB_MAINNET,
    parseInt(CHAIN_IDS.ARBITRUM).toString(),
    '3',
  );
};
export const getPolyTx = async (address: string) => {
  return await getErcTx(
    address,
    NODE_ENV === 'test' ? Network.MATIC_MUMBAI : Network.MATIC_MAINNET,
    parseInt(CHAIN_IDS.POLYGON).toString(),
    '4',
  );
};
export const getOptTx = async (address: string) => {
  return await getErcTx(
    address,
    NODE_ENV === 'test' ? Network.OPT_GOERLI : Network.OPT_MAINNET,
    parseInt(CHAIN_IDS.OPTIMISM).toString(),
    '5',
  );
};
export const getBscTx = async (address: string) => {
  const native_res = await axios.get(`${MORALIS_API_URL}/${address}`, {
    params: { chain: 'bsc' },
    headers: { accept: 'application/json', 'X-API-Key': MORALIS_API_KEY },
  });
  const bep20_res = await axios.get(`${MORALIS_API_URL}/${address}/erc20/transfers`, {
    params: { chain: 'bsc' },
    headers: { accept: 'application/json', 'X-API-Key': MORALIS_API_KEY },
  });
  if (!Boolean(native_res) || !Boolean(bep20_res)) return null;
  const native_txs = native_res.data.result
    .filter((tx: any) => tx.value > 0)
    .map((tx: any) => ({
      hash: tx.hash,
      blockNum: tx.block_number,
      asset: 'BNB',
      action: address === tx.from_address ? 'withdraw' : 'deposit',
      address: address === tx.from_address ? tx.to_address : tx.from_address,
      amount: utils.fromWei(tx.value, 'ether'),
      net_id: '2',
      created_at: new Date(tx.block_timestamp).getTime(),
    }));
  const bep20_txs = bep20_res.data.result
    .filter((tx: any) => tx.value > 0)
    .filter((tx: any) => findTokenByNetIdAndAddress(tokenData, '2', tx.address))
    .map((tx: any) => ({
      hash: tx.transaction_hash,
      blockNum: tx.block_number,
      asset: findTokenByNetIdAndAddress(tokenData, '2', tx.address)?.name,
      action: address === tx.from_address ? 'withdraw' : 'deposit',
      address: address === tx.from_address ? tx.to_address : tx.from_address,
      amount: utils.fromWei(tx.value, 'ether'),
      net_id: '2',
      created_at: new Date(tx.block_timestamp).getTime(),
    }));
  return native_txs.concat(bep20_txs).sort((a: any, b: any) => b.blockNum - a.blockNum);
};
export const getTezosTx = async (address: string) => {
  const res = await axios.get(
    `${TZSTATS_API_URL}/account/${address}/operations?limit=100&order=desc`,
  );
  if (!Boolean(res)) return null;
  return res.data.map((tx: any) => ({
    hash: tx.hash,
    blockNum: tx.height,
    asset: 'XTZ',
    action: address === tx.sender ? 'withdraw' : 'deposit',
    address: address === tx.sender ? tx.receiver : tx.sender,
    amount: tx?.volume?.toString() ?? '0',
    net_id: '10',
    created_at: new Date(tx.time).getTime(),
  }));
};
export const getSolTx = async (address: string) => {
  const res = await axios.get(`${SOLSCAN_API_URL}/account/solTransfers`, {
    params: {
      account: address,
      limit: 20,
      offset: 0,
      order: 'desc',
    },
  });
  if (!(Boolean(res) && res.status === 200)) return null;
  return res.data.data.map((tx: any) => ({
    hash: tx.txHash,
    blockNum: tx.slot,
    asset: 'SOL',
    action: address === tx.src ? 'withdraw' : 'deposit',
    address: address === tx.src ? tx.dst : tx.src,
    amount: utils.fromWei(tx.lamport.toString(), 'gwei'),
    net_id: '9',
    created_at: new Date(tx.blockTime * 1000).getTime(),
  }));
};
export const getTronTx = async (address: string) => {
  const usdt_address = findBy(tokenData, 'id', '3')?.address[7];
  const usdc_address = findBy(tokenData, 'id', '4')?.address[7];
  const usdt_res = await axios.get(`${TRON_API_URL}/address/transaction-list`, {
    headers: {
      'Ok-Access-Key': TRON_API_KEY,
    },
    params: {
      chainShortName: 'tron',
      address,
      protocolType: 'token_20',
      tokenContractAddress: usdt_address,
      limit: '20',
    },
  });
  const usdc_res = await axios.get(`${TRON_API_URL}/address/transaction-list`, {
    headers: {
      'Ok-Access-Key': TRON_API_KEY,
    },
    params: {
      chainShortName: 'tron',
      address,
      protocolType: 'token_20',
      tokenContractAddress: usdc_address,
      limit: '20',
    },
  });
  if (
    !Boolean(usdt_res) ||
    !Boolean(usdc_res) ||
    usdt_res.status !== 200 ||
    usdc_res.status !== 200
  )
    return null;
  return (
    usdt_res.data.data[0].transactionLists
      .concat(usdc_res.data.data[0].transactionLists)
      // .filter((tx: any) => tx.token_info.symbol === 'USDT')
      .map((tx: any) => ({
        hash: tx.txId,
        blockNum: tx.blockHash,
        asset: tx.tokenContractAddress === usdt_address ? 'USDT' : 'USDC',
        action: address === tx.from ? 'withdraw' : 'deposit',
        address: address === tx.from ? tx.to : tx.from,
        amount: utils.fromWei(tx.lamport, 'gwei'),
        net_id: '9',
        state: tx.state,
        created_at: parseInt(tx.transactionTime),
      }))
      .sort((tx1: any, tx2: any) => tx2.created_at - tx1.created_at)
  );
};
const getSolBalance = async (address: string) => {
  const connection = new web3_sol.Connection(
    NODE_ENV === 'test' ? web3_sol.clusterApiUrl('devnet') : SOL_MAINNET_ALCHEMY,
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
const getTrxBalance = async (wallet: string) => {
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider('https://api.trongrid.io');
  const solidityNode = new HttpProvider('https://api.trongrid.io');
  const eventServer = new HttpProvider('https://api.trongrid.io');
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
  const balance = await tronWeb.trx.getBalance(wallet);
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
const getTezosBalance = async (address: string) => {
  const Tezos = new TezosToolkit(
    FEATURED_RPCS.find((rpc) => rpc.chainId === CHAIN_IDS.TEZOS)?.rpcUrl as string,
    // 'https://rpc.tzstats.com',
  );
  const xtz_bal = await Tezos.tz.getBalance(address);
  // .then((balance: any) => console.log(`tezos: ${balance}`))
  // .catch((error: any) => console.log('tezps err:', error));
  const res = await axios.get(`${TZSTATS_API_URL}/account/${address}`).catch((e) => {
    console.log(e);
    return null;
  });
  if (!Boolean(res)) return '0';
  return res?.data.spendable_balance.toString();
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
              balance = getTezosBalance(wallet);
              decimal = new Promise((resolve) => resolve('0'));
            } else if (net === '7') {
              balance = getTrxBalance(wallet);
              decimal = new Promise((resolve) => resolve('6'));
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

export const listNft = async (address: string) => {
  // const web3_net = web3['1'];
  const web3_net = new Web3(FEATURED_RPCS_TEST[0].rpcUrl);
  const config = {
    // apiKey: ALCHEMY_API_KEY[Network.ETH_MAINNET],
    // network: Network.ETH_MAINNET,
    apiKey: ALCHEMY_API_KEY_TEST[Network.ETH_MAINNET],
    network: Network.ETH_GOERLI,
  };
  const alchemy = new Alchemy(config);
  const nfts = await alchemy.nft.getNftsForOwner(address);
  return nfts;
};

export const getPrice = async (tokenData: Token[]) => {
  // const account = new CryptoAccount(
  //   'db15d694c086191dc23f2570f8d48a3ab625cd45e5859d00b626d7659df51c78',
  // );
  // // console.log(await account.address('LTC'));
  // console.log(await account.getBalance('LTC'));
  const prices = await axios.get(`${PRICE_API_URL}/pricemulti`, {
    headers: {
      api_key: COMPARE_API_KEY,
    },
    params: {
      fsyms: 'BTC,LTC,ETH,BNB,XTZ,OP,SOL,USDT,USDC,TRX,EUR',
      tsyms: 'USD',
    },
  });
  return Object.keys(prices.data).map((key: string) => {
    return {
      [key + '-USD']: prices.data[key]['USD'],
    };
  });
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
  const rpc_url = FEATURED_RPCS.find(
    (rpc) => parseInt(rpc.chainId) === parseInt(net.chain_id),
  )?.rpcUrl;

  const send = async (): Promise<any> => {
    if (['1'].includes(asset)) {
      // const account = new CryptoAccount(
      //   'db15d694c086191dc23f2570f8d48a3ab625cd45e5859d00b626d7659df51c78',
      // );
      // console.log(await account.address('LTC'));
      // console.log(await account.getBalance('LTC'));
      // const txHash = await account
      //   .send(to, amount, token.name)
      //   .on('transactionHash', console.log)
      //   .on('confirmation', console.log);
      // const options = { testnet: false };
      // const { txId } = await ltcSDK.transaction.sendTransaction(
      //   {
      //     fromAddress: [
      //       {
      //         address: accountFrom.address,
      //         privateKey: accountFrom.private_key,
      //       },
      //     ],
      //     to: [
      //       {
      //         address: to,
      //         value: amount,
      //       },
      //     ],
      //     // fee: fee,
      //     // changeAddress: accountFrom.address,
      //   },
      //   options,
      // );
      // console.log(`Transaction sent: ${txId}`);
      // return txId;
      const fee = asset === '6' ? 0.01 : 0.0001;
      // const resp = await axios.post(
      //   `https://api.tatum.io/v3/litecoin/transaction`,
      //   {
      //     fromAddress: [
      //       {
      //         address: accountFrom.address,
      //         privateKey: accountFrom.private_key,
      //       },
      //     ],
      //     to: [
      //       {
      //         address: to,
      //         value: amount,
      //       },
      //     ],
      //     fee,
      //     changeAddress: accountFrom.address,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'x-api-key': TATUM_API_KEY,
      //     },
      //   },
      // );

      // console.log(litecoin.default());
      // const PrivateKey = asset === '6' ? bitcoin.PrivateKey : litecoin.PrivateKey;
      // const Transaction = asset === '6' ? bitcoin.Transaction : litecoin.Transaction;
      const { PrivateKey, Transaction } = bitcoin;
      const pvtKey = new PrivateKey(accountFrom?.private_key);
      let utxos = await getUTXOs(accountFrom?.address, net.name.toLowerCase());

      //   // TODO: replace with actual input selection or disable (uncomment)
      //   // NOTE: the current code selects always the first spendable input (usually the latest transaction, as it's using the blockchain.info `/unspent` endpoint)
      //   // utxos = [ utxos[0] ]

      console.log('utxos:', utxos);
      if (!utxos) {
        throw Error(
          `No spendable outputs were found, please fund the address or wait for transactions to confirm`,
        );
      }

      const tx = new Transaction()
        .from(utxos)
        .to(accountFrom?.address, amount)
        .change(accountFrom?.address)
        .fee(5000)
        .sign(pvtKey);

      const txHex = tx.serialize();

      console.log('tx:', txHex);

      const result = await pushTx(txHex, net.name.toLowerCase());
      console.log('txHash:', result?.status);
      return result;
    } else if (['6'].includes(asset)) {
      // const account = new CryptoAccount(
      //   'db15d694c086191dc23f2570f8d48a3ab625cd45e5859d00b626d7659df51c78',
      // );
      // console.log(await account.address('LTC'));
      // console.log(await account.getBalance('LTC'));
      // const txHash = await account
      //   .send(to, amount, token.name)
      //   .on('transactionHash', console.log)
      //   .on('confirmation', console.log);
      // const options = { testnet: false };
      // const { txId } = await ltcSDK.transaction.sendTransaction(
      //   {
      //     fromAddress: [
      //       {
      //         address: accountFrom.address,
      //         privateKey: accountFrom.private_key,
      //       },
      //     ],
      //     to: [
      //       {
      //         address: to,
      //         value: amount,
      //       },
      //     ],
      //     // fee: fee,
      //     // changeAddress: accountFrom.address,
      //   },
      //   options,
      // );
      // console.log(`Transaction sent: ${txId}`);
      // return txId;
      const fee = asset === '6' ? 0.01 : 0.0001;
      const resp = await axios.post(
        `https://api.tatum.io/v3/litecoin/transaction`,
        {
          fromAddress: [
            {
              address: accountFrom.address,
              privateKey: accountFrom.private_key,
            },
          ],
          to: [
            {
              address: to,
              value: amount,
            },
          ],
          fee,
          changeAddress: accountFrom.address,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': TATUM_API_KEY,
          },
        },
      );
      return resp;

      // console.log(litecoin.default());
      // const PrivateKey = asset === '6' ? bitcoin.PrivateKey : litecoin.PrivateKey;
      // const Transaction = asset === '6' ? bitcoin.Transaction : litecoin.Transaction;

      // const { PrivateKey, Transaction } = bitcoin;
      // const pvtKey = new PrivateKey(accountFrom?.private_key);
      // let utxos = await getUTXOs(accountFrom?.address, net.name.toLowerCase());

      // console.log('utxos:', utxos);
      // if (!utxos) {
      //   throw Error(
      //     `No spendable outputs were found, please fund the address or wait for transactions to confirm`,
      //   );
      // }

      // const tx = new Transaction()
      //   .from(utxos)
      //   .to(accountFrom?.address, amount)
      //   .change(accountFrom?.address)
      //   .fee(5000)
      //   .sign(pvtKey);

      // const txHex = tx.serialize();

      // console.log('tx:', txHex);

      // const result = await pushTx(txHex, net.name.toLowerCase());
      // console.log('txHash:', result?.status);
      // return result;
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
      console.log('txdata:', txData);
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
        NODE_ENV === 'test' ? web3_sol.clusterApiUrl('devnet') : SOL_MAINNET_ALCHEMY,
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
      if (net.id === '7' && asset !== '9') {
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
          .send({ from: accountFrom.address, gasLimit: '0x30000' });
        return resp;
      } else {
        const token_addr = token?.address;
        web3_net.eth.accounts.wallet.add(accountFrom.private_key);
        //@ts-ignore
        const tokenInst = new web3_net.eth.Contract(ABI as ABIType, token_addr[net.id]);
        const decimal = await getDecimal(rpc_url, token_addr[net.id]);

        const result = await tokenInst.methods
          .transfer(to, web3_net.utils.toWei(amount.toString(), WEI_DECIMALS[decimal] ?? 'ether'))
          .send({ from: accountFrom.address, gasLimit: '0x30000' });
        console.log('USDT tx: ', result);
        // return !(result.error);
        return result;
      }
    } else if (asset === '8') {
      console.log('8:', FEATURED_RPCS.find((rpc) => rpc.chainId === net.chain_id)?.rpcUrl);
      const Tezos = new TezosToolkit(
        FEATURED_RPCS.find((rpc) => rpc.chainId === net.chain_id)?.rpcUrl as string,
      );
      Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(accountFrom.private_key) });
      // Using the contract API, the follwing operation is signed using the configured signer:
      const result = await Tezos.wallet
        .transfer({ to, amount })
        .send()
        .catch((e: any) => console.log(e));
      console.log(result);
      return result;
    } else if (asset === '11') {
      let headers = null;
      // if (AppKey) {
      //     headers = { "TRON-PRO-API-KEY": AppKey };
      // }
      // const tronWeb = new TronWeb({
      //     fullHost: 'https://api.shasta.trongrid.io',
      //     headers: headers,
      //     privateKey: accountFrom.private_key,
      // });
      const HttpProvider = TronWeb.providers.HttpProvider;
      const fullNode = new HttpProvider('https://api.trongrid.io');
      const solidityNode = new HttpProvider('https://api.trongrid.io');
      const eventServer = new HttpProvider('https://api.trongrid.io');
      const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, accountFrom.private_key);
      const tradeobj = await tronWeb.transactionBuilder.sendTrx(
        tronWeb.address.toHex(to),
        amount * 1000 * 1000,
        tronWeb.address.toHex(accountFrom.address),
      );
      const signedtxn = await tronWeb.trx.sign(tradeobj, accountFrom.private_key);
      const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
      console.log('transfer:', receipt);
      return receipt;
    }
  };

  // 6. Call send function
  const result = await send();
  // .catch((e) => {
  //   return { data: null, e };
  // });
  console.log('withdraw result:', result);
  return result;
};

export const estimateGasSendNft = async (
  from: string,
  to: string,
  id: string,
  tokenAddress: string,
) => {
  // const web3_net = web3[CHAIN_IDS.MAINNET as string];
  const web3_net = new Web3(FEATURED_RPCS_TEST[0].rpcUrl);
  const gasPrice = await web3_net.eth.getGasPrice().catch((e) => '0');
  let gas = '21000';
  // web3_net.eth.accounts.wallet.add(accountFrom.private_key);
  console.log(gasPrice);
  console.log(tokenAddress);
  //@ts-ignore
  const tokenInst = new web3_net.eth.Contract(ABI721 as ABIType, tokenAddress);
  console.log(tokenInst);
  gas = await tokenInst.methods.safeTransferFrom(from, to, id).estimateGas({ gasPrice });
  console.log('NFT withdraw gas: ', gas);
  const gas_cost = parseFloat(utils.fromWei(gasPrice, 'ether')) * parseFloat(gas);
  return gas_cost.toString();
};

export const withdrawNft = async (
  accountFrom: any,
  to: string,
  id: string,
  tokenAddress: string,
) => {
  // const web3_net = web3[CHAIN_IDS.MAINNET as string];
  const web3_net = new Web3(FEATURED_RPCS_TEST[0].rpcUrl);

  web3_net.eth.accounts.wallet.add(accountFrom.private_key);
  //@ts-ignore
  const tokenInst = new web3_net.eth.Contract(ABI721 as ABIType, tokenAddress);

  const result = await tokenInst.methods
    .safeTransferFrom(accountFrom.address, to, id)
    .send({ from: accountFrom.address, gasLimit: '0x30000' });
  console.log('NFT withdraw tx: ', result);
  // return !(result.error);
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

// export const getPrice = async () => {
//   return getApi('/GetPrice');
// };

export const postQuery = async (query: string, data: any) => {
  return postApi(query, data);
};

const baseURL_lifi = 'https://li.quest/v1';
export const getLifi = async (url: string, data: any) => {
  const rpcUrl = FEATURED_RPCS.find(
    (rpc) => parseInt(rpc.chainId) === parseInt(data.fromChain),
  )?.rpcUrl;
  const decimal = await getDecimal(rpcUrl, data.fromToken);
  data.fromAmount = utils.toWei(data.fromAmount.toString(), WEI_DECIMALS[decimal]);
  const result = await axios.get(`${baseURL_lifi}${url}`, {
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

const baseURL_simple = 'https://api.simpleswap.io';
export const getSimpleQuote = async (data: any) => {
  const result = await axios
    .get(`${baseURL_simple}/get_estimated`, {
      // headers: {
      //   api_key: SIMPLE_SWAP_API_KEY,
      // },
      params: { ...data, api_key: SIMPLE_SWAP_API_KEY },
    })
    .then((res: any) => {
      return { data: res, e: null };
    })
    .catch((e: any) => {
      console.log('simple swap error1:', e);
      return { data: null, e };
    });
  return result;
};

// const provider = new ethers.providers.JsonRpcProvider(FEATURED_RPCS[0].rpcUrl, 100);
// const wallet = ethers.Wallet.fromMnemonic(YOUR_PERSONAL_MNEMONIC).connect(
//     provider
// );

export const lifiSwapPost = async (data: any, wallets: any, token: string, amount: string) => {
  // const walletData = array2object(
  //   wallets && 'map' in wallets ? wallets?.map((a: any) => ({ [a.net_id]: a.address })) : [],
  // );
  const wallet = wallets.find((wallet: any) => wallet.net_id === '1');
  const rpcUrl = FEATURED_RPCS.find((rpc) => parseInt(rpc.chainId) === data.chainId)?.rpcUrl;
  // const web3_net = web3[5];
  const web3_net = new Web3(rpcUrl as string);
  web3_net.eth.accounts.wallet.add(wallet.private_key);
  if (data.value === '0x00') {
    //@ts-ignore
    const tokenInst = new web3_net.eth.Contract(ABI as ABIType, token);
    const decimal = await tokenInst.methods.decimals().call({});
    const allowance = utils.fromWei(
      await tokenInst.methods.allowance(wallet.address, data.to).call({}),
      WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS],
    );
    if (parseFloat(allowance) < parseFloat(amount)) {
      const approve = await tokenInst.methods
        .approve(data.to, utils.toWei(amount, WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS]))
        .send({ from: wallet.address, gasLimit: '0x30000' });
    }
  }
  const signedTx = await web3_net.eth.accounts.signTransaction(data, wallet.private_key);
  const result = await web3_net.eth.sendSignedTransaction(signedTx.rawTransaction as string);
  // .then((res) => res)
  // .catch((e) => {
  //   console.log(e);
  //   return { data: null, e };
  // });
  console.log('result:', result);
  return result;
};

export const simpleSwapPost = async (data: any, net: any, token: any, wallets: any) => {
  const walletData = array2object(
    wallets && 'map' in wallets ? wallets?.map((a: any) => ({ [a.net_id]: a })) : [],
  );
  const result = await axios.post(`${baseURL_simple}/create_exchange`, data, {
    // headers: {
    //   api_key: SIMPLE_SWAP_API_KEY,
    // },
    params: {
      api_key: SIMPLE_SWAP_API_KEY,
    },
  });
  // .catch((e) => {
  //   return { data: null, e };
  // });
  console.log(result);
  if (result?.data) {
    const swap_result = await withdraw(
      net,
      token,
      result.data.address_from,
      data.amount,
      walletData[net.id],
    );
    // .catch((e) => {
    //   return { data: null, e };
    // });
    return swap_result;
  }
  return result;
};

// export const estimateGasLifi = async (chain_id: string, data: any) => {
//   const gasPrice = await web3[chain_id].eth.getGasPrice().catch((e) => '0');
//   if (chain_id !== '0') {
//     const gas = await web3[chain_id].eth.estimateGas({ ...data, gasPrice }).catch((e) => '0');
//     return utils.fromWei(gas.toString(), 'ether');
//   }
//   return '0';
// };

export const estimateGasSend = async (
  net: any,
  token: any,
  to: string,
  amount: string,
  // wallet_address: any,
) => {
  if (['1', '2', '3', '4', '5'].includes(net.id)) {
    const web3_net = web3[net.chain_id];
    const gasPrice = await web3_net.eth.getGasPrice().catch((e) => '0');
    let gas = '21000';
    let approve_gas = '0';
    const token_address = token.address[net.id];
    if (token_address !== '') {
      //@ts-ignore
      const tokenInst = new web3_net.eth.Contract(ABI as ABIType, token_address);
      const decimal = await tokenInst.methods.decimals().call({});
      // const allowance = utils.fromWei(
      //   await tokenInst.methods.allowance(wallet_address, to).call({}),
      //   WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS],
      // );
      // console.log(allowance);
      // if (parseFloat(allowance) < parseFloat(amount)) {
      //   approve_gas = await tokenInst.methods
      //     .approve(to, utils.toWei(amount, WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS]))
      //     .estimateGas({ from: wallet_address });
      // }
      gas = await tokenInst.methods
        .transfer(to, utils.toWei(amount, WEI_DECIMALS[decimal as keyof typeof WEI_DECIMALS]))
        .estimateGas({ gasPrice })
        .catch((e: any) => '0');
    }
    const gas_cost =
      parseFloat(utils.fromWei(gasPrice, 'ether')) * (parseFloat(gas) + parseFloat(approve_gas));
    return gas_cost.toString();
  } else {
    return net.gas;
  }
};
