export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === "object";

export const isString = (val: unknown): val is string =>
  typeof val === "string";

export const isArray = Array.isArray;

export const head = (val: string | Array<any>) =>
  isString(val) ? val.charAt(0) : val[0];

export const merge = <T>(a: T, b: T) => ({ ...a, ...b });
