import EventEmitter from 'events';
import browser from 'webextension-polyfill';
import { KeyringController } from '@metamask/eth-keyring-controller';
// const { KeyringController } = require('@metamask/eth-keyring-controller');
// import SimpleKeyring from 'eth-simple-keyring';
import log from 'loglevel';
import seedPhraseVerifier from './lib/seed-phrase-verifier';
import { Mutex } from 'await-semaphore';
import { Buffer } from 'buffer';
import { KEYRING_TYPES } from '~/shared/constants/keyrings';
import { HARDWARE_KEYRING_TYPES } from '~/shared/constants/hardware-wallets';
// import { ObservableStore } from '@metamask/obs-store';
import { isManifestV3 } from '~/shared/modules/mv3.utils';
// import OnboardingController from './controllers/onboarding';

(browser as any).global = browser;
// @ts-ignore
browser.Buffer = browser.Buffer ?? Buffer;

// browser.notifications.create({
//   type: 'basic',
//   iconUrl: '../favicon-32x32.png',
//   title: 'Tabs reloaded',
//   message: 'Your tabs have been reloaded',
// });

export default class WalletController extends EventEmitter {
  keyringController: any;
  onboardingController: any;
  createVaultMutex: Mutex;
  // store?: ObservableStore<any>;
  /**
   * @param {object} opts
   */
  constructor(opts: any) {
    super();
    const initState = opts.initState || {};
    this.keyringController = new KeyringController({
      keyringTypes: Object.values(HARDWARE_KEYRING_TYPES).map((value: string) => value), // optional array of types to support.
      initState: {}, // Last emitted persisted state.
      // encryptor: {},
    });
    // this.onboardingController = new OnboardingController({
    //   initState: initState.OnboardingController ?? {},
    // });
    // this.keyringController.on('unlock', () => this._onUnlock());
    // this.keyringController.on('lock', () => this._onLock());
    // lock to ensure only one vault created at once
    this.createVaultMutex = new Mutex();
    // this.store = new ObservableStore({});
  }

  /**
   * Returns an Object containing API Callback Functions.
   * These functions are the interface for the UI.
   * The API object can be transmitted over a stream via JSON-RPC.
   *
   * @returns {object} Object containing API functions.
   */
  getApi() {
    const { createNewVaultAndKeychain, keyringController } = this;
    return {
      // KeyringController
      setLocked: this.setLocked.bind(this),
      createNewVaultAndKeychain: createNewVaultAndKeychain.bind(this),
      getAllAccounts: keyringController.getAccounts.bind(this.keyringController),
      verifySeedPhrase: this.verifySeedPhrase.bind(this),
      exportAccount: keyringController.exportAccount.bind(keyringController),

      // onboarding controller
      // setSeedPhraseBackedUp:
      //   onboardingController.setSeedPhraseBackedUp.bind(onboardingController),
      // completeOnboarding:
      //   onboardingController.completeOnboarding.bind(onboardingController),
      // setFirstTimeFlowType:
      //   onboardingController.setFirstTimeFlowType.bind(onboardingController),
    };
  }

  async verifySeedPhrase() {
    const [primaryKeyring] = this.keyringController.getKeyringsByType(KEYRING_TYPES.HD_KEY_TREE);
    if (!primaryKeyring) {
      throw new Error('MetamaskController - No HD Key Tree found');
    }

    const serialized = await primaryKeyring.serialize();
    const seedPhraseAsBuffer = Buffer.from(serialized.mnemonic);
    const accounts = await primaryKeyring.getAccounts();
    console.log(accounts);
    if (accounts.length < 1) {
      throw new Error('MetamaskController - No accounts found');
    }

    try {
      // await seedPhraseVerifier.verifyAccounts(accounts, seedPhraseAsBuffer);
      return Array.from(seedPhraseAsBuffer.values());
    } catch (err: any) {
      log.error(err.message);
      throw err;
    }
  }

  /**
   * Creates a new Vault and create a new keychain.
   *
   * A vault, or KeyringController, is a controller that contains
   * many different account strategies, currently called Keyrings.
   * Creating it new means wiping all previous keyrings.
   *
   * A keychain, or keyring, controls many accounts with a single backup and signing strategy.
   * For example, a mnemonic phrase can generate many accounts, and is a keyring.
   *
   * @param {string} password
   * @returns {object} vault
   */
  async createNewVaultAndKeychain(password: string) {
    console.log(this);
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      let vault;
      const accounts = await this.keyringController.getAccounts();
      if (accounts.length > 0) {
        vault = await this.keyringController.fullUpdate();
      } else {
        vault = await this.keyringController.createNewVaultAndKeychain(password);

        const encodedSeedPhrase = await this.verifySeedPhrase();
        console.log(Buffer.from(encodedSeedPhrase).toString('utf8'));

        const addresses = await this.keyringController.getAccounts();
        const addresses1 = await this.keyringController.getAccounts();
        console.log(addresses);
        // this.store.putState({ addresses });
        // this.preferencesController.setAddresses(addresses);
        // this.selectFirstIdentity();
      }

      return vault;
    } finally {
      releaseLock();
    }
  }

  /**
   * Create a new Vault and restore an existent keyring.
   *
   * @param {string} password
   * @param {number[]} encodedSeedPhrase - The seed phrase, encoded as an array
   * of UTF-8 bytes.
   */
  async createNewVaultAndRestore(password: string, encodedSeedPhrase: any) {
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      let accounts, lastBalance;

      const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase);

      const { keyringController } = this;

      // clear known identities
      // this.preferencesController.setAddresses([]);

      // clear permissions
      // this.permissionController.clearState();

      ///: BEGIN:ONLY_INCLUDE_IN(flask)
      // Clear snap state
      // this.snapController.clearState();
      // Clear notification state
      // this.notificationController.clear();
      ///: END:ONLY_INCLUDE_IN

      // clear accounts in accountTracker
      // this.accountTracker.clearAccounts();

      // clear cachedBalances
      // this.cachedBalancesController.clearCachedBalances();

      // clear unapproved transactions
      // this.txController.txStateManager.clearUnapprovedTxs();

      // create new vault
      const vault = await keyringController.createNewVaultAndRestore(password, seedPhraseAsBuffer);

      // const ethQuery = new EthQuery(this.provider);
      accounts = await keyringController.getAccounts();
      // lastBalance = await this.getBalance(
      //   accounts[accounts.length - 1],
      //   ethQuery,
      // );

      const [primaryKeyring] = keyringController.getKeyringsByType(KEYRING_TYPES.HD_KEY_TREE);
      if (!primaryKeyring) {
        throw new Error('MetamaskController - No HD Key Tree found');
      }

      // seek out the first zero balance
      while (lastBalance !== '0x0') {
        await keyringController.addNewAccount(primaryKeyring);
        accounts = await keyringController.getAccounts();
        // lastBalance = await this.getBalance(
        //   accounts[accounts.length - 1],
        //   ethQuery,
        // );
      }

      // remove extra zero balance account potentially created from seeking ahead
      // if (accounts.length > 1 && lastBalance === '0x0') {
      //   await this.removeAccount(accounts[accounts.length - 1]);
      //   accounts = await keyringController.getAccounts();
      // }

      // This must be set as soon as possible to communicate to the
      // keyring's iframe and have the setting initialized properly
      // Optimistically called to not block MetaMask login due to
      // Ledger Keyring GitHub downtime
      // const transportPreference =
      //   this.preferencesController.getLedgerTransportPreference();
      // this.setLedgerTransportPreference(transportPreference);

      // set new identities
      // this.preferencesController.setAddresses(accounts);
      // this.selectFirstIdentity();
      return vault;
    } finally {
      releaseLock();
    }
  }

  async clearLoginArtifacts() {
    //@ts-ignore
    await browser.storage.session.remove(['loginToken', 'loginSalt']);
  }

  /**
   * Locks MetaMask
   */
  setLocked() {
    const [trezorKeyring] = this.keyringController.getKeyringsByType(KEYRING_TYPES.TREZOR);
    if (trezorKeyring) {
      trezorKeyring.dispose();
    }

    const [ledgerKeyring] = this.keyringController.getKeyringsByType(KEYRING_TYPES.LEDGER);
    ledgerKeyring?.destroy?.();

    if (isManifestV3) {
      this.clearLoginArtifacts();
    }

    return this.keyringController.setLocked();
  }

  async withdraw(request: any) {}
}

// const makeAccount = async () => {
//   // The KeyringController is also an event emitter:
//   const keyringController = new KeyringController({
//     keyringTypes: Object.keys(HARDWARE_KEYRING_TYPES).map(
//       //@ts-ignore
//       (key: string) => HARDWARE_KEYRING_TYPES[key],
//     ), // optional array of types to support.
//     initState: {}, // Last emitted persisted state.
//     encryptor: {
//       // An optional object for defining encryption schemes:
//       // Defaults to Browser-native SubtleCrypto.
//       encrypt(password: string, object: any) {
//         // return new Promise('encrypted!');
//         return password;
//       },
//       decrypt(password: string, encryptedString: string) {
//         // return new Promise({ foo: 'bar' });
//         return password;
//       },
//     },
//   });
//   const vault = await keyringController.createNewVaultAndKeychain('123456');
//   console.log(vault);
//   // const encodedSeedPhrase = await verifySeedPhrase();
//   // console.log(Buffer.from(encodedSeedPhrase).toString('utf8'));

//   // keyringController.on('newAccount', (address: string) => {
//   //   console.log(`New account created: ${address}`);
//   // });
//   // keyringController.on('removedAccount', handleThat);
// };

// makeAccount();

// export {};
