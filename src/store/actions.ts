import { generateActionId, callBackgroundMethod, submitRequestToBackground } from './action-queue';
import * as actionConstants from './actionConstants';

export function displayWarning(text: string) {
  return {
    type: actionConstants.DISPLAY_WARNING,
    value: text,
  };
}

export async function verifySeedPhrase() {
  const encodedSeedPhrase = await submitRequestToBackground('verifySeedPhrase');
  return Buffer.from(encodedSeedPhrase).toString('utf8');
}

export function createNewVault(password: string) {
  return new Promise((resolve, reject) => {
    callBackgroundMethod('createNewVaultAndKeychain', [password], (error: any) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(true);
    });
  });
}

export async function createNewVaultAndGetSeedPhrase(password: string) {
  try {
    await createNewVault(password);
    const seedPhrase = await verifySeedPhrase();
    return seedPhrase;
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
  }
}
