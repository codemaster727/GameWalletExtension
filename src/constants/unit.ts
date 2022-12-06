export const WEI_UNITS = {
  wei: '0',
  kwei: '3',
  mwei: '6',
  gwei: '9',
  szabo: '12',
  finney: '15',
  ether: '18',
};

export const WEI_DECIMALS = Object.entries(WEI_UNITS).reduce((ret: any, entry) => {
  const [key, value] = entry;
  ret[value] = key;
  return ret;
}, {});
