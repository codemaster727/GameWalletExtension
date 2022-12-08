import Web3 from 'web3';
import { ETH } from '~/constants/address';
import ABI from '../constants/abi/ERC20.abi.json';

export const getDecimal = async (
  rpc: `https://${string}` | undefined,
  address: string,
): Promise<string> => {
  if (address === ETH || rpc === undefined) return '18';
  const web3 = new Web3(rpc);
  //@ts-ignore
  const tokenContract = new web3.eth.Contract(ABI, address);
  const decimal = await tokenContract.methods.decimals().call({});
  return decimal;
};
