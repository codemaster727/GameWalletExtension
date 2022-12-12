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
