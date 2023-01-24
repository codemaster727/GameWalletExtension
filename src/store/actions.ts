import { generateActionId, callBackgroundMethod, submitRequestToBackground } from './action-queue';
import * as actionConstants from './actionConstants';

export function displayWarning(text: string) {
  return {
    type: actionConstants.DISPLAY_WARNING,
    value: text,
  };
}

export function showLoadingIndication(message?: string) {
  return {
    type: actionConstants.SHOW_LOADING,
    value: message,
  };
}

export function hideLoadingIndication() {
  return {
    type: actionConstants.HIDE_LOADING,
  };
}

export async function verifySeedPhrase() {
  const encodedSeedPhrase = await submitRequestToBackground('verifySeedPhrase');
  return Buffer.from(encodedSeedPhrase).toString('utf8');
}

export function createNewVault(password: string) {
  console.log('password:', password);
  return new Promise((resolve, reject) => {
    console.log('here1');
    callBackgroundMethod('createNewVaultAndKeychain', [password], (error: any) => {
      console.log('here');
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      console.log('success');
      resolve(true);
    });
  });
}

export async function createNewVaultAndGetSeedPhrase(password: string) {
  // return async (dispatch: any) => {
  try {
    console.log('calling createNewVault');
    const result = await createNewVault(password);
    console.log(result);
    // await result()
    console.log('calling verifySeedPhrase');
    const seedPhrase = await verifySeedPhrase();
    console.log(result);
    console.log(seedPhrase);
    return seedPhrase;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  } finally {
  }
  // };
}

export function setSeedPhraseBackedUp(seedPhraseBackupState: any) {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      callBackgroundMethod('setSeedPhraseBackedUp', [seedPhraseBackupState], (err: any) => {
        if (err) {
          // dispatch(displayWarning(err.message));
          reject(err);
          return;
        }
        // forceUpdateMetamaskState(dispatch).then(resolve).catch(reject);
      });
    });
  };
}

export function setFirstTimeFlowType(type: any) {
  return (dispatch: any) => {
    callBackgroundMethod('setFirstTimeFlowType', [type], (err: any) => {
      if (err) {
        dispatch(displayWarning(err.message));
      }
    });
    dispatch({
      type: actionConstants.SET_FIRST_TIME_FLOW_TYPE,
      value: type,
    });
  };
}

export function setCompletedOnboarding() {
  return async (dispatch: any) => {
    dispatch(showLoadingIndication());

    try {
      await submitRequestToBackground('completeOnboarding');
      dispatch(completeOnboarding());
    } catch (err: any) {
      dispatch(displayWarning(err.message));
      throw err;
    } finally {
      dispatch(hideLoadingIndication());
    }
  };
}

export function completeOnboarding() {
  return {
    type: actionConstants.COMPLETE_ONBOARDING,
  };
}
