import axios from 'axios';
import { BLOCKCHAIR_INFO_API_KEY, BLOCKCHAIR_INFO_API_URL } from '~/constants/apis';

const bcInfoHost = BLOCKCHAIR_INFO_API_URL;
const unspentUrl = (address: string, chain: string) =>
  `${bcInfoHost}/${chain}?dashboards/address/${address}?key=${BLOCKCHAIR_INFO_API_KEY}`;

// convert from blockchain.info format to bitcore-lib utxo format
const convertUTXO = (utxo: any) => ({
  txId: utxo.tx_hash_big_endian,
  vout: utxo.tx_output_n,
  script: utxo.script,
  satoshis: utxo.value,
});

const getUnspentOutputs = async (address: string, chain: string) => {
  const url = unspentUrl(address, chain);
  const resp = await axios.get(url);
  const data = resp.data;
  return data.utxo;
};

// raise an error if there are no spendable outputs
const checkUTXOs = (utxos: any, address: string) => {
  utxos = utxos.filter((utxo: any) => utxo.confirmations > 0);
  utxos = utxos.filter((utxo: any) => utxo.value > 1000);
  if (utxos.length == 0) return false;
  return true;
};

const getUTXOs = async (address: string, chain: string) => {
  let utxos = await getUnspentOutputs(address, chain);
  console.log('utxos:', utxos);
  if (checkUTXOs(utxos, address)) {
    utxos = utxos.map(convertUTXO);
  } else utxos = null;
  return utxos;
};

export default getUTXOs;
