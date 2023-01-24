import * as texts from 'src/locale/en/messages.json';

export const array2object = (
  value: Record<string, unknown>[] | undefined,
): Record<string, unknown> =>
  value && value.length
    ? value.reduce((a: any, b: any) => ({
        ...a,
        ...b,
      }))
    : {};

export const precision = (value: number) => {
  return Math.min(Math.floor(value), 3) + 2;
};

export const removePrefix = (value: string) => {
  return value.startsWith('0x') ? value.replace('0x', '') : value;
};

export const defaultNetId = (token: any): string => {
  let netId = 1;
  if (!Boolean(token?.address)) return netId.toString();
  const netIds = Object.keys(token?.address);
  if (!Boolean(netIds?.length)) return netId.toString();
  netId = parseInt(netIds[0]);
  return netId.toString();
};

export const findBy = (data: any[], key: string, value: string) => {
  if (!Boolean(data)) return null;
  return data?.find((el: any) => el[key ?? 'id'] === value) ?? null;
};

export const findTokenByNetIdAndAddress = (tokenData: any[], net_id: string, address: string) => {
  if (!Boolean(tokenData)) return null;
  return tokenData?.find((el: any) => el.address[net_id] === address) ?? null;
};

export function clearClipboard() {
  window.navigator.clipboard.writeText('');
}

export const t = (key: string) => {
  return texts[key as keyof typeof texts]?.message ?? `No such message: ${key}`;
};

export function getRandomFileName() {
  let fileName = '';
  const charBank = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];
  const fileNameLength = Math.floor(Math.random() * 7 + 6);

  for (let i = 0; i < fileNameLength; i++) {
    fileName += charBank[Math.floor(Math.random() * charBank.length)];
  }

  return fileName;
}
