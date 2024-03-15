export const eqSet = <T>(A: Set<T>, B: Set<T>) =>
  A.size === B.size && [...A].every((x) => B.has(x));
