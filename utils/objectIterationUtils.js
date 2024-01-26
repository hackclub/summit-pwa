export const objectMap = (obj, func) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, func(v, k, i)]
    )
  );

export const objectFilter = (obj, func) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v], i) => func(v, k, i)
    )
  );