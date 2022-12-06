const KeyringController = require('eth-keyring-controller');
const SimpleKeyring = require('eth-simple-keyring');
const log = require('loglevel');

const HARDWARE_KEYRING_TYPES = {
  LEDGER: 'Ledger Hardware',
  TREZOR: 'Trezor Hardware',
  LATTICE: 'Lattice Hardware',
  QR: 'QR Hardware Wallet Device',
};

const KEYRING_TYPES = {
  HD_KEY_TREE: 'HD Key Tree',
  IMPORTED: 'Simple Key Pair',
  ...HARDWARE_KEYRING_TYPES,
};

const keyringController = new KeyringController({
  keyringTypes: Object.keys(HARDWARE_KEYRING_TYPES).map(
    //@ts-ignore
    (key: string) => HARDWARE_KEYRING_TYPES[key],
  ), // optional array of types to support.
  initState: {}, // Last emitted persisted state.
  encryptor: {
    // An optional object for defining encryption schemes:
    // Defaults to Browser-native SubtleCrypto.
    encrypt(password: string, object: any) {
      // return new Promise('encrypted!');
      return password;
    },
    decrypt(password: string, encryptedString: string) {
      // return new Promise({ foo: 'bar' });
      return password;
    },
  },
});

const seedPhraseVerifier = {
  /**
   * Verifies if the seed words can restore the accounts.
   *
   * Key notes:
   * - The seed words can recreate the primary keyring and the accounts belonging to it.
   * - The created accounts in the primary keyring are always the same.
   * - The keyring always creates the accounts in the same sequence.
   *
   * @param {Array} createdAccounts - The accounts to restore
   * @param {Buffer} seedPhrase - The seed words to verify, encoded as a Buffer
   * @returns {Promise<void>}
   */
  async verifyAccounts(createdAccounts: any, seedPhrase: Buffer) {
    if (!createdAccounts || createdAccounts.length < 1) {
      throw new Error('No created accounts defined.');
    }

    const keyringController = new KeyringController({});
    const Keyring = keyringController.getKeyringClassForType(KEYRING_TYPES.HD_KEY_TREE);
    const opts = {
      mnemonic: seedPhrase,
      numberOfAccounts: createdAccounts.length,
    };

    const keyring = new Keyring(opts);
    const restoredAccounts = await keyring.getAccounts();
    log.debug(`Created accounts: ${JSON.stringify(createdAccounts)}`);
    log.debug(`Restored accounts: ${JSON.stringify(restoredAccounts)}`);

    if (restoredAccounts.length !== createdAccounts.length) {
      // this should not happen...
      throw new Error('Wrong number of accounts');
    }

    for (let i = 0; i < restoredAccounts.length; i++) {
      if (restoredAccounts[i].toLowerCase() !== createdAccounts[i].toLowerCase()) {
        throw new Error(
          `Not identical accounts! Original: ${createdAccounts[i]}, Restored: ${restoredAccounts[i]}`,
        );
      }
    }
  },
};

const verifySeedPhrase = async () => {
  const [primaryKeyring] = keyringController.getKeyringsByType(KEYRING_TYPES.HD_KEY_TREE);
  if (!primaryKeyring) {
    throw new Error('MetamaskController - No HD Key Tree found');
  }

  const serialized = await primaryKeyring.serialize();
  const seedPhraseAsBuffer = Buffer.from(serialized.mnemonic);

  const accounts = await primaryKeyring.getAccounts();
  if (accounts.length < 1) {
    throw new Error('MetamaskController - No accounts found');
  }

  try {
    await seedPhraseVerifier.verifyAccounts(accounts, seedPhraseAsBuffer);
    return Array.from(seedPhraseAsBuffer.values());
  } catch (err: any) {
    log.error(err.message);
    throw err;
  }
};

const makeAccount = async () => {
  // The KeyringController is also an event emitter:
  const vault = await keyringController.createNewVaultAndKeychain('123456');

  const encodedSeedPhrase = await verifySeedPhrase();
  console.log(Buffer.from(encodedSeedPhrase).toString('utf8'));

  keyringController.on('newAccount', (address: string) => {
    console.log(`New account created: ${address}`);
  });
  // keyringController.on('removedAccount', handleThat);
};

makeAccount();

export {};
