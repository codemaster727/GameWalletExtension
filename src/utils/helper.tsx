export const array2object = (
  value: Record<string, unknown>[] | undefined,
): Record<string, unknown> =>
  value && value.length
    ? value.reduce((a: any, b: any) => ({
        ...a,
        ...b,
      }))
    : {};
