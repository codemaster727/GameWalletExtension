import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
  DEFAULT_ROUTE,
  ONBOARDING_CREATE_PASSWORD_ROUTE,
  ONBOARDING_IMPORT_WITH_SRP_ROUTE,
} from '../constants/routes';

export function getFirstTimeFlowTypeRoute(state: any) {
  const { firstTimeFlowType } = state.wallet;

  let nextRoute;
  if (firstTimeFlowType === 'create') {
    nextRoute = process.env.ONBOARDING_V2
      ? ONBOARDING_CREATE_PASSWORD_ROUTE
      : INITIALIZE_CREATE_PASSWORD_ROUTE;
  } else if (firstTimeFlowType === 'import') {
    nextRoute = process.env.ONBOARDING_V2
      ? ONBOARDING_IMPORT_WITH_SRP_ROUTE
      : INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE;
  } else {
    nextRoute = DEFAULT_ROUTE;
  }

  return nextRoute;
}

export const getFirstTimeFlowType = (state: any) => {
  return state.wallet.firstTimeFlowType;
};

export const getOnboardingInitiator = (state: any) => {
  const { onboardingTabs } = state.wallet;

  if (!onboardingTabs || Object.keys(onboardingTabs).length !== 1) {
    return null;
  }

  const location = Object.keys(onboardingTabs)[0];
  const tabId = onboardingTabs[location];
  return {
    location,
    tabId,
  };
};
