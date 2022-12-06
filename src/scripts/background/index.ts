/*global chrome*/

console.log('started');
let tokenData;

let connection_deposit: WebSocket;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const connect = () => {
  connection_deposit?.close();

  connection_deposit = new WebSocket(
    'wss://80halgu2p0.execute-api.eu-west-1.amazonaws.com/production/',
  );
  console.log('connection_deposit:', connection_deposit);

  connection_deposit.onmessage = (message) => {
    const json = JSON.parse(message.data);
    console.log(json);
    if (json?.status === 'confirmed') {
      // chrome.notifications.create({
      //   type: 'basic',
      //   iconUrl: '../favicon-32x32.png',
      //   title: `Your ${json.type.charAt(0).toUpperCase() + json.type.slice(1)} Result`,
      //   message: `Your ${json.type} was successfully confirmed! Please check your balance now.`,
      // });
    } else if (json?.status === 'not-confirmed') {
      // chrome.notifications.create({
      //   type: 'basic',
      //   iconUrl: '../favicon-32x32.png',
      //   title: 'Your Deposit Result',
      //   message:
      //     'Your deposit request was successful but not confirmed yet. Please wait for a while to confirm the transaction.',
      // });
    } else {
      // chrome.notifications.create({
      //   type: 'basic',
      //   iconUrl: '../favicon-32x32.png',
      //   title: `Your ${json.type.charAt(0).toUpperCase() + json.type.slice(1)} Result`,
      //   message: `Your ${json.type} has been failed. Please check your transaction and contact us.`,
      // });
    }
  };

  // connection_deposit.onclose = (message) => {
  //   connect();
  // };
};

connect();

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (!connection_deposit || connection_deposit.readyState !== 1) connect();
  console.log('connection_deposit:', connection_deposit);
  // await sleep(10000);
  // setTimeout(() => {
  sendResponse({ result: 'connect' });
  // }, 10000);
  return true;
});

chrome.runtime.onMessage.addListener((request) => {
  console.log('rcvd');
});

// chrome.windows.create(
//   {
//     url: `index.html`,
//     type: `popup`,
//     focused: true,
//     width: 400,
//     height: 600,
//     top: 0,
//   },
//   () => {
//     console.log(`Opened popup!`);
//   },
// );

export {};
