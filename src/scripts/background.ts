/*global chrome*/
import { HARDWARE_KEYRING_TYPES } from '~/shared/constants/hardware-wallets';
import WalletController from './wallet-controller';
// import {} from 'src/scripts/ui';
import browser from 'webextension-polyfill';

let tokenData;
let controller: WalletController | undefined;
let api: any;

let connection_deposit: WebSocket;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTabID(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query(
        {
          active: true,
        },
        function (tabs) {
          resolve(tabs[0].id as number);
        },
      );
    } catch (e) {
      reject(e);
    }
  });
}

const callBackgroundMethodViaMessage = async (request: any) => {
  if (!controller) return;
  const { args, method } = request;
  const methodFunc: any = controller.getApi()[method as keyof typeof controller.getApi];
  const result = await methodFunc(...args);
  console.log(result);
  return result;
};

browser.runtime.onMessage.addListener(async (request, sender) => {
  console.log('BG page received message', request);
  console.log(controller);
  if (!controller) return;
  if ('method' in request) {
    const { args, method } = request;
    return await callBackgroundMethodViaMessage(request);
    // const vault = await controller.createNewVaultAndKeychain();
    // await browser.scripting.executeScript({
    //   target: { tabId: await getTabID() },
    //   files: ['assets/ui.ts.765ddf98.js'],
    // });
  }
  return null;
});

const connect = () => {
  connection_deposit?.close();

  // connection_deposit = new WebSocket(
  //   'wss://80halgu2p0.execute-api.eu-west-1.amazonaws.com/production/',
  // );

  // connection_deposit.onmessage = (message) => {
  //   const json = JSON.parse(message.data);
  //   if (json?.status === 'confirmed') {
  //     // chrome.notifications.create({
  //     //   type: 'basic',
  //     //   iconUrl: '../favicon-32x32.png',
  //     //   title: `Your ${json.type.charAt(0).toUpperCase() + json.type.slice(1)} Result`,
  //     //   message: `Your ${json.type} was successfully confirmed! Please check your balance now.`,
  //     // });
  //   } else if (json?.status === 'not-confirmed') {
  //     // chrome.notifications.create({
  //     //   type: 'basic',
  //     //   iconUrl: '../favicon-32x32.png',
  //     //   title: 'Your Deposit Result',
  //     //   message:
  //     //     'Your deposit request was successful but not confirmed yet. Please wait for a while to confirm the transaction.',
  //     // });
  //   } else {
  //     // chrome.notifications.create({
  //     //   type: 'basic',
  //     //   iconUrl: '../favicon-32x32.png',
  //     //   title: `Your ${json.type.charAt(0).toUpperCase() + json.type.slice(1)} Result`,
  //     //   message: `Your ${json.type} has been failed. Please check your transaction and contact us.`,
  //     // });
  //   }
  // };

  // connection_deposit.onclose = (message) => {
  //   connect();
  // };
};

// connect();

// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
//   // chrome.notifications.create({
//   //   type: 'basic',
//   //   iconUrl: '../favicon-32x32.png',
//   //   title: `keep alive`,
//   //   message: `.`,
//   // });
//   console.log(request);
//   if (!connection_deposit || connection_deposit.readyState !== 1) connect();
//   // await sleep(10000);
//   // setTimeout(() => {
//   sendResponse({ result: 'connect' });
//   // }, 10000);
//   return true;
// });

// chrome.runtime.onMessage.addListener((request) => {
//   console.log('rcvd');
// });

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
//   },
// );

/**
 * Initializes the Wallet Controller with any initial state and default language.
 * Configures platform-specific error reporting strategy.
 * Streams emitted state updates to platform-specific storage strategy.
 * Creates platform listeners for new Dapps/Contexts, and sets up their data connections to the controller.
 *
 * @param {object} initState - The initial state to start the controller with, matches the state that is emitted from the controller.
 * @param {string} initLangCode - The region code for the language preferred by the current user.
 */
async function setupController(initState: any, initLangCode: any) {
  //
  // Wallet Controller
  //

  controller = new WalletController({});
  // const vault = await controller.createNewVaultAndKeychain('123');
}

/**
 * @typedef VersionedData
 * @property {WalletState} data - The data emitted from Wallet controller, or used to initialize it.
 * @property {number} version - The latest migration version that has been run.
 */

/**
 * Initializes the Wallet controller, and sets up all platform configuration.
 *
 * @returns {Promise} Setup complete.
 */
async function initialize() {
  try {
    // const initState = await loadStateFromPersistence();
    // const initLangCode = await getFirstPreferredLangCode();
    await setupController({}, {});
    // if (!isManifestV3) {
    //   await loadPhishingWarningPage();
    // }
    // await sendReadyMessageToTabs();
    // log.info('Wallet initialization complete.');
    // resolveInitialization();
    // const account = new CryptoAccount('');
    // const txHash = await account
    //   .send('LhqVEXZnrskH9sC9umM4AeeZTzdhGcgChb', 0.001, 'LTC')
    //   .on('transactionHash', console.log);
  } catch (error) {
    console.log(error);
    // rejectInitialization(error);
  }
}

initialize();

export {};
