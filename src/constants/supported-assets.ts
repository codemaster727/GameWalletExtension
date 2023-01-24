import { Token } from '~/context/types';

export const ASSETS_MAIN: Token[] = [
  {
    address: {
      '6': '',
    },
    id: '1',
    name: 'BTC',
    label: 'Bitcoin',
    gecko_id: 'bitcoin',
  },
  {
    address: {
      '1': '',
      '3': '',
      '4': '',
      '5': '',
    },
    id: '2',
    name: 'ETH',
    label: 'Ethereum',
    gecko_id: 'ethereum',
  },
  {
    address: {
      '1': '0xdac17f958d2ee523a2206206994597c13d831ec7',
      '2': '0x55d398326f99059ff775485246999027b3197955',
      '4': '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      '5': '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      '7': 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    },
    id: '3',
    name: 'USDT',
    label: 'USDT',
    gecko_id: 'tether',
  },
  {
    address: {
      '1': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '2': '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      '4': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      '5': '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      '7': 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
    },
    id: '4',
    name: 'USDC',
    label: 'USDC',
    gecko_id: 'usd-coin',
  },
  {
    address: {
      '2': '',
    },
    id: '5',
    name: 'BNB',
    label: 'Binance coin',
    gecko_id: 'binancecoin',
  },
  {
    address: {
      '8': '',
    },
    id: '6',
    name: 'LTC',
    label: 'Litecoin',
    gecko_id: 'litecoin',
  },
  {
    address: {
      '9': '',
    },
    id: '7',
    name: 'SOL',
    label: 'Solana coin',
    gecko_id: 'solana',
  },
  {
    address: {
      '10': '',
    },
    id: '8',
    name: 'XTZ',
    label: 'Tezos',
    gecko_id: 'tezos',
  },
  {
    address: {
      '5': '0x4200000000000000000000000000000000000042',
    },
    id: '9',
    name: 'OP',
    label: 'Optimism coin',
    gecko_id: 'optimism',
  },
  {
    address: {
      '1': '',
    },
    id: '10',
    name: 'NFT',
    label: 'NFT',
    gecko_id: '',
  },
  {
    address: {
      '7': '',
    },
    id: '11',
    name: 'TRX',
    label: 'Tron coin',
    gecko_id: 'tron',
  },
];

export const ASSETS_TEST: Token[] = [
  {
    address: {
      '6': '',
    },
    id: '1',
    name: 'BTC',
    label: 'Bitcoin',
    gecko_id: 'bitcoin',
  },
  {
    address: {
      '1': '',
      '3': '',
      '4': '',
      '5': '',
    },
    id: '2',
    name: 'ETH',
    label: 'Ethereum',
    gecko_id: 'ethereum',
  },
  {
    address: {
      '1': '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      '2': '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      '4': '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
    },
    id: '3',
    name: 'USDT',
    label: 'USDT',
    gecko_id: 'tether',
  },
  {
    address: {
      '1': '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      '2': '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      '4': '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
    },
    id: '4',
    name: 'USDC',
    label: 'USDC',
    gecko_id: 'usd-coin',
  },
  {
    address: {
      '2': '',
    },
    id: '5',
    name: 'BNB',
    label: 'Binance coin',
    gecko_id: 'binancecoin',
  },
  {
    address: {
      '8': '',
    },
    id: '6',
    name: 'LTC',
    label: 'Litecoin',
    gecko_id: 'litecoin',
  },
  {
    address: {
      '9': '',
    },
    id: '7',
    name: 'SOL',
    label: 'Solana coin',
    gecko_id: 'solana',
  },
  {
    address: {
      '10': '',
    },
    id: '8',
    name: 'XTZ',
    label: 'Tezos',
    gecko_id: 'tezos',
  },
  {
    address: {
      '5': '0x4200000000000000000000000000000000000042',
    },
    id: '9',
    name: 'OP',
    label: 'Optimism coin',
    gecko_id: 'optimism',
  },
  {
    address: {
      '1': '',
    },
    id: '10',
    name: 'NFT',
    label: 'NFT',
    gecko_id: '',
  },
  {
    address: {
      '7': '',
    },
    id: '11',
    name: 'TRX',
    label: 'Tron coin',
    gecko_id: 'tron',
  },
];

export const SIMPLE_SWAP_KEYS: Record<string, Record<string, string>> = {
  1: {
    6: 'btc',
  },
  2: {
    1: 'eth',
  },
  3: {
    1: 'usdterc20',
    2: 'usdtbep20',
    4: 'usdtpoly',
    7: 'usdttrc20',
  },
  4: {
    1: 'usdcerc20',
    2: 'usdcbep20',
    4: 'usdcpoly',
    7: 'usdctrc20',
  },
  5: {
    2: 'bnb-bsc',
  },
  6: {
    8: 'ltc',
  },
  7: {
    9: 'sol',
  },
  8: {
    10: 'xtz',
  },
  9: {
    5: 'op',
  },
  11: {
    7: 'trx',
  },
};
