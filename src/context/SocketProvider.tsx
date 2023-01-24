import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getQuery,
  getPrice,
  postQuery,
  getBalance,
  withdraw,
  getLifi,
  getEthTx,
  getBscTx,
  getArbiTx,
  getPolyTx,
  getOptTx,
  getTezosTx,
  getBtcLtcTx,
  getSolTx,
  getTronTx,
  listNft,
  withdrawNft,
} from '../apis/api';
import BitcoinIcon from '../assets/coingroup/bitcoin.svg';
import EthIcon from '../assets/coingroup/ethereum.svg';
import UsdtIcon from '../assets/coingroup/usdt.svg';
import UsdcIcon from '../assets/coingroup/usdc.svg';
import BnbIcon from '../assets/coingroup/bnb.svg';
import LtcIcon from '../assets/coingroup/litecoin.svg';
// import SolIcon from '../assets/coingroup/sol.svg';
import SolIcon from '../assets/coingroup/sol.png';
import TezosIcon from '../assets/coingroup/tezos.png';
import OptimismIcon from '../assets/coingroup/optimism.svg';
import NFTIcon from '../assets/coingroup/NFT_Icon.png';
import PolygonIcon from '../assets/coingroup/polygon-token.svg';
import ArbitrumIcon from '../assets/coingroup/Arbitrum.svg';
import ArbitrumLogoIcon from '../assets/coingroup/arbitrum_logo.svg';
import TronIcon from '../assets/coingroup/tron-trx-logo.svg';
import { array2object, findBy } from '../utils/helper';
import { Token, TransactionMutateParams } from './types';
import { ASSETS_MAIN, ASSETS_TEST } from '~/constants/supported-assets';
import { NODE_ENV } from '~/constants/network';
import { CHAINS_MAIN, CHAINS_TEST } from '~/constants/nets';
import { isEmpty } from 'lodash';
import useNetwork from '~/hooks/useNetwork';

interface SocketContextType {
  loading: boolean;
  networkError: boolean;
  refetch: (query: string[]) => void;
  priceData: any;
  balances?: any;
  balanceData?: any;
  walletData?: any;
  walletArray?: any;
  tokenData: Token[];
  netData?: any;
  transactionIsLoading?: boolean;
  transactionData?: any;
  transactionTotal?: number;
  transactionMutate?: any;
  errorResult?: Result;
  successResult?: Result;
  // withdrawMutate?: any;
  // withdrawIsLoading?: boolean;
  // swapIsLoading?: boolean;
  // swapMutate?: any;
  // swapData: any;
  withdraw?: any;
  withdrawNft?: any;
  quoteMutate: any;
  quoteIsError: Boolean;
  quoteData: any;
  quoteIsLoading: boolean;
  quoteStatus: any;
  updateBalance: () => void;
  ethTx: any;
  bscTx: any;
  polyTx: any;
  arbiTx: any;
  optTx: any;
  btcTx: any;
  ltcTx: any;
  solTx: any;
  tezosTx: any;
  tronTx: any;
  getTx: () => void;
  nftStatus: string;
  nftList: any;
}

const init_tokens = [
  {
    id: '1',
    name: 'BTC',
    icon: BitcoinIcon,
    balance: 1.2338,
    USD: 23598.15,
    EUR: 24549.63,
  },
  {
    id: '2',
    name: 'ETH',
    icon: EthIcon,
    balance: 2.5613,
    USD: 3418.34,
    EUR: 3555.75,
  },
  {
    id: '3',
    name: 'USDT',
    icon: UsdtIcon,
    balance: 39295,
    USD: 39293.36,
    EUR: 40872.95,
  },
  {
    id: '4',
    name: 'USDC',
    icon: UsdcIcon,
    balance: 39295,
    USD: 39295,
    EUR: 40886.45,
  },
  {
    id: '5',
    name: 'BNB',
    icon: BnbIcon,
    balance: 39.2462,
    USD: 10794.45,
    EUR: 11227.85,
  },
  {
    id: '6',
    name: 'LTC',
    icon: LtcIcon,
    balance: 323.003,
    USD: 17280.66,
    EUR: 17973.27,
  },
  {
    id: '7',
    name: 'SOL',
    icon: SolIcon,
    balance: 33.103,
    USD: 1115.57,
    EUR: 1159.92,
  },
  {
    id: '8',
    name: 'XTZ',
    icon: TezosIcon,
    balance: 33.103,
    USD: 1115.57,
    EUR: 1159.92,
  },
  {
    id: '9',
    name: 'OP',
    icon: OptimismIcon,
    balance: 33.103,
    USD: 1115.57,
    EUR: 1159.92,
  },
  {
    id: '11',
    name: 'TRX',
    icon: TronIcon,
  },
  {
    id: '10',
    name: 'NFT',
    icon: NFTIcon,
  },
];

const net_icons = [
  BitcoinIcon,
  EthIcon,
  BnbIcon,
  PolygonIcon,
  ArbitrumLogoIcon,
  TronIcon,
  LtcIcon,
  SolIcon,
  TezosIcon,
  OptimismIcon,
];

const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const useSocket = () => useContext(SocketContext);

type Result = {
  count: number;
  message: string;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [priceLoading, setPriceLoading] = useState<boolean>(true);
  const [nftStatus, setNftStatus] = useState<string>('loading');
  const [balances, setBalances] = useState<any>({});
  const [calcedBalances, setCalcedBalances] = useState<any>({});
  const [requestRefetch, setRequestRefetch] = useState<number>(0);
  const [priceData, setPriceData] = useState<any>(null);
  const [successResult, setSuccessResult] = useState<Result>();
  const [errorResult, setErrorResult] = useState<Result>();
  const [connection, setConnection] = useState<WebSocket>();
  // const [networkError, setNetworkError] = useState<boolean>(false);
  const [transactionIsLoading, setTransactionIsLoading] = useState<boolean>(true);
  const [updateNeed, setUpdateNeed] = useState<number>(0);
  const [ethTx, setEthTx] = useState<any>(null);
  const [bscTx, setBscTx] = useState<any>(null);
  const [arbiTx, setArbiTx] = useState<any>(null);
  const [polyTx, setPolyTx] = useState<any>(null);
  const [optTx, setOptTx] = useState<any>(null);
  const [tezosTx, setTezosTx] = useState<any>(null);
  const [tronTx, setTronTx] = useState<any>(null);
  const [solTx, setSolTx] = useState<any>(null);
  const [btcTx, setBtcTx] = useState<any>(null);
  const [ltcTx, setLtcTx] = useState<any>(null);
  const [updateInterval, setUpdateInterval] = useState<any>(null);
  const [nftList, setNftList] = useState<any>(null);

  // Access the client
  const queryClient = useQueryClient();
  const user = '1';

  const onLine = useNetwork();
  const networkError = !onLine;

  // // Queries
  // const {
  //   status: tokenStatus,
  //   isLoading: tokenIsLoading,
  //   isError: tokenIsError,
  //   data: tokenData,
  // } = useQuery(['/GetSupportedAssets'], getQuery);
  const tokenData = NODE_ENV === 'test' ? ASSETS_TEST : ASSETS_MAIN;

  // const {
  //   status: netStatus,
  //   isLoading: netIsLoading,
  //   isError: netIsError,
  //   data: netData,
  // } = useQuery(['/GetSupportedNets'], getQuery);
  const netData = NODE_ENV === 'test' ? CHAINS_TEST : CHAINS_MAIN;

  const {
    status: walletStatus,
    isLoading: walletIsLoading,
    isError: walletIsError,
    data: walletData,
  } = {} as any; //useQuery(['/ListWallets', `?user=${user}`], getQuery);

  useEffect(() => {
    if (walletStatus === 'success') {
      let address = findBy(walletData, 'net_id', '1')?.address;
      const getListNft = async () => {
        const nft = await listNft(address)
          .then((res: any) => {
            console.log(res);
            setNftList(res);
            setNftStatus('success');
          })
          .catch((e: any) => {
            console.log(e);
            setNftStatus('error');
          });
      };
      getListNft();
    }
  }, [walletStatus]);

  const refetch = (query: string[]) => {
    // queryClient.invalidateQueries(query);
    setRequestRefetch((previous) => previous + 1);
  };

  // const {
  //   status: transactionStatus,
  //   isLoading: transactionIsLoading,
  //   isError: transactionIsError,
  //   mutate: transactionMutate,
  //   data: transactionData,
  // } = useMutation(
  //   (data: TransactionMutateParams) => {
  //     return postQuery('/ListTransactions', data);
  //   },
  //   {
  //     onError: (data: any) => {
  //       const { error } = data;
  //       setErrorResult((prev) => ({
  //         count: (prev?.count ?? 0) + 1,
  //         message: `Fetching Transactions failed due to server errors. ${error}`,
  //       }));
  //     },
  //   },
  // );

  // const {
  //   status: withdrawStatus,
  //   isLoading: withdrawIsLoading,
  //   isError: withdrawIsError,
  //   mutate: withdrawMutate,
  //   data: withdrawData,
  // } = useMutation(
  //   (data) => {
  //     return postQuery('/WithdrawAsset', data);
  //   },
  //   {
  //     onSuccess: (data) => {
  //       if (data?.success) {
  //         const { withdrawal } = data;
  //         setSuccessResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `Your withdraw request of ${withdrawal.amount} ${
  //             tokenData?.find((a) => a.id === withdrawal.token_id)?.name
  //           } has been successful. Check your balance.`,
  //         }));
  //         refetch(['ListAssets']);
  //       } else {
  //         setErrorResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `${data?.message} Check your input is correct.`,
  //         }));
  //       }
  //     },
  //     onError: (data: any) => {
  //       const { error } = data;
  //       setErrorResult((prev) => ({
  //         count: (prev?.count ?? 0) + 1,
  //         message: `Your withdraw request of ${error.amount} ${
  //           tokenData?.find((a: any) => a.id === error.token_id)?.name
  //         } has been failed. Check if amount is less than 0.01 for test mode. Or please contact to the support team.`,
  //       }));
  //     },
  //     onSettled: () => {
  //       refetch(['ListAssets']);
  //     },
  //   },
  // );

  const {
    status: quoteStatus,
    isLoading: quoteIsLoading,
    isError: quoteIsError,
    mutate: quoteMutate,
    data: quoteData,
  } = useMutation(
    (data) => {
      return getLifi('/quote', data);
    },
    {
      onSuccess: (data) => {
        if (Boolean(data?.id)) {
          const { estimate: quoteData } = data;
        } else {
          // setErrorResult((prev) => ({
          //   count: (prev?.count ?? 0) + 1,
          //   message: `${data?.message} Check your input is correct.`,
          // }));
        }
      },
      onError: (data: any) => {
        const { error } = data;
        // setErrorResult((prev) => ({
        //   count: (prev?.count ?? 0) + 1,
        //   message: `Your quote request from ${quoteData.fromToken} to ${quoteData.toToken} has been failed. Please contact to the support team.`,
        // }));
      },
    },
  );

  // const {
  //   status: swapStatus,
  //   isLoading: swapIsLoading,
  //   isError: swapIsError,
  //   mutate: swapMutate,
  //   data: swapData,
  // } = useMutation(
  //   () => {
  //     return postSwap(
  //       quoteData.transactionRequest,
  //       walletData.find((wallet: any) => wallet.net_id === '1'),
  //     );
  //   },
  //   {
  //     onSuccess: (result) => {
  //       if (result) {
  //         setSuccessResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `Your swap request from ${1} to ${1} has been successful. Check your balance.`,
  //         }));
  //       } else {
  //         setErrorResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `${1} Check your input is correct.`,
  //         }));
  //       }
  //     },
  //     onError: (data: any) => {
  //       const { error } = data;
  //       setErrorResult((prev) => ({
  //         count: (prev?.count ?? 0) + 1,
  //         message: `Your swap request from ${1} to ${1} has been failed. Please contact to the support team.`,
  //       }));
  //     },
  //     onSettled: () => {
  //       refetch(['ListAssets']);
  //     },
  //   },
  // );

  // const {
  //   status: swapStatus,
  //   isLoading: swapIsLoading,
  //   isError: swapIsError,
  //   mutate: swapMutate,
  //   data: swapData,
  // } = useMutation(
  //   (data) => {
  //     return postQuery('/Swap', data);
  //   },
  //   {
  //     onSuccess: (data) => {
  //       if (data?.success) {
  //         const { swapData } = data;
  //         setSuccessResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `Your swap request from ${swapData.fromToken} to ${swapData.toToken} has been successful. Check your balance.`,
  //         }));
  //       } else {
  //         setErrorResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `${data?.message} Check your input is correct.`,
  //         }));
  //       }
  //     },
  //     onError: (data: any) => {
  //       const { error } = data;
  //       setErrorResult((prev) => ({
  //         count: (prev?.count ?? 0) + 1,
  //         message: `Your swap request from ${swapData.fromToken} to ${swapData.toToken} has been failed. Please contact to the support team.`,
  //       }));
  //     },
  //     onSettled: () => {
  //       refetch(['ListAssets']);
  //     },
  //   },
  // );

  const withdrawRequest = async (
    net: any,
    token: any,
    to: string,
    amount: number,
    accountFrom: any,
  ) => {
    const result = await withdraw(net, token, to, amount, accountFrom);
    refetch(['ListAssets']);
    return result;
  };

  const withdrawRequestNft = async (to: string, id: string, tokenAddress: string) => {
    const accountFrom: any = findBy(walletData, 'net_id', '1');
    const result = await withdrawNft(accountFrom, to, id, tokenAddress);
    refetch(['ListAssets']);
    return result;
  };

  const updateBalance = () => {
    if (!walletData) return;
    getBalance(walletData, netData, tokenData).then((res: any) => {
      setBalances(res);
      const calcedBalances = Object.entries(res).reduce((ret: any, entry: any) => {
        const [key, value]: [key: string, value: Record<string, string>] = entry;
        ret[key] = Object.values(value).reduce((a: number, b: string) => {
          return parseFloat((a + parseFloat(b)).toString());
        }, 0);
        return ret;
      }, {});
      setCalcedBalances(calcedBalances);
    });
  };

  const updatePrice = () => {
    getPrice(tokenData).then((data) => {
      data && setPriceData(array2object(data));
    });
  };

  const getTx = async () => {
    if (!walletData) return;
    setTransactionIsLoading(true);
    let address = findBy(walletData, 'net_id', '1')?.address;
    if (!Boolean(address)) return null;
    await getEthTx(address).then((res: any) => {
      setEthTx(res);
    });
    getArbiTx(address).then((res: any) => {
      setArbiTx(res);
    });
    getPolyTx(address).then((res: any) => {
      setPolyTx(res);
    });
    getOptTx(address).then((res: any) => {
      setOptTx(res);
    });
    address = findBy(walletData, 'net_id', '2')?.address;
    getBscTx(address).then((res: any) => {
      setBscTx(res);
    });
    address = findBy(walletData, 'net_id', '6')?.address;
    getBtcLtcTx(address, 'BTC').then((res: any) => {
      setBtcTx(res);
    });
    address = findBy(walletData, 'net_id', '8')?.address;
    getBtcLtcTx(address, 'LTC').then((res: any) => {
      setLtcTx(res);
    });
    address = findBy(walletData, 'net_id', '10')?.address;
    getTezosTx(address).then((res: any) => {
      setTezosTx(res);
    });
    address = findBy(walletData, 'net_id', '9')?.address;
    getSolTx(address).then((res: any) => {
      setSolTx(res);
    });
    getTronTx(address).then((res: any) => {
      setTronTx(res);
    });
    setTimeout(() => {
      setTransactionIsLoading(false);
    }, 1000);
  };

  const loading =
    priceLoading ||
    !Boolean(priceData) ||
    !Boolean(tokenData) ||
    !Boolean(netData) ||
    isEmpty(balances) ||
    walletIsLoading ||
    nftStatus === 'loading';
  // withdrawIsLoading ||

  useEffect(() => {
    updatePrice();
    getTx();
  }, []);

  useEffect(() => {
    const connection_price = new WebSocket(
      'wss://eoul92hqui.execute-api.eu-west-1.amazonaws.com/production/',
    );

    connection_price.onopen = (socket) => {
      setPriceLoading(false);
    };

    connection_price.onmessage = (message) => {
      const json = JSON.parse(message.data);

      const assetName = json.asset;
      const { price } = json;

      setPriceData((prev: any) => ({
        ...prev,
        [assetName]: price,
      }));
    };

    connection_price.onerror = (error) => {};

    return () => connection_price?.close();
  }, []);

  useEffect(() => {
    if (successResult?.count ?? 0 > 0) {
      // chrome.runtime.sendMessage(successResult, function (response) {
      // });
      refetch(['ListAssets']);
    }
  }, [successResult]);

  useEffect(() => {
    if (errorResult?.count ?? 0 > 0) {
      // chrome.runtime.sendMessage(errorResult, function (response) {
      // });
    }
  }, [errorResult]);

  // useEffect(() => {
  //   const connection_deposit = new WebSocket(
  //     'wss://80halgu2p0.execute-api.eu-west-1.amazonaws.com/production/',
  //   );
  //   setConnection(connection_deposit);

  //   return () => connection_deposit.close();
  // }, []);

  // useEffect(() => {
  //   if (connection && tokenData) {
  //     connection.onopen = (socket) => {
  //       setNetworkError(false);
  //     };

  //     connection.onmessage = (message) => {
  //       const json = JSON.parse(message.data);
  //       if (json?.status === 'confirmed') {
  //         // setSuccessResult((prev) => ({
  //         //   count: (prev?.count ?? 0) + 1,
  //         //   message: `${json?.amount} ${
  //         //     tokenData?.find((a: any) => a.id === json?.token_id)?.name
  //         //   } was successfully deposited and confirmed! Please check your balance now.`,
  //         // }));
  //         refetch(['ListAssets']);
  //       } else if (json?.status === 'not-confirmed') {
  //         setSuccessResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `Your deposit request was successful but not confirmed yet. Please wait for a while to confirm the transaction.`,
  //         }));
  //         refetch(['ListAssets']);
  //       } else {
  //         setErrorResult((prev) => ({
  //           count: (prev?.count ?? 0) + 1,
  //           message: `Your deposit has been failed. Please check your transaction and contact us.`,
  //         }));
  //       }
  //     };
  //   }
  // }, [connection, tokenData]);

  useEffect(() => {
    if (walletIsLoading) return;
    updateBalance();
  }, [walletIsLoading, requestRefetch]);

  useEffect(() => {
    if (updateInterval) {
      clearTimeout(updateInterval);
    }
    const update_interval = setInterval(() => {
      setUpdateNeed((prev) => prev + 1);
    }, 5000);
    setUpdateInterval(update_interval);
  }, []);

  useEffect(() => {
    if (updateNeed > 0) {
      updateBalance();
    }
    if (updateNeed > 0 && updateNeed % 50 === 0) {
      updatePrice();
    }
  }, [updateNeed]);

  return (
    <SocketContext.Provider
      value={{
        loading,
        networkError,
        refetch,
        priceData,
        // balanceData: array2object(
        //   balanceData && 'map' in balanceData
        //     ? balanceData?.map((a: any) => ({
        //         [a.token_id]: Math.floor(a.amount * 100000) / 100000,
        //       }))
        //     : [],
        // ),
        balances,
        balanceData: calcedBalances,
        walletData: array2object(
          walletData && 'map' in walletData
            ? walletData?.map((a: any) => ({ [a.net_id]: a.address }))
            : [],
        ),
        walletArray: walletData && 'map' in walletData ? walletData : [],
        tokenData:
          tokenData && 'sort' in tokenData
            ? tokenData
                ?.filter((token: any) => token.id !== '10')
                ?.sort((a: any, b: any) => a.id - b.id)
                .map((token: any) => ({
                  ...token,
                  icon: init_tokens?.find((tk) => tk.id === token.id)?.icon,
                }))
            : [],
        netData: netData.map((net: any, index: number) => {
          net.icon = net_icons[index];
          return net;
        }),
        errorResult,
        successResult,
        // withdrawMutate,
        // withdrawIsLoading,
        transactionIsLoading,
        // transactionData: transactionData?.rows,
        // transactionTotal: transactionData?.total ? transactionData?.total[0].Total : 0,
        // transactionMutate,
        // swapIsLoading,
        // swapMutate,
        // swapData,
        withdraw: withdrawRequest,
        withdrawNft: withdrawRequestNft,
        quoteIsError,
        quoteData,
        quoteMutate,
        quoteIsLoading,
        quoteStatus,
        updateBalance,
        ethTx,
        bscTx,
        arbiTx,
        polyTx,
        optTx,
        btcTx,
        ltcTx,
        solTx,
        tezosTx,
        tronTx,
        getTx,
        nftStatus,
        nftList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
