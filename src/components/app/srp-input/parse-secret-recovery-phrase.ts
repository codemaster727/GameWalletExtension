export const parseSecretRecoveryPhrase = (seedPhrase: any) =>
  (seedPhrase || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';
