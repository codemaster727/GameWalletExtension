let tokenData;

let connection_deposit;

const connect = () => {
  connection_deposit?.close();

  connection_deposit = new WebSocket(
    'wss://80halgu2p0.execute-api.eu-west-1.amazonaws.com/production/',
  );

  connection_deposit.onmessage = (message) => {
    const json = JSON.parse(message.data);
    console.log(json);
    if (json?.status === 'confirmed') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: './favicon-32x32.png',
        title: 'Your Deposit Result',
        message: 'Your deposit was successfully confirmed! Please check your balance now.',
      });
    } else if (json?.status === 'not-confirmed') {
      // chrome.notifications.create({
      //   type: 'basic',
      //   iconUrl: './favicon-32x32.png',
      //   title: 'Your Deposit Result',
      //   message:
      //     'Your deposit request was successful but not confirmed yet. Please wait for a while to confirm the transaction and notice your balance will be updated after that.',
      // });
    } else {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: './favicon-32x32.png',
        title: 'Your Deposit Result',
        message: 'Your deposit has been failed. Please check your transaction and contact us.',
      });
    }
  };

  connection_deposit.onclose = (message) => {
    connect();
  };
};

connect();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('request:', request);
  chrome.notifications.create({
    type: 'basic',
    iconUrl: './favicon-32x32.png',
    title: 'Your withdrawal result',
    message: request?.message,
  });
  sendResponse({ result: 'ok' });
});
