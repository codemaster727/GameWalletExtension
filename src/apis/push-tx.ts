import axios from 'axios';
import { BLOCKCHAIR_INFO_API_KEY, BLOCKCHAIR_INFO_API_URL } from '~/constants/apis';

const bdHost = BLOCKCHAIR_INFO_API_URL;
const pushTx = async (tx: string, chain: string) => {
  const postUrl = `${bdHost}/${chain}/push/transaction?key=${BLOCKCHAIR_INFO_API_KEY}`;
  const result = await axios
    .post(postUrl, {
      data: tx,
    })
    .catch((e) => {
      console.log(e.response.status);
      return null;
    });
  // const result = await client.post('/bitcoin/mainnet/tx/send', {body: {tx}});
  // const result = await get('https://svc.blockdaemon.com/universal/v1/ethereum/mainnet/sync/block_number?apiKey=F9QZbdK9BztxGL3USOB6V7wvaGpOtRLN0pYSctZRVIOR2YUu')
  //               .catch(e => console.log(e.response.status))
  console.log(result?.status ? result.data : 'error');
  return result;
};

export default pushTx;
